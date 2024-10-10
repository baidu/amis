import {ANY_KEY, Attributes} from '../openxml/Attributes';
import {normalizeBoolean} from '../OpenXML';
import {XMLNode} from '../util/xml';

const removeNameSpace = new RegExp('a:|xdr:|c:');

const replaceCache: Map<string, string> = new Map();

/**
 * 目前不支持这两种 name space
 */
function removeNamespace(tag: string) {
  if (replaceCache.has(tag)) {
    return replaceCache.get(tag)!;
  }
  const result = tag.replace('a:', '').replace('xdr:', '').replace('c:', '');
  replaceCache.set(tag, result);
  return result;
}

/**
 * 通用属性解析
 * @param node xml 节点
 * @param attributes 属性定义
 * @param fillDefault 是否补上默认值
 */

export function autoParse(
  node: XMLNode | null,
  attributes: Attributes,
  fillDefault = false
) {
  const result: any = {};
  const attrs = node?.attrs || {};
  for (const key in attrs) {
    const resultKey = removeNamespace(key);
    if (resultKey in attributes) {
      const attribute = attributes[resultKey];
      const value = attrs[key];
      if (attribute.type === 'int') {
        result[resultKey] = parseInt(value, 10);
      } else if (attribute.type === 'double') {
        result[resultKey] = parseFloat(value);
      } else if (attribute.type === 'boolean') {
        result[resultKey] = normalizeBoolean(
          value,
          attribute.defaultValue as boolean
        );
      } else if (attribute.type === 'string') {
        result[resultKey] = value;
      }
    } else {
      result[resultKey] = attrs[key];
      if (key.startsWith('xmlns') || key.startsWith('mc:Ignorable')) {
        continue;
      }
      // xr: 先不处理
      if (
        result[resultKey] === undefined &&
        !(
          key.startsWith('xr:') ||
          key === 'xr3:uid' ||
          key === 'xr2:uid' ||
          key === 'x14ac:dyDescent'
        )
      ) {
        console.log(
          `parseAttributes: ${node?.tag}'s attribute: ${key} is not supported`
        );
      }
    }
  }
  // 补上默认值
  if (fillDefault) {
    for (const key in attributes) {
      const attribute = attributes[key];
      if (attribute.defaultValue !== undefined && result[key] === undefined) {
        result[key] = attribute.defaultValue;
      }
    }
  }

  // 自定义类型
  for (const attributeKey in attributes) {
    const attribute = attributes[attributeKey];
    if (attribute.type === 'child') {
      for (const child of node?.children || []) {
        let tag = removeNamespace(child.tag);
        if (tag === attributeKey) {
          const childElement = autoParse(child, attribute.childAttributes!);
          if (attribute.childIsArray) {
            if (Array.isArray(result[attributeKey])) {
              result[attributeKey].push(childElement);
            } else {
              result[attributeKey] = [childElement];
            }
          } else {
            result[attributeKey] = childElement;
          }
        }
      }
    } else if (attribute.childIsArray) {
      // 这种情况是用子节点当成数组，比如 CT_CfRule 里的 formula
      const type = attribute.type;
      if (
        type === 'string' ||
        type === 'int' ||
        type === 'double' ||
        type === 'boolean' ||
        type === 'child-string' ||
        type === 'child-int'
      ) {
        const childArray = node?.children || [];
        const resultArray = childArray
          .map(child => {
            let tag = removeNamespace(child.tag);
            const text = child.text || '';
            if (type === 'int') {
              return parseInt(text, 10);
            }
            if (type === 'double') {
              return parseFloat(text);
            }
            if (type === 'boolean') {
              return normalizeBoolean(text, false);
            }
            if (type === 'child-string') {
              if (tag === attributeKey) {
                return text;
              } else {
                return undefined;
              }
            }
            if (type === 'child-int') {
              if (tag === attributeKey) {
                return parseInt(text, 10);
              } else {
                return undefined;
              }
            }

            return text;
          })
          .filter(function (element) {
            return element !== undefined;
          });
        result[attributeKey] = resultArray;
      } else {
        console.log('unsupported attribute array type', type);
      }
    } else if (attribute.type === 'child-string') {
      for (const child of node?.children || []) {
        let tag = removeNamespace(child.tag);
        if (tag === attributeKey) {
          result[tag] = child.text;
        }
      }
    } else if (attribute.type === 'child-int') {
      for (const child of node?.children || []) {
        let tag = removeNamespace(child.tag);
        if (tag === attributeKey) {
          result[tag] = parseInt(child.text || '0', 10);
        }
      }
    } else if (attribute.type === 'any') {
      result[ANY_KEY] = node?.children || [];
    }
  }

  return result;
}
