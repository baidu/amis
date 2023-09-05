import React from 'react';
import {themeable, ClassNamesFn, ThemeProps} from 'amis-core';
import {Overlay} from 'amis-core';
import {PopOver} from 'amis-core';
import {Icon} from './icons';
import {autobind} from 'amis-core';
import Alert2 from './Alert2';
import BaiduMapPicker from './BaiduMapPicker';
import GaodeMapPicker from './GaodeMapPicker';
import {LocaleProps, localeable} from 'amis-core';
import PopUp from './PopUp';

export interface LocationProps extends ThemeProps, LocaleProps {
  vendor: 'baidu' | 'gaode' | 'tenxun';
  coordinatesType: 'bd09' | 'gcj02';
  placeholder: string;
  clearable: boolean;
  ak: string;
  value?: {
    address: string;
    lat: number;
    lng: number;
    city?: string;
  };
  disabled?: boolean;
  className?: string;
  popoverClassName?: string;
  onChange: (value: any) => void;
  popOverContainer?: any;
}

export interface LocationState {
  isFocused: boolean;
  isOpened: boolean;
}

export class LocationPicker extends React.Component<
  LocationProps,
  LocationState
> {
  static defaultProps = {
    placeholder: 'LocationPicker.placeholder',
    clearable: false
  };
  domRef: React.RefObject<HTMLDivElement> = React.createRef();
  tempValue: any;
  state = {
    isFocused: false,
    isOpened: false
  };

  @autobind
  handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === ' ') {
      this.handleClick();
      e.preventDefault();
    }
  }

  @autobind
  handleFocus() {
    this.setState({
      isFocused: true
    });
  }

  @autobind
  handleBlur() {
    this.setState({
      isFocused: true
    });
  }

  @autobind
  handleClick() {
    this.state.isOpened ? this.close() : this.open();
  }

  @autobind
  getTarget() {
    return this.domRef.current;
  }

  @autobind
  getParent() {
    return this.domRef.current?.parentElement;
  }

  @autobind
  open(fn?: () => void) {
    this.props.disabled ||
      this.setState(
        {
          isOpened: true
        },
        fn
      );
    this.tempValue = this.props.value;
  }

  @autobind
  close() {
    this.setState({
      isOpened: false
    });
  }

  @autobind
  clearValue(e: React.MouseEvent<any>) {
    e.preventDefault();
    e.stopPropagation();
    const onChange = this.props.onChange;
    onChange('');
  }

  @autobind
  handlePopOverClick(e: React.MouseEvent<any>) {
    e.stopPropagation();
    e.preventDefault();
  }

  @autobind
  handleChange(value: any) {
    if (value) {
      value = {
        ...value,
        vendor: this.props.vendor
      };
    }
    this.props.onChange(value);
  }

  @autobind
  handleTempChange(value: any) {
    if (value) {
      value = {
        ...value,
        vendor: this.props.vendor
      };
    }
    this.tempValue = value;
  }

  @autobind
  handleConfirm() {
    this.props.onChange(this.tempValue);
    this.close();
  }

  render() {
    const {
      classnames: cx,
      value,
      className,
      popoverClassName,
      disabled,
      placeholder,
      clearable,
      popOverContainer,
      vendor,
      coordinatesType,
      ak,
      mobileUI
    } = this.props;
    const __ = this.props.translate;
    const {isFocused, isOpened} = this.state;

    const picker = (() => {
      switch (vendor) {
        case 'baidu':
          return (
            <BaiduMapPicker
              ak={ak}
              value={value}
              coordinatesType={coordinatesType}
              onChange={this.handleChange}
            />
          );
        case 'gaode':
          return (
            <GaodeMapPicker
              ak={ak}
              value={value}
              coordinatesType={coordinatesType}
              onChange={this.handleChange}
            />
          );
        default:
          return <Alert2>{__(`{{vendor}} 地图控件不支持`, {vendor})}</Alert2>;
      }
    })();

    return (
      <div
        tabIndex={0}
        onKeyPress={this.handleKeyPress}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        className={cx(
          `LocationPicker`,
          {
            'is-mobile': mobileUI,
            'is-disabled': disabled,
            'is-focused': isFocused,
            'is-active': isOpened
          },
          className
        )}
        ref={this.domRef}
        onClick={this.handleClick}
      >
        {value ? (
          <span className={cx('LocationPicker-value')}>{value.address}</span>
        ) : (
          <span className={cx('LocationPicker-placeholder')}>
            {__(placeholder)}
          </span>
        )}

        {clearable && !disabled && value ? (
          <a className={cx('LocationPicker-clear')} onClick={this.clearValue}>
            <Icon icon="input-clear" className="icon" />
          </a>
        ) : null}

        <a className={cx('LocationPicker-toggler')}>
          <Icon icon="location" className="icon" />
        </a>

        {mobileUI ? (
          <PopUp
            className={cx(`LocationPicker-popup`)}
            container={popOverContainer || this.getParent}
            isShow={isOpened}
            onHide={this.close}
            showConfirm
            onConfirm={this.handleConfirm}
          >
            <div className={cx('LocationPicker-popup-inner')}>
              {vendor === 'baidu' ? (
                <BaiduMapPicker
                  ak={ak}
                  value={value}
                  coordinatesType={coordinatesType}
                  onChange={this.handleTempChange}
                />
              ) : (
                <Alert2>{__('{{vendor}} 地图控件不支持', {vendor})}</Alert2>
              )}
            </div>
          </PopUp>
        ) : (
          <Overlay
            target={this.getTarget}
            container={popOverContainer || this.getParent}
            rootClose={false}
            show={isOpened}
          >
            <PopOver
              className={cx('LocationPicker-popover', popoverClassName)}
              onHide={this.close}
              overlay
              onClick={this.handlePopOverClick}
              style={{width: this.getTarget()?.offsetWidth}}
            >
              {vendor === 'baidu' ? (
                <BaiduMapPicker
                  ak={ak}
                  value={value}
                  coordinatesType={coordinatesType}
                  onChange={this.handleChange}
                />
              ) : (
                <Alert2>{__('{{vendor}} 地图控件不支持', {vendor})}</Alert2>
              )}
            </PopOver>
          </Overlay>
        )}
      </div>
    );
  }
}

const ThemedCity = themeable(localeable(LocationPicker));
export default ThemedCity;
