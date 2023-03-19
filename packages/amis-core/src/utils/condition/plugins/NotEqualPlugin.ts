import isEqual from 'lodash/isEqual';
import {registerOpPlugin, IPlugin} from '../ConditionResolver';

export class NotEqualPlugin implements IPlugin {
  compute(left: any, right: any) {
    return !isEqual(left, right);
  }
}

registerOpPlugin('not_equal', new NotEqualPlugin());
