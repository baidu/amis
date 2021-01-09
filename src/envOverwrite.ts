/**
 * @file 用于在移动端或不同语言环境下使用不同配置
 */

import {addSchemaFilter} from './factory';

const isMobile = window.matchMedia('(max-width: 768px)').matches ? true : false;

addSchemaFilter((schema, render, props: any) => {
  const locale = props?.locale;
  if (schema.mobile && isMobile) {
    Object.assign(schema, schema.mobile);
    delete schema.mobile;
  }

  if (schema.pc && !isMobile) {
    Object.assign(schema, schema.pc);
    delete schema.pc;
  }

  if (locale && schema[locale]) {
    Object.assign(schema, schema[locale]);
    delete schema[locale];
  }

  return schema;
});
