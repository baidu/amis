import {PackageParser} from '../../../package/PackageParser';
import {xml2json} from '../../../util/xml';
import {IWorkbook} from '../../types/IWorkbook';

import {parseDefinedNames} from './parseDefinedNames';
import {parseSheets} from './parseSheet';
import {parseWorkbookPr} from './parseWorkbookPr';
import {parseWorkbookView} from './parseWorkbookView';
import {parseRelationship} from '../../../common/parseRelationship';
import {parseSharedStrings} from './parseSharedStrings';

import {CT_CalcPr_Attributes, CT_Stylesheet} from '../../../openxml/ExcelTypes';
import {parseTheme} from './parseTheme';
import {StringItem} from '../../types/StringItem';
import {autoParse} from '../../../common/autoParse';
import {defaultThemeString} from './preset/defaultTheme';

/**
 * 解析 WorkBook
 * @param xml workbook.xml 文件内容
 */
export async function parseWorkbook(
  parser: PackageParser,
  styleSheet: CT_Stylesheet
): Promise<IWorkbook> {
  // 理论上这里应该是通过 _rels/.rels 来获取，但这个文件位置几乎不会变，所以直接写死
  const workbookXML = parser.getString('xl/workbook.xml');

  // 这个要在前面，因为后面有些解析依赖这个数据
  const workbookRelationships = await parseRelationship(
    parser.getString('xl/_rels/workbook.xml.rels')
  );

  const node = await xml2json(workbookXML);

  const workbookPr = parseWorkbookPr(node);

  const workbookView = parseWorkbookView(node);

  let theme;

  if (parser.fileExists('xl/theme/theme1.xml')) {
    theme = await parseTheme(parser.getString('xl/theme/theme1.xml'));
  } else {
    theme = await parseTheme(defaultThemeString);
  }

  const workbook: IWorkbook = {
    sheets: [],
    workbookPr,
    workbookView,
    workbookRelationships,
    styleSheet,
    theme
  };

  let sharedStrings: StringItem[] = [];

  if (parser.fileExists('xl/sharedStrings.xml.json')) {
    sharedStrings = JSON.parse(parser.getString('xl/sharedStrings.xml.json'));
  } else if (parser.fileExists('xl/sharedStrings.xml')) {
    sharedStrings = await parseSharedStrings(
      parser.getString('xl/sharedStrings.xml')
    );
  }

  for (const child of node.children || []) {
    const tag = child.tag;
    switch (tag) {
      case 'sheets':
        workbook.sheets = await parseSheets(
          child,
          parser,
          workbook,
          sharedStrings
        );
        break;
      case 'calcPr':
        workbook.calcPr = autoParse(child, CT_CalcPr_Attributes);
        break;
      case 'definedNames':
        workbook.definedNames = parseDefinedNames(child);
        break;
    }
  }

  return workbook;
}
