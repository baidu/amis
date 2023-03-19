import isEqual from 'lodash/isEqual';
import {registerOpPlugin, BaseOpPlugin} from '../ConditionResolver';

export class NotEqualPlugin implements BaseOpPlugin {
  compute(left: any, right: any) {
    return !isEqual(left, right);
  }
}

registerOpPlugin('not_equal', new NotEqualPlugin());
