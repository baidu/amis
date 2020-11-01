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
      controls: buildOptions('legend', legendOptions)
    },
    {
      title: '位置',
      controls: [viewport('legend', '标题')]
    },
    {
      title: '样式',
      controls: commonStyle('legend', '标题')
    },
    {
      title: '文字样式',
      controls: [
        textStyleControls('legend.textStyle', '图例'),
        textStyleControls('legend.pageTextStyle', '图例页信息')
      ]
    },
    {
      title: '数据',
      controls: [createHierarchy('legend', [])]
    }
  ]
};
