/**
 * zip 文件解析
 */
import JSZip from 'jszip';

import {PackageParser} from './PackageParser';

export default class ZipPackageParser implements PackageParser {
  private zip: JSZip;

  /**
   * 加载 zip 文件
   */
  async load(docxFile: Blob | any) {
    this.zip = (await JSZip.loadAsync(docxFile)) as JSZip;
  }

  /**
   * 读取 xml 文件，转成 json 对象
   * @param filePath 文件路径
   * @returns 转成 json 的结果
   */
  async getXML(filePath: string): Promise<Document> {
    const fileContent = (await this.getFileByType(
      filePath,
      'string'
    )) as string;

    const doc = new DOMParser().parseFromString(fileContent, 'application/xml');

    const errorNode = doc.querySelector('parsererror');
    if (errorNode) {
      throw new Error(errorNode.textContent || "can't parse xml");
    } else {
      return doc;
    }
  }

  /**
   * 根据类型读取文件
   */
  async getFileByType(filePath: string, type: 'string' | 'blob' | 'base64') {
    filePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    const file = this.zip.file(filePath);
    if (file) {
      return await file.async(type);
    }
    throw new Error('file not found');
  }

  /**
   * 判断文件是否存在
   */
  fileExists(filePath: string) {
    filePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    const file = this.zip.file(filePath);
    if (file) {
      return true;
    }
    return false;
  }

  /**
   * 生成新的 zip 文件
   */
  async generateZip(docContent: string) {
    // 其实最好是生成个新的，后续再用户
    this.zip.file('word/document.xml', docContent);

    return this.zip.generateAsync({
      type: 'blob'
    });
  }
}
