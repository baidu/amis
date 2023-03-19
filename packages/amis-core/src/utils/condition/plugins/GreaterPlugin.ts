import {registerOpPlugin, IPlugin} from '../ConditionResolver';

export class GreaterPlugin implements IPlugin {
  compute(left: any, right: any) {
    return parseFloat(left as any) > parseFloat(right as any);
  }
}

registerOpPlugin('greater', new GreaterPlugin());
