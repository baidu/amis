/**
 * @file Alert
 * @author fex
 */

import React from 'react';
import {render} from 'react-dom';
import Modal from './Modal';
import Button from './Button';
import {ClassNamesFn, themeable} from '../theme';

export interface AlertProps {
  container?: any;
  confirmText?: string;
  cancelText?: string;
  title?: string;
  confirmBtnLevel?: string;
  alertBtnLevel?: string;
  classPrefix: string;
  classnames: ClassNamesFn;
  theme?: string;
}

export interface AlertState {
  show: boolean;
  title?: string;
  content: string;
  confirm: boolean;
}

export class Alert extends React.Component<AlertProps, AlertState> {
  static instance: any = null;
  static getInstance() {
    if (!Alert.instance) {
      console.warn('Alert 组件应该没有被渲染，所以隐性的渲染到 body 了');
      const container = document.body;
      const div = document.createElement('div');
      container.appendChild(div);
      render(<ThemedAlert />, div);
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
    this.bodyRef = this.bodyRef.bind(this);
  }

  static defaultProps = {
    confirmText: '确认',
    cancelText: '取消',
    title: '系统消息',
    alertBtnLevel: 'primary',
    confirmBtnLevel: 'danger'
  };

  componentWillMount() {
    Alert.instance = this;
  }

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

  handleConfirm() {
    this.close(true);
  }

  handleCancel() {
    this.close(false);
  }

  close(confirmed: boolean) {
    const isConfirm = this.state.confirm;

    this.setState(
      {
        show: false
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

  confirm(content: string, title?: string) {
    this.setState({
      title,
      content,
      show: true,
      confirm: true
    });

    return new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  modalRef(ref: any) {
    this._modal = ref;
  }

  bodyRef(ref: any) {
    this._body = ref;
    this._body && (this._body.innerHTML = this.state.content);
  }

  render() {
    const {
      container,
      cancelText,
      confirmText,
      title,
      confirmBtnLevel,
      alertBtnLevel,
      classnames: cx,
      classPrefix
    } = this.props;
    return (
      <Modal
        show={this.state.show}
        onHide={this.handleCancel}
        container={container}
        ref={this.modalRef}
      >
        <div className={cx('Modal-header')}>
          <div className={cx('Modal-title')}>{this.state.title || title}</div>
        </div>
        <div className={cx('Modal-body')}>
          <div ref={this.bodyRef} />
        </div>
        <div className={cx('Modal-footer')}>
          {this.state.confirm ? (
            <Button onClick={this.handleCancel}>{cancelText}</Button>
          ) : null}
          <Button
            level={this.state.confirm ? confirmBtnLevel : alertBtnLevel}
            onClick={this.handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </Modal>
    );
  }
}

export const alert: (content: string, title?: string) => void = (
  content,
  title
) => Alert.getInstance().alert(content, title);
export const confirm: (content: string, title?: string) => Promise<any> = (
  content,
  title
) => Alert.getInstance().confirm(content, title);
export const ThemedAlert = themeable(Alert);
export default ThemedAlert;
