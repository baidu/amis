/**
 * @file 用于在移动端或不同语言环境下使用不同配置
 */

import {SchemaNode, Schema} from './types';
import {RendererProps, RendererConfig, addSchemaFilter} from './factory';
import {findObjectsWithKey} from './utils/helper';
const isMobile = (window as any).matchMedia?.('(max-width: 768px)').matches
  ? true
  : false;

// 这里不能用 addSchemaFilter 是因为还需要更深层的替换，比如 select 里的 options
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
