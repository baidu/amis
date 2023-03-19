import startsWith from 'lodash/startsWith';
import {BaseOpPlugin, registerOpPlugin} from '../ConditionResolver';

export class StartsWithPlugin implements BaseOpPlugin {
  compute(left: any, right: any) {
    return startsWith(left, right);
  }
}

registerOpPlugin('starts_with', new StartsWithPlugin());
