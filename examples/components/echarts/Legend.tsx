/**
 * @file Echarts legend 的配置
 */
import {
  textStyleControls,
  numberOrArray,
  shadowControls,
  color,
  number,
  padding,
  width,
  height,
  trueSwitch,
  visibleOn,
  fieldSet,
  origin,
  select,
  viewport,
  formatter,
  selectedMode,
  createHierarchy
} from './Common';

export default {
  type: 'tabs',
  tabs: [
    {
      title: '基础',
      controls: [
        createHierarchy('title', [
          trueSwitch('show', '是否显示标题组件'),
          visibleOn('data.show || typeof data.show === "undefined"', [
            select('type', '图例的类型', [
              {label: '普通图例', value: 'plain'},
              {label: '可滚动翻页的图例', value: 'scroll'}
            ]),
            visibleOn('data.type === "scroll"', [fieldSet('滚动翻页设置', [])]),
            width('图例'),
            height('图例'),
            viewport('图例'),
            origin('图例'),
            select('align', `图例的对齐`, ['auto', 'left', 'right']),
            ...padding('图例'),
            number('itemGap', '主副标题之间的间距'),
            number('itemWidth', '图例标记的图形宽度'),
            number('itemHeight', '图例标记的图形高度'),
            trueSwitch('symbolKeepAspect', '是否在缩放时保持该图形的长宽比'),
            formatter('图例'),
            selectedMode('图例')
          ])
        ])
      ]
    },
    {
      title: '样式',
      controls: []
    },
    {
      title: '文字样式',
      controls: []
    },
    {
      title: '数据',
      controls: []
    }
  ]
};
