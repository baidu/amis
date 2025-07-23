import {JSONValueMap, findTree, resolveVariableAndFilter} from 'amis';
import {EditorManager, guid} from 'amis-editor-core';
import isString from 'lodash/isString';

/**
 * 布局配置项，数值设置时需要
 */
export const isAuto = (value: any) => {
  if (value && isString(value) && /^((a)|(au)|(aut)|(auto))$/.test(value)) {
    return true;
  }
  return false;
};

/**
 * 用于列表类展示组件在 filterProps 中获取编辑态 value 值
 */
export const resolveArrayDatasource = (
  {
    data,
    value,
    source
  }: {
    value?: any;
    data: any;
    source: string;
  },
  defaultSource: string = '$items'
) =>
  Array.isArray(value)
    ? value
    : // resolveVariable 不支持 ${items} 格式，导致预览态无数据
      resolveVariableAndFilter(
        typeof source === 'string' ? source : defaultSource,
        data,
        '| raw'
      );

export const schemaToArray = (value: any) => {
  return value && Array.isArray(value) ? value : [value];
};

export const schemaArrayFormat = (value: any) => {
  return value && Array.isArray(value) && value.length === 1 ? value[0] : value;
};

/**
 * 解析选项值类型
 * @param options
 * @returns
 */
export const resolveOptionType = (schema: any = {}) => {
  const {options, valueField} = schema;
  if (!options) {
    return 'string';
  }

  // 默认options内选项是同类型
  let option = options[0];

  if (typeof option === 'object') {
    option = findTree(
      options,
      item => item[valueField || 'value'] !== undefined
    );
  }

  const value = option?.[valueField || 'value'] ?? option;

  return value !== undefined ? typeof value : 'string';
};

/**
 * 构建选择器事件参数
 * @param manager
 * @returns
 */
export const resolveOptionEventDataSchame = (
  manager: EditorManager,
  multiple?: boolean
) => {
  const schemas = manager.dataSchema.current.schemas;
  const node = manager.store.getNodeById(manager.store.activeId);
  const dataSchema = schemas.find(item => item.properties?.[node!.schema.name]);

  const itemSchema = {
    [node!.schema?.labelField || 'label']: {
      type: 'string',
      title: '文本'
    },
    [node!.schema?.valueField || 'value']: {
      type: resolveOptionType(node!.schema?.options),
      title: '值'
    }
  };

  const isMultiple = multiple ?? node!.schema?.multiple;

  return {
    value: {
      type: 'string',
      ...((dataSchema?.properties?.[node!.schema.name] as any) ?? {}),
      title: '选中的值'
    },
    selectedItems: isMultiple
      ? {
          type: 'array',
          title: '选中的项',
          items: {
            type: 'object',
            title: '成员',
            properties: itemSchema
          }
        }
      : {
          type: 'object',
          title: '选中的项',
          properties: itemSchema
        },
    items: {
      type: 'array',
      title: '选项列表',
      items: {
        type: 'object',
        title: '成员',
        properties: itemSchema
      }
    },
    itemSchema
  };
};

/**
 * 构建输入列表事件参数
 * @param manager
 * @param multiple
 * @returns
 */
export const resolveInputTableEventDataSchame = (
  manager: EditorManager,
  multiple?: boolean
) => {
  const schemas = manager.dataSchema.current.schemas;
  const node = manager.store.getNodeById(manager.store.activeId);
  const dataSchema = schemas.find(item => item.properties?.[node!.schema.name]);
  const valDataSchema = dataSchema?.properties?.[node!.schema.name] as any;
  const isMultiple = multiple ?? node!.schema?.multiple;

  return {
    value: valDataSchema ?? {},
    item: isMultiple ? valDataSchema.items : valDataSchema ?? {}
  };
};

export const OPTION_EDIT_EVENTS = [
  {
    eventName: 'addConfirm',
    eventLabel: '确认新增',
    description: '新增提交时触发',
    dataSchema: (manager: EditorManager) => {
      const {value, items, itemSchema} = resolveOptionEventDataSchame(manager);

      return [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                item: {
                  type: 'object',
                  title: '新增的选项',
                  properties: itemSchema
                },
                value,
                items
              }
            }
          }
        }
      ];
    }
  },
  {
    eventName: 'editConfirm',
    eventLabel: '确认编辑',
    description: '编辑提交时触发',
    dataSchema: (manager: EditorManager) => {
      const {value, items, itemSchema} = resolveOptionEventDataSchame(manager);

      return [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                item: {
                  type: 'object',
                  title: '编辑的选项',
                  properties: itemSchema
                },
                value,
                items
              }
            }
          }
        }
      ];
    }
  },
  {
    eventName: 'deleteConfirm',
    eventLabel: '确认删除',
    description: '删除提交时触发',
    dataSchema: (manager: EditorManager) => {
      const {value, items, itemSchema} = resolveOptionEventDataSchame(manager);

      return [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                item: {
                  type: 'object',
                  title: '删除的选项',
                  properties: itemSchema
                },
                value,
                items
              }
            }
          }
        }
      ];
    }
  }
];

export const OPTION_EDIT_EVENTS_OLD = (schema: any) => {
  let events = [];
  if (schema?.onEvent?.add) {
    events.push({
      eventName: 'add',
      eventLabel: '确认新增(不推荐)',
      description: '新增提交时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'object',
                  title: '新增的节点信息'
                },
                items: {
                  type: 'array',
                  title: '选项集合'
                }
              }
            }
          }
        }
      ]
    });
  }

  if (schema?.onEvent?.edit) {
    events.push({
      eventName: 'edit',
      eventLabel: '确认编辑(不推荐)',
      description: '编辑提交时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'object',
                  title: '编辑的节点信息'
                },
                items: {
                  type: 'array',
                  title: '选项集合'
                }
              }
            }
          }
        }
      ]
    });
  }

  if (schema?.onEvent?.delete) {
    events.push({
      eventName: 'delete',
      eventLabel: '确认删除(不推荐)',
      description: '删除提交时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'object',
                  title: '删除的节点信息'
                },
                items: {
                  type: 'array',
                  title: '选项集合'
                }
              }
            }
          }
        }
      ]
    });
  }

  return events;
};

export const TREE_BASE_EVENTS = (schema: any) => {
  let events = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中值变化时触发',
      dataSchema: (manager: EditorManager) => {
        const {value, items, itemSchema} =
          resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value,
                  item: {
                    type: 'object',
                    title: '选中的项',
                    properties: itemSchema
                  },
                  items,
                  selectedItems: {
                    type: 'array',
                    title: '选中项集合',
                    items: {
                      type: 'object'
                    }
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'itemClick',
      eventLabel: '节点点击',
      description: '点击节点触发',
      dataSchema: (manager: EditorManager) => {
        const {itemSchema} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  item: {
                    type: 'object',
                    title: '所点击的选项',
                    properties: itemSchema
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'staticItemClick',
      eventLabel: '静态展示节点点击',
      description: '静态展示时节点点击时触发',
      dataSchema: (manager: EditorManager) => {
        const {itemSchema} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  item: {
                    type: 'object',
                    title: '所点击的选项',
                    properties: itemSchema
                  },
                  index: {
                    type: 'number',
                    title: '所点击的选项索引'
                  }
                }
              }
            }
          }
        ];
      }
    },
    ...OPTION_EDIT_EVENTS,
    {
      eventName: 'deferLoadFinished',
      eventLabel: '懒加载完成',
      description: '懒加载接口远程请求成功时触发',
      dataSchema: (manager: EditorManager) => {
        const {value, items} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  result: {
                    type: 'object',
                    title: 'deferApi 懒加载远程请求成功后返回的结果'
                  },
                  value,
                  items
                }
              }
            }
          }
        ];
      }
    },
    ...OPTION_EDIT_EVENTS_OLD(schema)
  ];

  if (schema?.onEvent?.loadFinished) {
    events.push({
      eventName: 'loadFinished',
      eventLabel: '懒加载完成(不推荐)',
      description: '懒加载接口远程请求成功时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'object',
                  title: 'deferApi 懒加载远程请求成功后返回的数据'
                }
              } as any
            }
          }
        }
      ]
    });
  }

  return events;
};

/**
 * 将组件配置里面的公式进行转义，一般是文本组件编辑器里直接显示公式所用
 *
 * @param conf 组件schema 配置
 * @param keys 转义的字段key列表
 * @returns 转义后的配置
 */
export function escapeFormula(conf: any, keys: string[] = ['tpl']) {
  return JSONValueMap(conf, (value: any, key: string | number) => {
    if (keys.includes(String(key)) && /(^|[^\\])\$\{.+\}/.test(value)) {
      return value.replace(/\${/g, ' \\${');
    }
    return value;
  });
}

/**
 * 判断给定的 schema 是否为 model 组件
 *
 * @param schema schema 对象
 * @returns 如果给定的 schema 是 model 组件则返回 true，否则返回 false
 */
export function _isModelComp(schema: Record<string, any>): boolean {
  if (!schema) {
    return false;
  }

  if (
    schema.hasOwnProperty('$$m') &&
    (schema.$$m?.type === 'list' || schema.$$m?.type === 'form')
  ) {
    return true;
  }

  const extraEvaluation = ['source', 'api', 'initApi'].some(key => {
    if (schema?.[key] && typeof schema[key] === 'string') {
      return schema?.[key].startsWith('model://');
    }

    if (schema?.[key]?.url && typeof schema[key].url === 'string') {
      return (
        schema[key].url.startsWith('model://') &&
        !schema[key].hasOwnProperty('strategy')
      );
    }

    return false;
  });

  return extraEvaluation;
}

export const getOwnValue = (obj: any, key: string) => {
  if (obj && obj.hasOwnProperty(key)) {
    return obj[key];
  }
};

export function generateId() {
  return `u:${guid()}`;
}
