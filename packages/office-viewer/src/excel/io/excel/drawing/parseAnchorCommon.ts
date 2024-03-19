import {PackageParser} from '../../../../package/PackageParser';
import {XMLNode, getNodeByTagName, xml2json} from '../../../../util/xml';
import {IAnchorCommon} from '../../../types/IDrawing';
import {IRelationship} from '../../../types/IRelationship';
import {IWorkbook} from '../../../types/IWorkbook';
import {getRelationPath} from './getRelationPath';
import {parseChart} from './parseChart';
import {parsePic} from './parsePic';
import {parseShape} from './parseShape';

/**
 * 解析一些 anchor 的通用属性，这些属性大多需要读取另一个文件，所以直接在这里解析简化后续操作
 */
export async function parseAnchorCommon(
  workbook: IWorkbook,
  parser: PackageParser,
  drawingPath: string,
  drawingNode: XMLNode,
  relationships: IRelationship[],
  anchorCommon: IAnchorCommon,
  element: Element
) {
  for (const child of drawingNode.children || []) {
    const tag = child.tag;
    switch (tag) {
      case 'xdr:pic':
        anchorCommon.pic = parsePic(child, relationships, parser, drawingPath);
        break;

      case 'xdr:sp':
        anchorCommon.shape = parseShape(workbook, child, element);
        break;

      case 'xdr:from':
      case 'xdr:to':
      case 'xdr:clientData':
        // 这些前面已经自动解析了
        break;

      case 'xdr:graphicFrame':
        // 目就支持图表这种形式
        const chartNode = getNodeByTagName(child, 'c:chart', true);
        if (chartNode) {
          const chartPath = getRelationPath(
            drawingPath,
            relationships,
            chartNode.attrs['r:id']
          );
          if (chartPath) {
            const chartXML = await xml2json(parser.getString(chartPath));
            anchorCommon.chartSpace = parseChart(chartXML);
          }
        }
        break;

      default:
        console.warn(`unhandled tag: ${tag}`);
    }
  }
}
