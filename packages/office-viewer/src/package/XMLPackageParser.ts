/**
 * openxml 默认是 zip 格式，导致构造比较麻烦，所以增加了这种单一格式，所有内容都放在一个 xml 文件里
 */

import JSZip from 'jszip';

import {buildXML, parseXML} from '../util/xml';
import {PackageParser} from './PackageParser';

export default class XMLPackageParser implements PackageParser {
  private xml: Document;
  private files: Record<string, Element> = {};
  private contentTypesDoc: Document;

  /**
   * 加载 zip 文件
   */
  async load(fileContent: Blob | string) {
    if (fileContent instanceof Blob) {
      fileContent = await fileContent.text();
    }
    this.xml = new DOMParser().parseFromString(fileContent, 'application/xml');
    const errorNode = this.xml.querySelector('parsererror');
    if (errorNode) {
      throw new Error(errorNode.textContent || "can't parse xml");
    }
    let overrides = [];
    const parts = this.xml.getElementsByTagName('pkg:part');
    for (const part of parts) {
      const name = part.getAttribute('pkg:name')!;
      const contentType = part.getAttribute('pkg:contentType')!;
      this.files[name] = part.firstElementChild!.firstElementChild!;
      overrides.push(
        `<Override PartName="${name}" ContentType="${contentType}" />`
      );
    }

    const contentTypes = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="gif" ContentType="image/gif"/>
  <Default Extension="png" ContentType="image/png"/>
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  ${overrides.join('\n')}
</Types>`.trim();

    this.contentTypesDoc = parseXML(contentTypes);
  }

  /**
   * 读取 xml 文件，转成 json 对象
   * @param filePath 文件路径
   * @returns 转成 json 的结果
   */
  async getXML(filePath: string): Promise<Document> {
    if (filePath === '[Content_Types].xml') {
      return this.contentTypesDoc;
    }
    if (!filePath.startsWith('/')) {
      filePath = '/' + filePath;
    }
    if (filePath in this.files) {
      // 因为基本上都是使用 query 接口，所以当成 document 没问题的
      return this.files[filePath] as unknown as Document;
    }
    throw new Error('file not found: ' + filePath);
  }

  /**
   * 在 xml 下基本不用这个
   */
  async getFileByType(filePath: string, type: 'string' | 'blob' | 'base64') {
    return '';
  }

  /**
   * 判断文件是否存在
   */
  fileExists(filePath: string) {
    if (!filePath.startsWith('/')) {
      filePath = '/' + filePath;
    }
    return filePath in this.files;
  }

  /**
   * 生成 zip 文件
   */
  async generateZip(docContent: string) {
    const zip = JSZip();

    zip.file('[Content_Types].xml', buildXML(this.contentTypesDoc));

    for (const filePath in this.files) {
      // 目前只支持 xml 文件
      zip.file(filePath, buildXML(this.files[filePath] as unknown as Document));
    }

    zip.file('word/document.xml', docContent);

    return zip.generateAsync({
      type: 'blob'
    });
  }
}
