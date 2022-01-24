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
          if (key.endsWith('___tmp')) {
            arr.push({
              key: key.replace('___tmp', ''),
              value: ''
            });
          } else {
            arr.push({
              key: key || '',
              value:
                valueType === 'string' ||
                valueType === 'number' ||
                valueType === 'boolean'
                  ? value[key]
                  : JSON.stringify(value[key])
            });
          }
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

          // 如果先输入了 a 作为 key，想输入 aa 的时候会先进入这里，导致无法输入 aa，因此当遇到 key 相同的时候加个 ___tmp 后缀
          if (key in obj) {
            obj[key + '___tmp'] = value;
          } else {
            obj[key] = value;
          }
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
