/**
 * 文件加载器默认是直接读取 zip，如果要对文件做特殊加密处理，可以实现这个接口
 */

import {Unzipped} from '../util/fflate';

export interface PackageParser {
  load(docxFile: ArrayBuffer | string): void;

  /**
   * 读取 xml 文件，转成 json 对象
   * @param filePath 文件路径
   * @returns 转成 json 的结果
   */
  getXML(filePath: string): Document;

  /**
   * 根据类型读取文件
   */
  getFileByType(
    filePath: string,
    type: 'string' | 'blob' | 'uint8array'
  ): string | Blob | Uint8Array | null;

  /**
   * 读取文本内容
   */
  getString(filePath: string): string;

  /**
   * 写入文件，主要用于图片
   */
  saveFile(filePath: string, content: Uint8Array | string): void;

  /**
   * 文件是否存在
   */
  fileExists(filePath: string): boolean;

  /**
   * 生成新的 zip 文件
   *
   * @param docContent 新的 word/document.xml 文件内容
   */
  generateZipBlob(docContent: string): Blob;

  generateZip(): Uint8Array;

  getZip(): Unzipped;
}
