/**
 * @file 用于在移动端或不同语言环境下使用不同配置
 */

import {findObjectsWithKey} from './utils/helper';

const isMobile = window.matchMedia('(max-width: 768px)').matches ? true : false;

export const envOverwrite = (schema: any, locale?: string) => {
  if (schema.mobile && isMobile) {
    Object.assign(schema, schema.mobile);
    delete schema.mobile;
  }

  if (locale) {
    let schemaNodes = findObjectsWithKey(schema, locale);
    for (let schemaNode of schemaNodes) {
      Object.assign(schemaNode, schemaNode[locale]);
      delete schemaNode[locale];
    }
  }

  if (isMobile) {
    let schemaNodes = findObjectsWithKey(schema, 'mobile');
    for (let schemaNode of schemaNodes) {
      Object.assign(schemaNode, schemaNode['mobile']);
      delete schemaNode['mobile'];
    }
  }
};
