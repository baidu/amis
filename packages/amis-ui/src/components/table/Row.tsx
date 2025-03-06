/**
 * @file table/BodyRow
 * @author fex
 */

import React from 'react';
import {InView} from 'react-intersection-observer';

import {ThemeProps, isObject, autobind, isClickOnInput} from 'amis-core';

import CheckBox from '../Checkbox';
import {Icon} from '../icons';
import {ColumnProps, TdProps} from './index';
import Cell from './Cell';
import {
  getBuildColumns,
  updateFixedRow,
  hasFixedColumn,
  levelsSplit
} from './util';
import type {TestIdBuilder} from 'amis-core';

export interface Props extends ThemeProps {
  data: any;
  rowIndex: number;
  columns: ColumnProps[];
  expandable: boolean;
  expandableFixed?: boolean;
  indentSize: number;
  lineHeight?: string;
  keyField?: string;
  draggable: boolean;
  levels: string;
  isExpandable: boolean;
  isExpandableRow: boolean;
  colCount: number;
  isRightExpandable?: boolean;
  isLeftExpandable?: boolean;
  isChecked: boolean;
  rowClassName?: Function;
  onExpand?: Function;
  onCollapse?: Function;
  onMouseEnter: Function;
  onMouseLeave: Function;
  onClick: Function;
  onDoubleClick: Function;
  onChange: Function;
  childrenColumnName: string;
  selectable: boolean;
  rowSelectionFixed?: boolean;
  rowSelectionType?: 'radio' | 'checkbox';
  rowClickIgControl?: boolean;
  hasChildrenRow: boolean;
  hasChildrenChecked: boolean;
  expandedRowClassName: string;
  expandedRowRender?: Function;
  isExpanded: boolean;
  testIdBuilder?: TestIdBuilder;
  [propName: string]: any; // 对应checkbox属性
}

class BodyRow extends React.PureComponent<Props> {
  domRef: React.RefObject<HTMLTableRowElement> = React.createRef();
  // 表格配置
  tdColumns: Array<TdProps>;

  @autobind
  onExpand() {
    const {onExpand, data} = this.props;
    onExpand && onExpand([data]);
  }

  @autobind
  onCollapse() {
    const {onCollapse, data} = this.props;
    onCollapse && onCollapse([data]);
  }

  onMouseEnter(event: React.ChangeEvent<any>, record?: any, rowIndex?: number) {
    const {onMouseEnter} = this.props;
    onMouseEnter && onMouseEnter(event, record, rowIndex);
  }

  onMouseLeave(event: React.ChangeEvent<any>, record?: any, rowIndex?: number) {
    const {onMouseLeave} = this.props;
    onMouseLeave && onMouseLeave(event, record, rowIndex);
  }

  onClick(
    e: React.MouseEvent<HTMLTableRowElement>,
    record?: any,
    rowIndex?: number
  ) {
    if (isClickOnInput(e) && !this.props.rowClickIgControl) {
      return;
    }

    const {onClick} = this.props;
    onClick && onClick(e, record, rowIndex);
  }

  onDoubleClick(
    event: React.ChangeEvent<any>,
    record?: any,
    rowIndex?: number
  ) {
    const {onDoubleClick} = this.props;
    onDoubleClick && onDoubleClick(event, record, rowIndex);
  }

  getExpandedIcons() {
    const {classnames: cx, isExpanded} = this.props;

    return isExpanded ? (
      <i
        className={cx('Table-expandBtn', 'is-active')}
        onClick={this.onCollapse}
      >
        <Icon icon="right-arrow-bold" className="icon" />
      </i>
    ) : (
      <i className={cx('Table-expandBtn')} onClick={this.onExpand}>
        <Icon icon="right-arrow-bold" className="icon" />
      </i>
    );
  }

  prependColumns(columns: Array<any>) {
    const {
      selectable,
      expandable,
      expandableFixed,
      draggable,
      rowSelectionFixed
    } = this.props;
    if (draggable) {
      columns.unshift({});
    } else {
      if (expandable) {
        columns.unshift({fixed: expandableFixed});
      }
      if (selectable) {
        columns.unshift({fixed: rowSelectionFixed});
      }
    }
  }

  updateFixedRow() {
    const {classnames: cx} = this.props;

    const columns = [...this.tdColumns];
    this.prependColumns(columns);

    if (hasFixedColumn(columns)) {
      updateFixedRow(this.domRef.current as HTMLTableRowElement, columns, cx);
    }
  }

  componentDidMount() {
    this.updateFixedRow();
  }

  componentDidUpdate() {
    this.updateFixedRow();
  }

  @autobind
  onCheckChange(value: boolean) {
    const {data} = this.props;
    this.props.onChange && this.props.onChange(value, data);
    event && event.stopPropagation();
  }

  render() {
    const {
      classnames: cx,
      isChecked,
      selectable,
      expandable,
      draggable,
      indentSize,
      rowClassName,
      lineHeight,
      levels,
      columns,
      data,
      isExpandable,
      rowIndex,
      keyField,
      colCount,
      isRightExpandable,
      isLeftExpandable,
      classPrefix,
      rowSelectionFixed,
      rowSelectionType,
      isExpandableRow,
      hasChildrenRow,
      hasChildrenChecked,
      expandedRowClassName,
      expandedRowRender,
      isExpanded,
      childrenColumnName,
      expandableFixed,
      onExpand,
      onCollapse,
      onMouseEnter,
      onMouseLeave,
      onClick,
      onChange,
      testIdBuilder,
      ...rest
    } = this.props;

    const {tdColumns} = getBuildColumns(columns);
    this.tdColumns = tdColumns;

    const level = levelsSplit(levels).length;
    // 设置缩进效果
    const indentDom =
      levels.length > 0 ? (
        <span
          className={cx('Table-row-indent', `indent-level-${level}`)}
          style={levels?.length > 0 ? {width: indentSize * level + 'px'} : {}}
        ></span>
      ) : null;

    const cells = tdColumns.map((item, i) => {
      // 为了支持灵活合并单元格，renderers层的Table2传递的render方法，返回{children: <ReactElement>, props: {rowSpan, colSpan}}
      // 但直接使用amis-ui的table，render方法一般直接返回ReactElement
      const cellIDBuilder = testIdBuilder?.getChild(`cell-${i}`);
      const render =
        item.render && typeof item.render === 'function'
          ? item.render(data[item.name], data, rowIndex, i, levelsSplit(levels))
          : null;
      let props = {rowSpan: 1, colSpan: 1};
      let children = render;
      if (render && !React.isValidElement(render) && isObject(render)) {
        if (render.props) {
          props = render.props;
        }
        children = render.children;
        // 如果合并行 且有展开行，那么合并行不生效
        if (props.rowSpan > 1 && isExpandableRow && hasChildrenRow) {
          props.rowSpan === 1;
        }
      }

      const className =
        typeof item.className === 'function'
          ? item.className(data, rowIndex)
          : '';
      return props.rowSpan === 0 || props.colSpan === 0 ? null : (
        <Cell
          classnames={cx}
          classPrefix={classPrefix}
          key={i}
          {...props}
          fixed={item.fixed === true ? 'left' : item.fixed}
          column={item}
          className={cx({
            [`${className}`]: !!className
          })}
          col={i > -1 ? i.toString() : undefined}
          testIdBuilder={cellIDBuilder}
        >
          <div
            className={cx('Table-cell-wrapper', {
              [cx('Table-cell-wrapper-prefix')]:
                i === 0 &&
                (!!indentDom || (levels.length === 0 && hasChildrenRow)),
              [cx(`Table-cell-height-${lineHeight}`)]: !!lineHeight
            })}
          >
            {i === 0 && levels.length > 0 ? indentDom : null}
            {i === 0 && hasChildrenRow ? this.getExpandedIcons() : null}
            {render ? children : data[item.name]}
          </div>
        </Cell>
      );
    });
    const rowClassNameClass =
      rowClassName && typeof rowClassName === 'function'
        ? rowClassName(data, rowIndex)
        : '';

    // 可展开和嵌套不能同时支持
    // 设置了expandable 数据源里有children也就不生效了
    // 拖拽排序 可选、可展开都先不支持了，可以支持嵌套展示
    const children =
      !draggable && isExpandableRow && isExpanded ? (
        <tr
          key="expandedRow"
          className={cx('Table-expanded-row', expandedRowClassName)}
        >
          <Cell
            key="expanded"
            classnames={cx}
            classPrefix={classPrefix}
            colSpan={tdColumns.length + colCount}
          >
            {expandable &&
            expandedRowRender &&
            typeof expandedRowRender === 'function'
              ? expandedRowRender(data, rowIndex)
              : null}
          </Cell>
        </tr>
      ) : null;

    const isRadio = rowSelectionType === 'radio';

    const expandableCell =
      !draggable && isExpandable ? (
        <Cell
          key="expandable"
          classnames={cx}
          classPrefix={classPrefix}
          fixed={
            expandable && expandableFixed
              ? isRightExpandable
                ? 'right'
                : 'left'
              : ''
          }
          className={cx('Table-cell-expand-icon-cell')}
        >
          {isExpandableRow || hasChildrenRow ? this.getExpandedIcons() : null}
        </Cell>
      ) : null;

    return [
      <tr
        ref={this.domRef}
        key={`${data[keyField || 'key'] || rowIndex}`} // 可能会拖拽排序，就不能用rowIndex作为key了，否则显示会有问题
        row-index={rowIndex}
        row-levels={levels}
        className={cx(
          'Table-row',
          `Table-row-level-${level}`,
          rowClassNameClass,
          {
            'Table-row-disabled': !!rest.disabled
          }
        )}
        onMouseEnter={e => this.onMouseEnter(e, data, rowIndex)}
        onMouseLeave={e => this.onMouseLeave(e, data, rowIndex)}
        onClick={e => this.onClick(e, data, rowIndex)}
        onDoubleClick={e => this.onDoubleClick(e, data, rowIndex)}
      >
        {draggable ? (
          <Cell
            key="drag"
            classPrefix={classPrefix}
            classnames={cx}
            className={cx('Table-dragCell')}
          >
            <Icon icon="drag-bar" className="icon"></Icon>
          </Cell>
        ) : null}
        {!draggable && selectable ? (
          <Cell
            key="select"
            classPrefix={classPrefix}
            classnames={cx}
            fixed={rowSelectionFixed ? 'left' : ''}
            className={cx('Table-checkCell')}
          >
            <CheckBox
              name={'Table-checkbox'}
              type={rowSelectionType || 'checkbox'}
              partial={!isRadio && hasChildrenChecked && !isChecked}
              checked={isRadio ? isChecked : hasChildrenChecked || isChecked}
              onChange={this.onCheckChange}
              {...rest}
            ></CheckBox>
          </Cell>
        ) : null}
        {isLeftExpandable ? expandableCell : null}
        {cells}
        {isRightExpandable ? expandableCell : null}
      </tr>,
      children
    ];
  }
}

export interface LazyRowProps extends Props {}

export interface LazyRowState {
  visible: boolean;
}

export default class LazyRow extends React.PureComponent<
  LazyRowProps,
  LazyRowState
> {
  constructor(props: LazyRowProps) {
    super(props);

    const {lazyRenderAfter, rowIndex} = props;

    this.state = {visible: rowIndex + 1 < lazyRenderAfter};
  }

  @autobind
  handleVisibleChange(visible: boolean, entry?: any) {
    this.setState({
      visible: visible
    });
  }

  render() {
    const visible = this.state.visible;
    const {columns, lazyRenderAfter, rowIndex, classnames: cx} = this.props;
    const {tdColumns} = getBuildColumns(columns);

    return (
      <InView
        onChange={this.handleVisibleChange}
        // 如果是嵌套层 默认从当前层来计算
        skip={rowIndex + 1 < lazyRenderAfter}
      >
        {({ref}) => {
          return visible ? (
            <BodyRow {...this.props} />
          ) : (
            <tr ref={ref}>
              {tdColumns.map((column: ColumnProps, index: number) => {
                return (
                  <td key={`empty-cell-${index}`}>
                    <div className={cx('Table-emptyBlock')}>&nbsp;</div>
                  </td>
                );
              })}
            </tr>
          );
        }}
      </InView>
    );
  }
}
