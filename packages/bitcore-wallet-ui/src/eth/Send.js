/**
 * SendProgram
 *
 * @param config
 * ETHNode: {
 *  host: 'localhost',
 *  rpcPort: '8545',
 *  protocol: 'http',
 *  currencies : {
 *    GUSD: {
 *      tokenContractAddress: '0xd0683a2f4e9ecc9ac6bb41090b4269f7cacdd5d4'
 *    },
 *    USDC: {
 *      tokenContractAddress: '0xc92e381c387edbfd2e2112f3054896dd20ac3d31'
 *    }
 *  }
 *}
 */

import CryptoRPC from './rpcs';

const SendProgram = {
  start: program => {
    async function main() {
      const { currency, address, amount } = program;

      const rpcHost = {
        host: 'localhost',
        rpcPort: 7545,
        protocol: 'http',
        currencies: {
          ETH: {
            account: '0x157FC5b24F9Fa85B37BdD6307753257b60393684'
          }
        }
      };
      if (rpcHost) {
        const { host, rpcPort, protocol, user, pass } = rpcHost;
        const currencyConfig = rpcHost.currencies[currency] || {};
        let rpcs = new CryptoRPC(
          {
            host,
            rpcPort,
            user,
            pass,
            protocol
          },
          currencyConfig
        );

        rpcs.unlockAndSendToAddress(currency, address, amount, (err, tx) => {
          if (err) console.error(err);
          console.log(tx);
        });
      } else {
        console.error('ERROR: Node is not in the config');
      }
    }
    main();
  }
};

export default SendProgram;
