import {autoParse} from '../../../../common/autoParse';
import {
  CT_ChartSpace,
  CT_ChartSpace_Attributes
} from '../../../../openxml/ChartTypes';
import {XMLNode} from '../../../../util/xml';
import {IChartSpace} from '../../../types/IChartSpace';

let chartId = 0;

export function parseChart(node: XMLNode) {
  const chart = autoParse(node, CT_ChartSpace_Attributes) as IChartSpace;
  chart.gid = `chart${chartId++}`;
  return chart;
}
