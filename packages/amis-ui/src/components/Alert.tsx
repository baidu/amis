/**
 * @file Alert
 * @author fex
 */

import React from 'react';
import {render} from 'react-dom';
import Modal from './Modal';
import Button from './Button';
import {ClassNamesFn, themeable, ThemeProps} from 'amis-core';
import {LocaleProps, localeable} from 'amis-core';
import Html from './Html';
import type {PlainObject} from 'amis-core';
export interface AlertProps extends ThemeProps, LocaleProps {
  container?: any;
  confirmText?: string;
  cancelText?: string;
  title?: string;
  confirmBtnLevel?: string;
  alertBtnLevel?: string;
}

export interface AlertState {
  show: boolean;
  title?: string;
  content: string;
  confirm: boolean;
  prompt?: boolean;
  controls?: any;
  value?: any;
  confirmText?: string;
}

export class Alert extends React.Component<AlertProps, AlertState> {
  static instance: any = null;
  static getInstance() {
    if (!Alert.instance) {
      console.warn('Alert 组件应该没有被渲染，所以隐性的渲染到 body 了');
      const container = document.body;
      const div = document.createElement('div');
      container.appendChild(div);
      render(<FinnalAlert />, div);
    }

    return Alert.instance;
  }

  _resolve: (value: any) => void;
  _modal: any;
  _body: any;
  state: AlertState = {
    show: false,
    title: '',
    content: '',
    confirm: false
  };
  constructor(props: AlertProps) {
    super(props);

    this.close = this.close.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.modalRef = this.modalRef.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.scopeRef = this.scopeRef.bind(this);

    Alert.instance = this;
  }

  static defaultProps = {
    confirmText: 'confirm',
    cancelText: 'cancel',
    title: 'Alert.info',
    alertBtnLevel: 'primary',
    confirmBtnLevel: 'danger'
  };

  componentDidMount() {
    this._body && (this._body.innerHTML = this.state.content);
  }

  componentDidUpdate(prevProps: AlertProps, prevState: AlertState) {
    if (prevState.content !== this.state.content) {
      this._body && (this._body.innerHTML = this.state.content);
    }
  }

  componentWillUnmount() {
    Alert.instance = null;
  }

  schemaSope: any;
  scopeRef(schemaSope: any) {
    this.schemaSope = schemaSope;
  }

  handleConfirm() {
    const form = this.schemaSope?.getComponentByName('form');

    if (form) {
      form.doAction({type: 'submit'});
    } else {
      this.close(true);
    }
  }

  handleCancel() {
    this.close(false);
  }

  close(confirmed: boolean) {
    const isConfirm = this.state.confirm || this.state.prompt;

    this.setState(
      {
        show: false,
        prompt: false,
        confirm: false
      },
      isConfirm ? () => this._resolve(confirmed) /*this._reject()*/ : undefined
    );
  }

  alert(content: string, title?: string) {
    this.setState({
      title,
      content,
      show: true,
      confirm: false
    });
  }

  confirm(content: string, title?: string, confirmText?: string) {
    this.setState({
      title,
      content,
      show: true,
      confirm: true,
      confirmText
    });

    return new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  prompt(
    controls: any,
    defaultValue?: any,
    title: string = 'placeholder.enter',
    confirmText: string = 'confirm'
  ) {
    if (typeof controls === 'string') {
      // 兼容浏览器标准用法。
      controls = [
        {
          name: 'text',
          label: controls,
          type: 'text'
        }
      ];

      if (typeof defaultValue === 'string') {
        defaultValue = {
          text: defaultValue
        };
      }
    } else if (!Array.isArray(controls)) {
      controls = [controls];
    }

    this.setState({
      title,
      controls,
      show: true,
      prompt: true,
      value: defaultValue,
      confirmText
    });

    return new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  modalRef(ref: any) {
    this._modal = ref;
  }

  handleFormSubmit(values: any) {
    this.close(values);
  }

  render() {
    const {
      container,
      cancelText,
      confirmText,
      title,
      confirmBtnLevel,
      alertBtnLevel,
      classnames: cx
    } = this.props;
    let theme = this.props.theme || 'cxd';
    if (theme === 'default') {
      theme = 'cxd';
    }
    const __ = this.props.translate;
    const finalTitle = __(this.state.title ?? title);
    const finalConfirmText = __(this.state.confirmText ?? confirmText);

    return (
      <Modal
        show={this.state.show}
        onHide={this.handleCancel}
        container={container}
        ref={this.modalRef}
        closeOnEsc
      >
        {finalTitle ? (
          <div className={cx('Modal-header')}>
            <div className={cx('Modal-title')}>{finalTitle}</div>
          </div>
        ) : null}
        <div className={cx('Modal-body')}>
          {this.state.prompt ? (
            renderForm(
              this.state.controls,
              this.state.value,
              this.handleFormSubmit,
              this.scopeRef,
              theme
            )
          ) : (
            <Html html={this.state.content} />
          )}
        </div>
        {finalConfirmText ? (
          <div className={cx('Modal-footer')}>
            {this.state.confirm || this.state.prompt ? (
              <Button onClick={this.handleCancel}>{__(cancelText)}</Button>
            ) : null}
            <Button
              level={
                this.state.confirm || this.state.prompt
                  ? confirmBtnLevel
                  : alertBtnLevel
              }
              onClick={this.handleConfirm}
            >
              {finalConfirmText}
            </Button>
          </div>
        ) : null}
      </Modal>
    );
  }
}

export type renderSchemaFn = (
  controls: Array<any>,
  value: PlainObject,
  callback?: (values: PlainObject) => void,
  scopeRef?: (value: any) => void,
  theme?: string
) => JSX.Element;
let renderSchemaFn: renderSchemaFn;
export function setRenderSchemaFn(fn: renderSchemaFn) {
  renderSchemaFn = fn;
}

function renderForm(
  controls: Array<any>,
  value: PlainObject = {},
  callback?: (values: PlainObject) => void,
  scopeRef?: (value: any) => void,
  theme?: string
) {
  return renderSchemaFn?.(controls, value, callback, scopeRef, theme);
}

export const alert: (content: string, title?: string) => void = (
  content,
  title
) => Alert.getInstance().alert(content, title);
export const confirm: (
  content: string,
  title?: string,
  confirmText?: string
) => Promise<any> = (content, title, confirmText) =>
  Alert.getInstance().confirm(content, title, confirmText);
export const prompt: (
  controls: any,
  defaultvalue?: any,
  title?: string,
  confirmText?: string
) => Promise<any> = (controls, defaultvalue, title, confirmText) =>
  Alert.getInstance().prompt(controls, defaultvalue, title, confirmText);
export const FinnalAlert = themeable(localeable(Alert));
export default FinnalAlert;
