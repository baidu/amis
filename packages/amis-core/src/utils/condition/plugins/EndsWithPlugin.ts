import endsWith from 'lodash/endsWith';
import {registerOpPlugin, IPlugin} from '../ConditionResolver';

export class EndsWithPlugin implements IPlugin {
  compute(left: any, right: any) {
    return endsWith(left, right);
  }
}

registerOpPlugin('ends_with', new EndsWithPlugin());
