import {registerEditorPlugin} from '../manager';
import {ButtonPlugin} from './Button';

export class ResetPlugin extends ButtonPlugin {
  // 关联渲染器名字
  rendererName = 'reset';
  disabledRendererPlugin = true; // 组件面板不显示
  // 组件名称
  name = '重置';
  isBaseComponent = true;
  icon = 'fa fa-eraser';
  description = '一般用来重置表单数据到初始值。';
  panelTitle = '按钮';
  scaffold: any = {
    type: 'reset',
    label: '重置'
  };
  previewSchema: any = {
    ...this.scaffold
  };
}

registerEditorPlugin(ResetPlugin);
