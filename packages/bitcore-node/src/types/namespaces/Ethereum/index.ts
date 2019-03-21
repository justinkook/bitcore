import { ObjectID } from 'bson';

export declare namespace Ethereum {
  export type Block = {
    hash: string;
    header: Header;
    transactions: Transaction[];
    uncleHeaders: Header[];
    raw: Buffer[];
    txTrie: any;
  };

  export type Header = {
    parentHash: Buffer;
    uncleHash: Buffer;
    coinbase: Buffer;
    stateRoot: Buffer;
    transactionsTrie: Buffer;
    receiptTrie: Buffer;
    bloom: Buffer;
    difficulty: Buffer;
    number: Buffer;
    gasLimit: Buffer;
    gasUsed: Buffer;
    timestamp: Buffer;
    extraData: Buffer;
    mixHash: Buffer;
    nonce: Buffer;
    raw: Array<Buffer>;
    hash: () => Buffer;
  };

  export type Transaction = {
    nonce: Buffer;
    gasPrice: Buffer;
    gasLimit: Buffer;
    to?: Buffer | string;
    value: number;
    data?: Buffer | string;
    chainId: number;
    chain: string;
    network: string;
    txid: string;
    blockHeight: number;
    blockHash: string;
    fee: number;
    outputIndex?: string;
    outputAmount: number;
    wallets: ObjectID[];
    from?: string;
    category: string;
    ERC20: boolean;
    tokenValue?: number;
  };
}
