import {registerOpPlugin, BaseOpPlugin} from '../ConditionResolver';

export class GreaterPlugin implements BaseOpPlugin {
  compute(left: any, right: any) {
    return parseFloat(left as any) > parseFloat(right as any);
  }
}

registerOpPlugin('greater', new GreaterPlugin());
