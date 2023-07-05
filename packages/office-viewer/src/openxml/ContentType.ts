interface Override {
  partName: string;
  contentType: string;
}

export interface ContentTypes {
  overrides: Override[];
}

/**
 * 解析 [Content_Types].xml
 */
export function parseContentType(doc: Document) {
  const types: ContentTypes = {overrides: []};
  const overrides = [].slice.call(doc.getElementsByTagName('Override'));
  for (const item of overrides) {
    types.overrides.push({
      partName: item.getAttribute('PartName') as string,
      contentType: item.getAttribute('ContentType') as string
    });
  }
  return types;
}
