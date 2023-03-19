import {registerOpPlugin, IPlugin} from '../ConditionResolver';

export class GreaterOrEqualPlugin implements IPlugin {
  compute(left: any, right: any) {
    return parseFloat(left as any) >= parseFloat(right as any);
  }
}

registerOpPlugin('greater_or_equal', new GreaterOrEqualPlugin());
