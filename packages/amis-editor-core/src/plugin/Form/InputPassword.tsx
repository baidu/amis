import {registerEditorPlugin} from '../../manager';
import {TextControlPlugin} from './InputText';

export class PasswordControlPlugin extends TextControlPlugin {
  // 关联渲染器名字
  rendererName = 'input-password';
  $schema = '/schemas/TextControlSchema.json';
  name = '密码框';
  isBaseComponent = true;
  icon = 'fa fa-asterisk';

  description = '验证输入是否符合邮箱的格式';

  scaffold = {
    type: 'input-password',
    label: '密码',
    name: 'password'
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

  panelTitle = this.name;
}

registerEditorPlugin(PasswordControlPlugin);
