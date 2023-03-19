import startsWith from 'lodash/startsWith';
import {IPlugin, registerOpPlugin} from '../ConditionResolver';

export class StartsWithPlugin implements IPlugin {
  compute(left: any, right: any) {
    return startsWith(left, right);
  }
}

registerOpPlugin('starts_with', new StartsWithPlugin());
