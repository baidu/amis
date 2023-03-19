import {registerOpPlugin, IPlugin} from '../ConditionResolver';

export class NotLikePlugin implements IPlugin {
  compute(left: any, right: any) {
    return !~left.indexOf(right);
  }
}

registerOpPlugin('not_like', new NotLikePlugin());
