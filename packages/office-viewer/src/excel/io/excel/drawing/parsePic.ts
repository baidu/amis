import {autoParse} from '../../../../common/autoParse';
import {CT_Picture_Attributes} from '../../../../openxml/ExcelTypes';
import {PackageParser} from '../../../../package/PackageParser';
import {joinPath} from '../../../../util/joinPath';
import {XMLNode} from '../../../../util/xml';
import {IRelationship} from '../../../types/IRelationship';
import {getRelationPath} from './getRelationPath';

let picId = 0;

export function parsePic(
  child: XMLNode,
  relationships: IRelationship[],
  parser: PackageParser,
  drawingPath: string
) {
  const pic = autoParse(child, CT_Picture_Attributes);
  const embedId = pic.blipFill?.blip?.['r:embed'];
  if (embedId) {
    const imagePath = getRelationPath(drawingPath, relationships, embedId);
    if (imagePath) {
      const data = parser.getFileByType(imagePath, 'blob');
      if (data && URL.createObjectURL) {
        pic.imgURL = URL.createObjectURL(data as Blob);
        pic.gid = `pic-${picId++}`;
      }
    }
  }
  return pic;
}
