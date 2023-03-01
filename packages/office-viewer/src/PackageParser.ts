/**
 * 目前使用的方案是在获取文件的时候直接转成 json，而不是使用 XML DOM，因为这样可以避免频繁调用 DOM 函数，性能更好
 */
import * as JSZip from 'jszip';
import {parse, evaluate} from 'amis-formula';

import {XMLParser, XMLBuilder} from 'fast-xml-parser';

const XMLOptions = {
  ignoreAttributes: false,
  allowBooleanAttributes: true,
  trimValues: false
};

export interface PackageOptions {
  /**
   * 是否替换变量
   */
  replaceVar: boolean;

  /**
   * 上下文，用于替换变量的场景
   */
  data?: any;
}

const defaultPackageOptions: PackageOptions = {
  replaceVar: false
};

export default class PackageParser {
  private zip: JSZip;

  private options: PackageOptions;

  constructor(zip: JSZip, packageOptions: PackageOptions) {
    this.zip = zip;
    this.options = packageOptions;
  }

  static async load(
    docxFile: Blob | any,
    packageOptions: PackageOptions = defaultPackageOptions
  ): Promise<PackageParser> {
    const jszip = (await JSZip.loadAsync(docxFile)) as JSZip;
    return new PackageParser(jszip, packageOptions);
  }

  /**
   * 读取 xml 文件，转成 json 对象
   * @param filePath 文件路径
   * @returns 转成 json 的结果
   */
  async getXML(filePath: string) {
    const fileContent = (await this.getFileByType(
      filePath,
      'string'
    )) as string;
    const parser = new XMLParser(XMLOptions);
    return parser.parse(this.replaceText(fileContent));
  }

  replaceText(text: string) {
    if (!this.options.replaceVar) {
      return text;
    }
    // 将 {{xxx}} 替换成 ${xxx}，为啥要这样呢，因为输入 $ 可能会变成两段文本
    text = text.replace(/{{/g, '${').replace(/}}/g, '}');

    return evaluate(text, this.options.data, {
      defaultFilter: 'raw'
    });
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

  async getRelation() {}
}
