import {registerOpPlugin, IPlugin} from '../ConditionResolver';

export class LessPlugin implements IPlugin {
  compute(left: any, right: any) {
    return parseFloat(left as any) < parseFloat(right as any);
  }
}

registerOpPlugin('less', new LessPlugin());
