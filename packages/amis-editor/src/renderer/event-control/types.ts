import {ListenerAction} from 'amis-core';
import {RendererPluginAction} from 'amis-editor-core';

export interface ActionConfig extends ListenerAction {
  [propName: string]: any;
}

export interface ActionEventConfig {
  [propName: string]: {
    weight?: number; // 权重
    actions: ActionConfig[]; // 执行的动作集
    __isBroadcast?: boolean; // 区分一下广播事件
  };
}

// 组件树结构
export interface ComponentInfo {
  label: string;
  value: string;
  type: string;
  disabled?: boolean;
  actions?: RendererPluginAction[]; // 动作集
  children?: ComponentInfo[];
  id: string;
}

export interface ContextVariables {
  // 上下文公式变量
  label: string;
  value?: any;
  tag?: string | string[];
  children?: any[];
}
