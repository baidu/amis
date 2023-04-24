import React from 'react';
import {
  RendererProps,
  ActionObject,
  IModalStore,
  Renderer,
  guid,
  SchemaNode,
  Schema
} from 'amis-core';
import {
  AlertComponent as AlertContainer,
  SpinnerExtraProps,
  Button
} from 'amis-ui';
import {
  BaseSchema,
  SchemaCollection,
  SchemaClassName,
  SchemaName
} from '../Schema';
import {ActionSchema} from './Action';

/**
 * ConfirmDialog 确认对话框。
 */
export interface ConfirmDialogSchema extends BaseSchema {
  type: 'confirm-dialog';

  /**
   * 默认不用填写，自动会创建确认和取消按钮。
   */
  actions?: Array<ActionSchema>;

  /**
   * 内容区域
   */
  body?: SchemaCollection;

  /**
   * 是否支持按 ESC 关闭 Dialog
   */
  closeOnEsc?: boolean;

  name?: SchemaName;

  /**
   * Dialog 大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * 请通过配置 title 设置标题
   */
  title?: SchemaCollection;

  /**
   * 是否显示关闭按钮
   */
  showCloseButton?: boolean;

  /**
   * 影响自动生成的按钮，如果自己配置了按钮这个配置无效。
   */
  confirm?: boolean;
}

export type ConfirmDialogSchemaBase = Omit<ConfirmDialogSchema, 'type'>;

export interface ConfirmDialogProps
  extends RendererProps,
    Omit<ConfirmDialogSchema, 'className'>,
    SpinnerExtraProps {
  onClose: (confirmed?: boolean) => void;
  onConfirm: (
    values: Array<object>,
    action: ActionObject,
    ctx: object,
    targets: Array<any>
  ) => void;
  children?: React.ReactNode | ((props?: any) => React.ReactNode);
  store: IModalStore;
  show?: boolean;
  wrapperComponent: React.ElementType;
}

export default class ConfirmDialog extends React.Component<
  ConfirmDialogProps,
  object
> {
  static defaultProps = {
    title: '',
    confirm: true,
    show: true,
    showCloseButton: true,
    closeOnEsc: false,
    showErrorMsg: true,
    wrapperComponent: AlertContainer
  };

  $$id: string = guid();
  constructor(props: ConfirmDialogProps) {
    super(props);
  }

  renderBody(body: SchemaNode, key?: any): React.ReactNode {
    let {render} = this.props;

    if (Array.isArray(body)) {
      return body.map((body, key) => this.renderBody(body, key));
    }

    let schema: Schema = body as Schema;

    if (schema.type === 'form') {
      schema = {
        mode: 'horizontal',
        wrapWithPanel: false,
        submitText: null,
        ...schema
      };
    }

    return render(`body${key ? `/${key}` : ''}`, schema);
  }

  render() {
    const {
      wrapperComponent,
      classnames: cx,
      body,
      title,
      render,
      confirmText,
      cancelText,
      confirmBtnLevel,
      cancelBtnLevel,
      translate: __
    } = this.props;
    const Wrapper = wrapperComponent || AlertContainer;

    return (
      <Wrapper>
        <div className={cx('Modal-header')}>
          {title ? (
            <div className={cx('Modal-title')}>{render('title', title)}</div>
          ) : null}
        </div>
        {body ? (
          // dialog-body 用于在 editor 中定位元素
          <div className={cx('Modal-body')} role="dialog-body">
            {this.renderBody(body, 'body')}
          </div>
        ) : null}
        <div className={cx('Modal-footer')}>
          <Button level={cancelBtnLevel}>{cancelText || '取消'}</Button>
          <Button level={confirmBtnLevel}>{confirmText || '确认'}</Button>
        </div>
      </Wrapper>
    );
  }
}

@Renderer({
  type: 'confirm-dialog'
})
export class ConfirmDialogRenderer extends ConfirmDialog {}
