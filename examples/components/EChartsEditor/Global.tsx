import {
  textStyleControls,
  animation,
  text,
  color,
  number,
  falseSwitch
} from './Common';

export default {
  type: 'tabs',
  tabs: [
    {
      title: '主题',
      body: [
        {
          type: 'input-array',
          name: 'color',
          label: '调色盘颜色列表',
          labelRemark:
            '如果系列没有设置颜色，则会依次循环从该列表中取颜色作为系列颜色',
          value: [
            '#c23531',
            '#2f4554',
            '#61a0a8',
            '#d48265',
            '#91c7ae',
            '#749f83',
            '#ca8622',
            '#bda29a',
            '#6e7074',
            '#546570',
            '#c4ccd3'
          ],
          items: {
            type: 'color'
          }
        },
        color('backgroundColor', '背景色') // TODO: 这里其实还支持多种类型 https://echarts.apache.org/zh/option.html#backgroundColor
      ]
    },
    {
      title: '动画',
      body: [animation(null, false)]
    },
    {
      title: '文字样式',
      body: [textStyleControls('textStyle', '全局文字')]
    },
    {
      title: '其它',
      body: [
        text(
          'blendMode',
          '图形的混合模式',
          '不同的混合模式见 https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation ',
          'source-over'
        ),
        number(
          'hoverLayerThreshold',
          '图形数量阈值',
          '决定是否开启单独的 hover 层，在整个图表的图形数量大于该阈值时开启单独的 hover 层。单独的 hover 层主要是为了在高亮图形的时候不需要重绘整个图表，只需要把高亮的图形放入单独的一个 canvas 层进行绘制，防止在图形数量很多的时候因为高亮重绘所有图形导致卡顿',
          3000
        ),
        falseSwitch(
          'useUTC',
          '是否使用 UTC 时间',
          `true: 表示 axis.type 为 'time' 时，依据 UTC 时间确定 tick 位置，并且 axisLabel 和 tooltip 默认展示的是 UTC 时间。
      false: 表示 axis.type 为 'time' 时，依据本地时间确定 tick 位置，并且 axisLabel 和 tooltip 默认展示的是本地时间。
      默认取值为false，即使用本地时间。因为考虑到：

      很多情况下，需要展示为本地时间（无论服务器存储的是否为 UTC 时间）。
      如果 data 中的时间为 '2012-01-02' 这样的没有指定时区的时间表达式，往往意为本地时间。默认情况下，时间被展示时需要和输入一致而非有时差。`
        )
      ]
    }
  ]
};
