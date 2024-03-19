import {autoParse} from '../../../../common/autoParse';
import {parseRelationship} from '../../../../common/parseRelationship';
import {
  CT_AbsoluteAnchor_Attributes,
  CT_OneCellAnchor_Attributes,
  CT_Picture_Attributes,
  CT_TwoCellAnchor_Attributes
} from '../../../../openxml/ExcelTypes';
import {PackageParser} from '../../../../package/PackageParser';
import {joinPath} from '../../../../util/joinPath';
import {parseXML, xml2json} from '../../../../util/xml';
import {IDrawing} from '../../../types/IDrawing';
import {IRelationship} from '../../../types/IRelationship';
import {IWorkbook} from '../../../types/IWorkbook';
import {getRelPath} from '../getRelPath';
import {parseAnchorCommon} from './parseAnchorCommon';

/**
 * 解析 xl/drawings/drawing1.xml 文件
 * P3155
 */
export async function parseDrawing(
  workbook: IWorkbook,
  parser: PackageParser,
  drawingPath: string
) {
  const drawing: IDrawing = {
    oneCellAnchors: [],
    twoCellAnchors: [],
    absoluteAnchors: []
  };
  const drawingXML = parser.getString(drawingPath);

  let relationships: IRelationship[] = [];

  const drawingRelationPath = getRelPath(drawingPath);

  if (parser.fileExists(drawingRelationPath)) {
    relationships = await parseRelationship(
      parser.getString(drawingRelationPath)
    );
  }

  const node = await xml2json(drawingXML);

  // 因为要用到 Word 里之前的方法，而之前的方法是使用 DOMParser 的，所以这里也用 DOMParser，后面再统一成 xml2json 版本
  const nodeElement = parseXML(drawingXML);

  const oneCellAnchorElements =
    nodeElement.getElementsByTagName('xdr:oneCellAnchor');

  const twoCellAnchorElements =
    nodeElement.getElementsByTagName('xdr:twoCellAnchor');

  const absoluteAnchorElements =
    nodeElement.getElementsByTagName('xdr:absoluteAnchor');

  for (const [index, drawingNode] of (node.children || []).entries()) {
    const childTag = drawingNode.tag;
    switch (childTag) {
      case 'xdr:oneCellAnchor':
        const oneCellAnchor = autoParse(
          drawingNode,
          CT_OneCellAnchor_Attributes
        );

        const oneCellAnchorElement = oneCellAnchorElements[index];

        await parseAnchorCommon(
          workbook,
          parser,
          drawingPath,
          drawingNode,
          relationships,
          oneCellAnchor,
          oneCellAnchorElement
        );

        drawing.oneCellAnchors.push(oneCellAnchor);
        break;

      case 'xdr:twoCellAnchor':
        // 不知为何这个定义里不包含 pic
        const twoCellAnchor = autoParse(
          drawingNode,
          CT_TwoCellAnchor_Attributes
        );

        const twoCellAnchorElement = twoCellAnchorElements[index];

        await parseAnchorCommon(
          workbook,
          parser,
          drawingPath,
          drawingNode,
          relationships,
          twoCellAnchor,
          twoCellAnchorElement
        );
        drawing.twoCellAnchors.push(twoCellAnchor);
        break;

      case 'xdr:absoluteAnchor':
        const absoluteAnchor = autoParse(
          drawingNode,
          CT_AbsoluteAnchor_Attributes
        );
        const absoluteAnchorElement = absoluteAnchorElements[index];
        await parseAnchorCommon(
          workbook,
          parser,
          drawingPath,
          drawingNode,
          relationships,
          absoluteAnchor,
          absoluteAnchorElement
        );
        drawing.absoluteAnchors.push(absoluteAnchor);
        break;

      default:
        console.warn(`unhandled tag: ${childTag}`);
    }
  }

  return drawing;
}
