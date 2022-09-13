/**
 * @file 一些处理方法
 */
import React from 'react';
import {
  BaseEventContext,
  defaultValue,
  EditorManager,
  getSchemaTpl,
  PluginActions,
  RendererPluginAction,
  RendererPluginEvent,
  SubRendererPluginAction
} from 'amis-editor-core';
import {ActionConfig, ContextVariables} from './types';
import {
  DataSchema,
  filterTree,
  findTree,
  mapTree,
  normalizeApi
} from 'amis-core';
import CmptActionSelect from './comp-action-select';
import {Button} from 'amis';
import ACTION_TYPE_TREE from './actions';
import {stores} from 'amis-core/lib/factory';

// 数据容器范围
export const DATA_CONTAINER = [
  'form',
  'dialog',
  'drawer',
  'wizard',
  'service',
  'page',
  'app',
  'chart'
];

// 下拉展示可赋值属性范围
export const SELECT_PROPS_CONTAINER = ['form'];

// 是否数据容器
export const IS_DATA_CONTAINER = `${JSON.stringify(
  DATA_CONTAINER
)}.includes(__rendererName)`;

// 是否下拉展示可赋值属性
export const SHOW_SELECT_PROP = `${JSON.stringify(
  SELECT_PROPS_CONTAINER
)}.includes(__rendererName)`;

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
      className: 'p-none',
      body: [
        {
          type: 'combo',
          name: 'value',
          label: '变量赋值',
          multiple: true,
          removable: true,
          required: true,
          addable: true,
          strictMode: false,
          canAccessSuperData: true,
          mode: 'horizontal',
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
            {
              name: 'val',
              type: 'input-formula',
              placeholder: '变量值',
              variables: '${variables}',
              evalMode: false,
              variableMode: 'tabs',
              inputMode: 'input-group'
            }
          ],
          visibleOn: `data.__rendererName && ${IS_DATA_CONTAINER}`
        },
        {
          type: 'combo',
          name: 'value',
          label: '变量赋值',
          multiple: true,
          removable: true,
          required: true,
          addable: true,
          strictMode: false,
          canAccessSuperData: true,
          mode: 'horizontal',
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
              mode: 'horizontal',
              items: [
                {
                  name: 'key',
                  type: 'input-text',
                  required: true
                },
                {
                  name: 'val',
                  type: 'input-formula',
                  variables: '${variables}',
                  evalMode: false,
                  variableMode: 'tabs',
                  inputMode: 'input-group'
                }
              ]
            }
          ],
          visibleOn: `data.__rendererName && __rendererName === 'combo'`
        },
        {
          name: '__valueInput',
          type: 'input-formula',
          variables: '${variables}',
          evalMode: false,
          variableMode: 'tabs',
          inputMode: 'input-group',
          label: '变量赋值',
          size: 'lg',
          mode: 'horizontal',
          visibleOn: `data.__rendererName && !${IS_DATA_CONTAINER} && __rendererName !== 'combo'`,
          required: true
        }
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
  commonActions?: {[propName: string]: RendererPluginAction}
): any => {
  let prop: any = null;
  if (action.componentId) {
    // 优先从组件特性动作中找
    pluginActions[action.__rendererName]?.find(
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

// 渲染组件选择配置项
export const renderCmptSelect = (
  componentLabel: string,
  required: boolean,
  onChange?: (value: string, oldVal: any, data: any, form: any) => void
) => {
  return [
    {
      type: 'tree-select',
      name: 'componentId',
      label: componentLabel,
      showIcon: false,
      searchable: true,
      required,
      selfDisabledAffectChildren: false,
      size: 'lg',
      source: '${__cmptTreeSource}',
      mode: 'horizontal',
      autoFill: {
        __rendererLabel: '${label}',
        __rendererName: '${type}',
        __nodeId: '${id}',
        __nodeSchema: '${schema}'
      },
      onChange: async (value: string, oldVal: any, data: any, form: any) => {
        onChange?.(value, oldVal, data, form);
      }
    }
  ];
};

// 渲染组件特性动作配置项
export const renderCmptActionSelect = (
  componentLabel: string,
  required: boolean,
  onChange?: (value: string, oldVal: any, data: any, form: any) => void
) => {
  return [
    ...renderCmptSelect(
      '选择组件',
      true,
      async (value: string, oldVal: any, data: any, form: any) => {
        // 获取组件上下文.
        const rendererType = form.data.__rendererName;
        if (form.data.__nodeId) {
          const dataSchema: any = await form.data.getContextSchemas?.(
            form.data.__nodeId,
            true
          );
          const dataSchemaIns = new DataSchema(dataSchema || []);
          const variables = dataSchemaIns?.getDataPropsAsOptions() || [];

          form.setValueByName('__cmptDataSchema', dataSchema);
          form.setValueByName('__cmptVariables', variables); // 组件上下文（不含父级）
          form.setValueByName('__cmptVariablesWithSys', [
            // 组件上下文+页面+系统
            {
              label: `${form.data.__rendererLabel}变量`,
              children: variables
            },
            ...form.data.rawVariables.filter((item: ContextVariables) =>
              ['页面变量', '系统变量'].includes(item.label)
            )
          ]);
          if (form.data.actionType === 'setValue') {
            // todo:这里会闪一下，需要从amis查下问题
            form.setValueByName('args.value', []);
            form.setValueByName('args.__comboType', undefined);
            form.setValueByName('args.__valueInput', undefined);
            form.setValueByName('args.__containerType', undefined);
            if (SELECT_PROPS_CONTAINER.includes(rendererType)) {
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
      }
    ),
    {
      asFormItem: true,
      label: '组件动作',
      name: 'groupType',
      mode: 'horizontal',
      required: true,
      visibleOn: 'data.actionType === "component"',
      component: CmptActionSelect,
      description: '${__cmptActionDesc}'
    }
  ];
};

export const getOldActionSchema = (
  manager: EditorManager,
  context: BaseEventContext
) => {
  const isInDialog = /(?:\/|^)dialog\/.+$/.test(context.path);
  return {
    type: 'tooltip-wrapper',
    content:
      '温馨提示：添加下方事件动作后，下方事件动作将先于旧版动作执行，建议统一迁移至事件动作机制，帮助您实现更灵活的交互设计',
    inline: true,
    tooltipTheme: 'dark',
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
                visibleOn: 'data.actionType == "copy"',
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
                visibleOn: 'data.actionType == "copy"',
                label: '复制格式'
              },

              {
                type: 'input-text',
                name: 'target',
                visibleOn: 'data.actionType == "reload"',
                label: '指定刷新目标',
                required: true
              },

              {
                name: 'dialog',
                pipeIn: defaultValue({
                  title: '弹框标题',
                  body: '<p>对，你刚刚点击了</p>'
                }),
                asFormItem: true,
                children: ({value, onChange, data}: any) =>
                  data.actionType === 'dialog' ? (
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
                  ) : null
              },

              {
                visibleOn: 'data.actionType == "drawer"',
                name: 'drawer',
                pipeIn: defaultValue({
                  title: '弹框标题',
                  body: '<p>对，你刚刚点击了</p>'
                }),
                asFormItem: true,
                children: ({value, onChange, data}: any) =>
                  data.actionType == 'drawer' ? (
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
                  ) : null
              },

              getSchemaTpl('api', {
                label: '目标API',
                visibleOn: 'data.actionType == "ajax"'
              }),

              {
                name: 'feedback',
                pipeIn: defaultValue({
                  title: '弹框标题',
                  body: '<p>内容</p>'
                }),
                asFormItem: true,
                children: ({onChange, value, data}: any) =>
                  data.actionType == 'ajax' ? (
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
                  ) : null
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
                visibleOn: 'data.actionType == "link"'
              },

              {
                type: 'input-text',
                label: '目标地址',
                name: 'url',
                visibleOn: 'data.actionType == "url"',
                placeholder: 'http://'
              },

              {
                type: 'switch',
                name: 'blank',
                visibleOn: 'data.actionType == "url"',
                mode: 'inline',
                className: 'w-full',
                label: '是否用新窗口打开',
                pipeIn: defaultValue(true)
              },

              isInDialog
                ? {
                    visibleOn:
                      'data.actionType == "submit" || data.type == "submit"',
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
                  'data.actionType != "link" && data.actionType != "url"',
                description:
                  '当前动作完成后，指定目标组件刷新。支持传递数据如：<code>xxx?a=\\${a}&b=\\${b}</code>，多个目标请用英文逗号隔开。'
              },

              {
                type: 'input-text',
                name: 'target',
                visibleOn: 'data.actionType != "reload"',
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
  const isSubEditor = manager.store.isSubEditor;
  // 通用动作配置
  const commonActions =
    manager?.config.actionOptions?.customActionGetter?.(manager);
  // 动作树
  const actionTree = manager?.config.actionOptions?.actionTreeGetter
    ? manager?.config.actionOptions?.actionTreeGetter(ACTION_TYPE_TREE(manager))
    : ACTION_TYPE_TREE(manager);
  const allComponents = mapTree(
    manager?.store?.outline ?? [],
    (item: any) => {
      const schema = manager?.store?.getSchema(item.id);
      let cmptLabel = '';
      if (item?.region) {
        cmptLabel = item?.label;
      } else {
        cmptLabel = schema?.label ?? schema?.title;
      }
      cmptLabel = cmptLabel ?? item.label;
      return {
        id: item.id,
        label: cmptLabel,
        value: schema?.id ?? item.id,
        type: schema?.type ?? item.type,
        schema,
        disabled: !!item.region,
        children: item?.children
      };
    },
    1,
    true
  );
  const checkComponent = (node: any, action: RendererPluginAction) => {
    const actionType = action.actionType!;
    const actions = manager?.pluginActions[node.type];
    const haveChild = !!node.children?.length;
    let isSupport = false;
    if (typeof action.supportComponents === 'string') {
      isSupport =
        action.supportComponents === '*' ||
        action.supportComponents === node.type;
      // 内置逻辑
      if (action.supportComponents === 'byComponent') {
        isSupport = hasActionType(actionType, actions);
      }
    } else if (Array.isArray(action.supportComponents)) {
      isSupport = action.supportComponents.includes(node.type);
    }

    if (actionType === 'component' && !actions?.length) {
      node.disabled = true;
    }
    if (isSupport) {
      return true;
    } else if (haveChild) {
      node.disabled = true;
      return true;
    }
    return false;
  };

  return {
    showOldEntry:
      !!context.schema.actionType ||
      ['submit', 'reset'].includes(context.schema.type),
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
      let components = allComponents;
      if (isSubEditor) {
        let superTree = manager.store.getSuperEditorData;
        while (superTree) {
          if (superTree.__superCmptTreeSource) {
            components = components.concat(superTree.__superCmptTreeSource);
          }
          superTree = superTree.__super;
        }
      }
      const result = filterTree(
        components,
        node => checkComponent(node, action),
        1,
        true
      );
      return result;
    },
    actionConfigInitFormatter: async (
      action: ActionConfig,
      variables: {
        eventVariables: ContextVariables[];
        rawVariables: ContextVariables[];
      }
    ) => {
      let config = {...action};

      if (['setValue', 'url'].includes(action.actionType) && action.args) {
        const prop = action.actionType === 'setValue' ? 'value' : 'params';
        !config.args && (config.args = {});
        if (Array.isArray(action.args[prop])) {
          config.args[prop] = action.args[prop].reduce(
            (arr: any, valueItem: any, index: number) => {
              if (!arr[index]) {
                arr[index] = {};
              }
              arr[index].item = Object.entries(valueItem).map(([key, val]) => ({
                key,
                val
              }));
              return arr;
            },
            []
          );
          // 目前只有给combo赋值会是数组，所以认为是全量的赋值方式
          config.args['__comboType'] = 'all';
        } else if (typeof action.args[prop] === 'object') {
          config.args[prop] = Object.keys(action.args[prop]).map(key => ({
            key,
            val: action.args?.[prop][key]
          }));
          config.args['__containerType'] = 'appoint';
          // 如果有index，认为是给指定序号的combo赋值，所以认为是指定序号的赋值方式
          if (action.args.index !== undefined) {
            config.args['__comboType'] = 'appoint';
          }
        } else if (
          action.actionType === 'setValue' &&
          typeof action.args[prop] === 'string'
        ) {
          config.args['__containerType'] = 'all';
          config.args['__valueInput'] = config.args['value'];
          delete config.args?.value;
        }
      }
      if (
        action.actionType === 'ajax' &&
        typeof action?.args?.api === 'string'
      ) {
        action.args.api = normalizeApi(action?.args?.api);
      }
      // 获取动作专有配置参数
      const innerArgs: any = getPropOfAcion(
        action,
        'innerArgs',
        actionTree,
        manager.pluginActions,
        commonActions
      );
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
      // 如果args配置中存在组件id，则自动获取一次该组件的上下文
      let datasource = [];
      if (action.args?.componentId) {
        const schema = manager?.store?.getSchema(
          action.args?.componentId,
          'id'
        );
        const dataSchema: any = await manager.getContextSchemas(
          schema?.$$id,
          true
        );
        const dataSchemaIns = new DataSchema(dataSchema || []);
        datasource = dataSchemaIns?.getDataPropsAsOptions() || [];
      }

      return {
        ...config,
        actionType: getActionType(action, hasSubActionNode),
        args: {
          ...config.args,
          __dataContainerVariables: datasource?.length
            ? [
                ...variables.eventVariables,
                {
                  label: `数据来源变量`,
                  children: datasource
                },
                ...variables.rawVariables
              ]
            : [...variables.eventVariables, ...variables.rawVariables]
        }
      };
    },
    actionConfigSubmitFormatter: (config: ActionConfig) => {
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
      // 转换下格式
      if (['setValue', 'url'].includes(action.actionType)) {
        const propName = action.actionType === 'setValue' ? 'value' : 'params';
        if (
          action.actionType === 'setValue' &&
          config.args?.__valueInput !== undefined
        ) {
          action.args = {
            value: config.args?.__valueInput
          };
        } else if (Array.isArray(config.args?.[propName])) {
          action.args = action.args ?? {};
          if (
            action.__rendererName === 'combo' &&
            action.args?.index === undefined
          ) {
            // combo特殊处理
            let tempArr: any = [];
            config.args?.[propName].forEach((valueItem: any, index: number) => {
              valueItem.item.forEach((item: any) => {
                if (!tempArr[index]) {
                  tempArr[index] = {};
                }
                tempArr[index][item.key] = item.val;
              });
            });
            action.args = {
              ...action.args,
              [propName]: tempArr
            };
          } else {
            let tmpObj: any = {};
            config.args?.[propName].forEach((item: any) => {
              tmpObj[item.key] = item.val;
            });
            action.args = {
              ...action.args,
              [propName]: tmpObj
            };
          }
        }
      }

      delete action.config;

      // 去掉空参
      if (action.args && !Object.keys(action.args).length) {
        delete action.args;
      }

      return action;
    }
  };
};
