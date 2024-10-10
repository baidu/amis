/**
 * Excel 渲染主入口
 */

import {OfficeViewer} from './OfficeViewer';
import {get} from './util/get';
import {PackageParser} from './package/PackageParser';
import ZipPackageParser from './package/ZipPackageParser';
import {ExcelFile} from './excel/types/ExcelFile';
import {parseExcel} from './excel/io/parseExcel';
import {ExcelRender} from './excel/render/ExcelRender';
import {Workbook} from './excel/Workbook';
import {LocalDataProvider} from './excel/data/LocalDataProvider';
import {ExcelRenderOptions} from './excel/sheet/ExcelRenderOptions';
import {printIframe} from './util/print';
import {emptyXLSX} from './excel/io/csv/emptyXLSX';
import {arrayBufferToString} from './util/arrayBufferToString';

/**
 * 默认渲染配置项
 */
const defaultRenderOptions: ExcelRenderOptions = {
  data: {},
  evalVar: (path: string, data: any) => {
    return get(data, path);
  },
  useWorker: false,
  height: 500,

  gridLineColor: '#D4D4D4',
  gridLineWidth: 1,
  dragGridLineColor: '#5D5D5D',
  frozenLineColor: '#00A92F',
  gridLineHitRange: 4,

  showRowColHeaders: true,
  rowColHeadersColor: '#575757',
  rowColHeadersBackgroundColor: '#F5F5F5',
  rowColHeadersLineColor: '#E3E2E2',
  hiddenRowColHeadersColor: '#575757',
  hiddenRowColHeadersLineColor: '#217346',
  hiddenRowColHeadersLineSize: 3,

  // 选区的配置
  selectionBorderColor: '#005500',
  selectionSquareSize: 4,
  selectionBackgroundColor: '#00B683',
  selectionBackgroundOpacity: 0.2,

  // 大概 2 个数字的宽度
  indentSize: 15.845,

  backgroundColor: '#F5F5F5',
  cellBackgroundColor: '#FFFFFF',

  showFormulaBar: true,
  showSheetTabBar: true,

  locale: 'zh-CN',

  // 默认嵌入模式
  embed: true,

  editable: false,

  fontURL: {}
};

export default class Excel implements OfficeViewer {
  /**
   * 全局 id，用于一个页面渲染多个文档
   */
  static globalId = 0;

  /**
   * 当前渲染 id
   */
  id: number;

  renderOptions: ExcelRenderOptions;

  /**
   * 渲染根节点
   */
  rootElement?: HTMLElement;

  /**
   * 文件解析器
   */
  parser: PackageParser;

  /**
   * 文件内容
   */
  excelFile?: ExcelFile;

  /**
   * 渲染实例
   */
  excelRender?: ExcelRender;

  workbook?: Workbook;

  docFile: ArrayBuffer;

  fileName?: string;

  constructor(
    docFile: ArrayBuffer,
    fileName?: string,
    renderOptions?: Partial<ExcelRenderOptions>,
    parser: PackageParser = new ZipPackageParser()
  ) {
    this.id = Excel.globalId++;
    this.parser = parser;
    this.docFile = docFile;
    this.fileName = fileName;
    this.updateOptions(renderOptions || {});
  }

  updateOptions(options: any): void {
    this.renderOptions = {...defaultRenderOptions, ...options};
  }

  /**
   * 加载 Excel 文件
   */
  async loadExcel() {
    if (this.loaded) {
      return;
    }
    this.parser.load(this.docFile);
    const startParse = performance.now();
    this.excelFile = await parseExcel(this.parser);
    if (this.renderOptions.debug) {
      console.log('parse time', performance.now() - startParse, 'ms');
      console.log('excelFile', this.excelFile);
    }
    this.loaded = true;
  }

  // 后续优化一下
  loaded = false;

  /**
   * 加载 CSV 文件
   */
  async loadCSV(fileExt: 'csv' | 'tsv') {
    if (this.loaded) {
      return;
    }
    // 目前 csv 的实现复用了 xlsx 的解析
    this.parser.load(emptyXLSX);
    this.excelFile = await parseExcel(this.parser);
    const papaparse = await import('papaparse');
    const result = papaparse.parse(arrayBufferToString(this.docFile), {
      delimiter: fileExt === 'csv' ? ',' : '\t'
    });

    this.excelFile.workbook.sheets[0].worksheet!.cellData =
      result.data as string[][];

    if (this.fileName) {
      this.excelFile.workbook.sheets[0].name = this.fileName.split('/').pop()!;
    }
    this.loaded = true;
  }

  /**
   * Excel 渲染入口
   * @param root 渲染根节点
   * @param renderOptionsOverride 临时覆盖某些渲选项
   */
  async render(
    root: HTMLElement,
    renderOptionsOverride: Partial<ExcelRenderOptions> = {}
  ) {
    this.rootElement = root;
    root.innerHTML = '';
    const renderOptions = {...this.renderOptions, ...renderOptionsOverride};
    root.style.position = 'relative';

    let {height} = root.getBoundingClientRect();
    if (height === 0) {
      height = renderOptions.height!;
      root.style.height = height + 'px';
    }

    if (!this.excelFile) {
      console.warn('excel file not loaded');
      return;
    }

    const workbookData = this.excelFile.workbook;
    const workbook = new Workbook(
      root,
      workbookData,
      new LocalDataProvider(workbookData, renderOptions),
      renderOptions
    );

    await workbook.render();

    this.workbook = workbook;
  }

  async download(fileName: string) {
    throw new Error('must implement this method');
  }

  destroy() {
    if (this.workbook) {
      this.workbook.destroy();
    }
  }

  async print(): Promise<void> {
    if (!this.workbook) {
      return;
    }
    const iframe = document.createElement('iframe') as HTMLIFrameElement;
    iframe.style.position = 'absolute';
    iframe.style.top = '-10000px';
    document.body.appendChild(iframe);
    const printDocument = iframe.contentDocument;
    if (!printDocument) {
      console.warn('printDocument is null');
      return;
    }
    this.workbook!.renderInIframe(iframe);

    setTimeout(() => {
      iframe.focus();
      printIframe(iframe);
    }, this.renderOptions.printWaitTime || 100); // 需要等一下图片渲染
    window.focus();
  }

  getWorkbook() {
    return this.workbook;
  }

  updateVariable() {}
}
