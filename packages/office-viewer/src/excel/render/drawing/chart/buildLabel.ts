import {CT_DLbls} from '../../../../openxml/ChartTypes';

export function buildLabel(dLbls?: CT_DLbls) {
  let label = {} as echarts.EChartOption.SeriesLine['label'];

  if (dLbls) {
    // todo: 目前解析漏掉了 EG_DLblShared
  }

  return label;
}
