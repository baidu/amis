import React, {Suspense} from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';

export const ColorPicker = React.lazy(
  () => import('../../components/ColorPicker')
);

/**
 * Color 颜色选择框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/color
 */
export interface InputColorControlSchema extends FormBaseControl {
  /**
   * 指定为颜色选择框
   */
  type: 'input-color';

  /**
   * 是否显示清除按钮
   */
  clearable?: boolean;

  /**
   * 颜色格式
   */
  format?: 'hex' | 'rgb' | 'rgba' | 'hsl';

  /**
   * 选中颜色后是否关闭弹出层。
   */
  closeOnSelect?: boolean;

  /**
   * 预设颜色，用户可以直接从预设中选。
   */
  presetColors?: Array<any>;

  /**
   * 是否允许用户输入颜色。
   */
  allowCustomColor?: boolean;
}

export interface ColorProps
  extends FormControlProps,
    Omit<
      InputColorControlSchema,
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

  render() {
    const {className, classPrefix: ns, value, ...rest} = this.props;

    return (
      <div className={cx(`${ns}ColorControl`, className)}>
        <Suspense fallback={<div>...</div>}>
          <ColorPicker classPrefix={ns} {...rest} value={value || ''} />
        </Suspense>
      </div>
    );
  }
}

@FormItem({
  type: 'input-color'
})
export class ColorControlRenderer extends ColorControl {}
