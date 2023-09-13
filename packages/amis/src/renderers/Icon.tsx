import React from 'react';
import {
  Renderer,
  RendererProps,
  filter,
  autobind,
  createObject,
  CustomStyle
} from 'amis-core';
import {BaseSchema, SchemaTpl} from '../Schema';
import {
  BadgeObject,
  withBadge,
  Icon as IconUI,
  IconCheckedSchema
} from 'amis-ui';

/**
 * Icon 图标渲染器
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/icon
 */
export interface IconSchema extends BaseSchema {
  type: 'icon';

  /**
   * 按钮类型
   */
  icon: SchemaTpl | IconCheckedSchema;

  vendor?: 'iconfont' | 'fa' | '';

  /**
   * 角标
   */
  badge?: BadgeObject;
}

export interface IconProps
  extends RendererProps,
    Omit<IconSchema, 'type' | 'className'> {}

export class Icon extends React.Component<IconProps, object> {
  static defaultProps: Partial<IconProps> = {
    icon: '',
    vendor: 'fa'
  };

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

  render() {
    const {
      classnames: cx,
      className,
      data,
      id,
      themeCss,
      css,
      env
    } = this.props;
    let icon = this.props.icon;

    if (typeof icon === 'string') {
      icon = filter(this.props.icon, data);
    }

    return (
      <>
        <IconUI
          {...this.props}
          icon={icon}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
        <CustomStyle
          config={{
            themeCss: themeCss || css,
            classNames: [
              {
                key: 'className',
                value: className
              }
            ],
            id
          }}
          env={env}
        />
      </>
    );
  }
}

@Renderer({
  type: 'icon'
})
// @ts-ignore 类型没搞定
@withBadge
export class IconRenderer extends Icon {}
