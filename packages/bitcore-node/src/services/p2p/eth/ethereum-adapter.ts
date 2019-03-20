import { ConvertBlockParams, AdapterType, ConvertTxParams } from '..';
import { BN } from 'bn.js';
import { Bucket } from '../../../types/namespaces/ChainAdapter';
import { Ethereum } from '../../../types/namespaces/Ethereum';
import { ObjectID } from 'bson';

export class EthereumAdapter implements AdapterType<Ethereum.Block, Ethereum.Transaction> {
  convertBlock(params: ConvertBlockParams<Ethereum.Block>) {
    const { chain, network, block } = params;
    const { header } = block;
    return {
      chain,
      network,
      header,
      height: new BN(header.number).toNumber(),
      hash: block.header.hash().toString('hex'),
      version: 1,
      merkleRoot: block.header.transactionsTrie.toString('hex'),
      time: new Date(parseInt(new Buffer(header.timestamp).toString()) * 1000),
      timeNormalized: new Date(parseInt(new Buffer(header.timestamp).toString()) * 1000),
      nonce: Number(header.nonce.toString('hex')),
      previousBlockHash: header.parentHash.toString('hex'),
      nextBlockHash: '',
      transactions: block.transactions,
      transactionCount: block.transactions.length,
      size: block.raw.length,
      reward: 3,
      processed: false,
      bits: 0,
      outputAmount: 3,
      uncleHeaders: block.uncleHeaders,
      txTrie: block.txTrie,
      raw: block.raw,
      toBuffer: () => Buffer,
      bucket: {
        gasLimit: Number.parseInt(header.gasLimit.toString('hex'), 16) || 0,
        gasUsed: Number.parseInt(header.gasUsed.toString('hex'), 16) || 0,
        stateRoot: header.stateRoot
      }
    };
  }

  convertTx(params: ConvertTxParams<Ethereum.Transaction>) {
    const { chain, network, tx, block } = params;

    const convertedTx: Bucket<any> = {
      chain,
      network,
      wallets: [] as ObjectID[],
      txid: tx.txid,
      size: tx.data!.length,
      fee: tx.fee,
      bucket: {
        gasLimit: tx.gasLimit!.toString('hex'),
        gasPrice: tx.gasPrice!.toString('hex'),
        nonce: tx.nonce!.toString('hex')
      }
    };
    if (block) {
      convertedTx.blockHeight = block.height;
      convertedTx.blockHash = block.hash;
      convertedTx.blockTime = block.time;
      convertedTx.blockTimeNormalized = block.timeNormalized;
    }

    const inputs = [
      {
        mintTxid: tx.txid,
        mintIndex: 0,
        bucket: {}
      }
    ];

    const outputs = [
      {
        value: tx.value || 0,
        address: '0x' + tx.to!.toString('hex'),
        bucket: { tokenValue: tx.tokenValue }
      }
    ];
    return { ...convertedTx, inputs, outputs };
  }
}
