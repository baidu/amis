/**
 * @file 一些处理方法
 */
import React from 'react';
import {
  BaseEventContext,
  defaultValue,
  EditorManager,
  getSchemaTpl,
  JSONGetById,
  JSONGetPathById,
  persistGet,
  persistSet,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {DataSchema, Schema, Option, getRendererByName} from 'amis-core';
import {Button, toast, TooltipWrapper} from 'amis';
import {i18n as _i18n} from 'i18n-runtime';
import {ActionConfig} from './types';
import CmptActionSelect from './comp-action-select';
import {ActionData} from '.';
import {
  getContextSchemasHoc,
  getComponentsHoc,
  actionConfigInitFormatterHoc,
  actionConfigSubmitFormatterHoc
} from './eventControlConfigHelper';
import {ACTION_TYPE_TREE} from './actionsPanelManager';
import {SELECT_PROPS_CONTAINER, SHOW_SELECT_PROP} from './constants';

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

export const getActionCommonProps = (actionType: string, info?: any) => {
  if (!actionType) {
    console.warn('请传入actionType');
  }
  return COMMON_ACTION_SCHEMA_MAP[actionType];
};

export const buildLinkActionDesc = (manager: EditorManager, info: any) => {
  const desc = info?.rendererLabel || info.componentId || '-';

  return (
    <span className="desc-tag variable-left variable-right">
      <TooltipWrapper
        rootClose
        placement="top"
        tooltip={`${desc}，点击锚定到该组件`}
        tooltipClassName="ae-event-item-header-tip"
      >
        <a
          href="#"
          className="component-action-tag"
          onClick={(e: React.UIEvent<any>) => {
            e.preventDefault();
            e.stopPropagation();

            const schema = JSONGetById(
              manager.store.schema,
              info.componentId,
              'id'
            );

            if (!schema) {
              toast.info('温馨提示：未找到该组件');
              return;
            }

            const path = JSONGetPathById(manager.store.schema, schema.$$id);

            if (path?.includes('dialog') || path?.includes('drawer')) {
              toast.info('该组件在弹窗内，暂无法直接锚定到该组件');
              return;
            }

            manager.store.setActiveId(schema.$$id);
          }}
        >
          {desc}
        </a>
      </TooltipWrapper>
    </span>
  );
};

// 动作配置项schema map
export const COMMON_ACTION_SCHEMA_MAP: {
  [propName: string]: RendererPluginAction;
} = {
  setValue: {
    innerArgs: ['value'],
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          设置
          {buildLinkActionDesc(props.manager, info)}
          的数据
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
          required: true,
          horizontal: {
            leftFixed: true
          }
        })
      ]
    })
  },
  reload: {
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          刷新
          {buildLinkActionDesc(props.manager, info)}
          组件
        </div>
      );
    }
  },
  clear: {
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          清空
          {buildLinkActionDesc(props.manager, info)}
          的数据
        </div>
      );
    }
  },
  reset: {
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          重置
          {buildLinkActionDesc(props.manager, info)}
          的数据
        </div>
      );
    }
  },
  submit: {
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          提交
          {buildLinkActionDesc(props.manager, info)}
          {info?.__rendererName === 'wizard' ? '全部数据' : '数据'}
        </div>
      );
    }
  },
  collapse: {
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          收起{buildLinkActionDesc(props.manager, info)}
        </div>
      );
    }
  },
  selectAll: {
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          选中{buildLinkActionDesc(props.manager, info)}所有选项
        </div>
      );
    }
  },
  focus: {
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          获取{buildLinkActionDesc(props.manager, info)}焦点
        </div>
      );
    }
  }
};

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

              getSchemaTpl('apiControl', {
                label: '目标API',
                visibleOn: 'this.actionType == "ajax"',
                mode: 'horizontal'
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
 * 获取事件动作面板所需属性配置
 */
export const getEventControlConfig = (
  manager: EditorManager,
  context: BaseEventContext
) => {
  // 通用动作配置
  const commonActions =
    manager?.config.actionOptions?.customActionGetter?.(manager);
  // 动作树
  const actionTree = manager?.config.actionOptions?.actionTreeGetter
    ? manager?.config.actionOptions?.actionTreeGetter(ACTION_TYPE_TREE(manager))
    : ACTION_TYPE_TREE(manager);
  const allComponents = manager?.store?.getComponentTreeSource();
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
    addBroadcast: manager?.addBroadcast.bind(manager),
    removeBroadcast: manager?.removeBroadcast.bind(manager),
    allComponents: allComponents,
    getContextSchemas: getContextSchemasHoc(manager, context),
    getComponents: getComponentsHoc(manager),
    actionConfigInitFormatter: actionConfigInitFormatterHoc(
      manager,
      actionTree,
      commonActions,
      allComponents
    ),
    actionConfigSubmitFormatter: actionConfigSubmitFormatterHoc(actionTree)
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

export const getActionsByRendererName = (
  pluginActions: any,
  rendererName: string
): RendererPluginAction[] => {
  let actions = (pluginActions[rendererName] || []).slice();
  // 表单项类型组件，添加校验动作
  if (getRendererByName(rendererName)?.isFormItem) {
    actions.push({
      actionLabel: '校验',
      description: '对单个表单项进行校验',
      actionType: 'validateFormItem'
    });
  }

  return actions;
};
