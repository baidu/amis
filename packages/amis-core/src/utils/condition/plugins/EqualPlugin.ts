import isEqual from 'lodash/isEqual';
import {registerOpPlugin, IPlugin} from '../ConditionResolver';

export class EqualPlugin implements IPlugin {
  compute(left: any, right: any) {
    return isEqual(left, right);
  }
}

registerOpPlugin('equal', new EqualPlugin());
