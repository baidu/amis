import React from 'react';
import {Checkbox} from 'amis-ui';
import {Renderer, RendererProps} from 'amis-core';
import {BaseSchema, SchemaClassName, SchemaCollection} from '../Schema';
import {autobind} from 'amis-core';
import {buildStyle} from 'amis-core';

/**
 * Card2 新卡片渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/card2
 */
export interface Card2Schema extends BaseSchema {
  /**
   * 指定为 card2 类型
   */
  type: 'card2';

  /**
   * 内容
   */
  body: SchemaCollection;

  /**
   * body 类名
   */
  bodyClassName?: SchemaClassName;

  /**
   * 自定义样式
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * 隐藏选框
   */
  hideCheckToggler?: boolean;

  /**
   * 不配置href且cards容器下生效，点击整个卡片触发选中
   */
  checkOnItemClick: boolean;

  /**
   * 渲染标签
   */
  wrapperComponent?: string;
}

export interface Card2Props
  extends RendererProps,
    Omit<Card2Schema, 'type' | 'className'> {
  /**
   * 选择事件
   */
  onCheck: (checked: boolean, data: any) => void;

  /**
   * 数据
   */
  item: any;

  /**
   * 是否可选，当disabled时，将禁用
   */
  selectable?: boolean;

  /**
   * 是否可多选
   */
  multiple?: boolean;

  /**
   * 是否默认选中
   */
  selected?: boolean;
}

export default class Card2<T> extends React.Component<Card2Props & T, object> {
  static propsList: Array<string> = ['body', 'className'];
  static defaultProps = {
    className: ''
  };

  @autobind
  handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const {checkOnItemClick, selectable} = this.props;

    // 控制选中
    if (checkOnItemClick && selectable) {
      this.handleCheck();
    }

    // TODO 触发事件动作
  }

  @autobind
  handleCheck() {
    const {item, selected} = this.props;
    this.props.onCheck && this.props.onCheck(!selected, item);
  }

  renderCheckbox(): JSX.Element | null {
    const {
      selectable,
      classnames: cx,
      multiple,
      disabled,
      selected,
      hideCheckToggler,
      checkOnItemClick,
      checkboxClassname
    } = this.props;

    if (!selectable || (checkOnItemClick && hideCheckToggler)) {
      return null;
    }

    return (
      <Checkbox
        className={cx('Card2-checkbox', checkboxClassname)}
        type={multiple ? 'checkbox' : 'radio'}
        disabled={disabled}
        checked={selected}
        onChange={this.handleCheck}
      />
    );
  }

  /**
   * 渲染内容区
   */
  renderBody(): JSX.Element | null {
    const {body, render, classnames: cx, bodyClassName, ...rest} = this.props;

    return (
      <div
        className={cx('Card2-body', bodyClassName)}
        onClick={this.handleClick}
      >
        {body ? (render('body', body as any, rest) as JSX.Element) : null}
      </div>
    );
  }

  render() {
    const {
      className,
      wrapperComponent,
      classnames: cx,
      style,
      item,
      selected,
      checkOnItemClick
    } = this.props;

    const Component =
      (wrapperComponent as keyof JSX.IntrinsicElements) || 'div';

    return (
      <Component
        className={cx('Card2', className, {
          'checkOnItem': checkOnItemClick,
          'is-checked': selected
        })}
        style={buildStyle(style, item)}
      >
        {this.renderBody()}
        {this.renderCheckbox()}
      </Component>
    );
  }
}

@Renderer({
  type: 'card2'
})
export class Card2Renderer extends Card2<{}> {}
