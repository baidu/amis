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
  doc.querySelectorAll('Override').forEach((item: Element) => {
    types.overrides.push({
      partName: item.getAttribute('PartName') as string,
      contentType: item.getAttribute('ContentType') as string
    });
  });
  return types;
}
