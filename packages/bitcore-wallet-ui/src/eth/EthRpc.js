import Web3 from 'web3';
import promptly from 'promptly';
import EthereumTx from 'ethereumjs-tx';

class EthRPC {
  constructor(config) {
    this.config = config;
    this.web3 = this.getWeb3(config);
    this.account = config.currencyConfig.account || this.web3.eth.accounts[0];
  }

  getWeb3(web3Config) {
    const { protocol, host, port } = web3Config;
    const connectionString = `${protocol}://${host}:${port}`;
    let Provider = Web3.providers.HttpProvider;
    if (!Provider) {
      throw new Error('Please provide a valid protocol');
    }
    return new Web3(new Provider(connectionString));
  }

  async isUnlocked() {
    try {
      await this.web3.eth.sign('', this.account);
    } catch (err) {
      return false;
    }
    return true;
  }

  async cmdlineUnlock(time, callback) {
    const timeHex = this.web3.utils.toHex(time);
    try {
      promptly.password('> ', async (err, phrase) => {
        if (err) {
          return callback(err);
        }
        await this.web3.eth.personal.unlockAccount(
          this.account,
          phrase,
          timeHex
        );
        console.warn(this.account, ' unlocked for ' + time + ' seconds');
        return callback(null, doneLocking => {
          this.walletLock(err => {
            if (err) {
              console.error(err.message);
            } else {
              console.warn('wallet locked');
            }
            doneLocking && doneLocking();
          });
        });
      });
    } catch (e) {
      return callback(e);
    }
  }

  async sendToAddress(address, amount, callback, passphrase) {
    try {
      const gasPrice = await this.estimateGasPrice();
      const sendParams = {
        from: this.account,
        to: address,
        value: amount,
        gasPrice
      };
      const result = await this.web3.eth.personal.sendTransaction(
        sendParams,
        passphrase
      );
      if (callback) {
        callback(null, result);
      }
      return result;
    } catch (e) {
      console.error(e);
      if (callback) {
        callback(e);
      }
    }
  }

  async unlockAndSendToAddress(address, amount, callback, passphrase) {
    const send = phrase => {
      console.warn('Unlocking for a single transaction.');
      return this.sendToAddress(address, amount, callback, phrase);
    };
    try {
      if (passphrase === undefined) {
        return promptly.password('> ', (err, phrase) => {
          return send(phrase);
        });
      } else {
        return send(passphrase);
      }
    } catch (err) {
      console.error(err);
      if (callback) {
        return callback(err);
      }
    }
  }

  async getInternalEthTransactions(address, callback) {
    //WIP trace filter rpc method
    // Port number 8545
    /**
     * Example Response:
     * type response.result: array[]
  "result": [
    {
      "action": {
        "callType": "call",
        "from": "0x32be343b94f860124dc4fee278fdcbd38c102d88",
        "gas": "0x4c40d",
        "input": "0x",
        "to": "0x8bbb73bcb5d553b5a556358d27625323fd781d37",
        "value": "0x3f0650ec47fd240000"
      },
      "blockHash": "0x86df301bcdd8248d982dbf039f09faf792684e1aeee99d5b58b77d620008b80f",
      "blockNumber": 3068183,
      "result": {
        "gasUsed": "0x0",
        "output": "0x"
      },
      "subtraces": 0,
      "traceAddress": [],
      "transactionHash": "0x3321a7708b1083130bd78da0d62ead9f6683033231617c9d268e2c7e3fa6c104",
      "transactionPosition": 3,
      "type": "call"
    },
    ...
  ]
}
     *  */
    this.callMethod(
      'trace_filter',
      [
        {
          toAddress: [address],
          fromAddress: [address]
        }
      ],
      callback
    );
  }

  estimateFee(nBlocks, cb) {
    return this.estimateGasPrice(nBlocks)
      .then(value => {
        if (cb) cb(null, value);
        return value;
      })
      .catch(err => {
        if (cb) cb(err);
      });
  }

  async estimateGasPrice(nBlocks = 4) {
    const bestBlock = await this.web3.eth.getBlockNumber();
    const gasPrices = [];
    for (let i = 0; i < nBlocks; i++) {
      const block = await this.web3.eth.getBlock(bestBlock - i);
      const txs = await Promise.all(
        block.transactions.map(txid => {
          return this.web3.eth.getTransaction(txid);
        })
      );
      var blockGasPrices = txs.map(tx => {
        return tx.gasPrice;
      });
      // sort gas prices in descending order
      blockGasPrices = blockGasPrices.sort((a, b) => {
        return b - a;
      });
      var txCount = txs.length;
      var lowGasPriceIndex = txCount > 1 ? txCount - 2 : 0;
      if (txCount > 0) {
        gasPrices.push(blockGasPrices[lowGasPriceIndex]);
      }
    }
    var gethGasPrice = await this.web3.eth.getGasPrice();
    var estimate = gasPrices.reduce((a, b) => {
      return Math.max(a, b);
    }, gethGasPrice);
    return estimate;
  }

  async getBestBlockHash(callback) {
    const bestBlock = await this.web3.eth.getBlockNumber();
    const block = await this.web3.eth.getBlock(bestBlock);
    const blockHash = block.hash;

    if (callback) callback(null, blockHash);
    return blockHash;
  }

  async walletLock(callback) {
    try {
      await this.web3.eth.personal.lockAccount(this.account);
      return callback();
    } catch (err) {
      if (callback) {
        return callback(err);
      }
    }
  }

  async getTransaction(txid, callback) {
    if (callback) {
      return this.web3.eth.getTransaction(txid, callback);
    } else {
      return this.web3.eth.getTransaction(txid);
    }
  }

  async getRawTransaction(txid, callback) {
    return new Promise((resolve, reject) => {
      this.web3.currentProvider.send(
        { method: 'getRawTransaction', args: [txid] },
        (err, data) => {
          if (callback) return callback(err, data);
          if (err) {
            return reject(err);
          }
          resolve(data);
        }
      );
    });
  }

  async decodeRawTransaction(rawTx, cb) {
    const tx = new EthereumTx(rawTx);
    const to = '0x' + tx.to.toString('hex');
    const from = '0x' + tx.from.toString('hex');
    const value = parseInt(tx.value.toString('hex') || '0', 16);
    const gasPrice = parseInt(tx.gasPrice.toString('hex'), 16);
    const gasLimit = parseInt(tx.gasLimit.toString('hex'), 16);
    const data = tx.data.toString('hex');
    const decodedData = {
      to,
      from,
      value,
      gasPrice,
      gasLimit,
      data
    };
    if (cb) cb(null, decodedData);
    return decodedData;
  }

  async getBlock(blockHash, cb) {
    return this.web3.eth.getBlock(blockHash, cb);
  }

  async getConfirmations(txid, cb) {
    try {
      const tx = await this.getTransaction(txid);
      const bestBlock = await this.web3.eth.getBlockNumber();
      if (tx.blockNumber === undefined) {
        if (cb) cb(null, 0);
        return 0;
      }
      const confirmations = bestBlock - tx.blockNumber + 1;
      if (cb) cb(confirmations);
      return confirmations;
    } catch (err) {
      if (cb) cb(err);
    }
  }
}
export default EthRPC;
