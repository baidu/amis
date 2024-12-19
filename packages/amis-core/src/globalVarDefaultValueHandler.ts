import {
  registerGlobalVariableHandler,
  GlobalVariableItemFull
} from './globalVar';
/**
 * 格式化默认值
 */
registerGlobalVariableHandler(function (
  variable,
  context
): GlobalVariableItemFull | void {
  if (variable.defaultValue && typeof variable.defaultValue === 'string') {
    const defaultValue = variable.defaultValue;
    try {
      let value = defaultValue;
      const valueType = variable.valueSchema?.type as string;

      if (valueType && ['number', 'array', 'object'].includes(valueType)) {
        value = JSON.parse(defaultValue);
      }

      return {
        ...variable,
        defaultValue: value
      };
    } catch (e) {
      // do nothing
    }
  }
});
