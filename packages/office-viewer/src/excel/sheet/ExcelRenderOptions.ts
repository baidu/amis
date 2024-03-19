import {RenderOptions} from '../../RenderOptions';
import {HitTestResult} from '../render/selection/hitTest';

export interface RowColHeadersOptions {
  /**
   * 是否显示表头，这个会覆盖默认设置
   */
  showRowColHeaders: boolean;

  /**
   * 字体颜色
   */
  rowColHeadersColor: string;

  /**
   * 表头背景色
   */
  rowColHeadersBackgroundColor: string;

  /**
   * 表头线颜色
   */
  rowColHeadersLineColor: string;

  /**
   * 有隐藏内容时的字体颜色
   */
  hiddenRowColHeadersColor: string;

  /**
   * 有隐藏内容时的线颜色
   */
  hiddenRowColHeadersLineColor: string;

  /**
   * 有隐藏内容时的线大小
   */
  hiddenRowColHeadersLineSize: number;
}

export interface GridLineOptions {
  /**
   * 是否显示网格线
   */
  showGridLines?: boolean;

  /**
   * 网格线宽度
   */
  gridLineWidth?: number;

  /**
   * 网格线颜色
   */
  gridLineColor: string;

  /**
   * 拖动网格线时的颜色
   */
  dragGridLineColor: string;

  /**
   * 冻结线宽度
   */
  frozenLineWidth?: number;

  /**
   * 冻结线颜色
   */
  frozenLineColor: string;

  /**
   * 点击到线上的范围，当鼠标靠近这个距离内时，会认为点击到了线上
   */
  gridLineHitRange: number;
}

export interface SelectionOptions {
  /**
   * 选中的边框颜色
   */
  selectionBorderColor: string;

  /**
   * 选中区域右下角的方块大小
   */
  selectionSquareSize: number;

  /**
   * 选中区域的背景色
   */
  selectionBackgroundColor: string;

  /**
   * 选中区域的背景色透明度
   */
  selectionBackgroundOpacity: number;
}

export interface Debug {
  /**
   * 鼠标移动时的回调，主要用于调试
   */
  mousePositionTracker?: (
    x: number,
    y: number,
    hitTestResult: HitTestResult | null
  ) => void;
}

export interface ExcelRenderOptions
  extends RenderOptions,
    RowColHeadersOptions,
    GridLineOptions,
    SelectionOptions,
    Debug {
  /**
   * 是否使用 web worker 避免解析时卡顿，默认不开启
   */
  useWorker?: boolean;

  /**
   * 是否加载时强制计算所有公式，这个在 workbook 的 calcPr 中也能配置
   */
  fullCalcOnLoad?: boolean;

  /**
   * 渲染宽度
   */
  width?: number;

  /**
   * 渲染高度
   */
  height?: number;

  /**
   * 语言，使用 http://www.rfc-editor.org/rfc/bcp/bcp47.txt，主要用于 numfmt
   */
  locale: string;

  /**
   * 缩放比例
   */
  scale?: number;

  /**
   * 单个缩进大小
   */
  indentSize: number;

  /**
   * 背景色
   */
  backgroundColor: string;

  /**
   * 单元格默认背景色
   */
  cellBackgroundColor: string;

  /**
   * 是否显示公式栏
   */
  showFormulaBar: boolean;

  /**
   * 是否显示 sheet 标签
   */
  showSheetTabBar: boolean;

  /**
   * 嵌入模式，在这个模式下滚动条滚到底部会出发继续滚动事件，滚动页面本身
   */
  embed: boolean;

  /**
   * 是否可编辑
   */
  editable: boolean;

  /**
   * 打印可以覆盖其它配置
   */
  printOptions?: ExcelRenderOptions;

  printWaitTime?: number;

  /**
   * 字体 url，用于加载字体
   */
  fontURL: Record<string, string>;
}
