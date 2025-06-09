import React from 'react';
import {
  getSchemaTpl,
  defaultValue,
  JSONGetById,
  EditorManager
} from 'amis-editor-core';
import {getRendererByName} from 'amis-core';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptActionSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc, getArgsWrapper} from '../../helper';
import {getRootManager} from '../../eventControlConfigHelper';

// 下拉展示可赋值属性范围
export const SELECT_PROPS_CONTAINER = ['form'];

// 是否下拉展示可赋值属性
export const SHOW_SELECT_PROP = `${JSON.stringify(
  SELECT_PROPS_CONTAINER
)}.includes(this.__rendererName)`;

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

registerActionPanel('setValue', {
  label: '变量赋值',
  tag: '组件',
  description: '更新目标组件或变量的数据值',
  innerArgs: [
    'path',
    'value',
    'index',
    '__valueInput',
    '__comboType',
    '__containerType'
  ],
  descDetail: (info: any, context: any, props: any) => {
    const variableManager = props.manager?.variableManager;

    return (
      <div className="action-desc">
        {/* 只要path字段存在就认为是应用变量赋值，无论是否有值 */}
        {typeof info?.args?.path === 'string' && !info?.componentId ? (
          <>
            设置变量
            <span className="variable-left variable-right">
              {variableManager?.getNameByPath(info.args.path)}
            </span>
            的数据
          </>
        ) : (
          <>
            设置组件
            {buildLinkActionDesc(props.manager, info)}
            的数据
          </>
        )}
      </div>
    );
  },
  supportComponents: 'byComponent',
  schema: (manager: EditorManager) => {
    // TODO: 传context
    const variableManager = manager?.variableManager;
    /** 变量列表 */
    const variableOptions = variableManager?.getVariableOptions() || [];
    const pageVariableOptions =
      variableManager?.getPageVariablesOptions() || [];
    const globalVariableOptions =
      variableManager?.getGlobalVariablesOptions() || [];
    return [
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
              {label: '全局变量', value: 'global'},
              {label: '页面参数', value: 'page'},
              {label: '内存变量', value: 'app'}
            ],
            value: /^global/.test(path) // 只需要初始化时更新value
              ? 'global'
              : /^appVariables/.test(path) // 只需要初始化时更新value
              ? 'app'
              : /^(__page|__query)/.test(path)
              ? 'page'
              : 'cmpt',
            onChange: (value: string, oldVal: any, data: any, form: any) => {
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
                const render = getRendererByName(schema.type);
                let __isScopeContainer = !!render?.storeType;
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
              getSchemaTpl('formulaControl', {
                name: 'index',
                label: '输入序号',
                required: true,
                rendererSchema: {
                  type: 'input-number'
                },
                valueType: 'number',
                variables: '${variables}',
                size: 'lg',
                mode: 'horizontal',
                placeholder: '请输入待更新序号',
                visibleOn: `(this.__rendererName === 'input-table' || this.__rendererName === 'combo')
              && this.__comboType === 'appoint'`
              }),
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
      },
      // 全局变量
      {
        type: 'container',
        visibleOn: '__actionSubType === "global"',
        body: [
          getArgsWrapper([
            {
              type: 'wrapper',
              body: [
                getCustomNodeTreeSelectSchema({
                  options: globalVariableOptions,
                  rootLabel: '全局变量',
                  label: '全局变量',
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
    ];
  }
});
