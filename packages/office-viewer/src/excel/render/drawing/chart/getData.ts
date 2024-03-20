import {CT_NumDataSource} from '../../../../openxml/ChartTypes';
import {Workbook} from '../../../Workbook';

/**
 * 获取数据，目前只从 cache 里获取，后续改成动态获取
 */
export function getData(workbook: Workbook, val?: CT_NumDataSource) {
  const ref = val?.numRef?.f;
  if (!ref) {
    return [];
  }
  const seriesData = (val?.numRef?.numCache?.pt || []).map(pt => {
    return parseFloat(pt.v!);
  });
  return seriesData;
}
