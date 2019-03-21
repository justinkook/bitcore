import { CoinStorage } from '../../coin';
import { TransactionStorage } from '../../transaction';
import { LoggifyClass } from '../../../decorators/Loggify';
import logger from '../../../logger';
import { IBlock } from '../../../types/Block';
import { SpentHeightIndicators } from '../../../types/Coin';
import { EventStorage } from '../../events';
import { Ethereum } from '../../../types/namespaces/Ethereum';
import { BlockModel } from '..';

export { IBlock };

export interface IEthBlock extends IBlock {
  parentHash: Buffer;
  uncleHash: Buffer;
  stateRoot: Buffer;
  timestamp: Date;
  coinbase: Buffer;
  transactionsTrie: Buffer;
  receiptTrie: Buffer;
  bloom: Buffer;
  difficulty: Buffer;
  gasLimit: Buffer;
  extraData: Buffer;
  mixHash: Buffer;
  raw: Array<Buffer>;
}

@LoggifyClass
export class EthBlockModel extends BlockModel {
  async addEthBlock(params: {
    block: Ethereum.Block;
    parentChain?: string;
    forkHeight?: number;
    initialSyncComplete: boolean;
    chain: string;
    network: string;
  }) {
    const { block, chain, network } = params;
    const header = block;

    const reorg = await this.handleEthReorg({ header, chain, network });

    if (reorg) {
      return Promise.reject('reorg');
    }
    return this.processEthBlock(params);
  }

  async processEthBlock(params: {
    block: Ethereum.Block;
    parentChain?: string;
    forkHeight?: number;
    initialSyncComplete: boolean;
    chain: string;
    network: string;
  }) {
    const { chain, network, block, parentChain, forkHeight, initialSyncComplete } = params;
    const blockOp = await this.getEthBlockOp(params);
    const convertedBlock = blockOp.updateOne.update.$set;
    const { height, timeNormalized, time } = convertedBlock;

    const previousBlock = await this.collection.findOne({ hash: convertedBlock.previousBlockHash, chain, network });

    await this.collection.bulkWrite([blockOp]);
    if (previousBlock) {
      await this.collection.updateOne(
        { chain, network, hash: previousBlock.hash },
        { $set: { nextBlockHash: convertedBlock.hash } }
      );
      logger.debug('Updating previous block.nextBlockHash ', convertedBlock.hash);
    }

    await TransactionStorage.batchEthImport({
      txs: block.transactions,
      blockHash: convertedBlock.hash,
      blockTime: new Date(time),
      blockTimeNormalized: new Date(timeNormalized),
      height: height,
      chain,
      network,
      parentChain,
      forkHeight,
      initialSyncComplete
    });

    if (initialSyncComplete) {
      EventStorage.signalBlock(convertedBlock);
    }

    await this.collection.updateOne({ hash: convertedBlock.hash, chain, network }, { $set: { processed: true } });
    this.updateCachedChainTip({ block: convertedBlock, chain, network });
  }

  async getEthBlockOp(params: { block: Ethereum.Block; chain: string; network: string }) {
    const { block, chain, network } = params;
    const header = block.header;
    const blockTime = parseInt(new Buffer(header.timestamp).toString()) * 1000;

    const previousBlock = await this.collection.findOne({ hash: header.parentHash, chain, network });

    const blockTimeNormalized = (() => {
      const prevTime = previousBlock ? previousBlock.timeNormalized : null;
      if (prevTime && blockTime <= prevTime.getTime()) {
        return prevTime.getTime() + 1;
      } else {
        return blockTime;
      }
    })();

    const height = (previousBlock && previousBlock.height + 1) || 1;
    logger.debug('Setting blockheight', height);

    const convertedBlock: IEthBlock = {
      chain,
      network,
      hash: block.hash,
      height,
      previousBlockHash: new Buffer(header.parentHash).toString(),
      parentHash: header.parentHash,
      uncleHash: header.uncleHash,
      merkleRoot: new Buffer(header.stateRoot).toString(),
      stateRoot: header.stateRoot,
      time: new Date(blockTime),
      timestamp: new Date(blockTime),
      timeNormalized: new Date(blockTimeNormalized),
      nonce: parseInt(new Buffer(header.nonce).toString()),
      transactionCount: block.transactions.length,
      reward: 0,
      processed: false,
      coinbase: header.coinbase,
      transactionsTrie: header.transactionsTrie,
      receiptTrie: header.receiptTrie,
      bloom: header.bloom,
      difficulty: header.difficulty,
      gasLimit: header.gasLimit,
      extraData: header.extraData,
      mixHash: header.mixHash,
      raw: header.raw
    };
    return {
      updateOne: {
        filter: {
          hash: header.hash,
          chain,
          network
        },
        update: {
          $set: convertedBlock
        },
        upsert: true
      }
    };
  }

  async handleEthReorg(params: { header?: Ethereum.Block; chain: string; network: string }): Promise<boolean> {
    const { header, chain, network } = params;
    let localTip = await this.getLocalTip(params);
    if (header && localTip && localTip.hash === header.hash) {
      return false;
    }
    if (!localTip || localTip.height === 0) {
      return false;
    }
    if (header) {
      const prevBlock = await this.collection.findOne({ chain, network, hash: header.hash });
      if (prevBlock) {
        localTip = prevBlock;
        this.updateCachedChainTip({ chain, network, block: prevBlock });
      } else {
        delete this.chainTips[chain][network];
        logger.error(`Previous block isn't in the DB need to roll back until we have a block in common`);
      }
      logger.info(`Resetting tip to ${localTip.height - 1}`, { chain, network });
    }
    const reorgOps = [
      this.collection.deleteMany({ chain, network, height: { $gte: localTip.height } }),
      TransactionStorage.collection.deleteMany({ chain, network, blockHeight: { $gte: localTip.height } }),
      CoinStorage.collection.deleteMany({ chain, network, mintHeight: { $gte: localTip.height } })
    ];
    await Promise.all(reorgOps);

    await CoinStorage.collection.updateMany(
      { chain, network, spentHeight: { $gte: localTip.height } },
      { $set: { spentTxid: null, spentHeight: SpentHeightIndicators.unspent } }
    );

    logger.debug('Removed data from above blockHeight: ', localTip.height);
    return true;
  }
}

export let EthBlockStorage = new EthBlockModel();
