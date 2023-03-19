import isEqual from 'lodash/isEqual';
import {registerOpPlugin, BaseOpPlugin} from '../ConditionResolver';

export class EqualPlugin implements BaseOpPlugin {
  compute(left: any, right: any) {
    return isEqual(left, right);
  }
}

registerOpPlugin('equal', new EqualPlugin());
