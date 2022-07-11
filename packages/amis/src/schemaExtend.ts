/**
 * 扩展 Schema，目前用于实现 input-kv
 */
import isEqual from 'lodash/isEqual';
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

/**
 * 之前 input-kv 的 value 值不支持对象或数组
 * 很多属性是给单个值设置的，比如 valuePlaceholder 导致
 * 耦合在一起会导致配置项混乱，所以新增了这个组件专门支持 value 是对象或数组的场景
 */
addSchemaFilter(function (schema: Schema, renderer, props?: any) {
  if (schema && schema.type === 'input-kvs') {
    const keyItem = schema.keyItem || {};
    const valueItems = schema.valueItems || [];
    // value 直接放在 key 下的情况
    let flatValue = false;
    if (valueItems.length == 1) {
      if (valueItems[0].name === '_value') {
        flatValue = true;
      }
    }
    const newSchema = {
      draggable: true,
      multiple: true,
      multiLine: true,
      ...schema,
      pipeIn: (data: any) => {
        if (!isObject(data)) {
          return [];
        }
        const arr: Array<any> = [];
        Object.keys(data).forEach(key => {
          let value = data[key];
          if (!value) {
            // value = {};
          }
          if (flatValue) {
            arr.push({
              _key: key || '',
              _value: value
            });
          } else if (typeof value === 'object') {
            arr.push({
              ...value,
              _key: key || ''
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
          let {_key, ...rest} = item;
          _key = _key ?? '';
          if (flatValue) {
            if (schema.valueIsArray) {
              obj[_key] = item['_value'] || [];
            } else {
              obj[_key] = item['_value'] || {};
            }
            // 数组的时候初始化会生成 [{}]，还不确定是哪生成的，先修正为 []
            if (isEqual(obj[_key], [{}])) {
              obj[_key] = [];
            }
          } else {
            if (schema.valueIsArray) {
              obj[_key] = rest || [];
            } else {
              obj[_key] = rest || {};
            }
          }
        });
        return obj;
      },
      items: [
        {
          type: 'input-text',
          unique: true,
          name: '_key',
          required: true,
          validateOnChange: true,
          ...keyItem
        },
        ...valueItems
      ]
    };
    return newSchema;
  }

  return schema;
});
