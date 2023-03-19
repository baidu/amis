import {registerOpPlugin, BaseOpPlugin} from '../ConditionResolver';

export class NotLikePlugin implements BaseOpPlugin {
  compute(left: any, right: any) {
    return !~left.indexOf(right);
  }
}

registerOpPlugin('not_like', new NotLikePlugin());
