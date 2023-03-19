import {registerOpPlugin, IPlugin} from '../ConditionResolver';

export class LessOrEqualPlugin implements IPlugin {
  compute(left: any, right: any) {
    return parseFloat(left as any) <= parseFloat(right as any);
  }
}

registerOpPlugin('less_or_equal', new LessOrEqualPlugin());
