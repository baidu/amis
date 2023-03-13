/**
 * 目的是统一内部的 xml 解析格式
 */

export function parseXML(content: string) {
  return new DOMParser().parseFromString(content, 'application/xml');
}

export function buildXML(doc: Document) {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}
