import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaCollection} from '../Schema';
import {SchemaNode} from '../types';
import CollapseGroup from '../components/CollapseGroup';

/**
 * CollapseGroup 折叠渲染器，格式说明。
 * 文档：https://baidu.gitee.io/amis/docs/components/collapse
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
   * 初始化展开
   */
  defaultActiveKey?: Array<string | number | never> | string | number;

  /**
   * 手风琴模式
   */
  accordion?: boolean;

  /**
   * 自定义切换图标
   */
  expandIcon?: SchemaNode;

  /**
   * 设置图标位置
   */
  expandIconPosition?: 'left' | 'right';

  /**
   * 内容区域
   */
  body?: SchemaCollection;
}
export interface CollapseGroupProps
  extends RendererProps,
    Omit<CollapseGroupSchema, 'type' | 'className'> {

  children?: JSX.Element | ((props?: any) => JSX.Element);
}

export class CollapseGroupRender extends React.Component<CollapseGroupProps, {}> {
  constructor(props: CollapseGroupProps) {
    super(props);
  }
  render() {
    const {
      activeKey,
      defaultActiveKey,
      accordion,
      expandIcon,
      expandIconPosition,
      body,
      className,
      WrapperComponent,
      render
    } = this.props;
    return (
      <CollapseGroup
          activeKey={activeKey}
          defaultActiveKey={defaultActiveKey}
          accordion={accordion}
          expandIcon={expandIcon}
          expandIconPosition={expandIconPosition}
          className={className}
          wrapperComponent={WrapperComponent}
        >
          {render('body', body || '')}
        </CollapseGroup>
    )
  }
}


@Renderer({
  type: 'collapse-group'
})
export class CollapseGroupRenderer extends CollapseGroupRender {}
