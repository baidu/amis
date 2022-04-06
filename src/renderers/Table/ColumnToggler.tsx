import React from 'react';
import {findDOMNode} from 'react-dom';
import Sortable from 'sortablejs';
import cloneDeep from 'lodash/cloneDeep';
import {RendererProps} from '../../factory';
import Overlay from '../../components/Overlay';
import PopOver from '../../components/PopOver';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import TooltipWrapper from '../../components/TooltipWrapper';
import type {TooltipObject} from '../../components/TooltipWrapper';
import {noop, autobind} from '../../utils/helper';
import {filter} from '../../utils/tpl';
import {Icon} from '../../components/icons';
import {getIcon} from '../../components/icons';
import {generateIcon} from '../../utils/icon';
import {RootClose} from '../../utils/RootClose';
import {IColumn} from '../../store/table';

export interface ColumnTogglerProps extends RendererProps {
  /**
   * 按钮文字
   */
  label?: string | React.ReactNode;

  /**
   * 按钮提示文字，hover focus 时显示
   */
  tooltip?: string | TooltipObject;

  /**
   * 禁用状态下的提示
   */
  disabledTip?: string | TooltipObject;

  /**
   * 点击外部是否关闭
   */
  closeOnOutside?: boolean;

  /**
   * 点击内容是否关闭
   */
  closeOnClick?: boolean;

  /**
   * 下拉菜单对齐方式
   */
  align?: 'left' | 'right';

  /**
   *  ColumnToggler的CSS类名
   */
  className?: string;

  /**
   * 按钮的CSS类名
   */
  btnClassName?: string;

  /**
   * 按钮大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';

  /**
   * 按钮级别，样式
   */
  level?: 'info' | 'success' | 'danger' | 'warning' | 'primary' | 'link';

  /**
   * 是否独占一行 `display: block`
   */
  block?: boolean;

  /**
   * 是否可通过拖拽排序
   */
  draggable?: boolean;

  /**
   * 默认是否展开
   */
  defaultIsOpened?: boolean;

  /**
   * 激活状态
   */
  isActived?: boolean;

  /**
   * ICON名称
   */
  icon?: string | React.ReactNode;

  /**
   * 是否只显示图标。
   */
  iconOnly?: boolean;

  /**
   * 是否隐藏展开的Icon
   */
  hideExpandIcon?: boolean;

  /**
   * 是否显示遮罩层
   */
  overlay?: boolean;

  /**
   * 列数据
   */
  columns: Array<IColumn>;

  /**
   * 弹窗底部按钮大小
   */
  footerBtnSize?: 'xs' | 'sm' | 'md' | 'lg';

  onColumnToggle: (columns: Array<IColumn>) => void;
  modalContainer?: () => HTMLElement;
}

export interface ColumnTogglerState {
  isOpened: boolean;
  enableSorting: boolean;
  tempColumns: any[];
}

export default class ColumnToggler extends React.Component<
  ColumnTogglerProps,
  ColumnTogglerState
> {
  state: ColumnTogglerState = {
    isOpened: false,
    enableSorting: false,
    tempColumns: cloneDeep(this.props.columns)
  };

  static defaultProps: Pick<
    ColumnTogglerProps,
    'placement' | 'tooltipTrigger' | 'tooltipRootClose' | 'draggable'
  > = {
    placement: 'top',
    tooltipTrigger: ['hover', 'focus'],
    tooltipRootClose: false,
    draggable: false
  };

  target: any;
  sortable?: Sortable;
  dragRefDOM: HTMLElement;

  constructor(props: ColumnTogglerProps) {
    super(props);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
    this.domRef = this.domRef.bind(this);
    this.dragRef = this.dragRef.bind(this);
  }

  componentDidMount() {
    if (this.props.defaultIsOpened) {
      this.setState({
        isOpened: true
      });
    }
  }

  componentWillUnmount() {
    this.destroyDragging();
  }

  domRef(ref: any) {
    this.target = ref;
  }

  toggle(e: React.MouseEvent<any>) {
    e.preventDefault();

    this.setState({
      isOpened: !this.state.isOpened
    });
  }

  open() {
    this.setState({
      isOpened: true
    });
  }

  close() {
    this.setState({
      isOpened: false,
      enableSorting: false,
      tempColumns: cloneDeep(this.props.columns)
    });
  }

  swapColumnPosition(oldIndex: number, newIndex: number) {
    const columns = this.state.tempColumns;

    columns[oldIndex] = columns.splice(newIndex, 1, columns[oldIndex])[0];
    this.setState({tempColumns: columns});
  }

  updateToggledColumn(
    column: IColumn,
    index: number,
    value: any,
    shift?: boolean
  ) {
    const tempColumns = this.state.tempColumns.concat();

    tempColumns.splice(index, 1, {
      ...column,
      toggled: value
    });
    this.setState({tempColumns});
  }

  @autobind
  dragRef(ref: any) {
    const {enableSorting} = this.state;
    const {draggable} = this.props;

    if (enableSorting && draggable && ref) {
      this.initDragging();
    }
  }

  initDragging() {
    const dom = findDOMNode(this) as HTMLElement;
    const ns = this.props.classPrefix;

    this.sortable = new Sortable(
      dom.querySelector(`.${ns}ColumnToggler-modal-content`) as HTMLElement,
      {
        group: `ColumnToggler-modal-content`,
        animation: 150,
        handle: `.${ns}ColumnToggler-menuItem-dragBar`,
        ghostClass: `${ns}ColumnToggler-menuItem--dragging`,
        onEnd: (e: any) => {
          if (e.newIndex === e.oldIndex) {
            return;
          }

          const parent = e.to as HTMLElement;
          if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
          } else {
            parent.appendChild(e.item);
          }

          this.swapColumnPosition(e.oldIndex, e.newIndex);
        }
      }
    );
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  @autobind
  onConfirm() {
    const {tempColumns} = this.state;
    const {onColumnToggle} = this.props;

    onColumnToggle && onColumnToggle([...tempColumns]);
    this.setState({
      isOpened: false,
      enableSorting: false
    });
  }

  renderOuter() {
    const {
      popOverContainer,
      classnames: cx,
      classPrefix: ns,
      children,
      closeOnClick,
      closeOnOutside
    } = this.props;
    const body = (
      <RootClose
        disabled={!this.state.isOpened}
        onRootClose={closeOnOutside !== false ? this.close : noop}
      >
        {(ref: any) => {
          return (
            <ul
              className={cx('ColumnToggler-menu')}
              onClick={closeOnClick ? this.close : noop}
              ref={ref}
            >
              {children}
            </ul>
          );
        }}
      </RootClose>
    );

    if (popOverContainer) {
      return (
        <Overlay container={popOverContainer} target={() => this.target} show>
          <PopOver
            overlay
            onHide={this.close}
            classPrefix={ns}
            className={cx('ColumnToggler-popover')}
            style={{minWidth: this.target?.offsetWidth}}
          >
            {body}
          </PopOver>
        </Overlay>
      );
    }

    return body;
  }

  renderModal() {
    const {
      render,
      classnames: cx,
      classPrefix: ns,
      modalContainer,
      draggable,
      overlay,
      translate: __,
      footerBtnSize
    } = this.props;

    const {enableSorting, tempColumns} = this.state;

    return (
      <>
        <Modal
          closeOnEsc
          onHide={this.close}
          show={this.state.isOpened}
          contentClassName={cx('ColumnToggler-modal')}
          container={modalContainer || this.target}
          overlay={typeof overlay === 'boolean' ? overlay : false}
        >
          <header className={cx('ColumnToggler-modal-header')}>
            <span className={cx('ColumnToggler-modal-title')}>
              {__('Table.columnsVisibility')}
            </span>
            <a
              data-tooltip={__('Dialog.close')}
              data-position="left"
              className={cx('Modal-close')}
              onClick={this.close}
            >
              <Icon icon="close" className="icon" />
            </a>
          </header>

          <ul className={cx('ColumnToggler-modal-content')} ref={this.dragRef}>
            {Array.isArray(tempColumns)
              ? tempColumns.map((column, index) => (
                  <TooltipWrapper
                    tooltipClassName={cx('ColumnToggler-tooltip')}
                    placement="top"
                    tooltip={column.label || ''}
                    trigger={enableSorting ? [] : 'hover'}
                    key={column.index}
                  >
                    <li
                      className={cx('ColumnToggler-menuItem')}
                      key={column.index}
                    >
                      {enableSorting && draggable && tempColumns.length > 1 ? (
                        <>
                          <a className={cx('ColumnToggler-menuItem-dragBar')}>
                            <Icon icon="drag-bar" className={cx('icon')} />
                          </a>
                          <span className={cx('ColumnToggler-menuItem-label')}>
                            <span>{column.label || '-'}</span>
                          </span>
                        </>
                      ) : (
                        <Checkbox
                          size="sm"
                          labelClassName={cx('ColumnToggler-menuItem-label')}
                          classPrefix={ns}
                          checked={column.toggled}
                          disabled={!column.toggable || enableSorting}
                          onChange={this.updateToggledColumn.bind(
                            this,
                            column,
                            index
                          )}
                        >
                          <span>{column.label || '-'}</span>
                        </Checkbox>
                      )}
                    </li>
                  </TooltipWrapper>
                ))
              : null}
          </ul>

          <footer className={cx('ColumnToggler-modal-footer')}>
            <div>
              <Button
                className={cx(`ColumnToggler-modeSelect`, {
                  'is-actived': !enableSorting
                })}
                onClick={() => this.setState({enableSorting: false})}
                level="link"
              >
                {__('Table.toggleColumn')}
              </Button>
              <Button
                className={cx(`ColumnToggler-modeSelect`, {
                  'is-actived': enableSorting
                })}
                onClick={() =>
                  this.setState(
                    {enableSorting: true},
                    () =>
                      this.state.enableSorting &&
                      this.props.draggable &&
                      this.initDragging()
                  )
                }
                level="link"
                disabled={tempColumns.length < 2}
              >
                {__('sort')}
              </Button>
            </div>
            <div>
              <Button
                size={footerBtnSize}
                className="mr-3"
                onClick={this.close}
              >
                {__('cancel')}
              </Button>
              <Button
                size={footerBtnSize}
                level="primary"
                onClick={this.onConfirm}
              >
                {__('confirm')}
              </Button>
            </div>
          </footer>
        </Modal>
      </>
    );
  }

  render() {
    const {
      tooltip,
      placement,
      tooltipContainer,
      tooltipTrigger,
      tooltipRootClose,
      disabledTip,
      block,
      disabled,
      btnDisabled,
      btnClassName,
      size,
      label,
      level,
      primary,
      className,
      classnames: cx,
      align,
      iconOnly,
      icon,
      isActived,
      data,
      draggable,
      hideExpandIcon
    } = this.props;

    const button = (
      <button
        onClick={this.toggle}
        disabled={disabled || btnDisabled}
        className={cx(
          'Button',
          btnClassName,
          typeof level === 'undefined'
            ? 'Button--default'
            : level
            ? `Button--${level}`
            : '',
          {
            'Button--block': block,
            'Button--primary': primary,
            'Button--iconOnly': iconOnly
          },
          size ? `Button--${size}` : ''
        )}
      >
        {icon ? (
          typeof icon === 'string' ? (
            getIcon(icon!) ? (
              <Icon icon={icon} className={cx('icon', {'m-r-xs': !!label})} />
            ) : (
              generateIcon(cx, icon, label ? 'm-r-xs' : '')
            )
          ) : React.isValidElement(icon) ? (
            React.cloneElement(icon, {
              className: cx({'m-r-xs': !!label})
            })
          ) : (
            <Icon icon="columns" className="icon m-r-none" />
          )
        ) : (
          <Icon icon="columns" className="icon m-r-none" />
        )}
        {typeof label === 'string' ? filter(label, data) : label}
        {hideExpandIcon || draggable ? null : (
          <span className={cx('ColumnToggler-caret')}>
            <Icon icon="caret" className="icon" />
          </span>
        )}
      </button>
    );

    return (
      <div
        className={cx(
          'ColumnToggler',
          {
            'ColumnToggler-block': block,
            'ColumnToggler--alignRight': align === 'right',
            'is-opened': this.state.isOpened,
            'is-actived': isActived
          },
          className
        )}
        ref={this.domRef}
      >
        {draggable ? (
          button
        ) : (
          <TooltipWrapper
            placement={placement}
            tooltip={disabled ? disabledTip : tooltip}
            container={tooltipContainer}
            trigger={tooltipTrigger}
            rootClose={tooltipRootClose}
          >
            {button}
          </TooltipWrapper>
        )}
        {this.state.isOpened
          ? draggable
            ? this.renderModal()
            : this.renderOuter()
          : null}
      </div>
    );
  }
}
