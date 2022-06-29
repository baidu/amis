import {
  BaseEventContext,
  EditorManager,
  RendererPluginAction
} from 'amis-editor-core';
import {filterTree, mapTree} from 'amis';
import ACTION_TYPE_TREE from './renderer/event-control/actions';
import {ActionConfig, ComponentInfo} from './renderer/event-control/types';
import {
  COMMON_ACTION_SCHEMA_MAP,
  findActionNode,
  findSubActionNode,
  FORMITEM_CMPTS,
  getActionType,
  getPropOfAcion,
  hasActionType
} from './renderer/event-control/helper';

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
  const commonActionConfig = {
    ...COMMON_ACTION_SCHEMA_MAP,
    ...commonActions
  };
  return {
    showOldEntry:
    manager?.config.actionOptions?.showOldEntry !== false &&
    (!!context.schema.actionType ||
      ['submit', 'reset'].includes(context.schema.type)),
    actions: manager?.pluginActions,
    events: manager?.pluginEvents,
    actionTree,
    commonActions,
    owner: '',
    addBroadcast: manager?.addBroadcast,
    removeBroadcast: manager?.removeBroadcast,
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
      const actionType = action.actionType!;
      const components = filterTree(
        mapTree(
          manager?.store?.outline ?? [],
          (item: any) => {
            const schema = manager?.store?.getSchema(item.id);
            return {
              id: item.id,
              label: item.label,
              value: schema?.id ?? item.id,
              type: schema?.type ?? item.type,
              schema,
              disabled: !!item.region,
              children: item?.children
            };
          },
          1,
          true
        ),
        node => {
          const actions = manager?.pluginActions[node.type];
          let isSupport = false;
          if (typeof action.supportComponents === 'string') {
            isSupport =
              action.supportComponents === '*' ||
              action.supportComponents === node.type;
          } else if (Array.isArray(action.supportComponents)) {
            isSupport = action.supportComponents.includes(node.type);
          }
          if (['reload', 'setValue'].includes(actionType)) {
            isSupport = hasActionType(actionType, actions);
          }

          if (actionType === 'component' && !actions?.length) {
            node.disabled = true;
          }

          if (isSupport) {
            return true;
          } else if (!isSupport && !!node.children?.length) {
            node.disabled = true;
            return true;
          }
          return false;
        },
        1,
        true
      );

      return components;
    },
    actionConfigInitFormatter: (action: ActionConfig) => {
      let config = {...action};

      if (
        ['setValue', 'url', 'link'].includes(action.actionType) &&
        action.args
      ) {
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

      return {
        ...config,
        actionType: getActionType(action, hasSubActionNode)
      };
    },
    actionConfigSubmitFormatter: (config: ActionConfig) => {
      let action = {...config};
      action.__title = findActionNode(
        actionTree,
        config.actionType
      )?.actionLabel;

      // 修正动作名称
      if (config.actionType === 'component') {
        // 标记一下组件特性动作
        action.__isCmptAction = true;
        action.actionType = config.__cmptActionType;
      }
      const hasSubActionNode = findSubActionNode(
        actionTree,
        config.__cmptActionType
      );
      if (hasSubActionNode) {
        // 修正动作
        action.actionType = config.__cmptActionType;
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
      if (['setValue', 'url', 'link'].includes(action.actionType)) {
        const propName = action.actionType === 'setValue' ? 'value' : 'params';

        if (Array.isArray(config.args?.[propName])) {
          action.args = action.args ?? {};
          if (action.__rendererName === 'combo') {
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
        } else if (action.actionType === 'setValue') {
          // 处理变量赋值非数组的情况
          action.args = {
            ...action.args,
            value: config.args?.['valueInput']
          };
        }
      }

      delete action.config;

      return action;
    }
  };
};
