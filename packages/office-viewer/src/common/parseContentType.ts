import {xml2json} from '../util/xml';
import {ContentTypes} from '../openxml/ContentType';
import {PackageParser} from '../package/PackageParser';

/**
 * 解析 [Content_Types].xml
 * @param xml
 */
export async function parseContentType(
  parser: PackageParser
): Promise<ContentTypes> {
  const xml = parser.getString('[Content_Types].xml');
  const contentType: ContentTypes = {overrides: [], defaults: []};
  const node = await xml2json(xml);

  for (const child of node.children || []) {
    if (child.tag === 'Override') {
      contentType.overrides.push({
        partName: child.attrs.PartName,
        contentType: child.attrs.ContentType
      });
    } else if (child.tag === 'Default') {
      contentType.defaults.push({
        extension: child.attrs.Extension,
        contentType: child.attrs.ContentType
      });
    }
  }

  return contentType;
}
