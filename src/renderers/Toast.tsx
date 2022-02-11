import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {SchemaCollection, BaseSchema} from '../Schema';
import ToastComponent from '../components/Toast';
import {isMobile} from '../utils/helper';

interface Item {
  title?: SchemaCollection;
  body: SchemaCollection;
  level: 'info' | 'success' | 'error' | 'warning';
  id: string;
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'center'
    | 'center-left'
    | 'center-right';
  closeButton?: boolean;
  timeout?: number;
}

export interface ToastSchema extends BaseSchema {
  /**
   * 指定为轻提示控件
   */
  type: 'toast';

  /**
   * 轻提示内容
   */
  items: Array<Item>;

  /**
   * 弹出位置
   */
  position:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'center'
    | 'center-left'
    | 'center-right';

  /**
   * 是否展示关闭按钮
   */
  closeButton: boolean;

  /**
   * 是否展示图标
   */
  showIcon?: boolean;

  /**
   * 持续时间
   */
  timeout: number;

  /**
   * 报错时的持续时长
   */
  errorTimeout: number;

  /**
   * 类名
   */
  className?: string;
}

export type ToastSchemaBase = Omit<ToastSchema, 'type'>;

export interface ToastProps extends RendererProps {
  children?: JSX.Element | ((props?: any) => JSX.Element);
}

export class ToastRenderer extends React.Component<ToastProps, {}> {
  constructor(props: ToastProps) {
    super(props);
  }

  hidePreToast(toastRef: any) {
    if (toastRef && toastRef.props && toastRef.props.store) {
      // 清除上一个轻提示组件，同时间只能存在一个
      toastRef.props.store.closeToast();
      if (this.props.store && !this.props.store.toastOpen) {
        this.props.store.toastOpen = true;
      }
    }
  }

  render() {
    const {
      items,
      position,
      closeButton,
      showIcon,
      timeout,
      errorTimeout,
      useMobileUI,
      visible,
      render
    } = this.props;
    const mobileUI = useMobileUI && isMobile();

    const toastItems = items.map((item: Item) => {
      return {
        ...item,
        title: item.title ? render('title', item.title) : null,
        body: item.body ? render('body', item.body) : ''
      };
    });

    return (
      <ToastComponent
        items={toastItems}
        position={position || (mobileUI ? 'center' : undefined)}
        closeButton={closeButton}
        showIcon={showIcon}
        timeout={timeout || (mobileUI ? 3000 : undefined)}
        errorTimeout={errorTimeout}
        useMobileUI={mobileUI}
        visible={visible}
        onMount={this.hidePreToast.bind(this)}
      />
    );
  }
}

@Renderer({
  type: 'toast'
})
export class ToastRendererer extends ToastRenderer {}
