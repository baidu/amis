/**
 * @file 用于在移动端或不同语言环境下使用不同配置
 */

import {SchemaNode, Schema} from './types';
import {RendererProps, RendererConfig, addSchemaFilter} from './factory';

const isMobile = (window as any).matchMedia?.('(max-width: 768px)').matches
  ? true
  : false;

addSchemaFilter(function (schema: Schema, renderer, props?: any) {
  if (schema && schema.mobile && isMobile) {
    return {...schema, ...schema.mobile};
  }

  if (props?.locale && schema[props.locale]) {
    return {...schema, ...schema[props.locale]};
  }

  return schema;
});
