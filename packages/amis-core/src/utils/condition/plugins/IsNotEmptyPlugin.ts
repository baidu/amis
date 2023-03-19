import isEmpty from 'lodash/isEmpty';
import {registerOpPlugin, BaseOpPlugin} from '../ConditionResolver';

export class IsNotEmptyPlugin implements BaseOpPlugin {
  compute(left: any) {
    if (typeof left === 'string') {
      return !left;
    } else if (typeof left === 'number') {
      return left !== undefined;
    } else if (Array.isArray(left)) {
      return !!left.length;
    } else if (typeof left === 'object') {
      return !isEmpty(left);
    }
    return false;
  }
}

registerOpPlugin('is_not_empty', new IsNotEmptyPlugin());
