import * as fs from 'fs';
import {XMLNode, xml2json} from '../src/util/xml';

interface SimpleType {
  name: string;
  type: 'string' | 'int' | 'double' | 'boolean' | 'enum' | 'union' | string;
  isArray?: boolean;
  required?: boolean;
  enum?: string[];
  union?: string[];
  defaultValue?: string;
}

interface ComplexType {
  name: string;
  type: string;
  defaultValue?: string;
  isArray?: boolean;
  required?: boolean;
  attributes: Record<string, SimpleType | ComplexType>;
}

export async function parse(filePath: string, types: Type[] = []) {
  return xsd2Types(fs.readFileSync(filePath, 'utf-8'), types);
}

export type Type = SimpleType | ComplexType;

function toJavaScriptType(type: string) {
  if (
    type === 'xsd:string' ||
    type === 'xsd:token' ||
    type === 'xsd:hexBinary' ||
    type === 'xsd:dateTime' ||
    type === 'xsd:NCName' ||
    type === 'xsd:base64Binary' ||
    type === 'ST_UnsignedIntHex' ||
    type === 'ST_Sqref' ||
    type === 'ST_Percentage' ||
    type === 'ST_Formula' ||
    type === 's:ST_Xstring' ||
    type === 'a:ST_Coordinate'
  ) {
    return 'string';
  } else if (
    type === 'xsd:integer' ||
    type === 'xsd:int' ||
    type === 'xsd:unsignedInt' ||
    type === 'xsd:unsignedLong' ||
    type === 'xsd:unsignedShort' ||
    type === 'xsd:long' ||
    type === 'xsd:byte' ||
    type === 'xsd:unsignedByte' ||
    type === 'ST_ColID' ||
    type === 'ST_RowID' ||
    type === 'ST_TextRotation'
  ) {
    return 'int';
  } else if (type === 'xsd:double') {
    return 'double';
  } else if (type === 'xsd:boolean') {
    return 'boolean';
  }
  return type.replace(/\w:/g, '');
}

function parseElement(
  sequenceChild: XMLNode,
  attributes: Record<string, SimpleType | ComplexType>
) {
  const type = sequenceChild.attrs.type;
  const name = sequenceChild.attrs.name;
  const maxOccurs = parseInt(sequenceChild.attrs.maxOccurs, 10);
  let isArray = true;
  if (maxOccurs === 1) {
    isArray = false;
  }
  const defaultValue = sequenceChild.attrs.default;
  if (name) {
    let javaScriptType = toJavaScriptType(type);
    // 这里都是 element，所以一定是 child-string
    if (javaScriptType === 'string') {
      javaScriptType = 'child-string';
    }
    if (javaScriptType === 'int') {
      javaScriptType = 'child-int';
    }

    attributes[name] = {
      name,
      isArray,
      defaultValue,
      type: javaScriptType
    };
  } else {
    const ref = sequenceChild.attrs.ref;
    if (ref === 'r:id') {
      attributes['r:id'] = {
        name: 'r:id',
        type: 'string'
      };
    } else {
      console.error(`error require name`, ref);
    }
  }
}

function parseTypeChild(
  child: XMLNode,
  attributes: Record<string, SimpleType | ComplexType>,
  groupMap: Map<string, XMLNode>
) {
  for (let typeChild of child.children) {
    // 这里可能是深层嵌套关系，需要递归处理，但
    if (typeChild.tag === 'xsd:sequence' || typeChild.tag === 'xsd:choice') {
      for (let sequenceChild of typeChild.children) {
        if (
          sequenceChild.tag === 'xsd:element' ||
          sequenceChild.tag === 'xsd:group'
        ) {
          if (sequenceChild.tag === 'xsd:group') {
            const ref = sequenceChild.attrs.ref;
            if (ref) {
              const group = groupMap.get(ref);
              if (group) {
                parseTypeChild(group, attributes, groupMap);
              } else {
                console.error(`找不到 group: ${ref}`);
              }
            } else {
              console.error(`require ref`, sequenceChild);
            }
          }
          parseElement(sequenceChild, attributes);
        } else if (sequenceChild.tag === 'xsd:any') {
          attributes['__any__'] = {
            name: '__any__',
            type: 'any'
          };
        } else if (sequenceChild.tag === 'xsd:choice') {
          for (const choiceChild of sequenceChild.children) {
            if (choiceChild.tag === 'xsd:element') {
              parseElement(choiceChild, attributes);
            }
          }
        }
      }
    } else if (typeChild.tag === 'xsd:attribute') {
      const type = typeChild.attrs.type;
      let name = typeChild.attrs.name;
      const defaultValue = typeChild.attrs.default;
      if (name) {
        attributes[name] = {
          name,
          defaultValue,
          type: toJavaScriptType(type)
        };
      } else {
        const ref = typeChild.attrs.ref;
        if (ref === 'r:id') {
          attributes['r:id'] = {
            name: 'r:id',
            type: 'string'
          };
        } else {
          console.error(`require name`, ref, typeChild);
        }
      }
    }
  }
}

/**
 * 解析 xsd 生成 TypeScript 类型定义
 * @param xmlString
 */
export async function xsd2Types(xmlString: string, types: Type[] = []) {
  const xml = await xml2json(xmlString);
  const groupMap = collectGroup(xml);
  for (const child of xml.children) {
    if (child.tag === 'xsd:complexType') {
      const type = child.attrs.name;
      const attributes: Record<string, SimpleType | ComplexType> = {};
      parseTypeChild(child, attributes, groupMap);
      const hasType = types.findIndex(item => item.name === type);
      // 有重复定义就以后面的为主，删掉这个
      if (hasType !== -1) {
        console.log(`有重复定义: ${type}`);
        types.splice(hasType, 1);
      }

      types.push({name: type, type, attributes});
    } else if (child.tag === 'xsd:simpleType') {
      const name = child.attrs.name;
      const simpleTypeChild = child.children[0];
      if (simpleTypeChild.tag === 'xsd:restriction') {
        const base = simpleTypeChild.attrs.base;
        if (base) {
          const type = toJavaScriptType(base);
          if (type === 'string') {
            const enumValues: string[] = [];
            for (const enumChild of simpleTypeChild.children) {
              if (enumChild.tag === 'xsd:enumeration') {
                enumValues.push(enumChild.attrs.value);
              }
            }
            if (enumValues.length === 0) {
              types.push({
                name,
                type
              });
            } else {
              types.push({
                name,
                type: 'enum',
                enum: enumValues
              });
            }
          } else {
            types.push({
              name,
              type
            });
          }
        }
      } else if (simpleTypeChild.tag === 'xsd:union') {
        const memberTypes = simpleTypeChild.attrs.memberTypes
          ?.replace(/s:/g, '')
          .split(' ')
          .map((item: string) => {
            return toJavaScriptType(item);
          });
        types.push({
          name,
          type: 'union',
          union: memberTypes
        });
      } else if (simpleTypeChild.tag === 'xsd:list') {
        const itemType = simpleTypeChild.attrs.itemType;
        types.push({
          name,
          type: toJavaScriptType(itemType),
          isArray: true
        });
      }
    }
  }
  return types;
}

/**
 * 搜集 group 列表
 */
function collectGroup(xmlNode: XMLNode) {
  const groupMap = new Map<string, XMLNode>();
  for (const child of xmlNode.children) {
    if (child.tag === 'xsd:group') {
      const name = child.attrs.name;
      groupMap.set(name, child);
    }
  }
  return groupMap;
}

/**
 * 生成简化类型，比如有些最终是字符串或字符串数组，就直接用 string | string[] 表示
 * 只支持一层数组，层次多会有问题，但好像没这种场景
 */
function simplifyType(
  type: Type,
  typeMap: Record<string, Type>
): {
  type: string;
  isArray?: boolean;
} | null {
  const typeName = type.type;

  if (
    typeName === 'string' ||
    typeName === 'number' ||
    typeName === 'int' ||
    typeName === 'double'
  ) {
    if (type.isArray) {
      return {
        type: typeName,
        isArray: true
      };
    } else {
      return {
        type: typeName
      };
    }
  }

  if (typeName.startsWith('ST')) {
    if (typeName in typeMap) {
      const parentType = simplifyType(typeMap[typeName], typeMap);
      if (parentType) {
        if (type.isArray) {
          return {
            ...parentType,
            isArray: true
          };
        } else {
          return parentType;
        }
      }
    }
  }

  return null;
}

// 这些类型不需要生成，由外部提供定义
const IGNORE_TYPES = new Set([
  'CT_ExtensionList',
  'EG_ExtensionList',
  'CT_Extension'
]);

// 目前这些定义有死循环，导致用不了
const ANY_TYPES = new Set([
  'CT_Div',
  'CT_Divs',
  'CT_EffectStyleItem',
  'CT_EffectList',
  'CT_FillOverlayEffect',
  'CT_GvmlGroupShape',
  'CT_GroupShape'
]);

function generateAnyType(typeName: string) {
  const result: string[] = [];
  result.push(`export type ${typeName} = any;`);
  result.push(`export const ${typeName}_Attributes: Attributes = {};`);

  return result.join('\n');
}

/**
 * 生成某个类型的代码
 * @param type 类型定义
 * @param typeIsGenerated 已经生成过的类型
 * @param typeMap 类型映射，用于查找依赖的类型
 * @param generateAttributes 是否生成用于解析的属性定义
 */
function generateType(
  type: Type,
  typeIsGenerated: Record<string, boolean>,
  typeMap: Record<string, Type>,
  generateAttributes = true
) {
  if (type.name in typeIsGenerated || IGNORE_TYPES.has(type.name)) {
    return '';
  }

  if (ANY_TYPES.has(type.name)) {
    typeIsGenerated[type.name] = true;
    return generateAnyType(type.name);
  }

  typeIsGenerated[type.name] = true;
  // 说明是复杂类型
  if ('attributes' in type) {
    const attributes = type.attributes;
    const result: string[] = [];

    result.push(`export interface ${type.name} {`);
    for (let key in attributes) {
      const attribute = attributes[key] as Type;
      let outputType = attribute.type;

      let simpleType = simplifyType(attribute, typeMap);
      if (simpleType) {
        let javascriptType = simpleType.type;
        if (javascriptType === 'int' || javascriptType === 'double') {
          javascriptType = 'number';
        }
        if (simpleType.isArray) {
          outputType = `${javascriptType}[]`;
        } else {
          outputType = javascriptType;
        }
      }
      if (outputType === 'int' || outputType === 'double') {
        outputType = 'number';
      }
      if (outputType === 'child-string') {
        outputType = 'string';
      }
      if (outputType === 'child-int') {
        outputType = 'number';
      }
      let optional = '?';
      if (attribute.required) {
        optional = '';
      }
      if (key.includes(':')) {
        key = `'${key}'`;
      }
      // simpleType 已经处理过数组了
      if (attribute.isArray && !simpleType) {
        result.push(`  ${key}${optional}: ${outputType}[];`);
      } else {
        result.push(`  ${key}${optional}: ${outputType};`);
      }
    }
    result.push('};');

    // 生成用于解析的属性定义

    if (generateAttributes) {
      result.push(`\nexport const ${type.type}_Attributes: Attributes = {`);
      for (let key in attributes) {
        const attribute = attributes[key] as Type;
        let outputType = attribute.type;
        // 这两个定义循环了，所以目前无法支持
        if (outputType === 'CT_Divs' || outputType === 'CT_Div') {
          continue;
        }
        if (key.includes(':')) {
          key = `'${key}'`;
        }
        let simpleType = simplifyType(attribute, typeMap);
        if (simpleType) {
          if (simpleType.isArray) {
            result.push(`  ${key}: {`);
            result.push(`    type: '${simpleType.type}',`);
            result.push(`    childIsArray: true`);
            result.push('  },');
          } else {
            result.push(`  ${key}: {`);
            result.push(`    type: '${simpleType.type}',`);
            if (attribute.defaultValue) {
              result.push(`    defaultValue: '${attribute.defaultValue}'`);
            }
            result.push('  },');
          }
        } else {
          let childAttributes = '';
          if (outputType.startsWith('CT_')) {
            childAttributes = `\n    childAttributes: ${outputType}_Attributes,`;
          }
          if (childAttributes !== '') {
            outputType = `child`;
          }
          // 这种情况一般是 union
          if (outputType.startsWith('ST_')) {
            outputType = 'string';
          }
          if (attribute.isArray) {
            result.push(`  ${key}: {`);
            result.push(`    type: '${outputType}',${childAttributes}`);
            result.push(`    childIsArray: true`);
            result.push('  },');
          } else {
            result.push(`  ${key}: {`);
            result.push(`    type: '${outputType}',${childAttributes}`);
            if (attribute.defaultValue) {
              result.push(`defaultValue: '${attribute.defaultValue}'`);
            }
            result.push('  },');
          }
        }
      }
      result.push('};');
    }

    return result.join('\n');
  } else {
    if (type.type === 'enum') {
      return `export type ${type.name} = ${type.enum
        ?.map(item => `'${item}'`)
        .join(' | ')};`;
    } else if (type.type === 'union') {
      return `export type ${type.name} = ${type.union
        ?.map(item => {
          if (item === 'int' || item === 'double') {
            return 'number';
          }
          return item;
        })
        .join(' | ')};`;
    } else {
      let outputType = type.type;
      if (type.type === 'int' || type.type === 'double') {
        outputType = 'number';
      }
      if (type.isArray) {
        return `export type ${type.name} = ${outputType}[];`;
      } else {
        return `export type ${type.name} = ${outputType};`;
      }
    }
  }
}

function generateCode(
  type: Type,
  typeIsGenerated: Record<string, boolean>,
  typeMap: Record<string, Type>,
  generateAttributes = true
) {
  const result: string[] = [];

  // 先生成依赖的类型
  if ('attributes' in type) {
    for (const key in type.attributes) {
      const attribute = type.attributes[key];
      const typeName = attribute.type;
      // 这个定义循环了
      if (ANY_TYPES.has(type.name) && !(type.name in typeIsGenerated)) {
        typeIsGenerated[type.name] = true;
        result.push(generateAnyType(type.name));
      }
      if (
        (typeName.startsWith('CT_') || typeName.startsWith('ST_')) &&
        !typeIsGenerated[typeName]
      ) {
        if (!typeMap[typeName]) {
          console.error(`找不到类型定义:${typeName}`);
        }
        // 递归生成
        result.push(
          ...generateCode(
            typeMap[typeName],
            typeIsGenerated,
            typeMap,
            generateAttributes
          )
        );
      }
    }
  }
  result.push(generateType(type, typeIsGenerated, typeMap, generateAttributes));

  return result;
}

/**
 * 将 union 为一的情况换成最初的值，简化生成的类型
 * @param types
 */
export function simplifyUnionOne(types: Type[]) {
  const typeNameMap: Record<string, Type> = {};
  for (const type of types) {
    typeNameMap[type.name] = type;
  }

  let oneUnionTypes = findOneUnionType(types);
  while (oneUnionTypes.length > 0) {
    for (const singleUnionType of oneUnionTypes) {
      const unionType = typeNameMap[singleUnionType.unionTypeName];
      // 将这个类型设置为 union 的类型
      const originName = singleUnionType.type.name;
      if (!unionType) {
        // 找不到类型定义说明是基础类型
        singleUnionType.type.type = singleUnionType.unionTypeName;
      } else {
        singleUnionType.type.type = unionType.type;
      }
      if ('union' in singleUnionType.type) {
        delete singleUnionType.type.union;
      }
    }
    oneUnionTypes = findOneUnionType(types);
    console.log(oneUnionTypes);
  }
}

type SingleUnionType = {
  type: Type;
  unionTypeName: string;
};

function findOneUnionType(types: Type[]) {
  const result: SingleUnionType[] = [];
  for (const type of types) {
    if ('union' in type && type.type === 'union') {
      const union = type.union || [];
      if (union.length === 1) {
        const unionParentType = union[0];
        // 如果不是自己，就需要替换
        if (unionParentType !== type.name) {
          result.push({
            type,
            unionTypeName: unionParentType
          });
        }
      }
    }
  }
  return result;
}

export function generateCodes(types: Type[], generateAttributes = true) {
  // 如果已经生成过就跳过
  const typeIsGenerated: Record<string, boolean> = {};

  // 类型映射，这个主要是生成的时候先生成依赖的类型
  const typeMap: Record<string, Type> = {};
  for (const type of types) {
    typeMap[type.name] = type;
  }

  const result: string[] = [
    "import {Attributes} from './Attributes';\n",
    "import {CT_ExtensionList, CT_ExtensionList_Attributes} from './../excel/types/CT_ExtensionList';\n\n"
  ];

  for (const type of types) {
    result.push(
      ...generateCode(type, typeIsGenerated, typeMap, generateAttributes)
    );
  }

  return result.join('\n\n');
}
