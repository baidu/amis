/**
 * @file 用于在移动端或不同语言环境下使用不同配置
 */

import {JSONValueMap} from './utils/helper';
import isPlainObject from 'lodash/isPlainObject';
const isMobile = (window as any).matchMedia?.('(max-width: 768px)').matches
  ? true
  : false;

// 这里不能用 addSchemaFilter 是因为还需要更深层的替换，比如 select 里的 options
export const envOverwrite = (schema: any, locale?: string, device?: string) => {
  const isMobileDevice = device === 'mobile' || isMobile;
  return JSONValueMap(
    schema,
    (value: any) => {
      if (!isPlainObject(value)) {
        return value;
      }

      if (locale && value[locale]) {
        const newValue = Object.assign({}, value, value[locale]);
        delete newValue[locale];
        return newValue;
      } else if (isMobileDevice && value.mobile) {
        const newValue = Object.assign({}, value, value.mobile);
        delete newValue.mobile;
        return newValue;
      }
    },
    true
  );
};
