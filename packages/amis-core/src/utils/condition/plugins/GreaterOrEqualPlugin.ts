import {registerOpPlugin, BaseOpPlugin} from '../ConditionResolver';

export class GreaterOrEqualPlugin implements BaseOpPlugin {
  compute(left: any, right: any) {
    return parseFloat(left as any) >= parseFloat(right as any);
  }
}

registerOpPlugin('greater_or_equal', new GreaterOrEqualPlugin());
