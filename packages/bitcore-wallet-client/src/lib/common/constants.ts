'use strict';

export const Constants = {
  SCRIPT_TYPES: {
    P2SH: 'P2SH',
    P2PKH: 'P2PKH'
  },
  // not used, since Credentials 2.0
  DERIVATION_STRATEGIES: {
    BIP44: 'BIP44',
    BIP45: 'BIP45',
    BIP48: 'BIP48'
  },
  PATHS: {
    SINGLE_ADDRESS: 'm/0/0',
    REQUEST_KEY: "m/1'/0",
    //  TXPROPOSAL_KEY: "m/1'/1",
    REQUEST_KEY_AUTH: 'm/2' // relative to BASE
  },
  BIP45_SHARED_INDEX: 0x80000000 - 1,
  UNITS: {
    btc: {
      toSatoshis: 100000000,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    bch: {
      toSatoshis: 100000000,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    eth: {
      toSatoshis: 1e18,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    xrp: {
      toSatoshis: 1e6,
      full: {
        maxDecimals: 6,
        minDecimals: 6
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    usdc: {
      toSatoshis: 1e6,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    pax: {
      toSatoshis: 1e18,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    gusd: {
      toSatoshis: 1e2,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    dai: {
      toSatoshis: 1e18,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    bat: {
      toSatoshis: 1e18,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    bnb: {
      toSatoshis: 1e18,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    link: {
      toSatoshis: 1e18,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    cvc: {
      toSatoshis: 1e8,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    mana: {
      toSatoshis: 1e18,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    gnt: {
      toSatoshis: 1e18,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    omg: {
      toSatoshis: 1e18,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    usdt: {
      toSatoshis: 1e6,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    trx: {
      toSatoshis: 1e6,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    zrx: {
      toSatoshis: 1e18,
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    },
    bit: {
      toSatoshis: 100,
      full: {
        maxDecimals: 2,
        minDecimals: 2
      },
      short: {
        maxDecimals: 0,
        minDecimals: 0
      }
    }
  },
  COINS: [
    'btc',
    'bch',
    'eth',
    'xrp',
    'usdc',
    'pax',
    'gusd',
    'dai',
    'bat',
    'bnb',
    'link',
    'cvc',
    'mana',
    'gnt',
    'omg',
    'usdt',
    'trx',
    'zrx'
  ],
  ERC20: ['usdc', 'pax', 'gusd', 'dai', 'bat', 'bnb', 'link', 'cvc', 'mana', 'gnt', 'omg', 'usdt', 'trx', 'zrx'],
  UTXO_COINS: ['btc', 'bch'],
  TOKEN_OPTS: {
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
      name: 'USD Coin',
      symbol: 'USDC',
      decimal: 6,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    },
    '0x8e870d67f660d95d5be530380d0ec0bd388289e1': {
      name: 'Paxos Standard',
      symbol: 'PAX',
      decimal: 18,
      address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1'
    },
    '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd': {
      name: 'Gemini Dollar',
      symbol: 'GUSD',
      decimal: 2,
      address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd'
    },
    '0x6b175474e89094c44da98b954eedeac495271d0f': {
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      decimal: 18,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f'
    },
    '0x0d8775f648430679a709e98d2b0cb6250d2887ef': {
      name: 'Basic Attention Token',
      symbol: 'BAT',
      decimal: 18,
      address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef'
    },
    '0xB8c77482e45F1F44dE1745F52C74426C631bDD52': {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimal: 18,
      address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
    },
    '0x514910771af9ca656af840dff83e8264ecf986ca': {
      name: 'ChainLink',
      symbol: 'LINK',
      decimal: 18,
      address: '0x514910771af9ca656af840dff83e8264ecf986ca'
    },
    '0x41e5560054824ea6b0732e656e3ad64e20e94e45': {
      name: 'Civic',
      symbol: 'CVC',
      decimal: 8,
      address: '0x41e5560054824ea6b0732e656e3ad64e20e94e45'
    },
    '0x0f5d2fb29fb7d3cfee444a200298f468908cc942': {
      name: 'Decentraland',
      symbol: 'MANA',
      decimal: 18,
      address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942'
    },
    '0xa74476443119A942dE498590Fe1f2454d7D4aC0d': {
      name: 'Golem',
      symbol: 'GNT',
      decimal: 18,
      address: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d'
    },
    '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07': {
      name: 'OmiseGO',
      symbol: 'OMG',
      decimal: 18,
      address: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07'
    },
    '0xdac17f958d2ee523a2206206994597c13d831ec7': {
      name: 'Tether USD',
      symbol: 'USDT',
      decimal: 6,
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
    },
    '0xf230b790e05390fc8295f4d3f60332c93bed42e2': {
      name: 'Tron',
      symbol: 'TRX',
      decimal: 6,
      address: '0xf230b790e05390fc8295f4d3f60332c93bed42e2'
    },
    '0xe41d2489571d322189246dafa5ebde1f4699f498': {
      name: '0x',
      symbol: 'ZRX',
      decimal: 18,
      address: '0xe41d2489571d322189246dafa5ebde1f4699f498'
    }
  }
};
