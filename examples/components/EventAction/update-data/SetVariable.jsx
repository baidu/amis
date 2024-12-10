/**
 * @file 变量更新示例
 */
import update from 'lodash/update';
import isEqual from 'lodash/isEqual';
import {cloneObject, setVariable} from 'amis-core';

const variables = [
  {
    key: 'xxx',
    defaultValue: 'yyy'
  },

  {
    key: 'ProductName',
    defaultValue: ''
  },

  {
    key: 'count',
    defaultValue: 0,
    scope: 'page',
    storageOn: 'client'
  },

  {
    key: 'arr',
    defaultValue: []
  },

  {
    key: 'select',
    defaultValue: ''
  }
];

export default {
  /** schema配置 */
  schema: {
    type: 'page',
    title: '更新变量数据',
    body: [
      {
        type: 'tpl',
        tpl: '变量的命名空间通过环境变量设置为了<code>global</code>, 可以通过\\${global.xxx}来取值'
      },
      {
        type: 'container',
        style: {
          padding: '8px',
          marginBottom: '8px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        },
        body: [
          {
            type: 'tpl',
            tpl: '<h2>数据域global</h2>'
          },
          {
            type: 'json',
            id: 'u:44521540e64c',
            source: '${global}',
            levelExpand: 10
          },
          {
            type: 'tpl',
            tpl: '<h3>接口中的<code>ProductName (\\${ProductName})</code>: <strong>${ProductName|default:-}</strong></h3>',
            inline: false,
            id: 'u:98ed5c5534ef'
          },
          {
            type: 'tpl',
            tpl: '<h3>变量中的<code>ProductName (\\${global.ProductName})</code>: <strong>${global.ProductName|default:-}</strong></h3>',
            inline: false,
            id: 'u:98ed5c5534ef'
          }
        ]
      },
      {
        type: 'form',
        title: '表单',
        debug: true,
        body: [
          {
            label: '产品名称',
            type: 'input-text',
            name: 'product',
            placeholder: '请输入内容, 观察引用变量组件的变化',
            id: 'u:d9802fd83145',
            onEvent: {
              change: {
                weight: 0,
                actions: [
                  {
                    args: {
                      path: 'global.ProductName',
                      value: '${event.data.value}'
                    },
                    actionType: 'setValue'
                  },

                  {
                    args: {
                      path: 'global.arr',
                      value:
                        '${[{label: event.data.value, value: event.data.value}]}'
                    },
                    actionType: 'setValue'
                  },

                  {
                    args: {
                      path: 'global.select',
                      value: '${event.data.value}'
                    },
                    actionType: 'setValue'
                  }
                ]
              }
            }
          },
          {
            type: 'static',
            label: '产品名称描述',
            id: 'u:7bd4e2a4f95e',
            value: '${global.ProductName}',
            name: 'staticName'
          },

          {
            type: 'input-number',
            label: 'Count (client)',
            description: '存储自动存入客户端，刷新页面后数据还在',
            id: 'u:7bd4e2a4f95e',
            value: '${global.count}',
            name: 'count',
            onEvent: {
              change: {
                weight: 0,
                actions: [
                  {
                    args: {
                      path: 'global.count',
                      value: '${event.data.value}'
                    },
                    actionType: 'setValue'
                  }
                ]
              }
            }
          },

          {
            type: 'select',
            label: 'select(${global.select})',
            name: 'select',
            value: '${global.select}',
            source: '${global.arr}'
          }
        ],
        id: 'u:dc2580fa447a'
      }
    ],
    initApi: '/api/mock2/page/initData2',
    onEvent: {
      inited: {
        weight: 0,
        actions: [
          {
            args: {
              path: 'global.ProductName',
              value: '${event.data.ProductName}'
            },
            actionType: 'setValue'
          }
        ]
      }
    }
  },
  props: {
    globalVars: variables
  }
};
