import {registerEditorPlugin} from 'amis-editor-core';

import {DateRangeControlPlugin} from './InputDateRange';

export class YearRangeControlPlugin extends DateRangeControlPlugin {
  // 关联渲染器名字
  rendererName = 'input-year-range';
  $schema = '/schemas/DateRangeControlSchema.json';

  order = -440;

  // 组件名称
  icon = 'fa fa-calendar';
  pluginIcon = 'input-month-range-plugin';
  name = '日期范围';
  isBaseComponent = true;
  description =
    '年份范围选择，可通过<code>minDate</code>、<code>maxDate</code>设定最小、最大日期';
  docLink = '/amis/zh-CN/components/form/year-range';
  tags = ['表单项'];
  scaffold = {
    type: 'input-year-range',
    label: '日期范围',
    name: 'year-range'
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

registerEditorPlugin(YearRangeControlPlugin);
