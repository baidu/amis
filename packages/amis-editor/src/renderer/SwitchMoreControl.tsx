/**
 * @file 开关 + 更多编辑组合控件
 * 使用时需关注所有的配置项是一个object还是整个data中，可使用bulk来区分
 *
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import {FormItem, Button, Overlay, PopOver, Icon, Switch} from 'amis';

import {isObject, autobind} from 'amis-editor-core';

import type {Action} from 'amis/lib/types';
import type {SchemaCollection} from 'amis/lib/Schema';
import type {IScopedContext} from 'amis-core';
import type {FormSchema} from 'amis/lib/schema';
import type {FormControlProps} from 'amis-core';
import {fromPairs, some} from 'lodash';

export interface SwitchMoreProps extends FormControlProps {
  className?: string;
  // popOverclassName?: string;
  // btnLabel?: string;
  // btnIcon?: string;
  // iconPosition?: 'right' | 'left';
  form?: Omit<FormSchema, 'type'>; // 更多编辑的表单
  formType: 'extend' | 'dialog' | 'pop'; // 更多编辑的出现方式
  body?: SchemaCollection;
  rootClose?: boolean;
  autoFocus?: boolean;
  // placement?: string;
  // offset?: ((clip: object, offset: object) => Offset) | Offset;
  // style?: object;
  overlay?: boolean;
  container?: React.ReactNode | Function;
  target?: React.ReactNode | Function;
  trueValue?: any;
  falseValue?: any;
  // editable?: boolean;
  removable?: boolean; // 是否可删除此项配置
  hiddenOnDefault?: boolean; // bulk且不配置时 默认收起
  bulk?: boolean; // 是否是一个综合object属性，若是，最终提交所有项覆盖到表单data，否则提交为 [name] 一项,
  onRemove?: (e: React.UIEvent<any> | void) => void;
  onClose: (e: React.UIEvent<any> | void) => void;
  defaultData?: any; // 默认数据
}

interface SwitchMoreState {
  /**
   * 是否展示更多编辑内容
   */
  show: boolean;

  /**
   * 是否开启编辑
   */
  checked: boolean;
}

export default class SwitchMore extends React.Component<
  SwitchMoreProps,
  SwitchMoreState
> {
  static defaultProps: Pick<
    SwitchMoreProps,
    // | 'btnIcon'
    // | 'iconPosition'
    | 'container'
    | 'autoFocus'
    // | 'placement'
    | 'overlay'
    | 'rootClose'
    | 'trueValue'
    | 'falseValue'
    | 'formType'
    | 'bulk'
    // | 'editable'
  > = {
    // btnIcon: 'pencil',
    // iconPosition: 'right',
    container: document.body,
    autoFocus: true,
    // placement: 'left',
    overlay: true,
    rootClose: false,
    trueValue: true,
    falseValue: false,
    formType: 'pop',
    bulk: true
    // editable: true
  };

  overlay: HTMLElement | null;
  formNames: null | Array<string>;

  constructor(props: SwitchMoreProps) {
    super(props);
    this.state = this.initState();
  }

  initState() {
    const {data, value, name, bulk, hiddenOnDefault} = this.props;
    let checked = false;
    let show = false;

    // 这个开关 无具体属性对应
    if (!name) {
      // 子表单项是组件根属性，遍历看是否有值
      if (bulk) {
        const formNames = this.getFormItemNames();
        checked = some(formNames, key => data[key] !== undefined);
        show = checked;
      } else {
        checked = value != null;
      }
    } else {
      checked = !!value;
    }

    // 开关有属性对应
    return {
      checked,
      show
    };
  }

  getFormItemNames() {
    const {form} = this.props;

    const formNames =
      form && Array.isArray(form?.body)
        ? form.body
            .map((item: any) =>
              typeof item === 'string' ? undefined : item?.name
            )
            .filter(name => name)
        : [];

    return formNames;
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
  toogleExtend() {
    this.setState({show: !this.state.show});
  }

  @autobind
  closePopover() {
    this.setState({show: false});
  }

  @autobind
  handleDelete(e: React.UIEvent<any> | void) {
    const {onRemove} = this.props;

    onRemove && onRemove(e);
  }

  @autobind
  handleSwitchChange(checked: boolean) {
    const {onBulkChange, onChange, bulk, defaultData, name} = this.props;

    this.setState({checked});

    // 子表单项是组件根属性，用bulk处理所有属性
    if (bulk) {
      // 选中后，给一个默认 {} 或 配置的默认值
      if (checked) {
        let data = defaultData ? {...defaultData} : {};
        name && (data[name] = true);
        onBulkChange && onBulkChange(data);
      }
      // 取消选中后，讲所有字段重置
      else {
        const values = fromPairs(
          this.getFormItemNames().map(i => [i, undefined])
        );
        name && (values[name] = false);
        onBulkChange && onBulkChange(values);
      }
      return;
    }
    onChange(checked ? defaultData || true : undefined);
  }

  @autobind
  handleSubmit(values: any) {
    const {onChange, onBulkChange, bulk} = this.props;

    if (bulk) {
      onBulkChange && onBulkChange(values);
    } else {
      onChange && onChange(values);
    }
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

  renderActions() {
    const {render, removable, disabled, form, formType, hiddenOnDefault, bulk} =
      this.props;
    const {checked, show} = this.state;

    if (!form || !checked || disabled) {
      return null;
    }

    const actions = [];
    if (formType === 'dialog') {
      actions.push(
        render('switch-more-form', this.renderDialogMore(), {
          key: 'edit',
          onSubmit: this.handleSubmit
        })
      );
    } else if (formType === 'pop') {
      actions.push(
        <Button
          key="edit"
          level="link"
          size="sm"
          className="action-btn"
          ref={this.overlayRef}
          onClick={this.openPopover}
        >
          <Icon icon="pencil" className="icon" />
        </Button>
      );
    } else if (bulk && hiddenOnDefault && formType === 'extend') {
      actions.push(
        <div
          key="open"
          data-tooltip={!show ? '展开更多' : undefined}
          data-position="bottom"
        >
          <Button
            level="link"
            size="sm"
            className={'action-btn open-btn' + (show ? ' opening' : '')}
            onClick={this.toogleExtend}
          >
            <Icon icon="caret" className="icon" />
          </Button>
        </div>
      );
    }

    if (removable) {
      actions.push(
        <Button key="remove" level="link" size="sm" onClick={this.handleDelete}>
          <Icon icon="delete-btn" className="icon ae-SwitchMore-icon" />
        </Button>
      );
    }

    return actions;
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
      title
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
          className={cx('ae-SwitchMore-popover', popOverclassName)}
          placement={placement}
          overlay={overlay}
          offset={offset}
          style={style}
        >
          <header>
            <p className="ae-SwitchMore-title">{title || '更多配置'}</p>
            <a onClick={this.closePopover} className="ae-SwitchMore-close">
              <Icon icon="close" className="icon" />
            </a>
          </header>
          {render('switch-more-form', this.renderForm(), {
            onSubmit: this.handleSubmit
          })}
        </PopOver>
      </Overlay>
    );
  }

  renderExtend() {
    const {render, form, bulk, hiddenOnDefault} = this.props;
    const {show} = this.state;

    if (hiddenOnDefault && !show) {
      return null;
    }

    return (
      <div>
        <div className={cx('ae-SwitchMore-content', 'inFormItem')}>
          {render('switch-more-form', this.renderForm(), {
            onSubmit: this.handleSubmit
          })}
        </div>
      </div>
    );
  }

  renderDialogMore() {
    return {
      type: 'input-sub-form',
      btnLabel: '',
      className: 'inline-block m-0 h-6',
      itemClassName: 'bg-white hover:bg-white m-0 p-0',
      icon: 'fa fa-cog',
      form: {
        title: this.props.label,
        ...this.renderForm()
      }
    };
  }

  renderForm() {
    const {
      form,
      name,
      formType,
      data: ctx,
      bulk,
      defaultData,
      autoFocus
    } = this.props;

    return {
      type: 'form',
      wrapWithPanel: false,
      panelClassName: 'border-none shadow-none mb-0',
      actionsClassName: 'border-none mt-2.5',
      wrapperComponent: 'div',
      mode: 'horizontal',
      horizontal: {
        justify: true,
        left: 4
      },
      autoFocus: autoFocus,
      formLazyChange: true,
      preventEnterSubmit: true,
      submitOnChange: ['pop', 'extend'].includes(formType),
      data:
        ctx && name && !bulk ? ctx![name] ?? defaultData : defaultData ?? {},
      ...form
    };
  }

  renderMoreSection() {
    const {formType} = this.props;
    const {show, checked} = this.state;

    if (!checked) {
      return null;
    }

    if (formType === 'pop') {
      return show ? this.renderPopover() : null;
    } else if (formType === 'extend') {
      return this.renderExtend();
    }

    return null;
  }

  render() {
    const {
      render,
      disabled,
      className,
      body,
      env,
      hidden,
      formType,
      onText,
      offText
    } = this.props;

    if (hidden) {
      return null;
    }

    const {show, checked} = this.state;
    const actions = this.renderActions();

    const classPrefix = env?.theme?.classPrefix;

    return (
      <div
        className={cx('ae-SwitchMore', 'ae-SwitchMore-' + formType, className)}
      >
        <div className={cx('ae-SwitchMore-switch')}>
          {body ? render('body', body) : null}
          {actions && actions.length ? (
            <div className="ae-SwitchMore-actions">
              {actions}
              {checked ? <hr /> : null}
            </div>
          ) : null}
          <Switch
            value={checked}
            onChange={this.handleSwitchChange}
            disabled={disabled}
            onText={onText}
            offText={offText}
          />
        </div>

        {this.renderMoreSection()}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-switch-more'
})
export class SwitchMoreRenderer extends SwitchMore {}
