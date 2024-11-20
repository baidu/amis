import {RendererPluginAction, EditorManager} from 'amis-editor-core';
const builtInActionsPanel: Array<RendererPluginAction> = [];

export interface ActionLeftPanelTree {
  actionType?: string;
  actionLabel?: string;
  children?: RendererPluginAction | Array<RendererPluginAction>;
}

type ActionPanel = Omit<RendererPluginAction, 'actionType' | 'actionLabel'> & {
  label: string;
  tag: string;
};

/**
 * 构建actionTypeTree 数据结构
 *
 * @param actionPanel
 */

const builtInActionPanelData = (
  actionType: string,
  actionPanel: ActionPanel | undefined
) => {
  const {label, description, ...rest} = actionPanel || {};
  return {
    actionType,
    actionLabel: label,
    description,
    ...rest
  };
};

/**
 * 注册动作面板插件
 *
 * @param actionPanel
 */
export const registerActionPanel = (
  actionType: string,
  actionPanel?: ActionPanel
) => {
  const {label, tag} = actionPanel || {};
  if (!actionType) {
    console.warn(`actionType 不能为空`);
    return;
  }
  if (!label || !tag) {
    console.warn(`label 或 tag 不能为空`);
    return;
  }

  if (builtInActionsPanel.length === 0) {
    builtInActionsPanel.push({
      actionType: tag,
      actionLabel: tag,
      children: [builtInActionPanelData(actionType, actionPanel)]
    });
    return;
  }

  const idx = builtInActionsPanel.findIndex(item => item.actionType === tag);
  if (idx === -1) {
    builtInActionsPanel.push({
      actionType: tag,
      actionLabel: tag,
      children: [builtInActionPanelData(actionType, actionPanel)]
    });
  } else {
    const subActionsPanel = builtInActionsPanel[idx]?.children || [];
    const idx2 = subActionsPanel.findIndex(
      item => item.actionType === actionType
    );
    const processData = builtInActionPanelData(actionType, actionPanel);
    if (idx2 === -1) {
      subActionsPanel.push(processData);
    } else {
      console.warn(
        `存在actionType：${actionType}相同的动作面板，将会覆盖原有的动作面板`
      );
      subActionsPanel.splice(idx2, 1, processData);
    }
  }
};

/**
 * 注销动作面板插件
 *
 * @param actionType
 */
export const unRegisterActionsPanel = (actionType: string | string[]) => {
  if (!Array.isArray(actionType)) {
    actionType = [actionType];
  }

  actionType.forEach(type => {
    builtInActionsPanel.forEach((item, index) => {
      item.children?.forEach((subItem, index) => {
        if (subItem.actionType === type) {
          subItem.children?.splice(index, 1);
        }
      });
    });
  });
};

export const ACTION_TYPE_TREE = (
  manager: EditorManager
): RendererPluginAction[] => {
  return builtInActionsPanel;
};
