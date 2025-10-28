import React from 'react';
import {
  Renderer,
  RendererProps,
  filter,
  autobind,
  createObject,
  CustomStyle,
  setThemeClassName
} from 'amis-core';
import {BaseSchema, SchemaTpl} from '../Schema';
import {
  BadgeObject,
  withBadge,
  Icon as IconUI,
  IconCheckedSchema
} from 'amis-ui';
import {AMISSchemaBase} from 'amis-core';

/**
 * Icon 图标渲染器
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/icon
 */
/**
 * 图标组件，用于展示图标或符号。支持字体图标、SVG 与样式控制。
 */
export interface AMISIconSchema extends AMISSchemaBase {
  type: 'icon';

  /**
   * 图标类型
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
    Omit<AMISIconSchema, 'type' | 'className'> {}

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
      env,
      wrapperCustomStyle
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
          className={cx(
            className,
            setThemeClassName({...this.props, name: 'className', id, themeCss}),
            setThemeClassName({
              ...this.props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle
            })
          )}
        />
        <CustomStyle
          {...this.props}
          config={{
            themeCss: themeCss,
            classNames: [
              {
                key: 'className'
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
