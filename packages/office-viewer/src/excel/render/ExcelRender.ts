/**
 * 实现 Excel 渲染
 */

import type {Workbook} from '../Workbook';
import {ScrollBar} from './ScrollBar';
import {Sheet} from '../sheet/Sheet';
import {SheetCanvas} from './SheetCanvas';
import type {ExcelRenderOptions} from '../sheet/ExcelRenderOptions';

import {throttle} from '../../util/throttle';
import {IDataProvider} from '../types/IDataProvider';
import {FontSize} from '../types/FontSize';
import {drawGridLines} from './grid/drawGridLines';
import {drawCells} from './cell/drawCells';
import {drawRowColHeaders} from './header/drawRowColHeaders';
import {debounce} from '../../util/debounce';
import {drawFrozen} from './cell/frozen/drawFrozen';
import {SelectionCanvas} from './SelectionCanvas';
import {updateCursor} from './selection/updateCursor';
import {dragState, handleMousedown} from './dnd/handleMousedown';
import {Scroll} from './scroll/Scroll';
import {drawDrawing} from './drawing/drawDrawing';
import {drawSparkline} from './sparkline/drawSparkline';
import {isValidURL} from '../../util/isValidURL';
import {LinkPosition} from './cell/LinkPosition';
import {isPointerOnLink} from './cell/isPointerOnLink';
import {ResizeBox} from './drawing/ResizeBox';
import {renderAutoFilter} from './autoFilter/renderAutoFilter';
import {AutoFilterIconUI} from './autoFilter/AutoFilterIconUI';
import {getMouseRelativePosition} from './dnd/getMouseRelativePosition';
import {CellEditor} from '../edit/ui/CellEditor';
import {getAllNotAvailableFont} from './cell/checkFont';
import {inValidTextSizeCache} from './cell/measureTextWithCache';

export class ExcelRender {
  /**
   * 主内容区
   */
  private contentContainer: HTMLElement;

  /**
   * 数据区
   */
  private dataContainer: HTMLElement;

  private workbook: Workbook;

  /**
   * 主内容区的 Canvas
   */
  private sheetCanvas: SheetCanvas;

  /**
   * 选区的 Canvas
   */
  private selectionCanvas: SelectionCanvas;

  /**
   * 滚动条
   */
  scrollbar: ScrollBar;

  /**
   * 调整大小的操作框
   */
  resizeBox: ResizeBox;

  renderOptions: ExcelRenderOptions;

  dataProvider: IDataProvider;

  /**
   * 默认字体大小，用于一些计算
   */
  defaultFontSize: FontSize;

  /**
   * 上一次滚动的位置，这个是为了滚动时固定某个方向
   */
  lastScroll: Scroll = {left: 0, top: 0};

  linkPositionCache: LinkPosition[] = [];

  autoFiltersUI: AutoFilterIconUI[] = [];

  constructor(
    contentContainer: HTMLElement,
    dataContainer: HTMLElement,
    workbook: Workbook,
    dataProvider: IDataProvider,
    renderOptions: ExcelRenderOptions
  ) {
    this.contentContainer = contentContainer;

    this.dataContainer = dataContainer;
    this.workbook = workbook;
    this.renderOptions = renderOptions;

    this.contentContainer.addEventListener(
      'wheel',
      this.handleWheel.bind(this),
      {
        passive: false
      }
    );

    this.contentContainer.addEventListener(
      'mousedown',
      this.handleMousedown.bind(this)
    );

    this.contentContainer.addEventListener(
      'mouseup',
      this.handleMouseup.bind(this)
    );

    this.contentContainer.addEventListener(
      'touchstart',
      this.handleMousedown.bind(this)
    );

    // 避免过于频繁
    this.handleMousemove = debounce(this.handleMousemove, 16);
    this.contentContainer.addEventListener(
      'mousemove',
      this.handleMousemove.bind(this)
    );

    this.dataContainer.addEventListener(
      'dblclick',
      this.handleDblclick.bind(this)
    );

    this.sheetCanvas = new SheetCanvas(workbook, dataProvider);
    const sheetCanvasElement = this.sheetCanvas.getCanvasElement();

    this.contentContainer.appendChild(sheetCanvasElement);

    this.selectionCanvas = new SelectionCanvas(workbook, dataProvider);
    this.contentContainer.appendChild(this.selectionCanvas.getCanvasElement());

    this.scrollbar = new ScrollBar(contentContainer, workbook);

    this.resizeBox = new ResizeBox(contentContainer);

    this.defaultFontSize = dataProvider.getDefaultFontSize();
    this.dataProvider = dataProvider;

    this.draw = this.draw.bind(this);

    workbook.uiEvent.on('SWITCH_SHEET', (sheet: Sheet) => {
      // 这里面会有一些 HTML，清空一下避免问题
      this.dataContainer.innerHTML = '';

      this.draw();
    });

    workbook.uiEvent.on('CHANGE_ZOOM_LEVEL', scale => {
      this.sheetCanvas.updateZoom(scale);
      this.selectionCanvas.updateZoom(scale);
      this.draw();
      this.selectionCanvas.draw();
    });

    workbook.uiEvent.on('SCROLL_X', (x: number) => {
      this.workbook.getActiveSheet().setScrollLeft(x);
      this.draw();
    });

    workbook.uiEvent.on('SCROLL_Y', (y: number) => {
      this.workbook.getActiveSheet().setScrollTop(y);
      this.draw();
    });

    workbook.uiEvent.on('APPLY_AUTO_FILTER', (sheetIndex: number) => {
      const currentSheetIndex = this.workbook.getActiveSheet().getIndex();
      if (currentSheetIndex === sheetIndex) {
        this.draw();
      }
    });

    workbook.uiEvent.on('UPDATE_RANGE', (sheetIndex: number) => {
      // 目前简单处理，后面需要支持局部渲染
      const currentSheetIndex = this.workbook.getActiveSheet().getIndex();
      if (currentSheetIndex === sheetIndex) {
        this.draw();
      }
    });

    workbook.uiEvent.on('UPDATE_ROW_HEIGHT', (row: number, height: number) => {
      this.draw();
    });

    workbook.uiEvent.on('UPDATE_COL_WIDTH', (col: number, width: number) => {
      this.draw();
    });

    this.watchResize();
  }

  lastScrollDirection: 'vertical' | 'horizontal' = 'vertical';

  lastScrollDirectionTime = 0;

  scrollDirectionLockTime = 100;

  getSelectionCanvas() {
    return this.selectionCanvas;
  }

  watchResize() {
    const contentContainer = this.contentContainer;
    // 监听容器大小变化
    let lastWidth = contentContainer.clientWidth;
    let lastHeight = contentContainer.clientHeight;
    const containerObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      const {width, height} = entry.contentRect;
      if (
        Math.floor(lastWidth) === Math.floor(width) &&
        Math.floor(lastHeight) === Math.floor(height)
      ) {
        return;
      }
      lastWidth = width;
      lastHeight = height;
      this.draw();
    });

    containerObserver.observe(contentContainer);
  }

  /**
   * 处理滚轮事件
   */
  handleWheel(event: WheelEvent) {
    let {deltaX, deltaY, deltaMode} = event;
    const currentSheet = this.workbook.getActiveSheet();
    // 按住 shift 键就当成水平滚动
    const isScrollingHorizontally =
      event.shiftKey || Math.abs(deltaX) > Math.abs(deltaY);

    event.preventDefault();
    event.stopPropagation();
    if (this.ignoreScrollDirection(isScrollingHorizontally)) {
      return false;
    }

    deltaX = Math.floor(deltaX);
    deltaY = Math.floor(deltaY);

    // 按住 shift 就只有水平滚动
    if (isScrollingHorizontally) {
      currentSheet.deltaScrollLeft(deltaX);
    } else {
      currentSheet.deltaScrollTop(deltaY);
    }

    const scroll = {
      left: Math.floor(currentSheet.getScrollLeft()),
      top: Math.floor(currentSheet.getScrollTop())
    };

    if (
      this.lastScroll.left !== scroll.left ||
      this.lastScroll.top !== scroll.top
    ) {
      this.lastScroll = scroll;
      this.draw();
      // 滚动结束后触发
      this.afterScroll(scroll);
    }

    return false;
  }

  /**
   * 处理单元格双击事件
   */
  handleDblclick(event: MouseEvent) {
    if (this.renderOptions.editable === false) {
      return;
    }
    const {offsetX, offsetY} = this.getMouseRelativePosition(event);

    const hitTestResult = this.workbook
      .getActiveSheet()
      .hitTest(offsetX, offsetY);

    if (hitTestResult && hitTestResult.type === 'cell') {
      new CellEditor(this.dataContainer, this.workbook, hitTestResult);
    }
  }

  /**
   * 处理鼠标按下事件
   */
  handleMousedown(event: MouseEvent) {
    let {offsetX, offsetY} = this.getMouseRelativePosition(event);

    const hitTestResult = this.workbook
      .getActiveSheet()
      .hitTest(offsetX, offsetY);

    if (hitTestResult) {
      handleMousedown(
        this.workbook,
        hitTestResult,
        this.contentContainer,
        event
      );
    }
  }

  /**
   * 处理鼠标松开事件，目前主要是处理点击链接的场景
   */
  handleMouseup(event: MouseEvent) {
    // 拖动过程中就不处理这个事件
    if (dragState.isDragging) {
      return;
    }
    let {offsetX, offsetY} = this.getMouseRelativePosition(event);

    const pointerOnLink = isPointerOnLink(
      offsetX,
      offsetY,
      this.linkPositionCache
    );

    if (pointerOnLink) {
      window.open(pointerOnLink);
    }

    const hitTestResult = this.workbook
      .getActiveSheet()
      .hitTest(offsetX, offsetY);

    this.resizeBox.hide();

    if (hitTestResult) {
      if (hitTestResult.type === 'drawing') {
        this.selectionCanvas.clearSelection();
        this.resizeBox.updatePosition(
          hitTestResult.x,
          hitTestResult.y,
          hitTestResult.width,
          hitTestResult.height
        );
      }
    }
  }

  /**
   * 处理鼠标移动事件
   */
  handleMousemove(event: MouseEvent) {
    // 拖动过程中就不处理这个事件
    if (dragState.isDragging) {
      return;
    }

    let {offsetX, offsetY} = this.getMouseRelativePosition(event);

    offsetX = Math.round(offsetX);
    offsetY = Math.round(offsetY);

    // 重置鼠标样式
    this.contentContainer.style.cursor = 'cell';
    const hitTestResult = this.workbook
      .getActiveSheet()
      .hitTest(offsetX, offsetY);

    // 用于快速了解当前鼠标位置
    if (this.renderOptions.debug) {
      this.renderOptions.mousePositionTracker?.(
        offsetX,
        offsetY,
        hitTestResult
      );
    }

    // 是否在链接上
    const pointerOnLink = isPointerOnLink(
      offsetX,
      offsetY,
      this.linkPositionCache
    );

    updateCursor(this.contentContainer, hitTestResult, pointerOnLink);
  }

  /**
   * 获取鼠标相对位置，会考虑缩放
   */
  getMouseRelativePosition(event: MouseEvent) {
    let {offsetX, offsetY} = getMouseRelativePosition(
      this.contentContainer,
      event
    );
    const zoomLevel = this.workbook.getActiveSheet().getZoomLevel();
    offsetX = offsetX / zoomLevel;
    offsetY = offsetY / zoomLevel;
    return {offsetX, offsetY};
  }

  /**
   * 是否忽略这个滚动方向
   * @param isScrollingHorizontally
   * @returns 如果返回 true 说明被锁定了，这时要忽略后面的行为
   */
  ignoreScrollDirection(isScrollingHorizontally: boolean) {
    // 避免滚动方向频繁切换，在短时间内只允许一个方向
    if (
      Date.now() - this.lastScrollDirectionTime <
      this.scrollDirectionLockTime
    ) {
      if (
        this.lastScrollDirection === 'horizontal' &&
        !isScrollingHorizontally
      ) {
        return true;
      }
      if (this.lastScrollDirection === 'vertical' && isScrollingHorizontally) {
        return true;
      }
    }
    this.lastScrollDirection = isScrollingHorizontally
      ? 'horizontal'
      : 'vertical';
    this.lastScrollDirectionTime = Date.now();
    return false;
  }

  afterScroll(scroll: Scroll) {
    this.workbook.uiEvent.emit('AFTER_SCROLL', scroll);
  }

  /**
   * 获取可视区域高宽
   */
  getWidthAndHeight() {
    const {width, height} = this.workbook.getViewpointSize();
    return {
      width,
      height
    };
  }

  /**
   * 是否需要重新绘制，主要是渲染过程中发现行高变化等情况
   */
  needReDraw: boolean | number = false;

  /**
   * 渲染总入库，包括数据区域和选区
   */
  async draw(fromReRender = false) {
    const startDraw = performance.now();

    const mainCanvas = this.sheetCanvas;
    const currentSheet = this.workbook.getActiveSheet();
    const {width, height} = this.getWidthAndHeight();

    this.linkPositionCache = [];

    // 获取可视区域范围
    const viewRange = currentSheet.getViewPointRange(width, height);
    this.workbook.getActiveSheet().updateViewRange(viewRange);

    // 获取可视区域内的信息
    const displayData = currentSheet.getViewPointData(viewRange);

    mainCanvas.clear();

    // 这个需要提前执行，保证 rowHeaderWidth 是正确的
    currentSheet.updateRowHeaderWidth(viewRange);

    // 绘制网格线
    drawGridLines(
      currentSheet,
      viewRange,
      mainCanvas,
      height,
      width,
      this.renderOptions
    );

    // 绘制 Sparkline，这个要在单元格前面
    drawSparkline(currentSheet, viewRange, mainCanvas);

    // 绘制单元格
    drawCells(
      this,
      currentSheet,
      this.renderOptions,
      mainCanvas,
      displayData,
      this.linkPositionCache
    );

    // 绘制自动筛选功能
    renderAutoFilter(currentSheet, this.dataContainer);

    // 绘制图片及文本框
    drawDrawing(this, currentSheet, viewRange, mainCanvas);

    // 表头晚于内容区绘制
    drawRowColHeaders(
      currentSheet,
      viewRange,
      mainCanvas,
      this.renderOptions,
      this.defaultFontSize,
      this.dataProvider.getDefaultFontStyle()
    );

    // 绘制冻结区
    const frozenViewRange = drawFrozen(
      this,
      currentSheet,
      this.dataProvider,
      this.renderOptions,
      mainCanvas,
      height,
      width,
      this.linkPositionCache
    );

    this.workbook.getActiveSheet().updateFrozenViewRange(frozenViewRange);

    if (this.renderOptions.debug) {
      console.log(
        'draw time',
        (performance.now() - startDraw).toFixed(2),
        'ms'
      );
    }

    // 目前只有渲染后才知道字体是否加载
    await this.loadFont();

    if (this.needReDraw && fromReRender === false) {
      this.needReDraw = false;
      // 避免死循环
      this.draw(true);
    }
  }

  /**
   * 已经加载的字体
   */
  loadedFont: Set<string> = new Set();

  /**
   * 加载字体
   */
  async loadFont() {
    const fontURL = this.renderOptions.fontURL;
    const notAvailableFonts = getAllNotAvailableFont();
    let needReDraw = false;
    for (const font of notAvailableFonts) {
      if (this.loadedFont.has(font)) {
        continue;
      }
      if (font in fontURL) {
        this.loadedFont.add(font);
        const fontFace = new FontFace(font, `url(${fontURL[font]})`);
        await fontFace.load();
        document.fonts.add(fontFace);
        needReDraw = true;
      } else {
        console.warn('font not found', font);
      }
    }
    if (needReDraw) {
      // 宽度可能变化
      inValidTextSizeCache();
      const currentSheet = this.workbook.getActiveSheet();
      currentSheet.clearFontCache();
      this.setNeedReDraw();
    }
  }

  setNeedReDraw() {
    const now = new Date().getTime();
    if (this.needReDraw) {
      // 避免频繁调用
      if (now - (this.needReDraw as number) < 100) {
        return;
      }
    }

    this.needReDraw = new Date().getTime();
  }

  /**
   * 销毁
   */
  destroy() {
    this.contentContainer.removeEventListener('wheel', this.handleWheel);
    this.contentContainer.removeEventListener(
      'mousedown',
      this.handleMousedown
    );
  }
}
