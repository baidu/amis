import {
  IColumn,
  IRow,
  ITableStore,
  PlainObject,
  SchemaNode,
  ThemeProps,
  resolveVariable,
  buildTrackExpression,
  evalTrackExpression,
  TestIdBuilder
} from 'amis-core';
import {BadgeObject, Checkbox, Icon, Spinner} from 'amis-ui';
import React from 'react';

export interface CellProps extends ThemeProps {
  region: string;
  column: IColumn;
  item: IRow;
  props: PlainObject;
  ignoreDrag?: boolean;
  render: (
    region: string,
    node: SchemaNode,
    props?: PlainObject
  ) => JSX.Element;
  filterItemIndex?: (index: number | string, item: any) => string | number;
  store: ITableStore;
  multiple: boolean;
  canAccessSuperData?: boolean;
  itemBadge?: BadgeObject;
  onCheck?: (item: IRow, value?: boolean, shift?: boolean) => void;
  onDragStart?: (e: React.DragEvent) => void;
  popOverContainer?: any;
  quickEditFormRef: any;
  onImageEnlarge?: any;
  translate: (key: string, ...args: Array<any>) => string;
  testIdBuilder?: TestIdBuilder;
  offset?: number;
}

export default function Cell({
  region,
  column,
  item,
  props,
  ignoreDrag,
  render,
  filterItemIndex,
  store,
  multiple,
  itemBadge,
  classnames: cx,
  classPrefix: ns,
  canAccessSuperData,
  onCheck,
  onDragStart,
  popOverContainer,
  quickEditFormRef,
  onImageEnlarge,
  translate: __,
  testIdBuilder,
  offset
}: CellProps) {
  if (column.name && item.rowSpans[column.name] === 0) {
    return null;
  }

  const [style, stickyClassName]: any = React.useMemo(() => {
    const style = {...column.pristine.style};
    const [stickyStyle, stickyClassName] = store.getStickyStyles(
      column,
      store.filteredColumns
    );
    return [Object.assign(style, stickyStyle), stickyClassName];
  }, []);

  const onCheckboxChange = React.useCallback(
    (value: boolean, shiftKey?: boolean) => {
      onCheck?.(item, value, shiftKey);
    },
    []
  );

  let [prefix, affix, addtionalClassName] = React.useMemo(() => {
    let prefix: React.ReactNode[] = [];
    let affix: React.ReactNode[] = [];
    let addtionalClassName = '';

    if (column.isPrimary && store.isNested) {
      addtionalClassName = 'Table-primayCell';
      prefix.push(
        <span
          key="indent"
          className={cx('Table-indent')}
          style={item.indentStyle}
        />
      );
      prefix.push(
        item.loading ? (
          <Spinner key="loading" size="sm" show />
        ) : item.error ? (
          <a
            className={cx('Table-retryBtn')}
            key="retryBtn"
            onClick={item.resetDefered}
            data-tooltip={__('Options.retry', {reason: item.error})}
            {...testIdBuilder?.getChild('retry').getTestId()}
          >
            <Icon icon="retry" className="icon" />
          </a>
        ) : item.expandable ? (
          <a
            key="expandBtn2"
            className={cx('Table-expandBtn2', item.expanded ? 'is-active' : '')}
            // data-tooltip="展开/收起"
            // data-position="top"
            onClick={item.toggleExpanded}
            {...testIdBuilder
              ?.getChild(item.expanded ? 'fold' : 'expand')
              .getTestId()}
          >
            <Icon icon="right-arrow-bold" className="icon" />
          </a>
        ) : (
          <span key="expandSpace" className={cx('Table-expandSpace')} />
        )
      );
    }

    if (
      !ignoreDrag &&
      column.isPrimary &&
      store.isNested &&
      store.draggable &&
      item.draggable
    ) {
      affix.push(
        <a
          key="dragBtn"
          draggable
          onDragStart={onDragStart}
          className={cx('Table-dragBtn')}
          {...testIdBuilder?.getChild('drag').getTestId()}
        >
          <Icon icon="drag" className="icon" />
        </a>
      );
    }
    return [prefix, affix, addtionalClassName];
  }, [
    item.expandable,
    item.expanded,
    item.error,
    item.loading,
    column.isPrimary,
    store.isNested
  ]);

  // 根据条件缓存 data，避免孩子重复渲染
  const hasCustomTrackExpression =
    typeof column.pristine.trackExpression !== 'undefined';
  const trackExpression = hasCustomTrackExpression
    ? column.pristine.trackExpression
    : React.useMemo(() => buildTrackExpression(column.pristine), []);
  const data = React.useMemo(
    () => item.locals,
    [
      hasCustomTrackExpression ? '' : JSON.stringify(item.locals),
      evalTrackExpression(trackExpression, item.locals)
    ]
  );

  const finalCanAccessSuperData =
    column.pristine.canAccessSuperData ?? canAccessSuperData;
  const subProps: any = {
    ...props,
    // 操作列不下发loading，否则会导致操作栏里面的所有按钮都出现loading
    loading: column.type === 'operation' ? false : props.loading,
    btnDisabled: store.dragging,
    data: data,

    // 不要下发 value，组件基本上都会自己取
    // 如果下发了表单项会认为是 controlled value
    // 就不会去跑 extraName 之类的逻辑了
    // value: column.name
    //   ? resolveVariable(
    //       column.name,
    //       finalCanAccessSuperData ? item.locals : item.data
    //     )
    //   : column.value,
    popOverContainer: popOverContainer,
    rowSpan: item.rowSpans[column.name as string],
    quickEditFormRef: quickEditFormRef,
    cellPrefix: prefix,
    cellAffix: affix,
    onImageEnlarge: onImageEnlarge,
    canAccessSuperData: finalCanAccessSuperData,
    row: item,
    itemBadge,
    showBadge:
      !props.isHead &&
      itemBadge &&
      store.firstToggledColumnIndex === props.colIndex,
    onQuery: undefined,
    style,
    className: cx(
      column.pristine.className,
      stickyClassName,
      addtionalClassName
    ),
    testIdBuilder: testIdBuilder?.getChild(column.name || column.value)
  };
  delete subProps.label;

  if (column.type === '__checkme') {
    return (
      <td
        style={style}
        className={cx(column.pristine.className, stickyClassName)}
        {...testIdBuilder?.getTestId()}
      >
        <Checkbox
          classPrefix={ns}
          type={multiple ? 'checkbox' : 'radio'}
          partial={multiple ? item.partial : false}
          checked={item.checked || (multiple ? item.partial : false)}
          disabled={item.checkdisable || !item.checkable}
          onChange={onCheckboxChange}
          testIdBuilder={testIdBuilder?.getChild('chekbx')}
        />
      </td>
    );
  } else if (column.type === '__dragme') {
    return (
      <td
        style={style}
        className={cx(column.pristine.className, stickyClassName, {
          'is-dragDisabled': !item.draggable
        })}
        {...testIdBuilder?.getChild('drag').getTestId()}
      >
        {item.draggable ? <Icon icon="drag" className="icon" /> : null}
      </td>
    );
  } else if (column.type === '__expandme') {
    return (
      <td
        style={style}
        className={cx(column.pristine.className, stickyClassName)}
      >
        {item.expandable ? (
          <a
            className={cx('Table-expandBtn', item.expanded ? 'is-active' : '')}
            // data-tooltip="展开/收起"
            // data-position="top"
            onClick={item.toggleExpanded}
            {...testIdBuilder
              ?.getChild(item.expanded ? 'fold' : 'expand')
              .getTestId()}
          >
            <Icon icon="right-arrow-bold" className="icon" />
          </a>
        ) : null}
      </td>
    );
  } else if (column.type === '__index') {
    return (
      <td
        style={style}
        className={cx(column.pristine.className, stickyClassName)}
      >
        {`${filterItemIndex ? filterItemIndex(item.path, item) : item.path}`
          .split('.')
          .map(a => parseInt(a, 10) + 1 + (offset || 0))
          .join('.')}
      </td>
    );
  }

  return render(
    region,
    {
      ...column.pristine,
      // 因为列本身已经做过显隐判断了，单元格不应该再处理
      visibleOn: '',
      hiddenOn: '',
      visible: true,
      hidden: false,
      column: column.pristine,
      type: 'cell'
    },
    subProps
  );
}
