/**
 * 扩展 Schema，目前用于实现 input-kv
 */
import {Schema} from 'amis-core';
import {addSchemaFilter} from 'amis-core';
import {isObject} from 'amis-core';

// input-kv 实际上是 combo 的一种扩展
addSchemaFilter(function (schema: Schema, renderer, props?: any) {
  if (schema && schema.type === 'input-kv') {
    return {
      draggable: true,
      ...schema,
      multiple: true,
      pipeIn: (value: any) => {
        if (!isObject(value)) {
          return [];
        }
        const arr: Array<any> = [];
        Object.keys(value).forEach(key => {
          const valueType = typeof value[key];
          arr.push({
            key: key || '',
            value:
              valueType === 'string' ||
              valueType === 'number' ||
              valueType === 'boolean'
                ? value[key]
                : JSON.stringify(value[key])
          });
        });
        return arr;
      },
      pipeOut: (value: any) => {
        if (!Array.isArray(value)) {
          return value;
        }
        const obj: any = {};
        value.forEach((item: any) => {
          const key: string = item.key ?? '';
          let value: any = item.value ?? schema.defaultValue ?? '';
          if (typeof value === 'string' && value.startsWith('{')) {
            try {
              value = JSON.parse(value);
            } catch (e) {}
          }

          obj[key] = value;
        });
        return obj;
      },
      items: [
        {
          placeholder: schema.keyPlaceholder ?? 'Key',
          type: 'input-text',
          unique: true,
          name: 'key',
          required: true,
          validateOnChange: true
        },
        schema.valueComponent
          ? {
              placeholder: schema.valuePlaceholder ?? 'Value',
              component: schema.valueComponent,
              asFormItem: true,
              name: 'value'
            }
          : {
              placeholder: schema.valuePlaceholder ?? 'Value',
              type: schema.valueType || 'input-text',
              name: 'value'
            }
      ]
    };
  }

  return schema;
});
