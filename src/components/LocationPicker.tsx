import React from 'react';
import {themeable, ClassNamesFn, ThemeProps} from '../theme';
import Overlay from './Overlay';
import PopOver from './PopOver';
import {Icon} from './icons';
import {autobind} from '../utils/helper';
import Alert2 from './Alert2';
import BaiduMapPicker from './BaiduMapPicker';
import {LocaleProps, localeable} from '../locale';

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
      ak
    } = this.props;
    const __ = this.props.translate;
    const {isFocused, isOpened} = this.state;

    return (
      <div
        tabIndex={0}
        onKeyPress={this.handleKeyPress}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        className={cx(
          `LocationPicker`,
          {
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
            <Icon icon="close" className="icon" />
          </a>
        ) : null}

        <a className={cx('LocationPicker-toggler')}>
          <Icon icon="location" className="icon" />
        </a>

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
              <Alert2>{__('${vendor} 地图控件不支持', {vendor})}</Alert2>
            )}
          </PopOver>
        </Overlay>
      </div>
    );
  }
}

const ThemedCity = themeable(localeable(LocationPicker));
export default ThemedCity;
