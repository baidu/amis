import endsWith from 'lodash/endsWith';
import {registerOpPlugin, BaseOpPlugin} from '../ConditionResolver';

export class EndsWithPlugin implements BaseOpPlugin {
  compute(left: any, right: any) {
    return endsWith(left, right);
  }
}

registerOpPlugin('ends_with', new EndsWithPlugin());
