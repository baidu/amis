/**
 * @file tableview 相关的可视化编辑，拖动行高等
 */

import React from 'react';
import isEqual from 'lodash/isEqual';
import {toast} from 'amis';
import {
  TableViewSchema,
  TdObject,
  TrObject
} from 'amis/lib/renderers/TableView';
import {EditorManager} from '../manager';
import {autobind, JSONGetById} from '../util';
import {EditorStoreType} from '../store/editor';

interface TableViewEditorProps {
  schema: TableViewSchema;
  manager: EditorManager;
}

interface TableViewEditorState {
  // 行线的 id
  trIds: string[];
  // 列线的 id
  tdIds: string[];
  // 是否显示合并单元格按钮
  displayMergeCell: boolean;
}

const ROW_HEIGHT = 42;

// 找到 td 最多的那一行，将这一行作为列线
function findMaxTrChildren(trs: TrObject[]) {
  let maxSize = 0;
  let maxIndex = 0;
  for (let trIndex = 0; trIndex < trs.length; trIndex++) {
    const childSize = (trs[trIndex].tds || []).length;
    if (childSize > maxSize) {
      maxIndex = trIndex;
      maxSize = childSize;
    }
  }
  return maxIndex;
}

export class TableViewEditor extends React.Component<
  TableViewEditorProps,
  TableViewEditorState
> {
  tableViewWrapperRef: React.RefObject<HTMLDivElement>;

  // 下面这些用于行和线的拖拽，来改变高宽
  // 但这里有个问题还没解决：同一列中如果同时有两个单元格设置宽度，这时究竟该改哪个？
  draggingId: string;
  draggingElement: HTMLElement;
  draggingElementTop: number;
  draggingElementLeft: number;
  startX: number;
  startY: number;
  maxChildTrIndex: number;

  store: EditorStoreType;

  // 是否进入单元格选择状态，用于单元格合并
  isSelectionCell: boolean;
  // 用于单元格合并
  selectedCell: {
    [cellId: string]: any;
  };
  preventTableClick: boolean = false;

  constructor(props: TableViewEditorProps) {
    super(props);
    this.tableViewWrapperRef = React.createRef();
    this.store = this.props.manager.store;
    const trs = this.props.schema.trs || [];
    if (trs.length) {
      const trsIds = trs.map((tr: any) => tr.$$id);
      const maxChildTrIndex = findMaxTrChildren(trs);
      this.maxChildTrIndex = maxChildTrIndex;
      const tds = trs[maxChildTrIndex].tds || [];
      const tdsIds = tds.map((td: any) => td.$$id);
      this.state = {
        trIds: trsIds,
        tdIds: tdsIds,
        displayMergeCell: false
      };
    } else {
      this.state = {
        trIds: [],
        tdIds: [],
        displayMergeCell: false
      };
    }

    this.listenTdSelection();
  }

  componentDidMount() {
    this.syncLinePos();
    this.listenTdSelection();
  }

  componentWillUnmount() {
    this.removeListenTdSelection();
  }

  // 同步线数量，主要用于新增行或列
  syncLineState() {
    const trs = this.props.schema.trs || [];
    if (!trs.length) {
      return;
    }
    const trsIds = trs.map((tr: any) => tr.$$id);
    const maxChildTrIndex = findMaxTrChildren(trs);
    this.maxChildTrIndex = maxChildTrIndex;
    const tds = trs[maxChildTrIndex].tds || [];
    const tdsIds = tds.map((td: any) => td.$$id);
    this.setState(
      {
        trIds: trsIds,
        tdIds: tdsIds
      },
      () => {
        this.syncLinePos();
      }
    );
  }

  @autobind
  removeListenTdSelection() {
    const dom = this.tableViewWrapperRef.current;
    if (dom) {
      const tbody = dom.querySelector('tbody')!;
      tbody.removeEventListener('mousedown', this.handleCellMouseDown);
      tbody.removeEventListener('mousemove', this.handleCellMouseMove);
      tbody.removeEventListener('mouseup', this.handleCellMouseUp);
      tbody.removeEventListener('click', this.handleCellMouseClick);
    }
  }

  // 监听 td 的拖拽事件，用于实现单元格合并
  @autobind
  listenTdSelection() {
    const dom = this.tableViewWrapperRef.current;
    if (dom) {
      const tbody = dom.querySelector('tbody')!;
      tbody.addEventListener('mousedown', this.handleCellMouseDown);
      tbody.addEventListener('mousemove', this.handleCellMouseMove);
      tbody.addEventListener('mouseup', this.handleCellMouseUp);
      tbody.addEventListener('click', this.handleCellMouseClick);
    }
  }

  // 用于单元格合并的点击
  @autobind
  handleCellMouseDown(e: MouseEvent) {
    const td = e.target! as HTMLElement;
    if (td && td.tagName !== 'TD') {
      return;
    }
    this.removeAllSelectionMark();
    this.setState({
      displayMergeCell: false
    });
    const tdId = td.getAttribute('data-editor-id')!;
    this.isSelectionCell = true;
    this.selectedCell = {
      [tdId]: JSONGetById(this.props.schema, tdId)
    };
  }

  // 用于单元格合并的移动
  @autobind
  handleCellMouseMove(e: MouseEvent) {
    if (this.isSelectionCell) {
      this.preventTableClick = true; //如果有移动就禁止一次表格 click 事件
      const td = e.target! as HTMLElement;
      if (td && td.tagName !== 'TD') {
        return;
      }
      const tdId = td.getAttribute('data-editor-id')!;
      if (!(tdId in this.selectedCell)) {
        this.selectedCell[tdId] = JSONGetById(this.props.schema, tdId);
        this.markSelectingCell();
        this.setState({
          displayMergeCell: true
        });
      }
    }
  }

  // 查找最大和最小行列位置，考虑跨行的情况，用于单元格合并
  findFirstAndLastCell() {
    const tds = [];
    for (const tdId in this.selectedCell) {
      tds.push(this.selectedCell[tdId]);
    }
    if (!tds.length) {
      console.warn('必须有 td');
    }
    let minCol: number = tds[0].$$col;
    let minRow: number = tds[0].$$row;
    let maxCol: number = 0;
    let maxRow: number = 0;
    let firstCell = null;
    let lastCell = null;
    for (const td of tds) {
      const col = td.$$col + (td.colspan || 1) - 1; // 这里直接减一不然后面还得弄
      const row = td.$$row + (td.rowspan || 1) - 1;
      if (col >= maxCol) {
        maxCol = col;
      }
      if (row >= maxRow) {
        maxRow = row;
      }
      if (td.$$col <= minCol) {
        minCol = td.$$col;
      }
      if (td.$$row <= minRow) {
        minRow = td.$$row;
      }
      if (td.$$col === minCol && td.$$row === minRow) {
        firstCell = td;
      }
    }
    return {
      minRow,
      minCol,
      maxRow,
      maxCol,
      firstCell,
      lastCell
    };
  }

  /**
   * 选择 td 主要是为了单元格合并，它要求是必须是矩形，比如下面的例子
   *		┌───┬───┬───┬───┐
   *		│ a │ b │ c │ d │
   *		├───┴───┼───┤   │
   *		│ e     │ f │   │
   *		│       ├───┼───┤
   *		│       │ g │ h │
   *		└───────┴───┴───┘
   * 直接选 a 和 c 是不行的，无法进行单元格合并，所以需要补上 b
   * 如果选择了 e 和 f，需要自动选择 g 来让整体变成矩形
   * 这个函数的主要作用就是将矩形补充完整
   */
  markSelectingCell() {
    // 首先，查找最小和最大的行和列
    const {minRow, minCol, maxRow, maxCol} = this.findFirstAndLastCell();

    // 变量一遍找出所有在这个范围内的节点，如果不在就添加
    for (const tr of this.props.schema.trs) {
      for (const td of tr.tds) {
        const internalTd = td as any;
        if (
          internalTd.$$col >= minCol &&
          internalTd.$$col <= maxCol &&
          internalTd.$$row >= minRow &&
          internalTd.$$row <= maxRow
        ) {
          if (!(internalTd.$$id in this.selectedCell)) {
            this.selectedCell[internalTd.$$id] = td;
          }
        }
      }
    }

    const dom = this.tableViewWrapperRef.current;
    if (dom) {
      const tds = dom.querySelectorAll('td');
      tds.forEach(td => {
        const tdId = td.getAttribute('data-editor-id')!;
        if (tdId in this.selectedCell) {
          td.setAttribute('data-selected', '1');
        }
      });
    }
  }

  // 清除之前的单元格选择
  removeAllSelectionMark() {
    const dom = this.tableViewWrapperRef.current;
    if (dom) {
      const tds = dom.querySelectorAll('td');
      tds.forEach(td => {
        td.removeAttribute('data-selected');
      });
    }
  }

  @autobind
  handleCellMouseUp(e: MouseEvent) {
    this.isSelectionCell = false;
  }

  // 如果有拖拽的时候就避免选中表格导致状态切换
  @autobind
  handleCellMouseClick(e: MouseEvent) {
    if (this.preventTableClick) {
      e.stopPropagation();
      e.preventDefault();
      this.preventTableClick = false;
    }
  }

  // 合并单元格操作
  @autobind
  handleMergeCell() {
    const {firstCell, minRow, minCol, maxRow, maxCol} =
      this.findFirstAndLastCell();
    if (!firstCell) {
      console.warn('找不到第一个 cell');
      return;
    }

    const firstCellId = firstCell.$$id;
    const colspan = maxCol - minCol + 1;
    const rowspan = maxRow - minRow + 1;
    firstCell.colspan = colspan;
    firstCell.rowspan = rowspan;
    const tds = [];
    for (const tdId in this.selectedCell) {
      tds.push(this.selectedCell[tdId]);
    }
    // 其它单元格，这些单元格会被删掉
    const otherCellIds = tds
      .filter(td => td.$$id !== firstCellId)
      .map(td => td.$$id);

    const trs = this.props.schema.trs;
    let trIndex = trs.length;
    while (trIndex--) {
      const tr = trs[trIndex];
      tr.tds = tr.tds.filter(td => {
        return !otherCellIds.includes((td as any).$$id);
      });
      if (!tr.tds.length) {
        trs.splice(trIndex, 1);
      }
    }

    const tableId = (this.props.schema as any).$$id;
    this.store.changeValueById(tableId, this.props.schema);
    this.setState({displayMergeCell: false});
  }

  // 同步线的位置
  syncLinePos() {
    const dom = this.tableViewWrapperRef.current;
    if (dom) {
      const table = dom.querySelector('table')!;
      const tableRect = table.getBoundingClientRect();
      const trs = dom.querySelectorAll('tr');
      if (!trs.length || typeof this.maxChildTrIndex === 'undefined') {
        return;
      }
      const rowLines = Array.from(
        dom.querySelectorAll<HTMLElement>('.ae-TableViewEditor-rowLine')
      );
      for (let trIndex = 0; trIndex < trs.length; trIndex++) {
        if (!trs[trIndex]) {
          continue;
        }
        const trRect = trs[trIndex].getBoundingClientRect();
        if (rowLines[trIndex]) {
          // 线的宽度是 7，所以要减去 3.5
          rowLines[trIndex].style.top =
            trRect.top + trRect.height - tableRect.top - 3.5 + 'px';
        } else {
          console.warn('行线数量不对');
        }
      }
      const tds = trs[this.maxChildTrIndex].querySelectorAll('td');

      const colLines = Array.from(
        dom.querySelectorAll<HTMLElement>('.ae-TableViewEditor-colLine')
      );
      for (let tdIndex = 0; tdIndex < tds.length; tdIndex++) {
        const td = tds[tdIndex];
        if (!td) {
          continue;
        }
        const tdRect = td.getBoundingClientRect();
        if (colLines[tdIndex]) {
          colLines[tdIndex].style.left =
            tdRect.left + tdRect.width - tableRect.left - 3.5 + 'px';
        } else {
          console.warn('列线数量不对');
        }
      }
    }
  }

  componentDidUpdate(prevProps: TableViewEditorProps) {
    const prevSchema = prevProps.schema;
    const thisSchema = this.props.schema;
    if (!isEqual(prevSchema, thisSchema)) {
      this.syncLineState();
    }
  }

  // 水平或垂直线在鼠标按下去时的通用处理
  lineMouseDownCommon(e: React.MouseEvent<HTMLElement>) {
    this.startY = e.clientY;
    this.startX = e.clientX;
    const currentTarget = e.currentTarget;
    this.draggingElement = currentTarget;
    this.draggingElementTop = parseInt(this.draggingElement.style.top, 10);
    this.draggingElementLeft = parseInt(this.draggingElement.style.left, 10);
    currentTarget.style.background = '#4285f4';
    this.draggingId = currentTarget.getAttribute('data-id')!;
    currentTarget.addEventListener('click', this.handleLineClick, {once: true});
  }

  // 水平线的拖拽
  @autobind
  handleRowMouseDown(e: React.MouseEvent<HTMLElement>) {
    this.lineMouseDownCommon(e);
    document.addEventListener('mousemove', this.handleRowMouseMove);
    document.addEventListener('mouseup', this.handleRowMouseUp);
  }

  // 水平线移动
  @autobind
  handleRowMouseMove(e: MouseEvent) {
    const moveY = e.clientY - this.startY;
    this.draggingElement.style.top = this.draggingElementTop + moveY + 'px';
  }

  // 水平线结束
  @autobind
  handleRowMouseUp(e: MouseEvent) {
    document.removeEventListener('mousemove', this.handleRowMouseMove);
    document.removeEventListener('mouseup', this.handleRowMouseUp);
    const moveY = e.clientY - this.startY;
    const store = this.store;
    const draggingId = this.draggingId;
    const value = store.getValueOf(draggingId);
    const rowElement = this.tableViewWrapperRef.current!.querySelector(
      `tr[data-editor-id="${draggingId}"]`
    );
    this.draggingElement.style.background = 'none';
    if (!value || !rowElement) {
      console.warn('找不到对应的 id', draggingId);
    } else {
      const height = rowElement.getBoundingClientRect().height;
      const targetHeight = height + moveY;
      store.changeValueById(draggingId, {...value, height: targetHeight});
      if (ROW_HEIGHT - targetHeight > 20) {
        toast.warning(
          '由于内边距限制，太小的高度设置会不生效，可以调小默认内边距'
        );
      }
    }
  }

  // 垂直线的拖拽
  @autobind
  handleColMouseDown(e: React.MouseEvent<HTMLElement>) {
    this.lineMouseDownCommon(e);
    document.addEventListener('mousemove', this.handleColMouseMove);
    document.addEventListener('mouseup', this.handleColMouseUp);
  }

  // 垂直线移动
  @autobind
  handleColMouseMove(e: MouseEvent) {
    const moveX = e.clientX - this.startX;
    this.draggingElement.style.left = this.draggingElementLeft + moveX + 'px';
  }

  // 垂直线结束
  @autobind
  handleColMouseUp(e: MouseEvent) {
    document.removeEventListener('mousemove', this.handleColMouseMove);
    document.removeEventListener('mouseup', this.handleColMouseUp);
    const moveX = e.clientX - this.startX;
    const store = this.store;
    const draggingId = this.draggingId;
    const value = store.getValueOf(draggingId);
    const tdElement = this.tableViewWrapperRef!.current!.querySelector(
      `td[data-editor-id="${draggingId}"]`
    );
    this.draggingElement.style.background = 'none';
    if (!value || !tdElement) {
      console.warn('找不到对应的 id', draggingId);
    } else {
      const width = tdElement.getBoundingClientRect().width;
      const targetWidth = width + moveX;
      store.changeValueById(draggingId, {...value, width: targetWidth});
    }
  }

  // 阻止冒泡防止切换到表格选中
  @autobind
  handleLineClick(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
  }

  // 单元格合并的按钮
  renderMergeIcon() {
    if (this.state.displayMergeCell) {
      return (
        <div
          className="ae-TableViewEditor-mergeIcon"
          onMouseDown={this.handleMergeCell}
        >
          合并单元格
        </div>
      );
    }
    return null;
  }

  render() {
    let rowLines = this.state.trIds.map((id: string) => (
      <div
        className="ae-TableViewEditor-rowLine"
        key={`row-${id}`}
        data-id={id}
        onMouseDown={this.handleRowMouseDown}
      ></div>
    ));

    let colLines = this.state.tdIds.map((id: string) => (
      <div
        className="ae-TableViewEditor-colLine"
        key={`row-${id}`}
        data-id={id}
        onMouseDown={this.handleColMouseDown}
      ></div>
    ));

    return (
      <div className="ae-TableViewEditor" ref={this.tableViewWrapperRef}>
        {this.props.children}
        {this.renderMergeIcon()}
        {rowLines}
        {colLines}
      </div>
    );
  }
}
