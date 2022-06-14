import {registerEditorPlugin} from '../../manager';
import {TextControlPlugin} from './InputText';

export class URLControlPlugin extends TextControlPlugin {
  // 关联渲染器名字
  rendererName = 'input-url';
  $schema = '/schemas/TextControlSchema.json';
  name = 'URL输入框';
  isBaseComponent = true;
  icon = 'fa fa-link';

  description = '验证输入是否为合法的 URL';
  docLink = '/amis/zh-CN/components/form/input-url';

  scaffold = {
    type: 'input-url',
    label: '链接',
    name: 'url'
  };

  disabledRendererPlugin = true;

  previewSchema = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: {
      ...this.scaffold
    }
  };

  panelTitle = 'URL';
}

registerEditorPlugin(URLControlPlugin);
