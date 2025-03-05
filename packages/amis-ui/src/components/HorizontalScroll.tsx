import {autobind, resizeSensor, TestIdBuilder, ThemeProps} from 'amis-core';
import React, {ReactNode} from 'react';
import debounce from 'lodash/debounce';

import {Icon} from './icons';

type ChildrenType =
  | React.ReactNode
  | ((showSelect: () => void) => React.ReactNode);

export interface HorizontalScrollProps extends ThemeProps {
  /**
   * 左右按钮图标
   */
  icons?: ReactNode | ReactNode[];

  /**
   * 外层容器类名
   */
  className?: string;

  /**
   * 左右图标类名
   */
  iconsClassName?: string | string[];

  /**
   * 测试ID生成器
   */
  testIdBuilder?: TestIdBuilder;

  children: ChildrenType;

  /**
   * 子元素滚动容器，用于计算当前点击。默认为当前滚动容器最内层
   */
  getScrollParentElement?: () => HTMLElement;

  /**
   * 激活的子元素类名，如果设置，那么每次页面缩放的时候，都会让对应的位置滚动到可视区域。如果命中多个元素，则只会滚动第一个
   * 支持传入多个类名，按照传入数组中元素的顺序作为优先级顺序。[p0, p1, p2...]，优先级高的类名命中元素则会停止寻找
   */
  activeChildClassName?: string | string[];
}

interface HorizontalScrollState {
  isOverflow: boolean;
  arrowLeftDisabled: boolean;
  arrowRightDisabled: boolean;
  scroll: boolean;
}

export class HorizontalScroll extends React.Component<
  HorizontalScrollProps,
  HorizontalScrollState
> {
  innerWrapper: React.RefObject<HTMLDivElement> = React.createRef(); // 内部滚动容器

  resizeDom: React.RefObject<HTMLDivElement> = React.createRef(); // 外部容器

  toDispose: Array<() => void> = []; // 监听函数数组

  constructor(props: HorizontalScrollProps) {
    super(props);
    this.resizeDom = React.createRef();

    this.state = {
      isOverflow: false,
      arrowLeftDisabled: false,
      arrowRightDisabled: false,
      scroll: false
    };
  }

  /**
   * 处理箭头点击事件
   * @param type 箭头方向，'left' 表示向左，'right' 表示向右
   */
  @autobind
  handleArrow(type: 'left' | 'right') {
    // 滚动元素的父元素
    const wrapElement =
      this.props.getScrollParentElement?.() || this.innerWrapper.current;

    const {scrollLeft, scrollWidth, clientWidth} = wrapElement || {
      scrollLeft: 0,
      scrollWidth: 0,
      clientWidth: 0
    };
    if (type === 'left' && scrollLeft > 0) {
      const newScrollLeft = scrollLeft - clientWidth;

      wrapElement?.scrollTo?.({
        left: newScrollLeft > 0 ? newScrollLeft : 0,
        behavior: 'smooth'
      });
      this.setState({
        arrowRightDisabled: false,
        arrowLeftDisabled: newScrollLeft <= 0
      });
    } else if (type === 'right' && scrollWidth > scrollLeft + clientWidth) {
      const newScrollLeft = scrollLeft + clientWidth;

      wrapElement?.scrollTo?.({
        left: newScrollLeft > scrollWidth ? scrollWidth : newScrollLeft,
        behavior: 'smooth'
      });
      this.setState({
        arrowRightDisabled: newScrollLeft > scrollWidth - clientWidth,
        arrowLeftDisabled: false
      });
    }
    this.setState({
      scroll: true
    });
  }

  /**
   * 根据滚动条位置更新左右箭头的禁用状态
   */
  checkArrowStatus = debounce(
    () => {
      const wrapElement =
        this.props.getScrollParentElement?.() || this.innerWrapper.current;

      const {scrollLeft, scrollWidth, clientWidth} = wrapElement || {
        scrollLeft: 0,
        scrollWidth: 0,
        clientWidth: 0
      };
      const {arrowRightDisabled, arrowLeftDisabled} = this.state;
      if (scrollLeft === 0 && !arrowLeftDisabled) {
        this.setState({
          arrowRightDisabled: false,
          arrowLeftDisabled: true
        });
      } else if (
        scrollWidth === scrollLeft + clientWidth &&
        !arrowRightDisabled
      ) {
        this.setState({
          arrowRightDisabled: true,
          arrowLeftDisabled: false
        });
      } else if (scrollLeft !== 0 && arrowLeftDisabled) {
        this.setState({
          arrowLeftDisabled: false
        });
      } else if (
        scrollWidth !== scrollLeft + clientWidth &&
        arrowRightDisabled
      ) {
        this.setState({
          arrowRightDisabled: false
        });
      }
    },
    100,
    {
      trailing: true,
      leading: false
    }
  );

  /**
   * 保证选中的yua始终显示在可视区域
   */
  @autobind
  showSelected(isOverflow?: boolean) {
    const isContentOverflow =
      isOverflow === undefined ? this.state.isOverflow : isOverflow;

    const {activeChildClassName} = this.props;

    if (!isContentOverflow || !activeChildClassName) {
      return;
    }

    // 滚动子元素容器
    const wrapperDom =
      this.props.getScrollParentElement?.() || this.innerWrapper.current;

    // 查找第一个命中的元素
    let activeElement: HTMLElement | null = null;
    const searchClassNames = Array.isArray(activeChildClassName)
      ? activeChildClassName
      : [activeChildClassName];

    // 根据传入类名数组从前到后查找是否能匹配到对应元素
    let classNameIndex = 0;

    while (!activeElement && classNameIndex < searchClassNames.length) {
      activeElement = wrapperDom?.querySelector(
        `.${activeChildClassName[classNameIndex]}`
      ) as HTMLElement;

      classNameIndex++;
    }

    // 检查查找到的元素是否是直接子元素，如果不是则一直向上找
    while (activeElement && activeElement.parentElement !== wrapperDom) {
      activeElement = activeElement.parentElement!;
    }

    if (!activeElement) {
      return;
    }

    const activeLeftOffset = activeElement?.offsetLeft;
    const activeWidth = activeElement?.clientWidth;
    const scrollLeft = wrapperDom?.scrollLeft || 0;
    const clientWidth = wrapperDom?.clientWidth || 0;

    // 左边被遮住了
    if (scrollLeft > activeLeftOffset) {
      wrapperDom?.scrollTo?.({
        left: activeLeftOffset,
        behavior: 'smooth'
      });
    }
    // 右边被遮住了
    if (activeLeftOffset + activeWidth > scrollLeft + clientWidth) {
      wrapperDom?.scrollTo?.({
        left: activeLeftOffset + activeWidth - clientWidth,
        behavior: 'smooth'
      });
    }
  }

  /**
   * 处理内容与容器之间的位置关系
   */
  @autobind
  checkIsOverflow() {
    const navMainRef =
      this.props.getScrollParentElement?.() || this.innerWrapper.current;
    const clientWidth: number = navMainRef?.clientWidth || 0;
    const scrollWidth: number = navMainRef?.scrollWidth || 0;
    const isOverflow = scrollWidth > clientWidth;

    // 内容超出容器长度标记溢出
    if (isOverflow !== this.state.isOverflow) {
      this.setState({isOverflow});
    }

    if (isOverflow) {
      this.showSelected(isOverflow);
    }
  }

  /**
   * 渲染箭头图标
   * @param type 箭头类型，'left' 表示左箭头，'right' 表示右箭头
   * @returns 返回渲染的箭头图标组件或 null
   */
  renderArrow(type: 'left' | 'right') {
    const {classnames: cx, testIdBuilder, icons, iconsClassName} = this.props;
    const {isOverflow, arrowLeftDisabled, arrowRightDisabled} = this.state;
    const disabled = type === 'left' ? arrowLeftDisabled : arrowRightDisabled;

    // 优先使用外部传入图标
    const [leftIcon, rightIcon] = Array.isArray(icons) ? icons : [icons, icons];
    const renderIconContent = type === 'left' ? leftIcon : rightIcon;

    const [leftIconClassName, rightIconClassName] = Array.isArray(
      iconsClassName
    )
      ? iconsClassName
      : [iconsClassName, iconsClassName];
    const renderIconClassName =
      type === 'left' ? leftIconClassName : rightIconClassName;

    return isOverflow ? (
      <div
        onClick={() => this.handleArrow(type)}
        className={cx(
          'HorizontalScroll-arrow',
          'HorizontalScroll-arrow--' + type,
          disabled && 'HorizontalScroll-arrow--disabled'
        )}
        {...testIdBuilder?.getChild(`arrow-${type}`).getTestId()}
      >
        {renderIconContent ? (
          <Icon icon={renderIconContent} className={renderIconClassName} />
        ) : (
          <Icon icon="right-arrow-bold" className="icon" />
        )}
      </div>
    ) : null;
  }

  /**
   * 监听导航上的滚动事件
   */
  @autobind
  handleWheel(e: WheelEvent) {
    const {deltaY, deltaX} = e;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // 当鼠标上下滚动时转换为左右滚动
    if (absY > absX) {
      const wrapElement =
        this.props.getScrollParentElement?.() || this.innerWrapper.current;

      wrapElement?.scrollTo?.({
        left: wrapElement?.scrollLeft + deltaY
      });
      e.preventDefault();
    }
    this.checkArrowStatus();
    this.setState({
      scroll: true
    });
  }

  componentDidMount() {
    this.checkIsOverflow();

    const wrapElement =
      this.props.getScrollParentElement?.() || this.innerWrapper.current;

    if (wrapElement) {
      wrapElement.addEventListener('wheel', this.handleWheel, {
        passive: false
      });
      this.checkArrowStatus();
    }

    this.resizeDom?.current &&
      this.toDispose.push(
        resizeSensor(this.resizeDom.current as HTMLElement, () =>
          this.checkIsOverflow()
        )
      );
  }

  componentWillUnmount() {
    this.checkArrowStatus.cancel();
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
  }

  render(): ReactNode {
    const {classnames: cx, children, testIdBuilder, className} = this.props;
    return (
      <div
        ref={this.resizeDom}
        className={cx('HorizontalScroll-wrapper', className)}
      >
        <div
          className={cx(
            'HorizontalScroll-Container',
            this.state.isOverflow && 'HorizontalScroll-Container--overflow'
          )}
          {...testIdBuilder?.getChild('links').getTestId()}
        >
          {this.renderArrow('left')}
          <div
            className={cx('HorizontalScroll-Container-main')}
            ref={this.innerWrapper}
          >
            {typeof children === 'function'
              ? children(this.showSelected)
              : children}
          </div>
          {this.renderArrow('right')}
        </div>
      </div>
    );
  }
}
