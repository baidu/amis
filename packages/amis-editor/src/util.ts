import {BaseEventContext, EditorManager} from 'amis-editor-core';
import ACTION_TYPE_TREE from './event-action/actions';
import {getActionConfigItemsMap} from './event-action/schema';
import {mapTree} from 'amis';

/**
 * 获取事件动作面板所需属性配置
 */
export const getEventControlConfig = (
  manager: EditorManager,
  context: BaseEventContext
) => ({
  actions: manager?.pluginActions,
  events: manager?.pluginEvents,
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
  getComponents: () =>
    mapTree(
      manager?.store?.outline ?? [],
      (item: any) => {
        const schema = manager?.store?.getSchema(item.id);
        return {
          id: item.id,
          label: item.label,
          value: schema.id || item.id,
          type: schema.type,
          schema,
          disabled: !!item.region,
          children: item?.children
        };
      },
      1,
      true
    ),
  actionTree: manager?.config.actionOptions?.actionTreeGetter
    ? manager?.config.actionOptions?.actionTreeGetter(ACTION_TYPE_TREE)
    : ACTION_TYPE_TREE,
  actionConfigItemsMap: {
    ...getActionConfigItemsMap(manager),
    ...manager?.config.actionOptions?.customActionGetter?.(manager)
  },
  owner: '',
  addBroadcast: manager?.addBroadcast,
  removeBroadcast: manager?.removeBroadcast
});
