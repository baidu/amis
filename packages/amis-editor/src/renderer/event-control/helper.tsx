/**
 * @file 一些处理方法
 */
import React from 'react';
import {
  PluginActions,
  RendererPluginAction,
  RendererPluginEvent
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

export const getArgsWrapper = (items: any, multiple: boolean = false) => ({
  type: 'combo',
  name: 'args',
  // label: '动作参数',
  multiple,
  strictMode: false,
  items: Array.isArray(items) ? items : [items]
});

// 获取动作树中指定的动作
export const findActionNode = (
  actions: RendererPluginAction[],
  actionType: string
) => findTree(actions, node => node.actionType === actionType);

// 获取包含指定子动作的动作
export const findHasSubActionNode = (
  actions: RendererPluginAction[],
  actionType: string
) =>
  findTree(actions, node =>
    node.actions?.find(item => item.actionType === actionType)
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

// 获取动作Label文案
export const getActionLabel = (events: RendererPluginAction[], name: string) =>
  findTree(events, item => item.actionType === name)?.actionLabel;

// 根据动作类型获取过滤后的组件树
export const getComponentTreeSource = (
  actionType: string,
  pluginActions: PluginActions,
  getComponents: () => ComponentInfo[],
  commonActions?: {[propName: string]: RendererPluginAction}
) => {
  if (!actionType) {
    return [];
  }

  const commonActionConfig = {
    ...COMMON_ACTION_SCHEMA_MAP,
    ...commonActions
  };
  // 如果组件树结构没有传，则重新获取
  const components = getComponents ? getComponents() || [] : [];
  return getComponentTreeByType(
    components,
    actionType,
    pluginActions,
    commonActionConfig
  );
};

/**
 * 根据不同的动作类型过滤组件树
 * @param componentsTree 组件树
 * @param actionType 动作类型
 * @returns
 */
export const getComponentTreeByType = (
  componentsTree: ComponentInfo[] = [],
  actionType: string = '',
  pluginActions: {
    [key: string]: any;
  } = {},
  actionConfigItems: {[propName: string]: RendererPluginAction}
) => {
  const hasActionType = (actions?: RendererPluginAction[]) => {
    if (!Array.isArray(actions)) {
      return false;
    }
    return !!actions?.find(item =>
      [item.actionType, 'component'].includes(actionType)
    );
  };

  const loopChildren = (nodes: ComponentInfo[]) => {
    const temp: ComponentInfo[] = [];
    for (let node of nodes) {
      const actions = pluginActions[node.type];

      if (
        ['visibility'].includes(actionType) ||
        (['usability'].includes(actionType) &&
          ['form', ...FORMITEM_CMPTS].includes(node.type)) ||
        (!['submit', 'clear', 'reset', 'validate'].includes(actionType) &&
          node.type &&
          hasActionType(actions)) ||
        (['submit', 'clear', 'reset', 'validate'].includes(actionType) &&
          node.type === 'form') ||
        ((actionType === 'component' ||
          actionConfigItems[actionType]?.withComponentId) &&
          actionConfigItems[actionType]?.supportComponents?.includes(node.type))
      ) {
        // 组件特性动作，如果当前组件没有动作，则禁用
        const disabled =
          actionType === 'component' && (!actions || !actions.length);
        const newNode: ComponentInfo = {
          ...node,
          disabled: disabled || node.disabled,
          children: []
        };
        if (node.children?.length) {
          // 检查子项
          newNode.children?.push(...loopChildren(node.children));
        }
        temp.push(newNode);
      } else if (node.children?.length) {
        const childNodes = loopChildren(node.children);
        if (childNodes.length) {
          temp.push(...childNodes);
        }
      }
    }
    return temp;
  };

  return loopChildren(componentsTree);
};

// 获取动作配置
export const getAcionConfig = (
  action: ActionConfig,
  actionTree: RendererPluginAction[],
  pluginActions: PluginActions,
  commonActions?: {[propName: string]: RendererPluginAction}
): RendererPluginAction | undefined => {
  const commonActionConfig = {
    ...COMMON_ACTION_SCHEMA_MAP,
    ...commonActions
  };
  const actionNode = findActionNode(actionTree, action.actionType);
  if (actionNode) {
    return actionNode;
  }

  const hasSubActionNode = findHasSubActionNode(actionTree, action.actionType);
  let actionConfig: RendererPluginAction | undefined =
    hasSubActionNode?.actions?.find(
      item => item.actionType === action.actionType
    ) ?? commonActionConfig[action.actionType];

  if (!actionConfig && action.componentId) {
    // 尝试从actions中获取desc
    actionConfig = pluginActions[action.__rendererName]?.find(
      (item: RendererPluginAction) => item.actionType === action.actionType
    );
  }

  return actionConfig;
};

// 格式化初始化时的动作配置
export const formatActionInitConfig = (
  action: ActionConfig,
  actionTree: RendererPluginAction[],
  pluginActions: PluginActions,
  getComponents: () => ComponentInfo[],
  commonActions?: {[propName: string]: RendererPluginAction}
) => {
  let config = {...action};

  if (['setValue', 'url', 'link'].includes(action.actionType) && action.args) {
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
    } else if (typeof action.args[prop] === 'object') {
      config.args[prop] = Object.keys(action.args[prop]).map(key => ({
        key,
        val: action.args?.[prop][key]
      }));
    } else if (
      action.actionType === 'setValue' &&
      typeof action.args[prop] === 'string'
    ) {
      config.args['valueInput'] = config.args['value'];
      delete config.args?.value;
    }
  }

  // 获取动作配置
  const actionConfig: any = getAcionConfig(
    action,
    actionTree,
    pluginActions,
    commonActions
  );
  // 还原args为可视化配置结构(args + addOnArgs)
  if (config.args) {
    if (actionConfig?.config) {
      let tmpArgs = {};
      config.addOnArgs = [];
      Object.keys(config.args).forEach(key => {
        // 筛选出附加配置参数
        if (!actionConfig?.config.includes(key)) {
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
  const hasSubActionNode = findHasSubActionNode(actionTree, action.actionType);
  const actionType = getActionType(action, hasSubActionNode);

  return {
    ...config,
    actionType,
    __cmptTreeSource: getComponentTreeSource(
      actionType!,
      pluginActions,
      getComponents,
      commonActions
    ),
    __cmptActionType:
      hasSubActionNode || action.componentId ? action.actionType : '',
    __actionDesc: action.__actionDesc ?? hasSubActionNode?.desc ?? actionConfig.schema, // 树节点描述
    __actionSchema: action.__actionSchema ?? hasSubActionNode?.schema ?? actionConfig.schema, // 树节点schema
    __subActions: hasSubActionNode?.actions // 树节点子动作
    // broadcastId: action.actionType === 'broadcast' ? action.eventName : ''
  };
};

// 渲染组件选择配置项
export function renderCmptSelect(
  componentLabel: string,
  required: boolean,
  onChange?: (value: string, oldVal: any, data: any, form: any) => void
) {
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
export function renderCmptActionSelect(
  componentLabel: string,
  required: boolean,
  onChange?: (value: string, oldVal: any, data: any, form: any) => void
) {
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

// 动作配置项schema map
export const COMMON_ACTION_SCHEMA_MAP: {
  [propName: string]: RendererPluginAction;
} = {
  setValue: {
    config: ['value', 'valueInput'],
    desc: (info: any) => {
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
    desc: (info: any) => {
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
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          清空
        </div>
      );
    }
  },
  reset: {
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          重置
        </div>
      );
    }
  },
  submit: {
    desc: (info: any) => {
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
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          校验
        </div>
      );
    }
  },
  prev: {
    desc: (info: any) => {
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
    desc: (info: any) => {
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
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          收起
        </div>
      );
    }
  },
  selectAll: {
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          选中所有选项
        </div>
      );
    }
  },
  focus: {
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          获取焦点
        </div>
      );
    }
  },
  refresh: {
    desc: (info: any) => <div>刷新页面</div>
  },
  alert: {
    desc: (info: any) => <div>打开提示对话框</div>
  },
  confirm: {
    desc: (info: any) => <div>打开确认对话框</div>
  }
};
