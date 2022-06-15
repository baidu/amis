import {registerEditorPlugin} from 'amis-editor-core';

import {DateRangeControlPlugin} from './InputDateRange';

export class QuarterRangePlugin extends DateRangeControlPlugin {
  // 关联渲染器名字
  rendererName = 'input-quarter-range';
  $schema = '/schemas/MonthRangeControlSchema.json';

  order = -440;

  // 组件名称
  icon = 'fa fa-calendar';
  name = '季度范围';
  isBaseComponent = true;
  description =
    '月份范围选择，可通过<code>minDate</code>、<code>maxDate</code>设定最小、最大日期';
  docLink = '/amis/zh-CN/components/form/input-quarter-range';
  tags = ['表单项'];
  scaffold = {
    type: 'input-quarter-range',
    label: '日期范围',
    name: 'quarter-range'
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

registerEditorPlugin(QuarterRangePlugin);
