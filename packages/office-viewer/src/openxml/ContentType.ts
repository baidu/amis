/**
 * 解析 [Content_Types].xml
 */

import {XMLData, Tag, Attr} from '../OpenXML';

interface Override {
  partName: string;
  contentType: string;
}

export interface ContentTypes {
  overrides: Override[];
}

export function parseContentType(data: XMLData) {
  const types: ContentTypes = {overrides: []};
  const typesData = data[Tag.Types];
  if (typeof typesData === 'object' && !Array.isArray(typesData)) {
    const overrideData = typesData[Tag.Override];
    if (Array.isArray(overrideData)) {
      types.overrides = overrideData.map((item: XMLData) => {
        return {
          partName: item[Attr.PartName] as string,
          contentType: item[Attr.ContentType] as string
        };
      });
    }
  }

  return types;
}
