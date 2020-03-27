import React from 'react';
import {themeable, ClassNamesFn} from '../theme';
import Overlay from './Overlay';
import PopOver from './PopOver';
import {Icon} from './icons';
import {autobind} from '../utils/helper';
import Alert2 from './Alert2';
import BaiduMapPicker from './BaiduMapPicker';

export interface LocationProps {
  vendor: 'baidu' | 'gaode' | 'tenxun';
  placeholder: string;
  clearable: boolean;
  value?: {
    address: string;
    lat: number;
    lng: number;
    city?: string;
  };
  disabled?: boolean;
  className?: string;
  onChange: (value: any) => void;
  classnames: ClassNamesFn;
  classPrefix: string;
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
    placeholder: '请选择位置',
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

  render() {
    const {
      classnames: cx,
      value,
      className,
      disabled,
      placeholder,
      clearable,
      popOverContainer,
      vendor
    } = this.props;
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
            'is-focused': isFocused
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
            {placeholder}
          </span>
        )}

        {clearable && !disabled && value ? (
          <a className={cx('LocationPicker-clear')} onClick={this.clearValue}>
            <Icon icon="close" className="icon" />
          </a>
        ) : null}

        <a className={cx('LocationPicker-toggler')}>
          <Icon icon="search" />
        </a>

        <Overlay
          target={this.getTarget}
          container={popOverContainer || this.getParent}
          rootClose={false}
          show={isOpened}
        >
          <PopOver
            className={cx('LocationPicker-popover')}
            onHide={this.close}
            overlay
            onClick={this.handlePopOverClick}
          >
            {vendor === 'baidu' ? (
              <BaiduMapPicker />
            ) : (<Alert2>{vendor} 地图控件不支持</Alert2>)}
          </PopOver>
        </Overlay>
      </div>
    );
  }
}

const ThemedCity = themeable(LocationPicker);
export default ThemedCity;
