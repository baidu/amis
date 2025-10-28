import React, {Suspense} from 'react';
import cx from 'classnames';

import {FormItem, FormControlProps, AMISFormItem} from 'amis-core';
import type {PresetColor} from 'amis-ui';
import {isMobile} from 'amis-core';
import {FormBaseControlSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';

// todo amis-ui 里面组件直接改成按需加载
export const ColorPicker = React.lazy(
  () => import('amis-ui/lib/components/ColorPicker')
);

/**
 * Color 颜色选择框
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/color
 */
/**
 * Color 颜色选择框组件，支持选择和自定义各种格式的颜色，包含预设颜色、清除按钮、以及弹出层相关配置。
 */
export interface AMISInputColorSchema extends AMISFormItem {
  /**
   * 指定为 color 组件
   */
  type: 'input-color';

  /**
   * 是否显示清除按钮
   */
  clearable?: boolean;

  /**
   * 颜色格式
   */
  format?: 'hex' | 'hexa' | 'rgb' | 'rgba' | 'hsl';

  /**
   * 选中颜色后是否关闭弹出层
   */
  closeOnSelect?: boolean;

  /**
   * 预设颜色
   */
  presetColors?: Array<PresetColor>;

  /**
   * 是否允许用户输入颜色
   */
  allowCustomColor?: boolean;
  /**
   * 弹窗容器选择器
   */
  popOverContainerSelector?: string;
}

export interface ColorProps
  extends FormControlProps,
    Omit<
      AMISInputColorSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export interface ColorControlState {
  open: boolean;
}

export default class ColorControl extends React.PureComponent<
  ColorProps,
  ColorControlState
> {
  static defaultProps: Partial<ColorProps> = {
    format: 'hex',
    clearable: true
  };
  state: ColorControlState = {
    open: false
  };

  @supportStatic()
  render() {
    const {
      className,
      style,
      classPrefix: ns,
      value,
      env,
      static: isStatic,
      mobileUI,
      ...rest
    } = this.props;

    return (
      <div className={cx(`${ns}ColorControl`, className)}>
        <Suspense fallback={<div>...</div>}>
          <ColorPicker
            classPrefix={ns}
            {...rest}
            placeholder={rest.placeholder as string}
            mobileUI={mobileUI}
            popOverContainer={
              mobileUI
                ? env?.getModalContainer
                : rest.popOverContainer || env.getModalContainer
            }
            value={value || ''}
          />
        </Suspense>
      </div>
    );
  }
}

@FormItem({
  type: 'input-color'
})
export class ColorControlRenderer extends ColorControl {}
