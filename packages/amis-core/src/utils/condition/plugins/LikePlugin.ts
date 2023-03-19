import {registerOpPlugin, BaseOpPlugin} from '../ConditionResolver';

export class LikePlugin implements BaseOpPlugin {
  compute(left: any, right: any) {
    return !!~left.indexOf(right);
  }
}

registerOpPlugin('like', new LikePlugin());
