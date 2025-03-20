import React from 'react';
import {
  themeable,
  ClassNamesFn,
  ThemeProps,
  Overlay,
  PopOver,
  autobind,
  getVariable
} from 'amis-core';
import {
  FormItem,
  FormBaseControl,
  FormControlProps,
  resolveEventData
} from 'amis-core';
import {Api, ActionObject} from 'amis-core';
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

  /**
   * 是否隐藏地图控制组件，默认为false
   */
  hideViewControl?: boolean;
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
  state = {
    isOpened: false
  };

  @autobind
  close() {
    this.setState({
      isOpened: false
    });
  }

  @autobind
  open() {
    this.setState({
      isOpened: true
    });
  }

  @autobind
  handleClick() {
    this.state.isOpened ? this.close() : this.open();
  }

  @autobind
  async handleChange(value: any) {
    const {dispatchEvent, onChange} = this.props;
    const dispatcher = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value})
    );
    if (dispatcher?.prevented) {
      return;
    }
    onChange(value);
  }

  @autobind
  getParent() {
    return this.domRef.current?.parentElement;
  }

  @autobind
  getTarget() {
    return this.domRef.current;
  }

  doAction(action: ActionObject, data: object, throwErrors: boolean): any {
    const {resetValue, onChange, formStore, store, name} = this.props;
    const actionType = action?.actionType as string;
    switch (actionType) {
      case 'clear':
        onChange('');
        break;
      case 'reset':
        onChange?.(
          getVariable(formStore?.pristine ?? store?.pristine, name) ??
            resetValue ??
            ''
        );
        break;
    }
  }

  renderStatic(displayValue = '-') {
    const {
      classnames: cx,
      value,
      staticSchema,
      ak,
      coordinatesType,
      hideViewControl = false,
      mobileUI
    } = this.props;
    const __ = this.props.translate;

    if (!value) {
      return <>{displayValue}</>;
    }

    return (
      <div
        className={this.props.classnames('LocationControl', {
          'is-mobile': mobileUI
        })}
        ref={this.domRef}
      >
        {staticSchema?.embed ? (
          <>
            {staticSchema.showAddress === false ? null : (
              <div className="mb-2">{value.address}</div>
            )}
            <BaiduMapPicker
              ak={ak}
              value={value}
              coordinatesType={coordinatesType}
              autoSelectCurrentLoc={false}
              onlySelectCurrentLoc={true}
              showSug={false}
              showGeoLoc={staticSchema.showGeoLoc}
              mapStyle={staticSchema.mapStyle}
              hideViewControl={hideViewControl}
            />
          </>
        ) : (
          <span>{value.address}</span>
        )}
      </div>
    );
  }

  @supportStatic()
  render() {
    const {style, env, mobileUI} = this.props;
    const ak = filter(this.props.ak, this.props.data) || env.locationPickerAK!;
    return (
      <div
        className={this.props.classnames('LocationControl', {
          'is-mobile': mobileUI
        })}
      >
        <LocationPicker
          {...this.props}
          ak={filter(this.props.ak, this.props.data)}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'location-picker'
})
export class LocationRenderer extends LocationControl {}
