import {registerEditorPlugin} from 'amis-editor-core';
import {DateControlPlugin} from './InputDate';

export class TimeControlPlugin extends DateControlPlugin {
  // 关联渲染器名字
  rendererName = 'input-time';
  $schema = '/schemas/TimeControlSchema.json';

  // 组件名称
  name = '时间框';
  isBaseComponent = true;
  icon = 'fa fa-clock-o';
  pluginIcon = 'input-time-plugin';
  description = `时分秒输入`;
  docLink = '/amis/zh-CN/components/form/input-time';
  tags = ['表单项'];
  scaffold = {
    type: 'input-time',
    label: '时间',
    name: 'time'
  };

  disabledRendererPlugin = true;
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: {
      ...this.scaffold
    }
  };

  panelTitle = '时间框';
}

registerEditorPlugin(TimeControlPlugin);
