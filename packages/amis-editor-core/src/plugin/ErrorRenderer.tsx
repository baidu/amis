import {registerEditorPlugin} from '../manager';
import {BasePlugin} from '../plugin';

export class ErrorRendererPlugin extends BasePlugin {
  order = -9999;

  // 关联渲染器名字
  rendererName = 'error';

  // 组件名称
  name = 'Error';
  isBaseComponent = true;
}

registerEditorPlugin(ErrorRendererPlugin);
