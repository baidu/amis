/**
 * 解析 xml
 */
export function parseXML(content: string) {
  return new DOMParser().parseFromString(content, 'application/xml');
}

/**
 * 构建 xml 文本
 */
export function buildXML(doc: Node): string {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}
