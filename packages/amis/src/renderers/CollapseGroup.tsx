import React from 'react';
import {
  Renderer,
  RendererProps,
  autobind,
  resolveEventData,
  isPureVariable,
  resolveVariableAndFilter
} from 'amis-core';
import {BaseSchema, SchemaCollection, SchemaObject} from '../Schema';
import {CollapseGroup} from 'amis-ui';

/**
 * CollapseGroup 折叠渲染器，格式说明。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/collapse
 */
export interface CollapseGroupSchema extends BaseSchema {
  /**
   * 指定为折叠器类型
   */
  type: 'collapse-group';

  /**
   * 激活面板
   */
  activeKey?: Array<string | number | never> | string | number;

  /**
   * 手风琴模式
   */
  accordion?: boolean;

  /**
   * 自定义切换图标
   */
  expandIcon?: SchemaObject;

  /**
   * 设置图标位置
   */
  expandIconPosition?: 'left' | 'right';

  /**
   * 内容区域
   */
  body?: SchemaCollection;

  /**
   * 当Collapse作为Form组件的子元素时，开启该属性后组件样式设置为FieldSet组件的样式，默认开启
   */
  enableFieldSetStyle?: boolean;
}
export interface CollapseGroupProps
  extends RendererProps,
    Omit<CollapseGroupSchema, 'type' | 'className'> {
  children?: JSX.Element | ((props?: any) => JSX.Element);
}

export type CollapseGroupRenderEvent = 'collapseChange';
export class CollapseGroupRender extends React.Component<
  CollapseGroupProps,
  {}
> {
  static defaultProps = {
    enableFieldSetStyle: true
  };

  constructor(props: CollapseGroupProps) {
    super(props);
  }

  @autobind
  async handleCollapseChange(
    activeKeys: Array<string | number>,
    collapseId: string | number,
    collapsed: boolean
  ) {
    const {dispatchEvent, onCollapse} = this.props;
    const renderEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {
        activeKeys,
        collapseId,
        collapsed
      })
    );
    if (renderEvent?.prevented) {
      return;
    }
    onCollapse?.(activeKeys, collapseId, collapsed);
  }

  render() {
    const {
      defaultActiveKey,
      accordion,
      expandIcon,
      expandIconPosition,
      body,
      className,
      style,
      render,
      mobileUI,
      data
    } = this.props;
    let enableFieldSetStyle = this.props.enableFieldSetStyle;

    if (isPureVariable(enableFieldSetStyle)) {
      enableFieldSetStyle = resolveVariableAndFilter(
        enableFieldSetStyle,
        data,
        '| raw'
      );
    }

    return (
      <CollapseGroup
        defaultActiveKey={defaultActiveKey}
        accordion={accordion}
        expandIcon={expandIcon}
        expandIconPosition={expandIconPosition}
        className={className}
        style={style}
        mobileUI={mobileUI}
        onCollapseChange={this.handleCollapseChange}
      >
        {render('body', body || '', {enableFieldSetStyle})}
      </CollapseGroup>
    );
  }
}

@Renderer({
  type: 'collapse-group'
})
export class CollapseGroupRenderer extends CollapseGroupRender {}
