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

import type {Action} from 'amis';
import type {SchemaCollection} from 'amis';
import type {IScopedContext} from 'amis-core';
import type {FormSchema} from 'amis';
import type {FormControlProps} from 'amis-core';
import fromPairs from 'lodash/fromPairs';
import some from 'lodash/some';
import pick from 'lodash/pick';

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
  container?: HTMLElement | (() => HTMLElement);
  target?: React.ReactNode | Function;
  // editable?: boolean;
  removable?: boolean; // 是否可删除此项配置
  hiddenOnDefault?: boolean; // bulk且不配置时 默认收起
  /**
   *
   * bulk是指extend的内容是和name为平级还是子级，会产生几种情况：
   * 1. 有name 且bulk为false时，代表这个属性不是一个boolean值，而是一个object，有值=开启，无值=关闭  {kaiguan: {extend: xxx}}
   * 2. 有name 且bulk为true时，代表这个属性本身是开关，但还有其他同级别相关属性放在扩展中，因此需要bulk更新方式进行批量更新 {kaiguan: true, extend: xxx}
   * 3. 没有name 且bulk为true时，代表没有属性对应这个开关，开关只是为了表达配置交互层面的收纳含义 {extend: xxx}
   * 注意：不会出现没有name 且bulk为false的情况
   */
  bulk?: boolean;
  onRemove?: (e: React.UIEvent<any> | void) => void;
  onClose: (e: React.UIEvent<any> | void) => void;
  clearChildValuesOnOff?: boolean; // 关闭开关时，删除子表单字段，默认 true
  defaultData?: any; // 默认数据
  isChecked?: (options: {
    data: any;
    value: any;
    name?: string;
    bulk?: boolean;
  }) => boolean;
  trueValue?: any; // 开关开启时name对应的值，当isChecked属性不配置时，也会通过这个匹配是不是开启状态
  falseValue?: any; // 开关关闭时name对应的值
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

  /**
   * 子表单的数据key
   */
  childFormNames: string[];
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
    | 'clearChildValuesOnOff'
    // | 'editable'
  > = {
    // btnIcon: 'pencil',
    // iconPosition: 'right',
    container: document.body,
    autoFocus: true,
    // placement: 'left',
    overlay: true,
    rootClose: false,
    formType: 'pop',
    bulk: true,
    clearChildValuesOnOff: true
    // editable: true
  };

  overlay: HTMLElement | null;
  formNames: null | Array<string>;

  constructor(props: SwitchMoreProps) {
    super(props);
    this.state = this.initState();
  }

  initState() {
    const {data, value, trueValue, name, bulk, hiddenOnDefault, isChecked} =
      this.props;
    let checked = false;
    const formNames = this.getFormItemNames();

    // 优先用传入的是否选中函数来判断
    if (isChecked && typeof isChecked === 'function') {
      checked = isChecked({data, value, name, bulk});
    }
    // 其次使用trueValue，主要是类似于属性值是disableXX之类的反义但配置要改为可用XX等正向含义时，这里会trueValue为false
    else if (trueValue != null) {
      checked = value === trueValue;
    }
    // 有属性名，自己本身对应开关
    else if (name) {
      checked = data[name] != null && data[name] !== false;
    }
    // 这个开关 无具体属性对应, 子表单项任意一个开启表示开
    else {
      checked = some(formNames, key => data[key] !== undefined);
    }

    // 开关有属性对应
    return {
      checked,
      show: hiddenOnDefault === true ? false : checked,
      childFormNames: formNames
    };
  }

  // 获取子表单项的内容
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
    const {
      onBulkChange,
      onChange,
      bulk,
      name,
      defaultData,
      trueValue,
      falseValue,
      clearChildValuesOnOff
    } = this.props;

    if (name) {
      let newValue = checked
        ? this.getInitTureValue()
        : falseValue ?? undefined;

      onChange(newValue);
    }

    // 子表单项是同级别的需要单独更新一下
    if (bulk) {
      // 选中情况下，值需要进行更新
      if (checked) {
        let newValue = defaultData ?? trueValue;
        newValue && onBulkChange && onBulkChange(newValue);
      }
      // 这个逻辑感觉主要是为了一些本身有默认值的相关配置，不想删除，只是想保留初始
      else if (clearChildValuesOnOff) {
        onBulkChange &&
          onBulkChange(
            fromPairs(this.state.childFormNames.map(i => [i, undefined]))
          );
      }
    }

    this.setState({checked, show: checked});
  }

  /**
   * 返回子表单的数据，如果是同级，直接返回当前数据域，否则返回当前数据作为子表单
   */
  getExtendValues() {
    const {name, data: ctx, bulk} = this.props;

    if (!ctx) {
      return {};
    }

    if (bulk) {
      return ctx;
    }

    return name ? ctx[name] : {};
  }

  /**
   * 打开后，首先遵循默认值设置，之后遵循选中值设置
   * 当都不设置时，要看是否是object类型，是object类型，需要是空对象
   *
   * 关闭后，先遵循关闭值设置，否则一切回归原始删除属性状态
   */
  getInitTureValue() {
    const {bulk, defaultData, trueValue} = this.props;

    if (defaultData) {
      return {...defaultData};
    }

    if (trueValue != null) {
      return trueValue;
    }

    if (bulk) {
      return true;
    }

    return {};
  }

  /**
   * 弹窗配置的提交
   * @param values
   */
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
    const {removable, disabled, form, formType, hiddenOnDefault, render} =
      this.props;
    const {checked, show} = this.state;

    if (!form || !checked || disabled) {
      return null;
    }

    const actions = [];
    if (formType === 'dialog') {
      actions.push(
        render('switch-more-dialog', this.renderDialogMore(), {
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
    } else if (hiddenOnDefault && formType === 'extend') {
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
      popOverclassName,
      overlay,
      offset,
      target,
      container,
      placement,
      rootClose,
      style,
      title,
      render
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
    const {render} = this.props;
    const {show} = this.state;

    if (!show) {
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
      className: 'inline-block m-0 h-6 bg-white ',
      itemClassName: 'bg-white hover:bg-white m-0 p-0',
      icon: 'fa fa-cog',
      form: {
        title: this.props.label,
        ...this.renderForm()
      }
    };
  }

  renderForm() {
    const {form, formType, autoFocus, bulk} = this.props;

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
      canAccessSuperData: bulk, // 避免有同名的
      data: this.getExtendValues(),
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
  type: 'ae-switch-more',
  strictMode: false
})
export class SwitchMoreRenderer extends SwitchMore {}
