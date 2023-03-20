import {registerEditorPlugin} from 'amis-editor-core';

import {DateRangeControlPlugin} from './InputDateRange';

export class DateTimeRangeControlPlugin extends DateRangeControlPlugin {
  // 关联渲染器名字
  rendererName = 'input-datetime-range';
  $schema = '/schemas/DateTimeRangeControlSchema.json';

  order = -440;

  // 组件名称
  icon = 'fa fa-calendar';
  pluginIcon = 'input-date-range-plugin';
  name = '日期时间范围';
  isBaseComponent = true;
  description =
    '日期时间范围选择，可通过<code>minDate</code>、<code>maxDate</code>设定最小、最大日期';
  docLink = '/amis/zh-CN/components/form/input-datetime-range';
  tags = ['表单项'];
  scaffold = {
    type: 'input-datetime-range',
    label: '日期范围',
    name: 'datetime-range'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  disabledRendererPlugin = true;
  notRenderFormZone = true;
}

registerEditorPlugin(DateTimeRangeControlPlugin);
