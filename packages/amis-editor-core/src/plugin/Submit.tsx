import {registerEditorPlugin} from '../manager';
import {ButtonPlugin} from './Button';

export class SubmitPlugin extends ButtonPlugin {
  // 关联渲染器名字
  rendererName = 'submit';
  disabledRendererPlugin = true; // 组件面板不显示
  // 组件名称
  name = '提交';
  isBaseComponent = true;
  description = '用来提交表单，要求表单验证，如果在弹窗中会自动关闭弹窗。';
  panelTitle = '按钮';
  scaffold: any = {
    type: 'submit',
    label: '提交',
    level: 'primary'
  };
  previewSchema = {
    ...this.scaffold
  };
}

registerEditorPlugin(SubmitPlugin);
