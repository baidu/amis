import React from 'react';
import {
  Renderer,
  RendererProps,
  autobind,
  buildStyle,
  CustomStyle,
  isVisible,
  setThemeClassName
} from 'amis-core';
import {DndContainer as DndWrapper} from 'amis-ui';
import {BaseSchema, SchemaCollection} from '../Schema';
import {JSONSchema} from '../types';

export interface StateSchema extends Omit<BaseSchema, 'type'> {
  /**
   * 状态标题
   */
  title?: string;

  /**
   * 内容
   */
  body?: SchemaCollection;

  /**
   * 显示条件
   */
  visibleOn?: string;
}

/**
 * SwitchContainer 状态容器渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/state-container
 */
export interface SwitchContainerSchema extends BaseSchema {
  /**
   * 指定为 container 类型
   */
  type: 'switch-container';

  /**
   * 状态项列表
   */
  items: Array<StateSchema>;

  /**
   * 自定义样式
   */
  style?: {
    [propName: string]: any;
  };
}

export interface SwitchContainerProps
  extends RendererProps,
    Omit<SwitchContainerSchema, 'type' | 'className' | 'style'> {
  children?: (props: any) => React.ReactNode;
}

export interface SwtichContainerState {
  activeIndex: number;
}

export default class SwitchContainer extends React.Component<
  SwitchContainerProps,
  SwtichContainerState
> {
  static propsList: Array<string> = ['body', 'className'];
  static defaultProps = {
    className: ''
  };

  constructor(props: SwitchContainerProps) {
    super(props);
    this.state = {
      activeIndex: -1
    };
  }

  componentDidUpdate(preProps: SwitchContainerProps) {
    const items = this.props.items || [];
    if (this.state.activeIndex > 0 && !items[this.state.activeIndex]) {
      this.setState({
        activeIndex: 0
      });
    }
  }

  @autobind
  handleClick(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
  }

  @autobind
  handleMouseEnter(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
  }

  @autobind
  handleMouseLeave(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
  }

  @autobind
  renderBody(item: JSONSchema): JSX.Element | null {
    const {children, render, disabled} = this.props;
    const body = item?.body;

    const containerBody = children
      ? typeof children === 'function'
        ? ((children as any)(this.props) as JSX.Element)
        : (children as any)
      : body
      ? (render('body', body as any, {disabled}) as JSX.Element)
      : null;

    return <div style={{display: 'inline'}}>{containerBody}</div>;
  }

  @autobind
  switchTo(index: number) {
    const items = this.props.items || [];
    if (index >= 0 && index < items.length) {
      this.setState({activeIndex: index});
    }
  }

  render() {
    const {
      className,
      items = [],
      classnames: cx,
      style,
      data,
      id,
      wrapperCustomStyle,
      env,
      themeCss
    } = this.props;

    const activeItem =
      items[this.state.activeIndex] ??
      items.find((item: JSONSchema) => isVisible(item, data));

    const contentDom = (
      <div
        className={cx(
          'SwitchContainer',
          className,
          setThemeClassName({
            ...this.props,
            name: 'baseControlClassName',
            id,
            themeCss
          }),
          setThemeClassName({
            ...this.props,
            name: 'wrapperCustomStyle',
            id,
            themeCss: wrapperCustomStyle
          })
        )}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={buildStyle(style, data)}
        data-role="container"
      >
        {activeItem && this.renderBody(activeItem)}

        <CustomStyle
          config={{
            wrapperCustomStyle,
            id,
            themeCss,
            classNames: [
              {
                key: 'baseControlClassName'
              }
            ]
          }}
          env={env}
        />
      </div>
    );

    return contentDom;
  }
}

@Renderer({
  type: 'switch-container'
})
export class SwitchContainerRenderer extends SwitchContainer {}
