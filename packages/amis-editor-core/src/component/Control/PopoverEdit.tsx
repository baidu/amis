/**
 * @file 浮窗编辑
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import {FormItem, Button, Overlay, PopOver, Icon, Switch} from 'amis';

import {isObject, autobind} from '../../util';

import type {Action} from 'amis/lib/types';
import type {IScopedContext} from 'amis-core';

import type {FormControlProps} from 'amis-core';
import type {FormSchema} from 'amis/lib/Schema';
import type {Offset} from 'amis-ui/lib/components/PopOver';

export interface PopoverEditProps extends FormControlProps {
  className?: string;
  popOverclassName?: string;
  btnLabel?: string;
  btnIcon?: string;
  iconPosition?: 'right' | 'left';
  mode: 'popover' | 'dialog';
  form: Omit<FormSchema, 'type'>;
  rootClose?: boolean;
  placement?: string;
  offset?: ((clip: object, offset: object) => Offset) | Offset;
  style?: object;
  overlay?: boolean;
  container?: React.ReactNode | Function;
  target?: React.ReactNode | Function;
  trueValue?: any;
  falseValue?: any;
  enableEdit?: boolean;
  removable?: boolean;
  onClose: (e: React.UIEvent<any> | void) => void;
}

interface PopoverEditState {
  /**
   * 是否展示编辑窗口
   */
  show: boolean;

  /**
   * 是否开启编辑
   */
  checked: boolean;
}

export class PopoverEdit extends React.Component<
  PopoverEditProps,
  PopoverEditState
> {
  static defaultProps: Pick<
    PopoverEditProps,
    | 'btnIcon'
    | 'iconPosition'
    | 'container'
    | 'placement'
    | 'overlay'
    | 'rootClose'
    | 'mode'
    | 'trueValue'
    | 'falseValue'
    | 'enableEdit'
  > = {
    btnIcon: 'pencil',
    iconPosition: 'right',
    container: document.body,
    placement: 'left',
    overlay: true,
    rootClose: false,
    mode: 'popover',
    trueValue: true,
    falseValue: false,
    enableEdit: true
  };

  overlay: HTMLElement | null;

  constructor(props: PopoverEditProps) {
    super(props);

    this.state = {
      show: false,
      checked: !!props.value
    };
  }

  @autobind
  overlayRef(ref: any) {
    this.overlay = ref ? (findDOMNode(ref) as HTMLElement) : null;
  }

  @autobind
  openPopover() {
    this.setState({show: true});
  }

  @autobind
  closePopover() {
    this.setState({show: false});
  }

  @autobind
  handleDelete(e: React.UIEvent<any> | void) {
    const {onDelete} = this.props;

    onDelete && onDelete(e);
  }

  @autobind
  handleSwitchChange(checked: boolean) {
    const {onChange, enableEdit} = this.props;

    this.setState({checked});

    if (!enableEdit) {
      onChange && onChange(checked);
    } else {
      // undefined字段会从schema中删除
      !checked && onChange && onChange(undefined);
    }
  }

  @autobind
  handleSubmit(values: any, action: any) {
    const {onChange} = this.props;

    onChange && onChange(values);
  }

  @autobind
  handleAction(
    e: React.UIEvent<any> | void,
    action: Action,
    data: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ) {
    const {onClose} = this.props;

    if (action.actionType === 'close') {
      this.setState({show: false});
      onClose && onClose(e);
    }
  }

  renderPopover() {
    const {
      render,
      popOverclassName,
      overlay,
      offset,
      target,
      container,
      placement,
      rootClose,
      style,
      title,
      label,
      form,
      name,
      data: ctx
    } = this.props;

    return (
      <Overlay
        show
        rootClose={rootClose}
        placement={placement}
        target={target || this.overlay}
        container={container}
      >
        <PopOver
          className={cx('ae-PopoverEdit-popover', popOverclassName)}
          placement={placement}
          overlay={overlay}
          offset={offset}
          style={style}
        >
          <header>
            <p className="ae-PopoverEdit-title">{title || label}</p>
            <a onClick={this.closePopover} className="ae-PopoverEdit-close">
              <Icon icon="close" className="icon" />
            </a>
          </header>
          {isObject(form)
            ? render(
                'popover-edit-form',
                {
                  type: 'form',
                  wrapWithPanel: false,
                  panelClassName: 'border-none shadow-none mb-0',
                  bodyClassName: 'p-none',
                  actionsClassName: 'border-none mt-2.5',
                  wrapperComponent: 'div',
                  mode: 'horizontal',
                  autoFocus: true,
                  formLazyChange: true,
                  preventEnterSubmit: true,
                  submitOnChange: true,
                  data: ctx && name ? ctx?.[name] : {},
                  ...form
                },
                {
                  onSubmit: this.handleSubmit
                }
              )
            : null}
        </PopOver>
      </Overlay>
    );
  }

  render() {
    const {
      render,
      removable,
      btnIcon,
      btnLabel,
      iconPosition,
      disabled,
      enableEdit,
      className
    } = this.props;
    const {show, checked} = this.state;
    const btnLabelNode = btnLabel ? <span>{btnLabel}</span> : null;

    return (
      <div className={cx('ae-PopoverEditControl', className)}>
        {enableEdit && checked && !disabled ? (
          <Button
            level="link"
            size="sm"
            ref={this.overlayRef}
            onClick={this.openPopover}
          >
            {iconPosition === 'right' ? (
              <>
                {btnLabelNode}
                <Icon icon={btnIcon} className="icon" />
              </>
            ) : (
              <>
                <Icon icon={btnIcon} className="icon" />
                {btnLabelNode}
              </>
            )}
          </Button>
        ) : null}

        {removable ? (
          <Button level="link" size="sm" onClick={this.handleDelete}>
            <Icon icon="delete-btn" className="icon" />
          </Button>
        ) : null}

        <Switch
          value={checked}
          onChange={this.handleSwitchChange}
          disabled={disabled}
        />

        {show ? this.renderPopover() : null}
      </div>
    );
  }
}

@FormItem({
  type: 'popover-edit'
})
export class PopoverEditRenderer extends PopoverEdit {}
