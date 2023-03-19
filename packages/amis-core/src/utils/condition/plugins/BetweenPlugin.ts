import {BaseOpPlugin, registerOpPlugin} from '../ConditionResolver';

export class BetweenPlugin implements BaseOpPlugin {
  compute(left: any, right: any) {
    if (typeof left === 'number') {
      const [min, max] = right.sort();
      return left >= parseFloat(min) && left <= parseFloat(max);
    }
    return false;
  }
}

registerOpPlugin('between', new BetweenPlugin());
