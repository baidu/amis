import React from 'react';
import {themeable, ClassNamesFn, ThemeProps} from '../../theme';
import FormItem, {FormBaseControl, FormControlProps} from './Item';
import LocationPicker from '../../components/LocationPicker';

/**
 * Location 选点组件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/location
 */
export interface LocationControlSchema extends FormBaseControl {
  type: 'location';

  /**
   * 选择地图类型
   */
  vendor?: 'baidu' | 'gaode' | 'tenxun';

  /**
   * 有的地图需要设置 ak 信息
   */
  ak?: string;
}

export interface LocationControlProps
  extends FormControlProps,
    ThemeProps,
    Omit<LocationControlSchema, 'type'> {
  value: any;
  onChange: (value: any) => void;
  vendor: 'baidu' | 'gaode' | 'tenxun';
  ak: string;
}

export class LocationControl extends React.Component<LocationControlProps> {
  static defaultProps = {
    vendor: 'baidu'
  };

  render() {
    return (
      <div className={this.props.classnames('LocationControl')}>
        <LocationPicker {...this.props} />
      </div>
    );
  }
}

@FormItem({
  type: 'location'
})
export class LocationRenderer extends LocationControl {}
