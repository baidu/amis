import React from 'react';
import {
  themeable,
  ClassNamesFn,
  ThemeProps,
  Overlay,
  PopOver,
  autobind
} from 'amis-core';
import {FormItem, FormBaseControl, FormControlProps} from 'amis-core';
import {LocationPicker, Alert2, BaiduMapPicker, Icon} from 'amis-ui';
import {filter} from 'amis-core';
import {FormBaseControlSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';
import {isMobile} from 'amis-core';
/**
 * Location 选点组件
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/location
 */
export interface LocationControlSchema extends FormBaseControlSchema {
  type: 'location-picker';

  /**
   * 选择地图类型
   */
  vendor?: 'baidu' | 'gaode' | 'tenxun';

  /**
   * 有的地图需要设置 ak 信息
   */
  ak?: string;

  /**
   * 是否自动选中当前地理位置
   */
  autoSelectCurrentLoc?: boolean;

  /**
   * 是否限制只能选中当前地理位置
   * 备注：可用于充当定位组件，只允许选择当前位置
   */
  onlySelectCurrentLoc?: boolean;

  /**
   * 开启只读模式后的占位提示，默认为“点击获取位置信息”
   * 备注：区分下现有的placeholder（“请选择位置”）
   */
  getLocationPlaceholder?: string;
}

export interface LocationControlProps
  extends FormControlProps,
    Omit<ThemeProps, 'className'>,
    Omit<
      LocationControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {
  value: any;
  onChange: (value: any) => void;
  vendor: 'baidu' | 'gaode' | 'tenxun';
  ak: string;
  coordinatesType: 'bd09' | 'gcj02';
}

export class LocationControl extends React.Component<LocationControlProps> {
  static defaultProps = {
    vendor: 'baidu',
    coordinatesType: 'bd09'
  };
  domRef: React.RefObject<HTMLDivElement> = React.createRef();

  @autobind
  getTarget() {
    return this.domRef.current;
  }

  renderStatic(displayValue = '-') {
    const {classnames: cx, value} = this.props;
    const __ = this.props.translate;

    if (!value) {
      return <>{displayValue}</>;
    }

    return (
      <div
        className={this.props.classnames('LocationControl', {
          'is-mobile': isMobile()
        })}
        ref={this.domRef}
      >
        <span>{value.address}</span>
      </div>
    );
  }

  @supportStatic()
  render() {
    const {style, env} = this.props;
    const ak = filter(this.props.ak, this.props.data) || env.locationPickerAK!;
    return (
      <div
        className={this.props.classnames('LocationControl', {
          'is-mobile': isMobile()
        })}
      >
        <LocationPicker {...this.props} ak={ak} />
      </div>
    );
  }
}

@FormItem({
  type: 'location-picker'
})
export class LocationRenderer extends LocationControl {}
