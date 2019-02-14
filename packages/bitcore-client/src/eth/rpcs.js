const EthRPC = require('./EthRpc');

class CryptoRpcProvider {
  constructor() {
    this.rpcClasses = {
      ETH: EthRPC
    };

    this.config = {
      host: 'localhost',
      port: '7545',
      protocol: 'http',
      currencyConfig: {
        ETH: {
          account: '0xAdF6BD79a5C30c8a64b7DCbf73e5A14B43B059fA'
        }
      }
    };
  }

  has(currency) {
    return this.rpcClasses[currency] != null;
  }

  get(currency) {
    const RpcClass = this.rpcClasses[currency];
    return new RpcClass(this.config);
  }

  cmdlineUnlock(currency, time, cb) {
    return this.get(currency).cmdlineUnlock(time, cb);
  }

  getBalance(currency, address, cb) {
    return this.get(currency).getBalance(address, cb);
  }

  sendToAddress(currency, address, amount, cb, passphrase) {
    return this.get(currency).sendToAddress(address, amount, cb, passphrase);
  }

  walletLock(currency, cb) {
    return this.get(currency).walletLock(cb);
  }

  unlockAndSendToAddress(currency, address, amount, callback, passphrase) {
    return this.get(currency).unlockAndSendToAddress(
      address,
      amount,
      callback,
      passphrase
    );
  }

  getInternalEthTransactions(address, callback) {
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

  estimateFee(currency, nBlocks, cb) {
    return this.get(currency).estimateFee(nBlocks, cb);
  }

  getBestBlockHash(currency, cb) {
    return this.get(currency).getBestBlockHash(cb);
  }

  getTransaction(currency, txid, cb) {
    return this.get(currency).getTransaction(txid, cb);
  }

  getRawTransaction(currency, txid, cb) {
    return this.get(currency).getRawTransaction(txid, cb);
  }

  decodeRawTransaction(currency, rawTx, cb) {
    return this.get(currency).decodeRawTransaction(rawTx, cb);
  }

  getBlock(currency, hash, cb) {
    return this.get(currency).getBlock(hash, cb);
  }

  getConfirmations(currency, txid, cb) {
    return this.get(currency).getConfirmations(txid, cb);
  }
}

module.exports = CryptoRpcProvider;
