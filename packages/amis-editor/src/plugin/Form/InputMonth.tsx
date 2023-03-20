import {registerEditorPlugin} from 'amis-editor-core';

import {DateControlPlugin} from './InputDate';

export class MonthControlPlugin extends DateControlPlugin {
  // 关联渲染器名字
  rendererName = 'input-month';
  $schema = '/schemas/MonthControlSchema.json';

  // 组件名称
  name = '日期';
  isBaseComponent = true;
  pluginIcon = 'inputMonth-plugin';
  icon = 'fa fa-calendar';
  description = '月份选择';
  docLink = '/amis/zh-CN/components/form/input-month';
  tags = ['表单项'];
  // @ts-ignore
  scaffold = {
    type: 'input-month',
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

  panelTitle = 'Month';
}

registerEditorPlugin(MonthControlPlugin);
