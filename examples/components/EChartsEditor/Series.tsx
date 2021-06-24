/**
 * @file 各种图表的配置
 */

import {buildOptions, select} from './Common';

//@ts-ignore
const lineOptions = __inline('./option-parts/option.series-line.json');
//@ts-ignore
const barOptions = __inline('./option-parts/option.series-bar.json');
//@ts-ignore
const pieOptions = __inline('./option-parts/option.series-pie.json');
//@ts-ignore
const gaugeOptions = __inline('./option-parts/option.series-gauge.json');
//@ts-ignore
const funnelOptions = __inline('./option-parts/option.series-funnel.json');
//@ts-ignore
const radarOptions = __inline('./option-parts/option.series-radar.json');

const buildSerieOptions = (type: string, options: any) => {
  return {
    type: 'container',
    visibleOn: `this.type == "${type}"`,
    body: buildOptions('', options)
  };
};

export default {
  type: 'combo',
  name: 'series',
  tabsMode: true,
  tabsLabelTpl: '系列${index|plus}',
  lazyLoad: true,
  label: '',
  multiLine: true,
  multiple: true,
  addButtonText: '新增系列',
  items: [
    select('type', '图表类型', [
      'line',
      'bar',
      'pie',
      'radar',
      'funnel',
      'gauge'
    ]),
    {
      type: 'input-array',
      name: 'data', //TODO: 目前只支持一维
      label: '数据',
      items: {
        type: 'input-number'
      }
    },
    buildSerieOptions('line', lineOptions),
    buildSerieOptions('bar', barOptions),
    buildSerieOptions('pie', pieOptions),
    buildSerieOptions('funnel', funnelOptions),
    buildSerieOptions('gauge', gaugeOptions),
    buildSerieOptions('radar', radarOptions)
  ]
};
