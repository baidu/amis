import React from 'react';
import {reaction} from 'mobx';
import {Icon, resizeSensor} from 'amis';
import {EditorStoreType} from '../store/editor';
import {EditorManager} from '../manager';
import {observer} from 'mobx-react';
import {EditorNodeType} from '../store/node';
import {autobind} from '../util';

export interface BreadcrumbProps {
  store: EditorStoreType;
  manager: EditorManager;
}

interface BreadcrumbStates {
  showLeftScrollBtn: boolean;
  showRightScrollBtn: boolean;
}

@observer
export default class Breadcrumb extends React.Component<
  BreadcrumbProps,
  BreadcrumbStates
> {
  readonly breadcrumbRef = React.createRef<HTMLDivElement>();
  readonly bcnContentRef = React.createRef<HTMLDivElement>();

  currentBreadcrumb: HTMLElement; // 记录当前面包屑元素
  unReaction: () => void;
  unSensor?: () => void;

  constructor(props: any) {
    super(props);

    this.state = {
      showLeftScrollBtn: false,
      showRightScrollBtn: false
    };

    this.unReaction = reaction(
      () => this.props.store.bcn,
      () => {
        // 内容变动时，自动触发一次计算
        this.refreshHandleScroll(true);
      }
    );
  }

  componentDidMount() {
    const scrollElem = this.getCurBreadcrumb();
    const breadcrumbContainer = this.getBreadcrumbContainer();

    if (!scrollElem || !breadcrumbContainer) {
      return;
    }

    this.unSensor = resizeSensor(breadcrumbContainer, () => {
      this.refreshHandleScroll();
    });
  }

  componentWillUnmount() {
    this.unReaction();
    if (this.unSensor) {
      this.unSensor();
      delete this.unSensor;
    }
  }

  @autobind
  refreshHandleScroll(resetScroll?: boolean) {
    setTimeout(() => {
      this.HandleScroll(resetScroll);
    }, 0);
  }

  @autobind
  getCurBreadcrumb() {
    return this.bcnContentRef.current;
  }

  @autobind
  getBreadcrumbContainer() {
    return this.breadcrumbRef.current;
  }

  @autobind
  getScrollLeft(): string {
    const curBreadcrumb = this.getCurBreadcrumb();
    return curBreadcrumb ? curBreadcrumb.style.left : '0';
  }

  @autobind
  toNumber(pxStr: string): number {
    let curScrollLeft = 0;
    if (!pxStr) {
      return curScrollLeft;
    }
    return Number.parseInt(pxStr);
  }

  @autobind
  HandleScroll(resetScroll?: boolean) {
    const scrollElem = this.getCurBreadcrumb();
    const scrollContainer = this.getBreadcrumbContainer();

    if (!scrollElem || !scrollContainer) {
      return;
    }

    const scrollLeft = this.toNumber(this.getScrollLeft());
    const maxScrollLeft = scrollElem.offsetWidth - scrollContainer.offsetWidth;

    if (resetScroll) {
      scrollElem.style.left = '0';
    }

    this.setState({
      showLeftScrollBtn: scrollLeft < 0,
      showRightScrollBtn: scrollLeft > -maxScrollLeft
    });
  }

  @autobind
  handleScrollToLeft() {
    // 向左滚动：看左侧内容，left + 50， 滚动内容需要右移
    const scrollElem = this.getCurBreadcrumb();

    if (!scrollElem) {
      return;
    }

    const scrollLeft = this.toNumber(this.getScrollLeft());

    if (scrollLeft >= -50 && scrollLeft < 0) {
      scrollElem.style.left = '0';
      this.refreshHandleScroll();
    } else if (scrollLeft < -50) {
      scrollElem.style.left = `${scrollLeft + 50}px`;
      this.refreshHandleScroll();
    }
  }

  @autobind
  handleScrollToRight() {
    // 向左滚动：看左侧内容，left - 50， 滚动内容需要左移
    const scrollElem = this.getCurBreadcrumb();
    const scrollContainer = this.getBreadcrumbContainer();

    if (!scrollElem || !scrollContainer) {
      return;
    }

    const scrollLeft = this.toNumber(this.getScrollLeft());
    const maxScrollLeft = scrollElem.offsetWidth - scrollContainer.offsetWidth;

    if (scrollLeft - 50 > -maxScrollLeft) {
      scrollElem.style.left = `${scrollLeft - 50}px`;
    } else {
      scrollElem.style.left = `-${maxScrollLeft}px`;
    }
    this.refreshHandleScroll();
  }

  @autobind
  handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const dom = e.currentTarget;
    const id = dom.getAttribute('data-node-id')!;
    const region = dom.getAttribute('data-node-region')!;
    const store = this.props.store;
    const manager = this.props.manager;
    const node = store.getNodeById(id);

    if (node?.info?.editable === false) {
      return;
    }

    if (region) {
      // 点击容器类型自动弹出「组件插入面板」有点干扰用户操作
      // manager.showInsertPanel(region, id);
      /** 特殊区域允许点击事件 */
      store.setActiveId(id, region);
    } else {
      store.setActiveId(id);
    }
  }

  @autobind
  handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    const dom = e.currentTarget;
    const id = dom.getAttribute('data-node-id')!;
    const region = dom.getAttribute('data-node-region')!;
    const store = this.props.store;

    store.setHoverId(id, region);
  }

  render() {
    const {store} = this.props;
    const {showLeftScrollBtn, showRightScrollBtn} = this.state;
    const bcn = store.bcn;

    return (
      <div className="ae-Breadcrumb" ref={this.breadcrumbRef}>
        {showLeftScrollBtn && (
          <div
            className="ae-Breadcrumb-scrollLeft-btn"
            onClick={this.handleScrollToLeft}
          >
            <Icon icon="editor-double-arrow" className="icon" />
          </div>
        )}
        <div className="ae-Breadcrumb-content" ref={this.bcnContentRef}>
          {bcn.length ? (
            <ul>
              {bcn.map((item, index) => {
                const nearby: Array<EditorNodeType> = (item.parent as EditorNodeType)
                  ?.uniqueChildren;

                return (
                  <li key={index}>
                    <span
                      data-node-id={item.id}
                      data-node-region={item.region}
                      onClick={this.handleClick}
                      onMouseEnter={this.handleMouseEnter}
                    >
                      {item.label}
                    </span>
                    {nearby?.length > 1 ? (
                      <ul className='hoverShowScrollBar'>
                        {nearby.map(child => (
                          <li key={`${child.id}-${child.region}`}>
                            <span
                              data-node-id={child.id}
                              data-node-region={child.region}
                              onClick={this.handleClick}
                              onMouseEnter={this.handleMouseEnter}
                              className={
                                child.id === item.id &&
                                child.region === item.region
                                  ? 'is-active'
                                  : ''
                              }
                            >
                              {child.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
        {showRightScrollBtn && (
          <div
            className="ae-Breadcrumb-scrollRight-btn"
            onClick={this.handleScrollToRight}
          >
            <Icon icon="editor-double-arrow" className="icon" />
          </div>
        )}
      </div>
    );
  }
}
