import {autoParse} from '../../../common/autoParse';
import {CT_Table, CT_Table_Attributes} from '../../../openxml/ExcelTypes';
import {PackageParser} from '../../../package/PackageParser';
import {joinPath} from '../../../util/joinPath';
import {XMLNode, xml2json} from '../../../util/xml';
import {IRelationship} from '../../types/IRelationship';

export async function parseTableParts(
  worksheetPath: string,
  parser: PackageParser,
  relationships: IRelationship[],
  tablePartsNode: XMLNode
) {
  const tables: CT_Table[] = [];

  for (const tableParts of tablePartsNode.children || []) {
    const rId = tableParts.attrs['r:id'];

    const relationship = relationships.find(
      relationship => relationship.id === rId
    );
    if (relationship) {
      const target = relationship.target;
      const path = joinPath(worksheetPath, '..', target);
      const tableXML = parser.getString(path);
      const tableNode = await xml2json(tableXML);
      tables.push(autoParse(tableNode, CT_Table_Attributes));
    }
  }
  return tables;
}
