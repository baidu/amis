import {IPlugin, registerOpPlugin} from '../ConditionResolver';

export class SelectAnyInPlugin implements IPlugin {
  compute(left: any, right: any) {
    if (Array.isArray(left)) {
      return right.every((item: any) => left.includes(item));
    }
    return right.includes(left);
  }
}

registerOpPlugin('select_any_in', new SelectAnyInPlugin());
