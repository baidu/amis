import {CT_ChartSpace} from '../../openxml/ChartTypes';

export type IChartSpace = CT_ChartSpace & {
  /**
   * 图表全局 id，这个是为了渲染的时候标识是哪个图表
   */
  gid: string;
};
