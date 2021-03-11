export default {
  type: 'page',
  title: '选项卡3页面',
  body: [
    '<p>也可以多个页面，利用导航<code>nav</code>渲染期模拟 tabs 的效果。</p>',

    {
      type: 'nav',
      links: [
        {
          label: '选项卡1',
          icon: 'fa fa-cloud',
          to: './tab1'
        },

        {
          label: '选项卡2',
          to: './tab2'
        },

        {
          label: '选项卡3',
          icon: 'fa fa-youtube',
          to: './tab3'
        }
      ]
    },

    {
      type: 'wrapper',
      className: 'wrapper bg-white b-l b-b b-r',
      body: {
        type: 'chart',
        config: {
          title: {
            text: '极坐标双数值轴'
          },
          legend: {
            data: ['line']
          },
          polar: {
            center: ['50%', '54%']
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          angleAxis: {
            type: 'value',
            startAngle: 0
          },
          radiusAxis: {
            min: 0
          },
          series: [
            {
              coordinateSystem: 'polar',
              name: 'line',
              type: 'line',
              showSymbol: false,
              data: [
                [0, 0],
                [0.03487823687206265, 1],
                [0.06958655048003272, 2],
                [0.10395584540887964, 3],
                [0.13781867790849958, 4],
                [0.17101007166283433, 5],
                [0.2033683215379001, 6],
                [0.2347357813929454, 7],
                [0.26495963211660245, 8],
                [0.2938926261462365, 9],
                [0.3213938048432697, 10]
              ]
            }
          ],
          animationDuration: 2000
        }
      }
    }
  ]
};
