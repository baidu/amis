import {registerOpPlugin, BaseOpPlugin} from '../ConditionResolver';

export class LessPlugin implements BaseOpPlugin {
  compute(left: any, right: any) {
    return parseFloat(left as any) < parseFloat(right as any);
  }
}

registerOpPlugin('less', new LessPlugin());
