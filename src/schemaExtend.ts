/**
 * 扩展 Schema，目前用于实现 input-kv
 */
import {Schema} from './types';
import {addSchemaFilter} from './factory';
import {isObject} from './utils/helper';

// input-kv 实际上是 combo 的一种扩展
addSchemaFilter(function (schema: Schema, renderer, props?: any) {
  if (schema && schema.type === 'input-kv') {
    return {
      ...schema,
      multiple: true,
      pipeIn: (value: any) => {
        if (!isObject(value)) {
          return [];
        }

        let arr: Array<any> = [];

        Object.keys(value).forEach(key => {
          arr.push({
            key: key || '',
            value:
              typeof value[key] === 'string'
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
        let obj: any = {};

        value.forEach((item: any) => {
          let key: string = item.key || '';
          let value: any = item.value;
          try {
            value = JSON.parse(value);
          } catch (e) {}

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
          required: true
        },
        {
          placeholder: schema.valuePlaceholder ?? 'Value',
          type: schema.valueType || 'input-text',
          name: 'value'
        }
      ]
    };
  }

  return schema;
});
