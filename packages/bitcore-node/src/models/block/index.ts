import { valueOrDefault } from '../../utils/check';
import { TransformOptions } from '../../types/TransformOptions';
import { LoggifyClass } from '../../decorators/Loggify';
import { BaseModel, MongoBound } from '../base';
import { IBlock } from '../../types/Block';
import config from '../../config';
import { StorageService } from '../../services/storage';

export { IBlock };

@LoggifyClass
export class BlockModel extends BaseModel<IBlock> {
  constructor(storage?: StorageService) {
    super('blocks', storage);
  }

  chainTips: Mapping<Mapping<IBlock>> = {};

  allowedPaging = [
    {
      key: 'height' as 'height',
      type: 'number' as 'number'
    }
  ];

  async onConnect() {
    this.collection.createIndex({ hash: 1 }, { background: true });
    this.collection.createIndex({ chain: 1, network: 1, processed: 1, height: -1 }, { background: true });
    this.collection.createIndex({ chain: 1, network: 1, timeNormalized: 1 }, { background: true });
    this.collection.createIndex({ previousBlockHash: 1 }, { background: true });
    this.wireup();
  }

  async wireup() {
    for (let chain of Object.keys(config.chains)) {
      for (let network of Object.keys(config.chains[chain])) {
        const tip = await this.getLocalTip({ chain, network });
        if (tip) {
          this.chainTips[chain] = { [network]: tip };
        }
      }
    }
  }

  updateCachedChainTip(params: { block: IBlock; chain: string; network: string }) {
    const { chain, network, block } = params;
    this.chainTips[chain] = valueOrDefault(this.chainTips[chain], {});
    this.chainTips[chain][network] = valueOrDefault(this.chainTips[chain][network], block);
    if (this.chainTips[chain][network].height < block.height) {
      this.chainTips[chain][network] = block;
    }
  }

  getPoolInfo(coinbase: string) {
    //TODO need to make this actually parse the coinbase input and map to miner strings
    // also should go somewhere else
    return coinbase;
  }

  getLocalTip({ chain, network }) {
    return this.collection.findOne({ chain, network, processed: true }, { sort: { height: -1 } });
  }

  _apiTransform(block: Partial<MongoBound<IBlock>>, options: TransformOptions): any {
    const transform = {
      _id: block._id,
      chain: block.chain,
      network: block.network,
      hash: block.hash,
      height: block.height,
      version: block.version,
      size: block.size,
      merkleRoot: block.merkleRoot,
      time: block.time,
      timeNormalized: block.timeNormalized,
      nonce: block.nonce,
      bits: block.bits,
      /*
       *difficulty: block.difficulty,
       */
      /*
       *chainWork: block.chainWork,
       */
      previousBlockHash: block.previousBlockHash,
      nextBlockHash: block.nextBlockHash,
      reward: block.reward,
      /*
       *isMainChain: block.mainChain,
       */
      transactionCount: block.transactionCount
      /*
       *minedBy: BlockModel.getPoolInfo(block.minedBy)
       */
    };
    if (options && options.object) {
      return transform;
    }
    return JSON.stringify(transform);
  }
}

export let BlockStorage = new BlockModel();
