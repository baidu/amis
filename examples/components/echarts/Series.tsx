/**
 * @file 各种图表的配置
 */

import {buildOptions, select} from './Common';

//@ts-ignore
const lineOptions = __inline('./option-parts/option.series-line.json');

const buildSerieOptions = (type: string, options: any) => {
  return {
    type: 'container',
    visibleOn: `this.type === ${type}`,
    controls: buildOptions('', options)
  };
};

export default {
  type: 'tabs',
  tabs: [
    {
      title: '系列',
      controls: [
        {
          type: 'combo',
          name: 'series',
          label: '',
          multiLine: true,
          multiple: true,
          addButtonText: '新增系列',
          controls: [
            select('type', '图表类型', ['line', 'bar']),
            buildSerieOptions('line', lineOptions),
            {
              type: 'array',
              name: 'data', //TODO: 目前只支持一维
              label: '数据',
              items: {
                type: 'number'
              }
            }
          ]
        }
      ]
    }
  ]
};
