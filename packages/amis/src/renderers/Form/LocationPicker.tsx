import React from 'react';
import {themeable, ClassNamesFn, ThemeProps, Overlay, PopOver, autobind} from 'amis-core';
import {FormItem, FormBaseControl, FormControlProps} from 'amis-core';
import {LocationPicker, Alert2, BaiduMapPicker, Icon} from 'amis-ui';
import {filter} from 'amis-core';
import {FormBaseControlSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';
/**
 * Location 选点组件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/location
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
  getParent() {
    return this.domRef.current?.parentElement;
  }

  @autobind
  getTarget() {
    return this.domRef.current;
  }

  renderStatic(displayValue = '-') {
    const {
      classnames: cx,
      value,
      vendor,
      ak,
      coordinatesType,
      popOverContainer,
    } = this.props;
    const __ = this.props.translate;

    if (!value) {
      return <>{displayValue}</>;
    }

    return (
      <div className={this.props.classnames('LocationControl')} ref={this.domRef}>
        <span>{value.address}</span>
        <a className={cx('LocationPicker-toggler', 'ml-1')} onClick={this.handleClick}>
          <Icon icon="location" className="icon" />
        </a>
        <Overlay
          target={this.getTarget}
          container={popOverContainer || this.getParent}
          rootClose={false}
          show={this.state.isOpened}
        >
          <PopOver
            className={cx('LocationPicker-popover')}
            onHide={this.close}
            overlay
            style={{width: this.getTarget()?.offsetWidth}}
          >
            {vendor === 'baidu' ? (
              <BaiduMapPicker
                ak={ak}
                value={value}
                coordinatesType={coordinatesType}
              />
            ) : (
              <Alert2>{__('${vendor} 地图控件不支持', {vendor})}</Alert2>
            )}
          </PopOver>
        </Overlay>
      </div>
    );
  }

  @supportStatic()
  render() {
    return (
      <div className={this.props.classnames('LocationControl')}>
        <LocationPicker
          {...this.props}
          ak={filter(this.props.ak, this.props.data)}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'location-picker'
})
export class LocationRenderer extends LocationControl {}
