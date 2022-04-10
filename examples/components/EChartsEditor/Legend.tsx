/**
 * @file Echarts legend 的配置
 */
import {
  textStyleControls,
  buildOptions,
  createHierarchy,
  commonStyle,
  viewport
} from './Common';

//@ts-ignore
const legendOptions = __inline('./option-parts/option.legend.json');

export default {
  type: 'tabs',
  tabs: [
    {
      title: '基础',
      className: 'echarts-tab',
      body: [createHierarchy('legend', buildOptions('', legendOptions))]
    },
    {
      title: '位置',
      body: [createHierarchy('legend', [viewport('', '图例')])]
    },
    {
      title: '样式',
      body: [createHierarchy('legend', commonStyle('', '图例'))]
    },
    {
      title: '文字样式',
      body: [
        createHierarchy('legend', [
          textStyleControls('textStyle', '图例'),
          textStyleControls('pageTextStyle', '图例页信息')
        ])
      ]
    },
    {
      title: '数据',
      body: [createHierarchy('legend', [])]
    }
  ]
};
