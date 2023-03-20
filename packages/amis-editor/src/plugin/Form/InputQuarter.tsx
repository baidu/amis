import {registerEditorPlugin} from 'amis-editor-core';

import {DateControlPlugin} from './InputDate';

export class InputQuarterPlugin extends DateControlPlugin {
  // 关联渲染器名字
  rendererName = 'input-quarter';
  $schema = '/schemas/QuarterControlSchema.json';

  // 组件名称
  name = '季度';
  isBaseComponent = true;
  icon = 'fa fa-calendar';
  pluginIcon = 'input-quarter-plugin';
  description = '季度选择';
  docLink = '/amis/zh-CN/components/form/input-quarter';
  tags = ['表单项'];
  // @ts-ignore
  scaffold = {
    type: 'input-quarter',
    name: 'month'
  };

  disabledRendererPlugin = true;
  previewSchema: any = {
    type: 'form',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  panelTitle = 'Quarter';
}

registerEditorPlugin(InputQuarterPlugin);
