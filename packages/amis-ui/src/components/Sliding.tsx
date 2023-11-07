import React from 'react';
import {
  ThemeProps,
  themeable,
  localeable,
  LocaleProps,
  autobind
} from 'amis-core';
import {resizeSensor} from 'amis-core';
import {Icon} from './icons';

interface SlidingProp extends ThemeProps, LocaleProps {
  skin?: 'light' | 'dark';
  activeKey: number | string;
  options: Array<{
    node: React.ReactNode;
    key: number | string;
  }>;
  onChange?: (key: string | number) => any;
}

interface SlidingState {
  showToolBtn: boolean;
  arrowLeftDisabled: boolean;
  arrowRightDisabled: boolean;
}

class Sliding extends React.Component<SlidingProp, SlidingState> {
  bodyRef: React.RefObject<HTMLDivElement>;
  bodyListRef: React.RefObject<HTMLDivElement>;
  toDispose: Array<() => void> = [];
  scroll: boolean = false;

  state: Readonly<SlidingState> = {
    showToolBtn: false,
    arrowLeftDisabled: false,
    arrowRightDisabled: false
  };

  static defaultProps: Pick<SlidingProp, 'skin'> = {
    skin: 'light'
  };

  constructor(props: SlidingProp) {
    super(props);

    this.bodyRef = React.createRef();
    this.bodyListRef = React.createRef();
  }

  componentDidMount(): void {
    this.bodyRef?.current &&
      this.toDispose.push(
        resizeSensor(this.bodyRef.current as HTMLElement, () =>
          this.computedWidth()
        )
      );

    this.computedWidth();
  }

  componentDidUpdate(
    prevProps: Readonly<SlidingProp>,
    prevState: Readonly<SlidingState>,
    snapshot?: any
  ): void {
    if (prevProps.activeKey !== this.props.activeKey) {
      this.showSelected();
    }
  }

  componentWillUnmount(): void {
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
  }

  @autobind
  computedWidth() {
    const {showToolBtn} = this.state;
    const body = this.bodyRef.current;
    const bodyList = this.bodyListRef.current;
    if (!body || !bodyList) {
      return;
    }
    const bodyRect = body.getBoundingClientRect();
    const bodyListRect = bodyList.getBoundingClientRect();
    const bool = bodyRect.width < bodyListRect.width;

    if (bool !== showToolBtn) {
      this.setState({
        showToolBtn: bool
      });
    }
  }

  /**
   * 保证选中的tab始终显示在可视区域
   */
  showSelected(key?: string | number) {
    const {showToolBtn} = this.state;
    if (!showToolBtn) {
      return;
    }
    const {activeKey, options} = this.props;
    const currentKey = key !== undefined ? key : activeKey;
    const currentIndex = options?.findIndex(item => item.key === currentKey);
    const item = this.bodyListRef.current?.children || [];
    const currentLi = item[currentIndex] as HTMLElement;
    const itemOffsetLeft = currentLi?.offsetLeft;
    const itemClientWidth = currentLi?.clientWidth;
    const scrollLeft = this.bodyRef.current?.scrollLeft || 0;
    const clientWidth = this.bodyRef.current?.clientWidth || 0;
    // 左边被遮住了
    if (scrollLeft > itemOffsetLeft) {
      this.bodyRef.current?.scrollTo({
        left: itemOffsetLeft,
        behavior: 'smooth'
      });
    }
    // 右边被遮住了
    if (itemOffsetLeft + itemClientWidth > scrollLeft + clientWidth) {
      this.bodyRef.current?.scrollTo({
        left: itemOffsetLeft + itemClientWidth - clientWidth,
        behavior: 'smooth'
      });
    }
  }

  @autobind
  handleArrow(type: 'left' | 'right') {
    const {scrollLeft, scrollWidth, clientWidth} = this.bodyRef.current || {
      scrollLeft: 0,
      scrollWidth: 0,
      clientWidth: 0
    };
    if (type === 'left' && scrollLeft > 0) {
      const newScrollLeft = scrollLeft - clientWidth;

      this.bodyRef.current?.scrollTo({
        left: newScrollLeft > 0 ? newScrollLeft : 0,
        behavior: 'smooth'
      });
      this.setState({
        arrowRightDisabled: false,
        arrowLeftDisabled: newScrollLeft <= 0
      });
    } else if (type === 'right' && scrollWidth > scrollLeft + clientWidth) {
      const newScrollLeft = scrollLeft + clientWidth;

      this.bodyRef.current?.scrollTo({
        left: newScrollLeft > scrollWidth ? scrollWidth : newScrollLeft,
        behavior: 'smooth'
      });
      this.setState({
        arrowRightDisabled: newScrollLeft > scrollWidth - clientWidth,
        arrowLeftDisabled: false
      });
    }
  }

  @autobind
  handleItemClick(key: string | number) {
    this.props?.onChange?.(key);
    this.showSelected();
  }

  render() {
    const {classnames: cx, options, activeKey, skin} = this.props;
    const {showToolBtn} = this.state;

    return (
      <div
        className={cx(
          'Sliding',
          skin === 'light' ? 'Sliding-light' : 'Sliding-dark'
        )}
      >
        {showToolBtn ? (
          <div className={cx('Sliding-prev')}>
            <Icon
              icon="prev"
              className={cx('Sliding-prev-icon')}
              onClick={() => this.handleArrow('left')}
            />
          </div>
        ) : null}
        <div
          className={cx(
            'Sliding-content',
            showToolBtn ? 'scroll' : 'not-scroll'
          )}
          ref={this.bodyRef}
        >
          <div className={cx('Sliding-content-lists')} ref={this.bodyListRef}>
            {options.map(item => (
              <div
                className={cx(
                  'Sliding-content-lists-item',
                  item.key === activeKey ? 'is-active' : ''
                )}
                key={item.key}
                onClick={() => this.handleItemClick(item.key)}
              >
                {item.node}
              </div>
            ))}
          </div>
        </div>
        {showToolBtn ? (
          <div className={cx('Sliding-next')}>
            <Icon
              icon="next"
              className={cx('Sliding-next-icon')}
              onClick={() => this.handleArrow('right')}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default themeable(localeable(Sliding));
