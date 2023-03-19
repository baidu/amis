import {registerOpPlugin, IPlugin} from '../ConditionResolver';

export class LikePlugin implements IPlugin {
  compute(left: any, right: any) {
    return !!~left.indexOf(right);
  }
}

registerOpPlugin('like', new LikePlugin());
