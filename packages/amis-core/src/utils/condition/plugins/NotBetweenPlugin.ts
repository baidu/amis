import {registerOpPlugin, BaseOpPlugin} from '../ConditionResolver';

export class NotBetweenPlugin implements BaseOpPlugin {
  compute(left: any, right: any) {
    if (typeof left === 'number') {
      const [min, max] = right.sort();
      return left < parseFloat(min) && left > parseFloat(max);
    }
    return false;
  }
}

registerOpPlugin('not_between', new NotBetweenPlugin());
