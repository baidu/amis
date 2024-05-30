/**
 * @file 一些处理方法
 */
import React from 'react';
import {
  BaseEventContext,
  defaultValue,
  EditorManager,
  getSchemaTpl,
  JsonGenerateID,
  JSONGetById,
  modalsToDefinitions,
  persistGet,
  persistSet,
  PluginActions,
  RendererPluginAction,
  RendererPluginEvent,
  SubRendererPluginAction,
  tipedLabel
} from 'amis-editor-core';
import {
  DataSchema,
  filterTree,
  findTree,
  guid,
  mapTree,
  normalizeApi,
  PlainObject,
  Schema,
  Option
} from 'amis-core';
import {Button} from 'amis';
import {i18n as _i18n} from 'i18n-runtime';
import without from 'lodash/without';
import {ActionConfig, ComponentInfo, ContextVariables} from './types';
import CmptActionSelect from './comp-action-select';
import {ActionData} from '.';
import DialogActionPanel from './DialogActionPanel';

export const getArgsWrapper = (
  items: any,
  multiple: boolean = false,
  patch = {}
) => ({
  type: 'combo',
  name: 'args',
  // label: '动作参数',
  multiple,
  strictMode: false,
  ...patch,
  items: Array.isArray(items) ? items : [items]
});

const getRootManager = (manager: any) => {
  let rootManager = manager;
  while (rootManager) {
    if (!rootManager.parent) {
      break;
    }
    rootManager = rootManager.parent;
  }

  return rootManager;
};

// 数据容器范围
export const DATA_CONTAINER = [
  'form',
  'dialog',
  'drawer',
  'wizard',
  'service',
  'crud',
  'page',
  'app',
  'chart'
];

const MSG_TYPES: {[key: string]: string} = {
  info: '提示',
  warning: '警告',
  success: '成功',
  error: '错误'
};

// 下拉展示可赋值属性范围
export const SELECT_PROPS_CONTAINER = ['form'];

// 是否数据容器
export const IS_DATA_CONTAINER = `${JSON.stringify(
  DATA_CONTAINER
)}.includes(this.__rendererName)`;

// 是否下拉展示可赋值属性
export const SHOW_SELECT_PROP = `${JSON.stringify(
  SELECT_PROPS_CONTAINER
)}.includes(this.__rendererName)`;

// 表单项组件
export const FORMITEM_CMPTS = [
  'button-group-select',
  'button-toolbar',
  'chained-select',
  'chart-radios',
  'checkbox',
  'checkboxes',
  'combo',
  'input-kv',
  'condition-builder',
  'diff-editor',
  'editor',
  'formula',
  'hidden',
  'icon-picker',
  'input-array',
  'input-city',
  'input-color',
  'input-date',
  'input-date-range',
  'input-datetime-range',
  'input-time-range',
  'input-excel',
  'input-file',
  'input-formula',
  'input-group',
  'input-image',
  'input-month-range',
  'input-number',
  'input-quarter-range',
  'input-range',
  'input-rating',
  'input-repeat',
  'input-rich-text',
  'input-sub-form',
  'input-table',
  'input-tag',
  'input-text',
  'input-password',
  'input-email',
  'input-url',
  'native-date',
  'native-time',
  'native-number',
  'input-tree',
  'input-year-range',
  'list-select',
  'location-picker',
  'matrix-checkboxes',
  'nested-select',
  'cascader-select',
  'picker',
  'radios',
  'select',
  'multi-select',
  'switch',
  'tabs-transfer',
  'tabs-transfer-picker',
  'textarea',
  'transfer',
  'transfer-picker',
  'tree-select',
  'uuid'
];

export const SUPPORT_STATIC_FORMITEM_CMPTS = without(
  FORMITEM_CMPTS,
  ...[
    'button-toolbar',
    'condition-builder',
    'diff-editor',
    'editor',
    'formula',
    'hidden',
    'icon-picker',
    'input-excel',
    'input-file',
    'input-formula',
    'input-image',
    'input-repeat',
    'input-rich-text',
    'input-sub-form',
    'input-table',
    'picker',
    'uuid'
  ]
);

export const SUPPORT_DISABLED_CMPTS = [
  'button-group',
  'action',
  'button',
  'submit',
  'reset',
  'collapse',
  'container',
  'dropdown-button',
  'flex',
  'flex-item',
  'grid',
  'grid-2d',
  'link',
  'nav',
  'wizard'
  // 'card2'
];

// 用于变量赋值 页面变量和内存变量的树选择器中，支持展示变量类型
const getCustomNodeTreeSelectSchema = (opts: Object) => ({
  type: 'tree-select',
  name: 'path',
  label: '内存变量',
  multiple: false,
  mode: 'horizontal',
  required: true,
  placeholder: '请选择变量',
  showIcon: false,
  size: 'lg',
  hideRoot: false,
  rootLabel: '内存变量',
  options: [],
  menuTpl: {
    type: 'flex',
    className: 'p-1',
    items: [
      {
        type: 'container',
        body: [
          {
            type: 'tpl',
            tpl: '${label}',
            inline: true,
            wrapperComponent: ''
          }
        ],
        style: {
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          position: 'static',
          overflowY: 'auto',
          flex: '0 0 auto'
        },
        wrapperBody: false,
        isFixedHeight: true
      },
      {
        type: 'container',
        body: [
          {
            type: 'tpl',
            tpl: '${type}',
            inline: true,
            wrapperComponent: '',
            style: {
              background: '#f5f5f5',
              paddingLeft: '8px',
              paddingRight: '8px',
              borderRadius: '4px'
            }
          }
        ],
        size: 'xs',
        style: {
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          position: 'static',
          overflowY: 'auto',
          flex: '0 0 auto'
        },
        wrapperBody: false,
        isFixedHeight: true,
        isFixedWidth: false
      }
    ],
    style: {
      position: 'relative',
      inset: 'auto',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '24px',
      overflowY: 'hidden'
    },
    isFixedHeight: true,
    isFixedWidth: false
  },
  ...opts
});

export const ACTION_TYPE_TREE = (manager: any): RendererPluginAction[] => {
  const variableManager = manager?.variableManager;
  /** 变量列表 */
  const variableOptions = variableManager?.getVariableOptions() || [];
  const pageVariableOptions = variableManager?.getPageVariablesOptions() || [];

  const modalDescDetail: (info: any, context: any, props: any) => any = (
    info,
    {eventKey, actionIndex},
    props: any
  ) => {
    const {
      actionTree,
      actions: pluginActions,
      commonActions,
      allComponents,
      node,
      manager
    } = props;
    const store = manager.store;
    const modals = store.modals;
    const onEvent = node.schema?.onEvent;
    const action = onEvent?.[eventKey].actions?.[actionIndex];
    const actionBody =
      action?.[action?.actionType === 'drawer' ? 'drawer' : 'dialog'];
    let modalId = actionBody?.$$id;
    if (actionBody?.$ref) {
      modalId =
        modals.find((item: any) => item.$$ref === actionBody.$ref)?.$$id || '';
    }
    const modal = modalId
      ? manager.store.modals.find((item: any) => item.$$id === modalId)
      : '';
    if (modal) {
      return (
        <>
          <div>
            打开&nbsp;
            <a
              href="#"
              onClick={(e: React.UIEvent<any>) => {
                e.preventDefault();
                e.stopPropagation();

                const modalId = modal.$$id;
                manager.openSubEditor({
                  title: '编辑弹窗',
                  value: {
                    type: 'dialog',
                    ...modal,
                    definitions: modalsToDefinitions(store.modals, {}, modal)
                  },
                  onChange: ({definitions, ...modal}: any, diff: any) => {
                    store.updateModal(modalId, modal, definitions);
                  }
                });
              }}
            >
              {modal.editorSetting?.displayName || modal.title || '未命名弹窗'}
            </a>
            &nbsp;
            {(modal as any).actionType === 'confirmDialog'
              ? '确认框'
              : modal.type === 'drawer'
              ? '抽屉弹窗'
              : '弹窗'}
          </div>
        </>
      );
    } else if (Array.isArray(info.__actionModals)) {
      const modal = info.__actionModals.find((item: any) => item.isActive);
      if (modal) {
        // 这个时候还不能打开弹窗，schema 还没插入进去不知道 $$id，无法定位
        return (
          <>
            <div>
              打开
              <span className="variable-left">{modal.label}</span>
              &nbsp;
              {modal.tip}
            </div>
          </>
        );
      }
    }

    return null;
  };

  return [
    {
      actionLabel: '页面',
      actionType: 'page',
      children: [
        {
          actionLabel: '跳转链接',
          actionType: 'url',
          description: '跳转至指定链接的页面',
          innerArgs: ['url', 'params', 'blank'],
          descDetail: (info: any) => {
            return (
              <div>
                跳转至
                <span className="variable-left">{info?.args?.url || '-'}</span>
              </div>
            );
          },
          schema: getArgsWrapper([
            {
              type: 'wrapper',
              body: [
                getSchemaTpl('textareaFormulaControl', {
                  name: 'url',
                  label: '页面地址',
                  variables: '${variables}',
                  mode: 'horizontal',
                  // placeholder: 'http://', 长文本暂不支持
                  size: 'lg',
                  required: true,
                  visibleOn: 'this.actionType === "url"'
                }),
                {
                  type: 'combo',
                  name: 'params',
                  label: '页面参数',
                  multiple: true,
                  mode: 'horizontal',
                  size: 'lg',
                  formClassName: 'event-action-combo',
                  itemClassName: 'event-action-combo-item',
                  items: [
                    {
                      name: 'key',
                      placeholder: '参数名',
                      type: 'input-text'
                    },
                    getSchemaTpl('formulaControl', {
                      variables: '${variables}',
                      name: 'val',
                      placeholder: '参数值',
                      columnClassName: 'flex-1'
                    })
                  ]
                },
                {
                  type: 'switch',
                  name: 'blank',
                  label: '新窗口打开',
                  onText: '是',
                  offText: '否',
                  mode: 'horizontal',
                  pipeIn: defaultValue(true)
                }
              ]
            }
          ])
        },
        {
          actionLabel: '刷新页面',
          actionType: 'refresh',
          description: '触发浏览器刷新页面'
        },
        {
          actionLabel: '回退页面',
          actionType: 'goBack',
          description: '浏览器回退',
          descDetail: (info: any) => <div>返回上一页</div>
        }
      ]
    },
    {
      actionLabel: '弹窗消息',
      actionType: 'dialogs',
      children: [
        {
          actionLabel: '打开弹窗',
          actionType: 'openDialog',
          description: '打开弹窗，弹窗内支持复杂的交互设计',
          actions: [
            {
              actionType: 'dialog',
              descDetail: modalDescDetail
            },
            {
              actionType: 'drawer',
              descDetail: modalDescDetail
            },
            {
              actionType: 'confirmDialog',
              descDetail: modalDescDetail
            }
          ],
          schema: [
            {
              component: DialogActionPanel
            }
            // {
            //   name: '__selectDialog',
            //   type: 'select',
            //   label: '选择弹窗',
            //   source: '${__dialogActions}',
            //   mode: 'horizontal',
            //   size: 'lg'
            // }
          ]
        },
        {
          actionLabel: '关闭弹窗',
          actionType: 'closeDialog',
          description: '关闭当前弹窗' // 或者关闭指定弹窗
          // schema: getArgsWrapper({
          //   type: 'wrapper',
          //   body: [
          //     {
          //       type: 'radios',
          //       label: '类型',
          //       name: 'groupType',
          //       mode: 'horizontal',
          //       value: 'closeDialog',
          //       required: true,
          //       pipeIn: defaultValue('closeDialog'),
          //       options: [
          //         {
          //           label: '弹窗',
          //           value: 'closeDialog'
          //         },
          //         {
          //           label: '抽屉',
          //           value: 'closeDrawer'
          //         }
          //       ],
          //       visibleOn: 'this.actionType === "closeDialog"'
          //     }
          //   ]
          // })
        },
        // 暂时下掉，看后面具体设计
        // {
        //   actionLabel: '打开提示对话框',
        //   actionType: 'alert',
        //   description: '弹个提示对话框'
        // },
        // {
        //   actionLabel: '打开确认对话框',
        //   actionType: 'confirm',
        //   description: '弹个确认对话框'
        // },
        {
          actionLabel: '消息提醒',
          actionType: 'toast',
          description: '弹出消息提醒',
          innerArgs: [
            'title',
            'msgType',
            'msg',
            'position',
            'timeout',
            'closeButton',
            'showIcon',
            'className'
          ],
          descDetail: (info: any) => {
            return (
              <div>
                {MSG_TYPES[info?.args?.msgType] || ''}消息：
                <span className="variable-left">{info?.args?.msg || '-'}</span>
              </div>
            );
          },
          schema: getArgsWrapper({
            type: 'wrapper',
            body: [
              {
                type: 'button-group-select',
                name: 'msgType',
                label: '消息类型',
                value: 'info',
                required: true,
                mode: 'horizontal',
                options: Object.keys(MSG_TYPES).map(key => ({
                  label: MSG_TYPES[key],
                  value: key,
                  level: 'default'
                }))
              },
              getSchemaTpl('textareaFormulaControl', {
                name: 'msg',
                label: '消息内容',
                mode: 'horizontal',
                variables: '${variables}',
                size: 'lg',
                required: true
              }),
              getSchemaTpl('textareaFormulaControl', {
                name: 'title',
                label: '标题内容',
                variables: '${variables}',
                mode: 'horizontal',
                size: 'lg'
              }),
              getSchemaTpl('formulaControl', {
                name: 'timeout',
                label: '持续时间(ms)',
                rendererSchema: {
                  type: 'input-number'
                },
                valueType: 'number',
                variables: '${variables}',
                size: 'lg',
                mode: 'horizontal'
              }),
              {
                type: 'button-group-select',
                name: 'position',
                value: 'top-right',
                mode: 'horizontal',
                label: '显示位置',
                options: [
                  {
                    label: '左上',
                    value: 'top-left'
                  },

                  {
                    label: '中上',
                    value: 'top-center'
                  },

                  {
                    label: '右上',
                    value: 'top-right'
                  },

                  {
                    label: '左下',
                    value: 'bottom-left'
                  },
                  {
                    label: '中下',
                    value: 'bottom-center'
                  },

                  {
                    label: '右下',
                    value: 'bottom-right'
                  }
                ]
              },
              {
                type: 'switch',
                name: 'closeButton',
                value: true,
                label: '展示关闭按钮',
                mode: 'horizontal'
              },
              {
                type: 'switch',
                name: 'showIcon',
                value: true,
                label: '展示图标',
                mode: 'horizontal'
              }
            ]
          })
        }
      ]
    },
    {
      actionLabel: '服务',
      actionType: 'service',
      children: [
        {
          actionLabel: '发送请求',
          actionType: 'ajax',
          description: '配置并发送API请求',
          // innerArgs: ['api', 'options'],
          descDetail: (info: any) => {
            let apiInfo = info?.api ?? info?.args?.api;
            if (typeof apiInfo === 'string') {
              apiInfo = normalizeApi(apiInfo);
            }
            return (
              <div>
                发送
                <span className="variable-right variable-left">
                  {apiInfo?.method || '-'}
                </span>
                请求：
                <span className="variable-left">{apiInfo?.url || '-'}</span>
              </div>
            );
          },
          schema: {
            type: 'wrapper',
            className: 'p-none',
            body: [
              // getArgsWrapper(
              //   [
              //     getSchemaTpl('apiControl', {
              //       name: 'api',
              //       label: '配置请求',
              //       mode: 'horizontal',
              //       size: 'lg',
              //       inputClassName: 'm-b-none',
              //       renderLabel: true,
              //       required: true
              //     }),
              //     {
              //       name: 'options',
              //       type: 'combo',
              //       label: tipedLabel(
              //         '静默请求',
              //         '开启后，服务请求将以静默模式发送，即不会弹出成功或报错提示。'
              //       ),
              //       mode: 'horizontal',
              //       items: [
              //         {
              //           type: 'switch',
              //           name: 'silent',
              //           label: false,
              //           onText: '开启',
              //           offText: '关闭',
              //           mode: 'horizontal',
              //           pipeIn: defaultValue(false)
              //         }
              //       ]
              //     }
              //   ],
              //   false,
              //   {
              //     className: 'action-apiControl'
              //   }
              // ),
              getSchemaTpl('apiControl', {
                name: 'api',
                label: '配置请求',
                mode: 'horizontal',
                size: 'lg',
                inputClassName: 'm-b-none',
                renderLabel: true,
                required: true
              }),
              {
                name: 'options',
                type: 'combo',
                label: tipedLabel(
                  '静默请求',
                  '开启后，服务请求将以静默模式发送，即不会弹出成功或报错提示。'
                ),
                mode: 'horizontal',
                items: [
                  {
                    type: 'switch',
                    name: 'silent',
                    label: false,
                    onText: '开启',
                    offText: '关闭',
                    mode: 'horizontal',
                    pipeIn: defaultValue(false)
                  }
                ]
              },
              {
                name: 'outputVar',
                type: 'input-text',
                label: '请求结果',
                placeholder: '请输入存储请求结果的变量名称',
                description:
                  '如需执行多次发送请求，可以修改此变量名用于区分不同请求返回的结果',
                mode: 'horizontal',
                size: 'lg',
                value: 'responseResult',
                required: true
              }
            ]
          },
          outputVarDataSchema: [
            {
              type: 'object',
              title: 'responseResult',
              properties: {
                responseData: {
                  type: 'object',
                  title: '响应数据'
                },
                responseStatus: {
                  type: 'number',
                  title: '状态标识'
                },
                responseMsg: {
                  type: 'string',
                  title: '提示信息'
                }
              }
            }
          ]
        },
        {
          actionLabel: '下载文件',
          actionType: 'download',
          description: '触发下载文件',
          // innerArgs: ['api'],
          schema: {
            type: 'wrapper',
            className: 'p-none',
            body: [
              // getArgsWrapper(
              //   getSchemaTpl('apiControl', {
              //     name: 'api',
              //     label: '配置请求',
              //     mode: 'horizontal',
              //     inputClassName: 'm-b-none',
              //     size: 'lg',
              //     renderLabel: true,
              //     required: true
              //   }),
              //   false,
              //   {
              //     className: 'action-apiControl'
              //   }
              // )
              getSchemaTpl('apiControl', {
                name: 'api',
                label: '配置请求',
                mode: 'horizontal',
                inputClassName: 'm-b-none',
                size: 'lg',
                renderLabel: true,
                required: true
              })
            ]
          }
        }
      ]
    },
    {
      actionLabel: '组件',
      actionType: 'cmpt',
      children: [
        {
          actionLabel: '组件可见性',
          actionType: 'visibility',
          description: '控制所选的组件的显示/隐藏',
          actions: [
            {
              actionType: 'show',
              descDetail: (info: any) => {
                return (
                  <div>
                    显示
                    <span className="variable-left variable-right">
                      {info?.rendererLabel || info.componentId || '-'}
                    </span>
                    组件
                  </div>
                );
              }
            },
            {
              actionType: 'hidden',
              descDetail: (info: any) => {
                return (
                  <div>
                    隐藏
                    <span className="variable-left variable-right">
                      {info?.rendererLabel || info.componentId || '-'}
                    </span>
                    组件
                  </div>
                );
              }
            },
            {
              actionType: 'visibility',
              descDetail: (info: any) => {
                return (
                  <div>
                    组件
                    <span className="variable-left variable-right">
                      {info?.rendererLabel || info.componentId || '-'}
                    </span>
                    表达式已配置
                  </div>
                );
              }
            }
          ],
          supportComponents: '*',
          schema: [
            ...renderCmptSelect('目标组件', true),
            renderCmptIdInput(),
            {
              type: 'radios',
              label: '条件',
              name: 'groupType',
              mode: 'horizontal',
              value: 'static',
              required: true,
              inputClassName: 'event-action-radio',
              options: [
                {
                  label: '静态',
                  value: 'static'
                },
                {
                  label: '表达式',
                  value: 'visibility'
                }
              ]
            },
            {
              type: 'radios',
              label: '显示/隐藏',
              name: '__statusType',
              mode: 'horizontal',
              value: 'show',
              required: true,
              pipeIn: defaultValue('show'),
              inputClassName: 'event-action-radio',
              visibleOn: "this.groupType === 'static'",
              options: [
                {
                  label: '显示',
                  value: 'show'
                },
                {
                  label: '隐藏',
                  value: 'hidden'
                }
              ]
            },
            getSchemaTpl('expressionFormulaControl', {
              mode: 'horizontal',
              label: '表达式',
              required: true,
              size: 'lg',
              variables: '${variables}',
              evalMode: true,
              name: '__actionExpression',
              visibleOn: "this.groupType === 'visibility'"
            })
          ]
        },
        {
          actionLabel: '组件可用性',
          actionType: 'usability',
          description: '控制所选的组件的启用/禁用',
          actions: [
            {
              actionType: 'enabled',
              descDetail: (info: any) => {
                return (
                  <div>
                    启用
                    <span className="variable-left variable-right">
                      {info?.rendererLabel || info.componentId || '-'}
                    </span>
                    组件
                  </div>
                );
              }
            },
            {
              actionType: 'disabled',
              descDetail: (info: any) => {
                return (
                  <div>
                    禁用
                    <span className="variable-left variable-right">
                      {info?.rendererLabel || info.componentId || '-'}
                    </span>
                    组件
                  </div>
                );
              }
            },
            {
              actionType: 'usability',
              descDetail: (info: any) => {
                return (
                  <div>
                    组件
                    <span className="variable-left variable-right">
                      {info?.rendererLabel || info.componentId || '-'}
                    </span>
                    表达式已配置
                  </div>
                );
              }
            }
          ],
          supportComponents: [
            'form',
            ...FORMITEM_CMPTS,
            ...SUPPORT_DISABLED_CMPTS
          ],
          schema: [
            ...renderCmptSelect('目标组件', true),
            renderCmptIdInput(),
            {
              type: 'radios',
              label: '条件',
              name: 'groupType',
              mode: 'horizontal',
              inputClassName: 'event-action-radio',
              value: 'static',
              required: true,
              options: [
                {
                  label: '静态',
                  value: 'static'
                },
                {
                  label: '表达式',
                  value: 'usability'
                }
              ]
            },
            {
              type: 'radios',
              label: '启用/禁用',
              name: '__statusType',
              mode: 'horizontal',
              inputClassName: 'event-action-radio',
              value: 'enabled',
              required: true,
              pipeIn: defaultValue('enabled'),
              visibleOn: "this.groupType === 'static'",
              options: [
                {
                  label: '启用',
                  value: 'enabled'
                },
                {
                  label: '禁用',
                  value: 'disabled'
                }
              ]
            },
            getSchemaTpl('expressionFormulaControl', {
              mode: 'horizontal',
              label: '表达式',
              required: true,
              size: 'lg',
              evalMode: true,
              name: '__actionExpression',
              visibleOn: "this.groupType === 'usability'"
            })
          ]
        },
        {
          actionLabel: '组件展示态',
          actionType: 'staticStatus',
          description: '控制所选的组件的输入态/静态',
          actions: [
            {
              actionType: 'static',
              descDetail: (info: any) => {
                return (
                  <div>
                    <span className="variable-right">
                      {info?.rendererLabel || info.componentId}
                    </span>
                    组件切换为静态
                  </div>
                );
              }
            },
            {
              actionType: 'nonstatic',
              descDetail: (info: any) => {
                return (
                  <div>
                    <span className="variable-right">
                      {info?.rendererLabel || info.componentId}
                    </span>
                    组件切换为输入态
                  </div>
                );
              }
            }
          ],
          supportComponents: ['form', ...SUPPORT_STATIC_FORMITEM_CMPTS],
          schema: [
            ...renderCmptSelect('选择组件', true),
            renderCmptIdInput(),
            {
              type: 'radios',
              label: '组件状态',
              name: 'groupType',
              mode: 'horizontal',
              inputClassName: 'event-action-radio',
              value: 'nonstatic',
              required: true,
              pipeIn: defaultValue('nonstatic'),
              options: [
                {
                  label: '表单输入',
                  value: 'nonstatic'
                },
                {
                  label: '表单静态',
                  value: 'static'
                }
              ]
            }
          ]
        },
        {
          actionLabel: '重新请求数据',
          actionType: 'reload',
          description:
            '如果开启发送数据，会先发送配置数据到目标组件，然后重新请求数据。',
          descDetail: (info: any) => {
            return (
              <div>
                刷新
                <span className="variable-left variable-right">
                  {info?.rendererLabel || info.componentId || '-'}
                </span>
                组件
              </div>
            );
          },
          supportComponents: 'byComponent',
          schema: [
            {
              type: 'wrapper',
              size: 'sm',
              body: [
                ...renderCmptSelect(
                  '目标组件',
                  true,
                  (value: string, oldVal: any, data: any, form: any) => {
                    form.setValueByName('args.resetPage', true);
                    form.setValueByName('__addParam', false);
                    form.setValueByName('__containerType', 'all');
                    form.setValueByName('__reloadParam', []);
                  },
                  true
                )
              ]
            },
            renderCmptIdInput(
              (value: string, oldVal: any, data: any, form: any) => {
                // 找到组件并设置相关的属性
                let schema = JSONGetById(manager.store.schema, value, 'id');
                if (schema) {
                  let __isScopeContainer = DATA_CONTAINER.includes(schema.type);
                  let __rendererName = schema.type;
                  form.setValues({
                    __isScopeContainer,
                    __rendererName
                  });
                } else {
                  form.setValues({
                    __isScopeContainer: false,
                    __rendererName: ''
                  });
                }
              }
            ),
            {
              type: 'switch',
              name: '__resetPage',
              label: tipedLabel(
                '重置页码',
                '选择“是”时，将重新请求第一页数据。'
              ),
              onText: '是',
              offText: '否',
              mode: 'horizontal',
              pipeIn: defaultValue(true),
              visibleOn: `this.actionType === "reload" && this.__rendererName === "crud"`
            },
            {
              type: 'switch',
              name: '__addParam',
              label: tipedLabel(
                '发送数据',
                '开启“发送数据”后，所配置的数据将发送给目标组件，这些数据将与目标组件数据域进行合并或覆盖'
              ),
              onText: '是',
              offText: '否',
              mode: 'horizontal',
              pipeIn: defaultValue(false),
              visibleOn: `this.actionType === "reload" &&  this.__isScopeContainer`,
              onChange: (value: string, oldVal: any, data: any, form: any) => {
                form.setValueByName('__containerType', 'all');
              }
            },
            {
              type: 'radios',
              name: '__containerType',
              mode: 'horizontal',
              label: '',
              pipeIn: defaultValue('all'),
              visibleOn: `this.__addParam && this.actionType === "reload" && this.__isScopeContainer`,
              options: [
                {
                  label: '直接赋值',
                  value: 'all'
                },
                {
                  label: '成员赋值',
                  value: 'appoint'
                }
              ],
              onChange: (value: string, oldVal: any, data: any, form: any) => {
                form.setValueByName('__reloadParams', []);
                form.setValueByName('__valueInput', undefined);
              }
            },
            getSchemaTpl('formulaControl', {
              name: '__valueInput',
              label: '',
              variables: '${variables}',
              size: 'lg',
              mode: 'horizontal',
              required: true,
              visibleOn: `this.__addParam && this.__containerType === "all" && this.actionType === "reload" && this.__isScopeContainer`
            }),
            {
              type: 'combo',
              name: '__reloadParams',
              label: '',
              multiple: true,
              removable: true,
              addable: true,
              strictMode: false,
              canAccessSuperData: true,
              size: 'lg',
              mode: 'horizontal',
              formClassName: 'event-action-combo',
              itemClassName: 'event-action-combo-item',
              items: [
                {
                  name: 'key',
                  type: 'input-text',
                  placeholder: '参数名',
                  labelField: 'label',
                  valueField: 'value',
                  required: true
                },
                getSchemaTpl('formulaControl', {
                  name: 'val',
                  variables: '${variables}',
                  placeholder: '参数值',
                  columnClassName: 'flex-1'
                })
              ],
              visibleOn: `this.__addParam && this.__containerType === "appoint" && this.actionType === "reload" && this.__isScopeContainer`
            },
            {
              type: 'radios',
              name: 'dataMergeMode',
              mode: 'horizontal',
              label: tipedLabel(
                '数据处理方式',
                '选择“合并”时，会将数据合并到目标组件的数据域。<br/>选择“覆盖”时，数据会直接覆盖目标组件的数据域。'
              ),
              pipeIn: defaultValue('merge'),
              visibleOn: `this.__addParam && this.actionType === "reload" && this.__isScopeContainer`,
              options: [
                {
                  label: '合并',
                  value: 'merge'
                },
                {
                  label: '覆盖',
                  value: 'override'
                }
              ]
            }
          ]
        },
        {
          actionLabel: '变量赋值',
          actionType: 'setValue',
          description: '更新目标组件或变量的数据值',
          innerArgs: [
            'path',
            'value',
            'index',
            '__valueInput',
            '__comboType',
            '__containerType'
          ],
          descDetail: (info: any) => {
            return (
              <div>
                {/* 只要path字段存在就认为是应用变量赋值，无论是否有值 */}
                {typeof info?.args?.path === 'string' && !info?.componentId ? (
                  <>
                    设置变量
                    <span className="variable-left variable-right">
                      {variableManager.getNameByPath(info.args.path)}
                    </span>
                    的数据
                  </>
                ) : (
                  <>
                    设置组件
                    <span className="variable-left variable-right">
                      {info?.rendererLabel || info.componentId || '-'}
                    </span>
                    的数据
                  </>
                )}
                {/* 值为
                <span className="variable-left variable-right"> // 因为初始化时进行了格式化，会导致args的值发生变化并同步到右侧动作表，因此关闭详情
                  {info?.args?.value
                    ? JSON.stringify(info?.args?.value)
                    : info?.args?.valueInput}
                </span> */}
              </div>
            );
          },
          supportComponents: 'byComponent',
          schema: [
            {
              children: ({render, data}: any) => {
                const path = data?.args?.path || '';
                return render('setValueType', {
                  name: '__actionSubType',
                  type: 'radios',
                  label: '动作类型',
                  mode: 'horizontal',
                  options: [
                    {label: '组件变量', value: 'cmpt'},
                    {label: '页面参数', value: 'page'},
                    {label: '内存变量', value: 'app'}
                  ],
                  value: /^appVariables/.test(path) // 只需要初始化时更新value
                    ? 'app'
                    : /^(__page|__query)/.test(path)
                    ? 'page'
                    : 'cmpt',
                  onChange: (
                    value: string,
                    oldVal: any,
                    data: any,
                    form: any
                  ) => {
                    form.setValueByName('__valueInput', undefined);
                    form.setValueByName('args.value', undefined);
                    form.deleteValueByName('args.path');
                  }
                });
              }
            },
            // 组件变量
            {
              type: 'container',
              visibleOn: '__actionSubType === "cmpt"',
              body: [
                {
                  type: 'wrapper',
                  visibleOn: 'this.componentId === "customCmptId"',
                  className: 'p-none mb-6',
                  body: [
                    ...renderCmptActionSelect(
                      '目标组件',
                      true,
                      (value: string, oldVal: any, data: any, form: any) => {
                        form.setValueByName('args.__containerType', 'all');
                        form.setValueByName('args.__comboType', 'all');
                      },
                      true
                    )
                  ]
                },
                {
                  type: 'wrapper',
                  visibleOn: 'this.componentId !== "customCmptId"',
                  className: 'p-none mb-6',
                  body: [
                    ...renderCmptActionSelect(
                      '目标组件',
                      true,
                      (value: string, oldVal: any, data: any, form: any) => {
                        form.setValueByName('args.__containerType', 'all');
                        form.setValueByName('args.__comboType', 'all');
                      }
                    )
                  ]
                },
                renderCmptIdInput(
                  (value: string, oldVal: any, data: any, form: any) => {
                    // 找到root再查询
                    const root = getRootManager(manager);

                    // 找到组件并设置相关的属性
                    let schema = JSONGetById(root.store.schema, value, 'id');
                    if (schema) {
                      let __isScopeContainer = DATA_CONTAINER.includes(
                        schema.type
                      );
                      let __rendererName = schema.type;
                      form.setValues({
                        __isScopeContainer,
                        __rendererName
                      });
                    } else {
                      form.setValues({
                        __isScopeContainer: false,
                        __rendererName: ''
                      });
                    }
                  }
                ),
                getArgsWrapper({
                  type: 'wrapper',
                  body: [
                    {
                      type: 'radios',
                      name: '__containerType',
                      mode: 'horizontal',
                      label: '数据设置',
                      pipeIn: defaultValue('all'),
                      visibleOn: 'this.__isScopeContainer',
                      options: [
                        {
                          label: '直接赋值',
                          value: 'all'
                        },
                        {
                          label: '成员赋值',
                          value: 'appoint'
                        }
                      ],
                      onChange: (
                        value: string,
                        oldVal: any,
                        data: any,
                        form: any
                      ) => {
                        form.setValueByName('value', []);
                        form.setValueByName('__valueInput', undefined);
                      }
                    },
                    {
                      type: 'radios',
                      name: '__comboType',
                      inputClassName: 'event-action-radio',
                      mode: 'horizontal',
                      label: '数据设置',
                      pipeIn: defaultValue('all'),
                      visibleOn: `this.__rendererName === 'combo' || this.__rendererName === 'input-table'`,
                      options: [
                        {
                          label: '全量',
                          value: 'all'
                        },
                        {
                          label: '指定序号',
                          value: 'appoint'
                        }
                      ],
                      onChange: (
                        value: string,
                        oldVal: any,
                        data: any,
                        form: any
                      ) => {
                        form.setValueByName('index', undefined);
                        form.setValueByName('value', []);
                        form.setValueByName('__valueInput', undefined);
                      }
                    },
                    {
                      type: 'input-number',
                      required: true,
                      name: 'index',
                      mode: 'horizontal',
                      label: '输入序号',
                      size: 'lg',
                      placeholder: '请输入待更新序号',
                      visibleOn: `(this.__rendererName === 'input-table' || this.__rendererName === 'combo')
                    && this.__comboType === 'appoint'`
                    },
                    {
                      type: 'combo',
                      name: 'value',
                      label: '',
                      multiple: true,
                      removable: true,
                      required: true,
                      addable: true,
                      strictMode: false,
                      canAccessSuperData: true,
                      size: 'lg',
                      mode: 'horizontal',
                      formClassName: 'event-action-combo',
                      itemClassName: 'event-action-combo-item',
                      items: [
                        {
                          name: 'key',
                          type: 'input-text',
                          placeholder: '变量名',
                          source: '${__setValueDs}',
                          labelField: 'label',
                          valueField: 'value',
                          required: true
                        },
                        getSchemaTpl('formulaControl', {
                          name: 'val',
                          variables: '${variables}',
                          placeholder: '字段值',
                          columnClassName: 'flex-1'
                        })
                      ],
                      visibleOn: `this.__isScopeContainer && this.__containerType === 'appoint' || this.__comboType === 'appoint'`
                    },
                    {
                      type: 'combo',
                      name: 'value',
                      label: '',
                      multiple: true,
                      removable: true,
                      required: true,
                      addable: true,
                      strictMode: false,
                      canAccessSuperData: true,
                      mode: 'horizontal',
                      size: 'lg',
                      items: [
                        {
                          type: 'combo',
                          name: 'item',
                          label: false,
                          renderLabel: false,
                          multiple: true,
                          removable: true,
                          required: true,
                          addable: true,
                          strictMode: false,
                          canAccessSuperData: true,
                          className: 'm-l',
                          size: 'lg',
                          mode: 'horizontal',
                          formClassName: 'event-action-combo',
                          itemClassName: 'event-action-combo-item',
                          items: [
                            {
                              name: 'key',
                              type: 'input-text',
                              source: '${__setValueDs}',
                              labelField: 'label',
                              valueField: 'value',
                              required: true,
                              visibleOn: `this.__rendererName`
                            },
                            getSchemaTpl('formulaControl', {
                              name: 'val',
                              variables: '${variables}',
                              columnClassName: 'flex-1'
                            })
                          ]
                        }
                      ],
                      visibleOn: `(this.__rendererName === 'combo' || this.__rendererName === 'input-table')
                    && this.__comboType === 'all'`
                    },
                    getSchemaTpl('formulaControl', {
                      name: '__valueInput',
                      label: '',
                      variables: '${variables}',
                      size: 'lg',
                      mode: 'horizontal',
                      visibleOn: `(this.__isScopeContainer || ${SHOW_SELECT_PROP}) && this.__containerType === 'all'`,
                      required: true
                    }),
                    getSchemaTpl('formulaControl', {
                      name: '__valueInput',
                      label: '数据设置',
                      variables: '${variables}',
                      size: 'lg',
                      mode: 'horizontal',
                      visibleOn: `this.__rendererName && !this.__isScopeContainer && this.__rendererName !== 'combo' && this.__rendererName !== 'input-table'`,
                      required: true
                    })
                  ]
                })
              ]
            },
            // 页面参数
            {
              type: 'container',
              visibleOn: '__actionSubType === "page"',
              body: [
                getArgsWrapper([
                  {
                    type: 'wrapper',
                    body: [
                      getCustomNodeTreeSelectSchema({
                        label: '页面参数',
                        rootLabel: '页面参数',
                        options: pageVariableOptions,
                        horizontal: {
                          leftFixed: true
                        }
                      }),
                      getSchemaTpl('formulaControl', {
                        name: 'value',
                        label: '数据设置',
                        variables: '${variables}',
                        size: 'lg',
                        mode: 'horizontal',
                        required: true,
                        placeholder: '请输入变量值',
                        horizontal: {
                          leftFixed: true
                        }
                      })
                    ]
                  }
                ])
              ]
            },
            // 内存变量
            {
              type: 'container',
              visibleOn: '__actionSubType === "app"',
              body: [
                getArgsWrapper([
                  {
                    type: 'wrapper',
                    body: [
                      getCustomNodeTreeSelectSchema({
                        options: variableOptions,
                        horizontal: {
                          leftFixed: true
                        }
                      }),
                      getSchemaTpl('formulaControl', {
                        name: 'value',
                        label: '数据设置',
                        variables: '${variables}',
                        size: 'lg',
                        mode: 'horizontal',
                        required: true,
                        placeholder: '请输入变量值',
                        horizontal: {
                          leftFixed: true
                        }
                      })
                    ]
                  }
                ])
              ]
            }
          ]
        },
        {
          actionLabel: '提交表单',
          actionType: 'submit',
          description: '触发表单提交',
          descDetail: (info: any) => {
            return (
              <div>
                提交
                <span className="variable-left variable-right">
                  {info?.rendererLabel || info.componentId || '-'}
                </span>
                的数据
              </div>
            );
          },
          supportComponents: 'form',
          schema: [
            ...renderCmptSelect('目标组件', true),
            renderCmptIdInput(),
            {
              name: 'outputVar',
              type: 'input-text',
              label: '提交结果',
              placeholder: '请输入存储提交结果的变量名称',
              description:
                '如需执行多次表单提交，可以修改此变量名用于区分不同的提交结果',
              mode: 'horizontal',
              size: 'lg',
              value: 'submitResult',
              required: true
            }
          ],
          outputVarDataSchema: [
            {
              type: 'object',
              title: 'submitResult',
              properties: {
                error: {
                  type: 'string',
                  title: '错误信息'
                },
                errors: {
                  type: 'object',
                  title: '错误详情'
                },
                payload: {
                  type: 'object',
                  title: '提交的表单数据'
                },
                responseData: {
                  type: 'object',
                  title: '提交请求的响应数据'
                }
              }
            }
          ]
        },
        {
          actionLabel: '清空表单',
          actionType: 'clear',
          description: '清空表单数据',
          descDetail: (info: any) => {
            return (
              <div>
                清空
                <span className="variable-left variable-right">
                  {info?.rendererLabel || info.componentId || '-'}
                </span>
                的数据
              </div>
            );
          },
          supportComponents: 'form',
          schema: [...renderCmptSelect('目标组件', true), renderCmptIdInput()]
        },
        {
          actionLabel: '重置表单',
          actionType: 'reset',
          description: '重置表单数据',
          descDetail: (info: any) => {
            return (
              <div>
                重置
                <span className="variable-left variable-right">
                  {info?.rendererLabel || info.componentId || '-'}
                </span>
                的数据
              </div>
            );
          },
          supportComponents: 'form',
          schema: [...renderCmptSelect('目标组件', true), renderCmptIdInput()]
        },
        {
          actionLabel: '校验表单',
          actionType: 'validate',
          description: '校验表单数据',
          descDetail: (info: any) => {
            return (
              <div>
                校验
                <span className="variable-left variable-right">
                  {info?.rendererLabel || info.componentId || '-'}
                </span>
                的数据
              </div>
            );
          },
          supportComponents: 'form',
          schema: [
            ...renderCmptSelect('目标组件', true),
            renderCmptIdInput(),
            {
              name: 'outputVar',
              type: 'input-text',
              label: '校验结果',
              placeholder: '请输入存储校验结果的变量名称',
              description:
                '如需执行多次表单校验，可以修改此变量名用于区分不同的校验结果',
              mode: 'horizontal',
              size: 'lg',
              value: 'validateResult',
              required: true
            }
          ],
          outputVarDataSchema: [
            {
              type: 'object',
              title: 'validateResult',
              properties: {
                error: {
                  type: 'string',
                  title: '错误信息'
                },
                errors: {
                  type: 'object',
                  title: '错误详情'
                },
                payload: {
                  type: 'object',
                  title: '提交的表单数据'
                }
              }
            }
          ]
        },
        {
          actionLabel: '校验表单项',
          actionType: 'validateFormItem',
          description: '校验单个表单项数据',
          descDetail: (info: any) => {
            return (
              <div>
                校验
                <span className="variable-left variable-right">
                  {info?.rendererLabel || info.componentId || '-'}
                </span>
                的数据
              </div>
            );
          },
          supportComponents: [...FORMITEM_CMPTS],
          schema: [
            ...renderCmptSelect('目标组件', true),
            renderCmptIdInput(),
            {
              name: 'outputVar',
              type: 'input-text',
              label: '校验结果',
              placeholder: '请输入存储校验结果的变量名称',
              description:
                '如需执行多次表单校验，可以修改此变量名用于区分不同的校验结果',
              mode: 'horizontal',
              size: 'lg',
              value: 'validateFormItemResult',
              required: true
            }
          ],
          outputVarDataSchema: [
            {
              type: 'object',
              title: 'validateFormItemResult',
              properties: {
                error: {
                  type: 'string',
                  title: '错误信息'
                },
                value: {
                  type: 'object',
                  title: '校验的表单项的值'
                }
              }
            }
          ]
        },
        {
          actionLabel: '组件特性动作',
          actionType: 'component',
          description: '触发所选组件的特性动作',
          supportComponents: '*',
          schema: renderCmptActionSelect('目标组件', true)
        }
      ]
    },
    {
      actionLabel: '其他',
      actionType: 'others',
      children: [
        {
          actionLabel: '复制内容',
          actionType: 'copy',
          description: '复制文本内容至粘贴板',
          innerArgs: ['content', 'copyFormat'],
          descDetail: (info: any) => {
            return (
              <div>
                复制内容：
                <span className="variable-left">
                  {info?.args?.content || '-'}
                </span>
              </div>
            );
          },
          schema: getArgsWrapper({
            type: 'wrapper',
            body: [
              getSchemaTpl('textareaFormulaControl', {
                name: 'content',
                label: '内容模板',
                variables: '${variables}',
                mode: 'horizontal',
                size: 'lg',
                visibleOn: 'this.actionType === "copy"',
                required: true
              }),
              {
                type: 'select',
                name: 'copyFormat',
                mode: 'horizontal',
                value: 'text/plain',
                size: 'lg',
                options: [
                  {
                    label: '纯文本',
                    value: 'text/plain'
                  },
                  {
                    label: '富文本',
                    value: 'text/html'
                  }
                ],
                label: '复制格式'
              }
            ]
          })
        },
        {
          actionLabel: '自定义JS',
          actionType: 'custom',
          description: '通过JavaScript自定义动作逻辑',
          schema: {
            type: 'js-editor',
            allowFullscreen: true,
            required: true,
            name: 'script',
            label: '自定义JS',
            mode: 'horizontal',
            options: {
              automaticLayout: true,
              lineNumbers: 'off',
              glyphMargin: false,
              tabSize: 2,
              fontSize: '12px',
              wordWrap: 'on',
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 0,
              selectOnLineNumbers: true,
              scrollBeyondLastLine: false,
              folding: true
            },
            className: 'ae-event-control-action-js-editor',
            value: `/* 自定义JS使用说明：
  * 1.动作执行函数doAction，可以执行所有类型的动作
  * 2.通过上下文对象context可以获取当前组件实例，例如context.props可以获取该组件相关属性
  * 3.事件对象event，在doAction之后执行event.stopPropagation();可以阻止后续动作执行
*/
const myMsg = '我是自定义JS';
doAction({
  actionType: 'toast',
  args: {
    msg: myMsg
  }
});
`
          }
        }
        // {
        //   actionLabel: '广播',
        //   actionType: 'broadcast',
        //   description: '发送广播事件',
        //   schema: {
        //     type: 'wrapper',
        //     className: 'p-none',
        //     body: [
        //       {
        //         type: 'input-text',
        //         name: 'eventName',
        //         label: '广播标识',
        //         mode: 'horizontal',
        //         required: true,
        //         description: '广播事件标识派发出去后，其他组件可以进行监听并作出响应'
        //       },
        //       {
        //         type: 'input-text',
        //         label: '广播名称',
        //         name: 'eventLabel',
        //         mode: 'horizontal',
        //         required: true
        //       },
        //       {
        //         type: 'textarea',
        //         label: '描述',
        //         name: 'description',
        //         mode: 'horizontal',
        //         required: true
        //       }
        //     ]
        //   }
        // }
      ]
    }
  ];
};

// 渲染组件选择配置项
export const renderCmptSelect = (
  componentLabel: string,
  required: boolean,
  onChange?: (value: string, oldVal: any, data: any, form: any) => void,
  hideAutoFill?: boolean
) => [
  {
    type: 'tree-select',
    name: 'componentId',
    label: componentLabel || '选择组件',
    showIcon: false,
    searchable: true,
    required,
    selfDisabledAffectChildren: false,
    size: 'lg',
    source: '${__cmptTreeSource}',
    mode: 'horizontal',
    autoFill: {
      __isScopeContainer: '${isScopeContainer}',
      ...(hideAutoFill
        ? {}
        : {
            __rendererLabel: '${label}',
            __rendererName: '${type}',
            __nodeId: '${id}',
            __nodeSchema: '${schema}'
          })
    },
    onChange: async (value: string, oldVal: any, data: any, form: any) => {
      onChange?.(value, oldVal, data, form);
    }
  }
];

// 渲染组件特性动作配置项
export const renderCmptActionSelect = (
  componentLabel: string,
  required: boolean,
  onChange?: (value: string, oldVal: any, data: any, form: any) => void,
  hideAutoFill?: boolean,
  manager?: EditorManager
) => {
  return [
    ...renderCmptSelect(
      componentLabel || '选择组件',
      true,
      async (value: string, oldVal: any, data: any, form: any) => {
        // 获取组件上下文
        if (form.data.__nodeId) {
          if (form.data.actionType === 'setValue') {
            // todo:这里会闪一下，需要从amis查下问题
            form.setValueByName('args.value', []);
            form.setValueByName('args.__comboType', undefined);
            form.setValueByName('args.__valueInput', undefined);
            form.setValueByName('args.__containerType', undefined);

            if (SELECT_PROPS_CONTAINER.includes(form.data.__rendererName)) {
              const contextSchema: any = await form.data.getContextSchemas?.(
                form.data.__nodeId,
                true
              );

              const dataSchema = new DataSchema(contextSchema || []);
              const variables = dataSchema?.getDataPropsAsOptions() || [];
              form.setValueByName(
                '__setValueDs',
                variables.filter(item => item.value !== '$$id')
              );
            } else {
              form.setValueByName('__setValueDs', []);
            }
          }
        }
        form.setValueByName('groupType', '');
        onChange?.(value, oldVal, data, form);
      },
      hideAutoFill
    ),
    {
      type: 'input-text',
      name: '__cmptId',
      mode: 'horizontal',
      size: 'lg',
      required: true,
      label: '组件id',
      visibleOn:
        'this.componentId === "customCmptId" && this.actionType === "component"',
      onChange: async (value: string, oldVal: any, data: any, form: any) => {
        let schema = JSONGetById(manager!.store.schema, value, 'id');
        if (schema) {
          form.setValues({
            __rendererName: schema.type
          });
        } else {
          form.setValues({
            __rendererName: ''
          });
        }
      }
    },
    {
      asFormItem: true,
      label: '组件动作',
      name: 'groupType',
      mode: 'horizontal',
      required: true,
      visibleOn: 'this.actionType === "component"',
      component: CmptActionSelect,
      description: '${__cmptActionDesc}'
    }
  ];
};

export const renderCmptIdInput = (
  onChange?: (value: string, oldVal: any, data: any, form: any) => void
) => {
  return {
    type: 'input-text',
    name: '__cmptId',
    mode: 'horizontal',
    size: 'lg',
    required: true,
    label: '组件id',
    visibleOn: 'this.componentId === "customCmptId"',
    onChange: async (value: string, oldVal: any, data: any, form: any) => {
      onChange?.(value, oldVal, data, form);
    }
  };
};

// 动作配置项schema map
export const COMMON_ACTION_SCHEMA_MAP: {
  [propName: string]: RendererPluginAction;
} = {
  setValue: {
    innerArgs: ['value'],
    descDetail: (info: any) => {
      return (
        <div>
          设置
          <span className="variable-left variable-right">
            {info?.rendererLabel}
          </span>
          的数据
          {/* 设置
          <span className="variable-left variable-right">
            {info?.rendererLabel}
          </span>
          的值为
          <span className="variable-left variable-right">
            {info?.args?.value
              ? JSON.stringify(info?.args?.value)
              : info?.args?.valueInput}
          </span> */}
        </div>
      );
    },
    schema: getArgsWrapper({
      type: 'wrapper',
      body: [
        {
          type: 'radios',
          name: '__containerType',
          mode: 'horizontal',
          label: '数据设置',
          pipeIn: defaultValue('all'),
          visibleOn: 'this.__isScopeContainer',
          options: [
            {
              label: '直接赋值',
              value: 'all'
            },
            {
              label: '成员赋值',
              value: 'appoint'
            }
          ],
          onChange: (value: string, oldVal: any, data: any, form: any) => {
            form.setValueByName('value', []);
            form.setValueByName('__valueInput', undefined);
          }
        },
        {
          type: 'radios',
          name: '__comboType',
          inputClassName: 'event-action-radio',
          mode: 'horizontal',
          label: '数据设置',
          pipeIn: defaultValue('all'),
          visibleOn: `this.__rendererName === 'combo' || this.__rendererName === 'input-table'`,
          options: [
            {
              label: '全量',
              value: 'all'
            },
            {
              label: '指定序号',
              value: 'appoint'
            }
          ],
          onChange: (value: string, oldVal: any, data: any, form: any) => {
            form.setValueByName('index', undefined);
            form.setValueByName('value', []);
            form.setValueByName('__valueInput', undefined);
          }
        },
        {
          type: 'input-number',
          required: true,
          name: 'index',
          mode: 'horizontal',
          label: '输入序号',
          size: 'lg',
          placeholder: '请输入待更新序号',
          visibleOn: `(this.__rendererName === 'input-table' || this.__rendererName === 'combo')
      && this.__comboType === 'appoint'`
        },
        {
          type: 'combo',
          name: 'value',
          label: '',
          multiple: true,
          removable: true,
          required: true,
          addable: true,
          strictMode: false,
          canAccessSuperData: true,
          size: 'lg',
          mode: 'horizontal',
          formClassName: 'event-action-combo',
          itemClassName: 'event-action-combo-item',
          items: [
            {
              name: 'key',
              type: 'input-text',
              placeholder: '变量名',
              source: '${__setValueDs}',
              labelField: 'label',
              valueField: 'value',
              required: true
            },
            getSchemaTpl('formulaControl', {
              name: 'val',
              variables: '${variables}',
              placeholder: '字段值',
              columnClassName: 'flex-1'
            })
          ],
          visibleOn: `this.__isScopeContainer && this.__containerType === 'appoint' || this.__comboType === 'appoint'`
        },
        {
          type: 'combo',
          name: 'value',
          label: '',
          multiple: true,
          removable: true,
          required: true,
          addable: true,
          strictMode: false,
          canAccessSuperData: true,
          mode: 'horizontal',
          size: 'lg',
          items: [
            {
              type: 'combo',
              name: 'item',
              label: false,
              renderLabel: false,
              multiple: true,
              removable: true,
              required: true,
              addable: true,
              strictMode: false,
              canAccessSuperData: true,
              className: 'm-l',
              size: 'lg',
              mode: 'horizontal',
              formClassName: 'event-action-combo',
              itemClassName: 'event-action-combo-item',
              items: [
                {
                  name: 'key',
                  type: 'input-text',
                  source: '${__setValueDs}',
                  labelField: 'label',
                  valueField: 'value',
                  required: true,
                  visibleOn: `this.__rendererName`
                },
                getSchemaTpl('formulaControl', {
                  name: 'val',
                  variables: '${variables}',
                  columnClassName: 'flex-1'
                })
              ]
            }
          ],
          visibleOn: `(this.__rendererName === 'combo' || this.__rendererName === 'input-table')
      && this.__comboType === 'all'`
        },
        getSchemaTpl('formulaControl', {
          name: '__valueInput',
          label: '',
          variables: '${variables}',
          size: 'lg',
          mode: 'horizontal',
          visibleOn: `(this.__isScopeContainer || ${SHOW_SELECT_PROP}) && this.__containerType === 'all'`,
          required: true
        }),
        getSchemaTpl('formulaControl', {
          name: '__valueInput',
          label: '数据设置',
          variables: '${variables}',
          size: 'lg',
          mode: 'horizontal',
          visibleOn: `this.__rendererName && !this.__isScopeContainer && this.__rendererName !== 'combo' && this.__rendererName !== 'input-table'`,
          required: true,
          horizontal: {
            leftFixed: true
          }
        })
      ]
    })
  },
  reload: {
    descDetail: (info: any) => {
      return (
        <div>
          刷新
          <span className="variable-left variable-right">
            {info?.rendererLabel}
          </span>
          组件
        </div>
      );
    }
  },
  clear: {
    descDetail: (info: any) => {
      return (
        <div>
          清空
          <span className="variable-left variable-right">
            {info?.rendererLabel}
          </span>
          的数据
        </div>
      );
    }
  },
  reset: {
    descDetail: (info: any) => {
      return (
        <div>
          重置
          <span className="variable-left variable-right">
            {info?.rendererLabel}
          </span>
          的数据
        </div>
      );
    }
  },
  submit: {
    descDetail: (info: any) => {
      return (
        <div>
          提交
          <span className="variable-left variable-right">
            {info?.rendererLabel}
          </span>
          {info?.__rendererName === 'wizard' ? '全部数据' : '数据'}
        </div>
      );
    }
  },
  validate: {
    descDetail: (info: any) => {
      return (
        <div>
          校验
          <span className="variable-left variable-right">
            {info?.rendererLabel}
          </span>
          的数据
        </div>
      );
    }
  },
  prev: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.rendererLabel}</span>
          {info?.__rendererName === 'carousel' ? '滚动至上一张' : null}
          {info?.__rendererName === 'wizard' ? '返回前一步' : null}
        </div>
      );
    }
  },
  next: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.rendererLabel}</span>
          {info?.__rendererName === 'carousel' ? '滚动至下一张' : null}
          {info?.__rendererName === 'wizard' ? '提交当前步骤数据' : null}
        </div>
      );
    }
  },
  expand: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.rendererLabel}</span>
          展开
        </div>
      );
    }
  },
  collapse: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.rendererLabel}</span>
          收起
        </div>
      );
    }
  },
  selectAll: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.rendererLabel}</span>
          选中所有选项
        </div>
      );
    }
  },
  focus: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.rendererLabel}</span>
          获取焦点
        </div>
      );
    }
  },
  refresh: {
    descDetail: (info: any) => <div>刷新页面</div>
  },
  alert: {
    descDetail: (info: any) => <div>打开提示对话框</div>
  },
  confirm: {
    descDetail: (info: any) => <div>打开确认对话框</div>
  },
  preview: {
    descDetail: (info: any) => <div>预览图片</div>
  },
  zoom: {
    descDetail: (info: any) => <div>调整图片比例</div>
  }
};

// 获取动作树中指定的动作
export const findActionNode = (
  actions: RendererPluginAction[],
  actionType: string
) => findTree(actions, node => node.actionType === actionType);

// 获取包含指定子动作的动作
export const findSubActionNode = (
  actions: RendererPluginAction[],
  actionType: string
) =>
  findTree(actions, node =>
    node.actions?.find(
      (item: SubRendererPluginAction) => item.actionType === actionType
    )
  );

// 获取真实的动作类型
export const getActionType = (
  action: ActionConfig,
  hasSubActionNode: RendererPluginAction | null
) =>
  action.groupType === 'component'
    ? 'component'
    : hasSubActionNode
    ? hasSubActionNode.actionType
    : action.actionType;

// 获取事件Label文案
export const getEventLabel = (events: RendererPluginEvent[], name: string) =>
  events.find(item => item.eventName === name)?.eventLabel;

// 获取事件描述文案
export const getEventDesc = (events: RendererPluginEvent[], name: string) =>
  events.find(item => item.eventName === name)?.description;

export const getEventStrongDesc = (
  events: RendererPluginEvent[],
  name: string
) => events.find(item => item.eventName === name)?.strongDesc;

// 判断插件动作中是否存在指定动作
export const hasActionType = (
  actionType: string,
  actions?: RendererPluginAction[]
) => {
  if (!Array.isArray(actions)) {
    return false;
  }
  return !!actions?.find(item =>
    [item.actionType, 'component'].includes(actionType)
  );
};

// 获取动作配置，主要是为了获取config和desc，schema强制捆绑在动作树节点（动作配置可能在插件动作中 > 树节点 or 子动作）
export const getPropOfAcion = (
  action: ActionConfig,
  propName: string,
  actionTree: RendererPluginAction[],
  pluginActions: PluginActions,
  commonActions?: {[propName: string]: RendererPluginAction},
  allComponents?: ComponentInfo[]
): any => {
  let prop: any = null;
  if (action.componentId) {
    // 优先从组件特性动作中找
    const node = findTree(
      allComponents ?? [],
      item => item.value === action.componentId
    );
    prop =
      node &&
      pluginActions[node.type]?.find(
        (item: RendererPluginAction) => item.actionType === action.actionType
      )?.[propName as keyof RendererPluginAction];
  }

  if (!prop) {
    prop = findActionNode(actionTree, action.actionType)?.[
      propName as keyof RendererPluginAction
    ];
  }

  if (!prop) {
    const commonActionConfig = {
      ...COMMON_ACTION_SCHEMA_MAP,
      ...commonActions
    };
    const hasSubActionNode = findSubActionNode(actionTree, action.actionType);

    if (propName === 'actionLabel') {
      prop = hasSubActionNode?.actionLabel;
    } else {
      prop =
        hasSubActionNode?.actions?.find(
          (item: SubRendererPluginAction) =>
            item.actionType === action.actionType
        )?.[propName as keyof SubRendererPluginAction] ??
        commonActionConfig[action.actionType]?.[
          propName as keyof RendererPluginAction
        ];
    }
  }

  return prop;
};

export const getOldActionSchema = (
  manager: EditorManager,
  context: BaseEventContext
) => {
  const isInDialog = /(?:\/|^)dialog\/.+$/.test(context.path);
  return {
    type: 'tooltip-wrapper',
    className: 'old-action-tooltip-warpper',
    content:
      '温馨提示：添加下方事件动作后，下方事件动作将先于旧版动作执行，建议统一迁移至事件动作机制，帮助您实现更灵活的交互设计',
    inline: true,
    tooltipTheme: 'dark',
    placement: 'bottom',
    body: [
      {
        type: 'button',
        label: '配置动作(旧版)',
        className: 'block old-action-btn',
        actionType: 'dialog',
        dialog: {
          type: 'dialog',
          title: '动作',
          body: {
            type: 'form',
            body: [
              {
                label: '按钮行为',
                type: 'select',
                name: 'actionType',
                pipeIn: defaultValue(''),
                options: [
                  {
                    label: '默认',
                    value: ''
                  },
                  {
                    label: '弹框',
                    value: 'dialog'
                  },

                  {
                    label: '抽出式弹框（Drawer）',
                    value: 'drawer'
                  },

                  {
                    label: '发送请求',
                    value: 'ajax'
                  },

                  {
                    label: '下载文件',
                    value: 'download'
                  },

                  {
                    label: '页面跳转(单页模式)',
                    value: 'link'
                  },

                  {
                    label: '页面跳转',
                    value: 'url'
                  },

                  {
                    label: '刷新目标',
                    value: 'reload'
                  },

                  {
                    label: '复制内容',
                    value: 'copy'
                  },

                  {
                    label: '提交',
                    value: 'submit'
                  },

                  {
                    label: '重置',
                    value: 'reset'
                  },

                  {
                    label: '重置并提交',
                    value: 'reset-and-submit'
                  },

                  {
                    label: '确认',
                    value: 'confirm'
                  },

                  {
                    label: '取消',
                    value: 'cancel'
                  },

                  {
                    label: '跳转下一条',
                    value: 'next'
                  },

                  {
                    label: '跳转上一条',
                    value: 'prev'
                  }
                ]
              },

              {
                type: 'input-text',
                name: 'content',
                visibleOn: 'this.actionType == "copy"',
                label: '复制内容模板'
              },

              {
                type: 'select',
                name: 'copyFormat',
                options: [
                  {
                    label: '纯文本',
                    value: 'text/plain'
                  },
                  {
                    label: '富文本',
                    value: 'text/html'
                  }
                ],
                visibleOn: 'this.actionType == "copy"',
                label: '复制格式'
              },

              {
                type: 'input-text',
                name: 'target',
                visibleOn: 'this.actionType == "reload"',
                label: '指定刷新目标',
                required: true
              },

              {
                name: 'dialog',
                pipeIn: defaultValue({
                  title: '弹框标题',
                  body: '对，你刚刚点击了',
                  showCloseButton: true,
                  showErrorMsg: true,
                  showLoading: true
                }),
                asFormItem: true,
                visibleOn: '${actionType === "dialog"}',
                children: ({value, onChange, data}: any) => (
                  <Button
                    size="sm"
                    level="danger"
                    className="m-b"
                    onClick={() =>
                      manager.openSubEditor({
                        title: '配置弹框内容',
                        value: {type: 'dialog', ...value},
                        onChange: value => onChange(value)
                      })
                    }
                    block
                  >
                    配置弹框内容
                  </Button>
                )
              },

              {
                name: 'drawer',
                pipeIn: defaultValue({
                  title: '抽屉标题',
                  body: '对，你刚刚点击了'
                }),
                asFormItem: true,
                visibleOn: '${actionType == "drawer"}',
                children: ({value, onChange, data}: any) => (
                  <Button
                    size="sm"
                    level="danger"
                    className="m-b"
                    onClick={() =>
                      manager.openSubEditor({
                        title: '配置抽出式弹框内容',
                        value: {type: 'drawer', ...value},
                        onChange: value => onChange(value)
                      })
                    }
                    block
                  >
                    配置抽出式弹框内容
                  </Button>
                )
              },

              getSchemaTpl('api', {
                label: '目标API',
                visibleOn: 'this.actionType == "ajax"'
              }),

              {
                name: 'feedback',
                pipeIn: defaultValue({
                  title: '弹框标题',
                  body: '内容'
                }),
                asFormItem: true,
                visibleOn: '${actionType == "ajax"}',
                children: ({onChange, value, data}: any) => (
                  <div className="m-b">
                    <Button
                      size="sm"
                      level={value ? 'danger' : 'info'}
                      onClick={() =>
                        manager.openSubEditor({
                          title: '配置反馈弹框详情',
                          value: {type: 'dialog', ...value},
                          onChange: value => onChange(value)
                        })
                      }
                    >
                      配置反馈弹框内容
                    </Button>

                    {value ? (
                      <Button
                        size="sm"
                        level="link"
                        className="m-l"
                        onClick={() => onChange('')}
                      >
                        清空设置
                      </Button>
                    ) : null}
                  </div>
                )
              },

              {
                name: 'feedback.visibleOn',
                label: '是否弹出表达式',
                type: 'input-text',
                visibleOn: 'this.feedback',
                autoComplete: false,
                description: '请使用 JS 表达式如：`this.xxx == 1`'
              },

              {
                name: 'feedback.skipRestOnCancel',
                label: '弹框取消是否中断后续操作',
                type: 'switch',
                mode: 'inline',
                className: 'block',
                visibleOn: 'this.feedback'
              },

              {
                name: 'feedback.skipRestOnConfirm',
                label: '弹框确认是否中断后续操作',
                type: 'switch',
                mode: 'inline',
                className: 'block',
                visibleOn: 'this.feedback'
              },

              {
                type: 'input-text',
                label: '目标地址',
                name: 'link',
                visibleOn: 'this.actionType == "link"'
              },

              {
                type: 'input-text',
                label: '目标地址',
                name: 'url',
                visibleOn: 'this.actionType == "url"',
                placeholder: 'http://'
              },

              {
                type: 'switch',
                name: 'blank',
                visibleOn: 'this.actionType == "url"',
                mode: 'inline',
                className: 'w-full',
                label: '是否用新窗口打开',
                pipeIn: defaultValue(true)
              },

              isInDialog
                ? {
                    visibleOn:
                      'this.actionType == "submit" || this.type == "submit"',
                    name: 'close',
                    type: 'switch',
                    mode: 'inline',
                    className: 'w-full',
                    pipeIn: defaultValue(true),
                    label: '是否关闭当前弹框'
                  }
                : {},

              {
                name: 'confirmText',
                type: 'textarea',
                label: '确认文案',
                description:
                  '点击后会弹出此内容，等用户确认后才进行相应的操作。'
              },

              {
                type: 'input-text',
                name: 'reload',
                label: '刷新目标组件',
                visibleOn:
                  'this.actionType != "link" && this.actionType != "url"',
                description:
                  '当前动作完成后，指定目标组件刷新。支持传递数据如：<code>xxx?a=\\${a}&b=\\${b}</code>，多个目标请用英文逗号隔开。'
              },

              {
                type: 'input-text',
                name: 'target',
                visibleOn: 'this.actionType != "reload"',
                label: '指定响应组件',
                description:
                  '指定动作执行者，默认为当前组件所在的功能性性组件，如果指定则转交给目标组件来处理。'
              },

              {
                type: 'js-editor',
                allowFullscreen: true,
                name: 'onClick',
                label: '自定义点击事件',
                description: '将会传递 event 和 props 两个参数'
              },

              {
                type: 'input-text',
                name: 'hotKey',
                label: '键盘快捷键'
              }
            ]
          },
          onConfirm: (values: any[]) => {
            manager.panelChangeValue(values[0]);
          }
        }
      }
    ]
  };
};

/**
 * 对象转Combo组件对象数组
 * @param obj
 * @returns
 */
const objectToComboArray = (obj: PlainObject) =>
  Object.entries(obj).map(([key, val]) => ({
    key,
    val
  }));

/**
 * Combo组件对象数组转对象
 * @param arr
 * @returns
 */
const comboArrayToObject = (arr: any[]) => {
  let obj: PlainObject = {};
  arr?.forEach(item => {
    obj[item.key] = item.val;
  });

  return obj;
};

/**
 * 获取事件动作面板所需属性配置
 */
export const getEventControlConfig = (
  manager: EditorManager,
  context: BaseEventContext
) => {
  const isSubEditor = manager.store.isSubEditor;
  // 通用动作配置
  const commonActions =
    manager?.config.actionOptions?.customActionGetter?.(manager);
  // 动作树
  const actionTree = manager?.config.actionOptions?.actionTreeGetter
    ? manager?.config.actionOptions?.actionTreeGetter(ACTION_TYPE_TREE(manager))
    : ACTION_TYPE_TREE(manager);
  const allComponents = manager?.store?.getComponentTreeSource();
  const checkComponent = (node: any, action: RendererPluginAction) => {
    const actionType = action?.actionType;
    const actions = manager?.pluginActions[node.type];
    const haveChild = !!node.children?.length;
    let isSupport = false;
    if (typeof action.supportComponents === 'string') {
      isSupport =
        action.supportComponents === '*' ||
        action.supportComponents === node.type;
      // 内置逻辑
      if (action.supportComponents === 'byComponent' && actionType) {
        isSupport = hasActionType(actionType, actions);
        node.scoped = isSupport;
      }
    } else if (Array.isArray(action.supportComponents)) {
      isSupport = action.supportComponents.includes(node.type);
    }

    node.isScopeContainer = DATA_CONTAINER.includes(node.type);
    if (actionType === 'component' && !actions?.length) {
      node.disabled = true;
    }
    if (isSupport) {
      return true;
    } else if (haveChild) {
      return true;
    }
    return false;
  };

  return {
    showOldEntry:
      !!(
        context.schema.actionType &&
        !['dialog', 'drawer'].includes(context.schema.type)
      ) || ['submit', 'reset'].includes(context.schema.type),
    actions: manager?.pluginActions,
    events: manager?.pluginEvents,
    actionTree,
    commonActions,
    owner: '',
    addBroadcast: manager?.addBroadcast,
    removeBroadcast: manager?.removeBroadcast,
    allComponents: allComponents,
    getContextSchemas: async (id?: string, withoutSuper?: boolean) => {
      const dataSchema = await manager.getContextSchemas(
        id ?? context!.id,
        withoutSuper
      );
      // 存在指定id时，只需要当前层上下文
      if (id) {
        return dataSchema;
      }
      return manager.dataSchema;
    },
    getComponents: (action: RendererPluginAction) => {
      if (!action) {
        return [];
      }

      let components = manager?.store?.getComponentTreeSource();
      let finalCmpts: any[] = [];
      if (isSubEditor) {
        let editorData = manager.store.getSuperEditorData;
        while (components) {
          if (editorData?.__curCmptTreeWrap) {
            components = [
              {
                ...editorData.__curCmptTreeWrap,
                children: components
              }
            ];
          }
          finalCmpts = [...finalCmpts, ...components];
          components = editorData?.__superCmptTreeSource;
          editorData = editorData?.__super;
        }
      } else {
        finalCmpts = components;
      }
      const result = filterTree(
        finalCmpts,
        node => checkComponent(node, action),
        1,
        true
      );
      result.unshift({
        label: '输入组件id',
        value: 'customCmptId'
      });
      return result;
    },
    actionConfigInitFormatter: async (action: ActionConfig) => {
      let config = {...action};
      config.args = {...action.args};
      if (['link', 'url'].includes(action.actionType) && action.args?.params) {
        config.args = {
          ...config.args,
          params: objectToComboArray(action.args?.params)
        };
      }

      if (['setValue'].includes(action.actionType) && action.args?.value) {
        !config.args && (config.args = {});
        if (Array.isArray(action.args?.value)) {
          config.args.value = action.args?.value.reduce(
            (arr: any, valueItem: any, index: number) => {
              if (!arr[index]) {
                arr[index] = {};
              }
              arr[index].item = objectToComboArray(valueItem);
              return arr;
            },
            []
          );
          // 目前只有给combo赋值会是数组，所以认为是全量的赋值方式
          config.args['__comboType'] = 'all';
        } else if (typeof action.args?.value === 'object') {
          config.args.value = objectToComboArray(action.args?.value);
          config.args['__containerType'] = 'appoint';
          // 如果有index，认为是给指定序号的combo赋值，所以认为是指定序号的赋值方式
          if (action.args.index !== undefined) {
            config.args['__comboType'] = 'appoint';
          }
        } else if (
          action.actionType === 'setValue' &&
          typeof action.args?.path === 'string' &&
          typeof action.args?.value === 'string'
        ) {
          /** 应用变量赋值 */
          config.args['__containerType'] = 'all';
        } else if (
          action.actionType === 'setValue' &&
          typeof action.args?.value === 'string'
        ) {
          config.args['__containerType'] = 'all';
          config.args['__valueInput'] = config.args['value'];
          delete config.args?.value;
        }
      }

      if (
        ['show', 'hidden', 'enabled', 'disabled'].includes(action.actionType)
      ) {
        // 兼容老逻辑，初始化actionType
        config.__statusType = action.actionType;
        config.__actionType = 'static';
      }

      if (['usability', 'visibility'].includes(action.actionType)) {
        // 初始化条件参数
        config.__actionExpression = action.args?.value;
      }

      if (['ajax', 'download'].includes(action.actionType)) {
        config.api = action.api ?? action?.args?.api;
        config.options = action.options ?? action?.args?.options;
        if (typeof action?.api === 'string') {
          config.api = normalizeApi(action?.api);
        }
        delete config.args;
      }

      // 获取动作专有配置参数
      const innerArgs: any = getPropOfAcion(
        action,
        'innerArgs',
        actionTree,
        manager.pluginActions,
        commonActions
      );

      // 处理刷新组件动作的追加参数
      if (config.actionType === 'reload') {
        config.__resetPage = config.args?.resetPage;
        config.__addParam = !!config.data;

        if (
          (config.data && typeof config.data === 'object') ||
          (config.args &&
            Object.keys(config.args).length &&
            config.data === undefined)
        ) {
          config.__addParam = true;
          config.__containerType = 'appoint';
          config.dataMergeMode = config.dataMergeMode || 'merge';
        }

        if (config.__addParam && config.data) {
          if (typeof config.data === 'string') {
            config.__containerType = 'all';
            config.__valueInput = config.data;
          } else {
            config.__containerType = 'appoint';
            config.__reloadParams = objectToComboArray(config.data);
          }
        } else if (
          config.args &&
          Object.keys(config.args).length &&
          config.data === undefined
        ) {
          config.__reloadParams = objectToComboArray(config.args);
        }
      }

      // 如果不在可以选择的组件范围，设置一下自定义输入组件数据
      if (
        [
          'setValue',
          'static',
          'nonstatic',
          'show',
          'visibility',
          'hidden',
          'enabled',
          'disabled',
          'usability',
          'reload',
          'submit',
          'clear',
          'reset',
          'validate'
        ].includes(action.actionType)
      ) {
        const node = findTree(
          allComponents ?? [],
          item => item.value === config.componentId
        );
        if (!node) {
          config.__cmptId = config.componentId;
          config.componentId = 'customCmptId';
        }

        if (['setValue'].includes(action.actionType)) {
          const root = getRootManager(manager);
          let schema = JSONGetById(root.store.schema, config.__cmptId, 'id');
          if (schema) {
            let __isScopeContainer = DATA_CONTAINER.includes(schema.type);
            config.__isScopeContainer = __isScopeContainer;
            config.__rendererName = schema.type;
          }
        }
      }

      delete config.data;

      // 处理下 addItem 的初始化
      if (action.actionType === 'addItem') {
        if (Array.isArray(action.args?.item)) {
          const comboArray = (action.args?.item || []).map((raw: any) =>
            objectToComboArray(raw)
          );
          config.args = {
            ...config.args,
            value: comboArray.map(combo => ({item: combo}))
          };
        } else {
          config.args = {
            ...config.args,
            item: objectToComboArray(action.args?.item)
          };
        }
      }

      // 还原args为可视化配置结构(args + addOnArgs)
      if (config.args) {
        if (innerArgs) {
          let tmpArgs = {};
          config.addOnArgs = [];
          Object.keys(config.args).forEach(key => {
            // 筛选出附加配置参数
            if (!innerArgs.includes(key)) {
              config.addOnArgs = [
                ...config.addOnArgs,
                {
                  key: key,
                  val: config.args?.[key]
                }
              ];
            } else {
              tmpArgs = {
                ...tmpArgs,
                [key]: config.args?.[key]
              };
            }
          });
          config.args = tmpArgs;
        }
      }

      // 获取左侧命中的动作节点
      const hasSubActionNode = findSubActionNode(actionTree, action.actionType);

      return {
        ...config,
        actionType: getActionType(action, hasSubActionNode),
        args: config.args
      };
    },
    actionConfigSubmitFormatter: (
      config: ActionConfig,
      type?: string,
      actionData?: ActionData,
      shcema?: Schema
    ) => {
      let action: ActionConfig = {...config, groupType: undefined};
      action.__title = findActionNode(
        actionTree,
        config.actionType
      )?.actionLabel;

      // 修正动作名称
      if (config.actionType === 'component') {
        action.actionType = config.groupType;
        // 标记一下组件特性动作
        action.groupType = config.actionType;
      }
      const hasSubActionNode = findSubActionNode(actionTree, config.groupType);
      if (hasSubActionNode) {
        // 修正动作
        action.actionType = config.groupType;
      }

      // 合并附加的动作参数
      if (config.addOnArgs) {
        config.addOnArgs.forEach((args: any) => {
          action.args = action.args ?? {};
          action.args = {
            ...action.args,
            [args.key]: args.val
          };
        });
        delete action.addOnArgs;
      }

      // 不加回来可能数据会丢失
      ['drawer', 'dialog', 'args'].forEach(key => {
        action[key] = action[key] ?? actionData?.[key];
      });

      // 刷新组件时，处理是否追加事件变量
      if (config.actionType === 'reload') {
        action.data = undefined;
        action.dataMergeMode = undefined;

        action.args =
          action.__rendererName === 'crud'
            ? {
                ...action.args,
                resetPage: config.__resetPage ?? true
              }
            : undefined;

        action.data = undefined;
        if (config.__addParam) {
          action.dataMergeMode = config.dataMergeMode || 'merge';
          action.data =
            config.__containerType === 'all'
              ? config.__valueInput
              : comboArrayToObject(config.__reloadParams || []);
        }
      }

      // 转换下格式
      if (['link', 'url'].includes(action.actionType)) {
        const params = config.args?.params;
        if (params && params.length) {
          action.args = {
            ...action.args,
            params: comboArrayToObject(params)
          };
        }
      }

      if (action.actionType === 'toast') {
        // 配置一个toast组件默认class
        action.args = {
          ...action.args,
          className: 'theme-toast-action-scope'
        };
      }

      // 转换下格式
      if (action.actionType === 'setValue') {
        if (config.args?.hasOwnProperty('path')) {
          /** 应用变量赋值 */
          action.args = {
            path: config.args.path,
            value: config.args?.value ?? ''
          };

          action.hasOwnProperty('componentId') && delete action.componentId;
          return action;
        } else {
          action?.args?.hasOwnProperty('path') && delete action.args.path;

          if (config.args?.__valueInput !== undefined) {
            action.args = {
              value: config.args?.__valueInput
            };
          } else if (Array.isArray(config.args?.value)) {
            action.args = action.args ?? {};
            if (
              (action.__rendererName === 'combo' ||
                action.__rendererName === 'input-table') &&
              action.args?.index === undefined
            ) {
              // combo、input-table特殊处理
              let tempArr: any = [];
              config.args?.value.forEach((valueItem: any, index: number) => {
                valueItem.item.forEach((item: any) => {
                  if (!tempArr[index]) {
                    tempArr[index] = {};
                  }
                  tempArr[index][item.key] = item.val;
                });
              });
              action.args = {
                ...action.args,
                value: tempArr
              };
            } else {
              action.args = {
                ...action.args,
                value: comboArrayToObject(config.args?.value!)
              };
            }
          }
        }
      }

      if (
        [
          'setValue',
          'static',
          'nonstatic',
          'show',
          'visibility',
          'hidden',
          'enabled',
          'disabled',
          'usability',
          'reload',
          'submit',
          'clear',
          'reset',
          'validate'
        ].includes(action.actionType)
      ) {
        // 处理一下自行输入组件id的转换
        if (action.componentId === 'customCmptId') {
          action.componentId = action.__cmptId;
        }
      }

      if (
        action.actionType === 'addItem' &&
        action.__rendererName === 'combo'
      ) {
        action.args = {
          ...action.args,
          item: comboArrayToObject(config.args?.item!)
        };
      }

      if (
        action.actionType === 'addItem' &&
        action.__rendererName === 'input-table'
      ) {
        const comboArray = (config.args?.value! || []).map(
          (combo: any) => combo.item || {}
        );
        action.args = {
          ...action.args,
          item: comboArray.map((raw: any) => comboArrayToObject(raw))
        };
        delete action.args?.value;
      }

      // 转换下格式
      if (['visibility', 'usability'].includes(config.actionType)) {
        action.args =
          action.actionType !== 'static'
            ? {
                value: action.__actionExpression
              }
            : undefined;
        action.actionType === 'static' &&
          (action.actionType = config.__statusType);
        delete action.__actionExpression;
        delete action.__statusType;
      }

      delete action.config;
      delete action.__keywords;
      delete action.__resultActionTree;
      return action;
    }
  };
};

/**
 * 更新localStorage存储的常用动作
 */
export const updateCommonUseActions = (action: Option) => {
  const commonUseActions = persistGet('common-use-actions', []);
  const index = commonUseActions.findIndex(
    (item: Option) => item.value === action.value
  );
  if (index >= 0) {
    commonUseActions[index].use += 1;
  } else {
    commonUseActions.unshift(action);
  }
  commonUseActions.sort(
    (before: Option, next: Option) => next.use - before.use
  );
  persistSet('common-use-actions', commonUseActions);
};
