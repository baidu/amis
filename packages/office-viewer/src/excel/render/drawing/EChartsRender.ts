import type echarts from 'echarts';
import {BaseDrawingRender} from './BaseDrawingRender';
import {Rect} from '../Rect';

export class EChartsRender extends BaseDrawingRender {
  constructor(container: HTMLElement, displayRect: Rect, gid: string) {
    super(container, displayRect, gid, 'excel-chart');
  }

  render(option: echarts.EChartOption) {
    import('echarts').then(echarts => {
      // @ts-ignore 奇怪为啥不对
      const chart = echarts.init(this.drawingContainer);
      chart.setOption(option);
    });
  }
}
