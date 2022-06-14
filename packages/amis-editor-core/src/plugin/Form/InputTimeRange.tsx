import {registerEditorPlugin} from '../../manager';

import {DateRangeControlPlugin} from './InputDateRange';

export class TimeRangeControlPlugin extends DateRangeControlPlugin {
  // 关联渲染器名字
  rendererName = 'input-time-range';
  $schema = '/schemas/DateRangeControlSchema.json';

  order = -440;

  // 组件名称
  icon = 'fa fa-calendar';
  name = '日期范围';
  isBaseComponent = true;
  description =
    '时间范围选择，可通过<code>minDate</code>、<code>maxDate</code>设定最小、最大日期';
  docLink = '/amis/zh-CN/components/form/time-range';
  tags = ['表单项'];
  scaffold = {
    type: 'input-time-range',
    label: '日期范围',
    name: 'time-range'
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

registerEditorPlugin(TimeRangeControlPlugin);
