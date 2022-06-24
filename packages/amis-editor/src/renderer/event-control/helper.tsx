/**
 * @file 一些处理方法
 */
import React from 'react';
import {
  PluginActions,
  RendererPluginAction,
  RendererPluginEvent,
  SubRendererPluginAction
} from 'amis-editor-core';
import {ActionConfig, ComponentInfo, ContextVariables} from './types';
import {DataSchema, findTree} from 'amis-core';
import CmptActionSelect from './comp-action-select';

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

// 是否数据容器
export const IS_DATA_CONTAINER = `${JSON.stringify(
  DATA_CONTAINER
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

export const getArgsWrapper = (items: any, multiple: boolean = false) => ({
  type: 'combo',
  name: 'args',
  // label: '动作参数',
  multiple,
  strictMode: false,
  items: Array.isArray(items) ? items : [items]
});

// 动作配置项schema map
export const COMMON_ACTION_SCHEMA_MAP: {
  [propName: string]: RendererPluginAction;
} = {
  setValue: {
    innerArgs: ['value', 'valueInput'],
    descDetail: (info: any) => {
      return (
        <div>
          设置
          <span className="variable-left variable-right">
            {info?.__rendererLabel}
          </span>
          的值为
          <span className="variable-left variable-right">
            {info?.args?.value
              ? JSON.stringify(info?.args?.value)
              : info?.args?.valueInput}
          </span>
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
          name: 'valueInput',
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
            {info?.__rendererLabel}
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
          <span className="variable-right">{info?.__rendererLabel}</span>
          清空
        </div>
      );
    }
  },
  reset: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          重置
        </div>
      );
    }
  },
  submit: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          {info?.__rendererName === 'form' ? '提交' : null}
          {info?.__rendererName === 'wizard' ? '提交全部数据' : null}
        </div>
      );
    }
  },
  validate: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          校验
        </div>
      );
    }
  },
  prev: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
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
          <span className="variable-right">{info?.__rendererLabel}</span>
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
          <span className="variable-right">{info?.__rendererLabel}</span>
          收起
        </div>
      );
    }
  },
  selectAll: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          选中所有选项
        </div>
      );
    }
  },
  focus: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
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
  action.__isCmptAction
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
export const hasActionType = (actionType: string, actions?: RendererPluginAction[]) => {
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
    }
    else {
      prop =
        hasSubActionNode?.actions?.find(
          (item: SubRendererPluginAction) => item.actionType === action.actionType
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
}

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
        // 获取组件上下文
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
        }

        if (form.data.actionType === 'setValue') {
          // todo:这里会闪一下，需要从amis查下问题
          form.setValueByName('args.value', undefined);
          form.setValueByName('args.valueInput', undefined);
        }
        form.setValueByName('__cmptActionType', '');

        onChange?.(value, oldVal, data, form);
      }
    ),
    {
      asFormItem: true,
      label: '组件动作',
      name: '__cmptActionType',
      mode: 'horizontal',
      required: true,
      visibleOn: 'data.actionType === "component"',
      component: CmptActionSelect,
      description: '${__cmptActionDesc}'
    }
  ];
}
