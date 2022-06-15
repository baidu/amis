import {registerEditorPlugin} from 'amis-editor-core';

import {DateControlPlugin} from './InputDate';

export class DateTimeControlPlugin extends DateControlPlugin {
  // 关联渲染器名字
  rendererName = 'input-datetime';
  $schema = '/schemas/DateTimeControlSchema.json';

  // 组件名称
  isBaseComponent = true;
  icon = 'fa fa-calendar';
  name = '日期时间';
  description = '年月日时分选择';
  docLink = '/amis/zh-CN/components/form/input-datetime';
  tags = ['表单项'];
  scaffold = {
    type: 'input-datetime',
    label: '日期时间',
    name: 'datetime'
  };

  disabledRendererPlugin = true;
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  panelTitle = '日期时间';
}

registerEditorPlugin(DateTimeControlPlugin);
