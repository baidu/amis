import {registerEditorPlugin} from 'amis-editor-core';

import {DateControlPlugin} from './InputDate';

export class YearControlPlugin extends DateControlPlugin {
  static id = 'YearControlPlugin';
  // 关联渲染器名字
  rendererName = 'input-year';
  $schema = '/schemas/YearControlSchema.json';

  // 组件名称
  name = 'Year';
  isBaseComponent = true;
  icon = 'fa fa-calendar';
  pluginIcon = 'input-year-plugin';
  description = '年选择';
  docLink = '/amis/zh-CN/components/form/input-year';
  tags = ['表单项'];
  // @ts-ignore
  scaffold = {
    type: 'input-year',
    name: 'year'
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

  panelTitle = 'Year';
}

registerEditorPlugin(YearControlPlugin);
