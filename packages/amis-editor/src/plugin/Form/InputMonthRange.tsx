import {registerEditorPlugin} from 'amis-editor-core';

import {DateRangeControlPlugin} from './InputDateRange';

export class MonthRangeControlPlugin extends DateRangeControlPlugin {
  // 关联渲染器名字
  rendererName = 'input-month-range';
  $schema = '/schemas/MonthRangeControlSchema.json';

  order = -440;

  // 组件名称
  icon = 'fa fa-calendar';
  name = '月份范围';
  isBaseComponent = true;
  description =
    '月份范围选择，可通过<code>minDate</code>、<code>maxDate</code>设定最小、最大日期';
  docLink = '/amis/zh-CN/components/form/input-month-range';
  tags = ['表单项'];
  scaffold = {
    type: 'input-month-range',
    label: '日期范围',
    name: 'month-range'
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

registerEditorPlugin(MonthRangeControlPlugin);
