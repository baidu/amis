/**
 * 解析 [Content_Types].xml
 */

interface Override {
  partName: string;
  contentType: string;
}

export interface ContentTypes {
  overrides: Override[];
}

export function parseContentType(data: any) {
  const types: ContentTypes = {overrides: []};
  const typesData = data['Types'];
  if (typesData) {
    const overrideData = typesData['Override'];
    if (overrideData) {
      types.overrides = overrideData.map((item: any) => {
        return {
          partName: item['@_PartName'],
          contentType: item['@_ContentType']
        };
      });
    }
  }

  return types;
}
