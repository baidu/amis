/**
 * 目的是统一内部的 xml 解析格式
 */

import {XMLParser, XMLBuilder} from 'fast-xml-parser';

export const XMLOptions = {
  ignoreAttributes: false,
  allowBooleanAttributes: true,
  trimValues: false,
  preserveOrder: true,
  alwaysCreateTextNode: true
};

const parser = new XMLParser(XMLOptions);

const builder = new XMLBuilder(XMLOptions);

export function parseXML(content: string) {
  return parser.parse(content);
}

export function buildXML(content: string) {
  return builder.build(content);
}
