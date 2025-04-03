import React from 'react';
import debounce from 'lodash/debounce';
import {themeable, ClassNamesFn, ThemeProps} from 'amis-core';
import {autobind} from 'amis-core';
import Modal from './Modal';
import {Icon} from './icons';
import {LocaleProps, localeable} from 'amis-core';

export enum ImageActionKey {
  /** 右旋转 */
  ROTATE_RIGHT = 'rotateRight',
  /** 左旋转 */
  ROTATE_LEFT = 'rotateLeft',
  /** 等比例放大 */
  ZOOM_IN = 'zoomIn',
  /** 等比例缩小 */
  ZOOM_OUT = 'zoomOut',
  /** 恢复原图缩放比例尺 */
  SCALE_ORIGIN = 'scaleOrigin'
}

export interface ImageAction {
  key: ImageActionKey;
  label?: string;
  icon?: string | React.ReactNode;
  iconClassName?: string;
  disabled?: boolean;
  onClick?: (context: ImageGallery) => void;
}

export interface ImageGalleryProps extends ThemeProps, LocaleProps {
  children: React.ReactNode | Array<React.ReactNode>;
  modalContainer?: () => HTMLElement;
  /** 操作栏 */
  actions?: ImageAction[];
  imageGallaryClassName?: string;
}

export interface ImageGalleryState {
  isOpened: boolean;
  index: number;
  items: Array<{
    src: string;
    originalSrc: string;
    title?: string;
    caption?: string;
  }>;
  /** 图片缩放比例尺 */
  scale: number;
  /** 图片旋转角度 */
  rotate: number;
  /**
   * 水平位移
   */
  tx: number;
  /**
   * 垂直位移
   */
  ty: number;
  /** 是否开启操作栏 */
  showToolbar?: boolean;
  /** 是否显示底部图片集 */
  enlargeWithGallary?: boolean;
  /** 放大详情图类名 */
  imageGallaryClassName?: string;
  /** 工具栏配置 */
  actions?: ImageAction[];

  scrollBarLeading?: boolean;
  scrollBarTrailing?: boolean;
}

export class ImageGallery extends React.Component<
  ImageGalleryProps,
  ImageGalleryState
> {
  static defaultProps: Pick<ImageGalleryProps, 'actions'> = {
    actions: [
      {
        key: ImageActionKey.ROTATE_LEFT,
        icon: 'rotate-left',
        label: 'rotate.left'
      },
      {
        key: ImageActionKey.ROTATE_RIGHT,
        icon: 'rotate-right',
        label: 'rotate.right'
      },
      {key: ImageActionKey.ZOOM_IN, icon: 'zoom-in', label: 'zoomIn'},
      {key: ImageActionKey.ZOOM_OUT, icon: 'zoom-out', label: 'zoomOut'},
      {
        key: ImageActionKey.SCALE_ORIGIN,
        icon: 'scale-origin',
        label: 'scale.origin'
      }
    ]
  };

  state: ImageGalleryState = {
    isOpened: false,
    index: -1,
    items: [],
    tx: 0,
    ty: 0,
    scale: 1,
    rotate: 0,
    showToolbar: false,
    imageGallaryClassName: '',
    actions: ImageGallery.defaultProps.actions
  };

  galleryMain?: HTMLDivElement;
  @autobind
  galleryMainRef(ref: HTMLDivElement) {
    if (ref) {
      ref.addEventListener('wheel', this.onWheelScroll, {
        passive: false
      });
      ref.addEventListener('mousedown', this.onMouseDown);
    } else {
      this.galleryMain?.removeEventListener('wheel', this.onWheelScroll);
      this.galleryMain?.removeEventListener('mousedown', this.onMouseDown);
    }

    this.galleryMain = ref;
  }

  @autobind
  onWheelScroll(event: WheelEvent) {
    const showToolbar = this.state?.showToolbar;

    if (!showToolbar) {
      return;
    }

    event.preventDefault();

    /** 向上滚动放大，向下滚动缩小 */
    if (event.deltaY > 0) {
      this.handleToolbarAction({key: 'zoomOut'} as ImageAction);
    } else if (event.deltaY < 0) {
      this.handleToolbarAction({key: 'zoomIn'} as ImageAction);
    }
  }

  startX = 0;
  startY = 0;
  startTx = 0;
  startTy = 0;

  @autobind
  onMouseDown(event: MouseEvent) {
    const isLeftButton =
      (event.button === 1 && window.event !== null) || event.button === 0;
    if (!isLeftButton || event.defaultPrevented) return;

    event.preventDefault();

    this.galleryMain?.classList.add('is-dragging');
    document.body.addEventListener('mousemove', this.onMouseMove);
    document.body.addEventListener('mouseup', this.onMouseUp);

    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startTx = this.state.tx;
    this.startTy = this.state.ty;
  }

  @autobind
  onMouseMove(event: MouseEvent) {
    this.setState({
      tx: this.startTx + event.clientX - this.startX,
      ty: this.startTy + event.clientY - this.startY
    });
  }

  @autobind
  onMouseUp() {
    this.galleryMain?.classList.remove('is-dragging');
    document.body.removeEventListener('mousemove', this.onMouseMove);
    document.body.removeEventListener('mouseup', this.onMouseUp);
  }

  @autobind
  handleImageEnlarge(info: {
    src: string;
    originalSrc: string;
    list?: Array<{
      src: string;
      originalSrc: string;
      title?: string;
      caption?: string;
    }>;
    title?: string;
    caption?: string;
    index?: number;
    showToolbar?: boolean;
    imageGallaryClassName?: string;
    toolbarActions?: ImageAction[];
    enlargeWithGallary?: boolean;
  }) {
    const {actions} = this.props;
    const validActionKeys = Object.values(ImageActionKey);

    this.setState({
      isOpened: true,
      tx: 0,
      ty: 0,
      rotate: 0,
      scale: 1,
      items: info.list ? info.list : [info],
      index: info.index || 0,
      /* children组件可以控制工具栏的展示 */
      showToolbar: !!info.showToolbar,
      enlargeWithGallary: info.enlargeWithGallary,
      imageGallaryClassName: info.imageGallaryClassName,
      /** 外部传入合法key值的actions才会生效 */
      actions: Array.isArray(info.toolbarActions)
        ? info.toolbarActions.filter(action =>
            validActionKeys.includes(action?.key)
          )
        : actions,

      scrollBarLeading: true,
      scrollBarTrailing: false
    });
  }

  resetImageAction() {
    this.setState({scale: 1, rotate: 0});
  }

  @autobind
  close() {
    this.setState({
      isOpened: false
    });
    this.resetImageAction();
  }

  @autobind
  prev() {
    const index = this.state.index;
    this.setState({index: index - 1});
    this.resetImageAction();
  }

  @autobind
  next() {
    const index = this.state.index;
    this.setState({index: index + 1});
    this.resetImageAction();
  }

  @autobind
  handleItemClick(e: React.MouseEvent<HTMLDivElement>) {
    const index = parseInt(e.currentTarget.getAttribute('data-index')!, 10);
    this.setState({index});
    this.resetImageAction();
  }

  handleToolbarAction = debounce(
    (action: ImageAction) => {
      if (action.disabled) {
        return;
      }

      switch (action.key) {
        case ImageActionKey.ROTATE_LEFT:
          this.setState(prevState => ({
            rotate: prevState.rotate - 90,
            tx: 0,
            ty: 0
          }));
          break;
        case ImageActionKey.ROTATE_RIGHT:
          this.setState(prevState => ({
            rotate: prevState.rotate + 90,
            tx: 0,
            ty: 0
          }));
          break;
        case ImageActionKey.ZOOM_IN:
          this.setState(prevState => ({
            scale: prevState.scale + 0.5,
            tx: 0,
            ty: 0
          }));
          break;
        case ImageActionKey.ZOOM_OUT:
          this.setState(prevState => {
            return prevState.scale - 0.5 > 0
              ? {scale: prevState.scale - 0.5, tx: 0, ty: 0}
              : null;
          });
          break;
        case ImageActionKey.SCALE_ORIGIN:
          this.setState(() => ({scale: 1, tx: 0, ty: 0}));
          break;
      }

      if (action.onClick && typeof action.onClick === 'function') {
        action.onClick(this);
      }
    },
    250,
    {leading: true, trailing: false}
  );

  @autobind
  handleModalEntered() {
    if (this.scrollBar.current) {
      const item = this.scrollBar.current.querySelector(
        `div[data-index="${this.state.index}"]`
      );
      item?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

  scrollBar = React.createRef<HTMLDivElement>();

  @autobind
  handleBarScroll() {
    const scrollBar = this.scrollBar.current!;
    const inner = scrollBar.firstElementChild as HTMLElement;

    this.setState({
      scrollBarLeading: scrollBar.scrollLeft === 0,
      scrollBarTrailing:
        scrollBar.offsetWidth + scrollBar.scrollLeft >= inner.offsetWidth
    });
  }

  scroll(direction = 1) {
    const scrollBar = this.scrollBar.current!;
    const inner = scrollBar.firstElementChild as HTMLElement;
    const gap = inner.offsetWidth - scrollBar.offsetWidth;

    scrollBar.scrollTo({
      left: scrollBar.scrollLeft + gap * 0.1 * direction,
      top: 0,
      behavior: 'smooth'
    });

    let timer = setInterval(() => {
      scrollBar.scrollTo({
        left: scrollBar.scrollLeft + 5 * direction,
        top: 0,
        behavior: 'smooth'
      });
    }, 50);
    let onMouseUp = () => {
      document.body.removeEventListener('mouseup', onMouseUp);
      clearInterval(timer);
    };
    document.body.addEventListener('mouseup', onMouseUp);
  }

  @autobind
  scrollRight() {
    this.scroll(1);
  }

  @autobind
  scrollLeft() {
    this.scroll(-1);
  }

  renderToolbar(actions: ImageAction[]) {
    const {classnames: cx, translate: __, className} = this.props;
    const scale = this.state.scale;

    return (
      <div className={cx('ImageGallery-toolbar', className)}>
        {actions.map(action => (
          <div
            className={cx('ImageGallery-toolbar-action', {
              'is-disabled':
                action.disabled ||
                (action.key === ImageActionKey.ZOOM_OUT && scale - 0.5 <= 0)
            })}
            key={action.key}
            onClick={() => this.handleToolbarAction(action)}
          >
            <a
              className={cx('ImageGallery-toolbar-action-icon')}
              data-tooltip={__(action.label)}
              data-position="top"
            >
              {React.isValidElement(action.icon) ? (
                React.cloneElement(action.icon as React.ReactElement, {
                  className: cx('icon', action.iconClassName)
                })
              ) : (
                <Icon
                  icon={action.icon}
                  className={cx('icon', action.iconClassName)}
                />
              )}
            </a>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const {children, classnames: cx, modalContainer} = this.props;
    const {
      index,
      items,
      rotate,
      scale,
      tx,
      ty,
      showToolbar,
      enlargeWithGallary,
      actions,
      imageGallaryClassName,
      scrollBarLeading,
      scrollBarTrailing
    } = this.state;
    const __ = this.props.translate;

    return (
      <>
        {React.cloneElement(children as any, {
          onImageEnlarge: this.handleImageEnlarge
        })}

        <Modal
          closeOnEsc
          closeOnOutside
          size="full"
          onHide={this.close}
          show={this.state.isOpened}
          contentClassName={cx('ImageGallery', imageGallaryClassName)}
          container={modalContainer}
          onEntered={this.handleModalEntered}
        >
          <a
            data-tooltip={__('Dialog.close')}
            data-position="left"
            className={cx('ImageGallery-close')}
            onClick={this.close}
          >
            <Icon icon="close" className="icon" />
          </a>
          {~index && items[index] ? (
            <>
              <div className={cx('ImageGallery-title')}>
                {items[index].title}
              </div>
              {items[index].caption ? (
                <div className={cx('ImageGallery-caption')}>
                  {items[index].caption}
                </div>
              ) : null}
              <div
                className={cx('ImageGallery-main')}
                ref={this.galleryMainRef}
              >
                <img
                  draggable={false}
                  src={items[index].originalSrc}
                  style={{
                    transform: `translate(${tx}px, ${ty}px) scale(${scale}) rotate(${rotate}deg)`
                  }}
                />

                {showToolbar && Array.isArray(actions) && actions.length > 0
                  ? this.renderToolbar(actions)
                  : null}

                {items.length > 1 && enlargeWithGallary !== false ? (
                  <>
                    <a
                      className={cx(
                        'ImageGallery-prevBtn',
                        index <= 0 ? 'is-disabled' : ''
                      )}
                      onClick={this.prev}
                    >
                      <Icon
                        icon="prev"
                        className="icon"
                        iconContent="ImageGallery-prevBtn"
                      />
                    </a>
                    <a
                      className={cx(
                        'ImageGallery-nextBtn',
                        index >= items.length - 1 ? 'is-disabled' : ''
                      )}
                      onClick={this.next}
                    >
                      <Icon
                        icon="next"
                        className="icon"
                        iconContent="ImageGallery-nextBtn"
                      />
                    </a>
                  </>
                ) : null}
              </div>
            </>
          ) : null}

          {items.length > 1 && enlargeWithGallary !== false ? (
            <div className={cx('ImageGallery-footer')}>
              <a
                className={cx(
                  'ImageGallery-prevList',
                  scrollBarLeading ? 'is-disabled' : ''
                )}
                onMouseDown={this.scrollLeft}
              >
                <Icon icon="prev" className="icon" />
              </a>
              <div
                className={cx('ImageGallery-itemsWrap')}
                ref={this.scrollBar}
                onScroll={this.handleBarScroll}
              >
                <div className={cx('ImageGallery-items')}>
                  {items.map((item, i) => (
                    <div
                      key={i}
                      data-index={i}
                      onClick={this.handleItemClick}
                      className={cx(
                        'ImageGallery-item',
                        i === index ? 'is-active' : ''
                      )}
                    >
                      <img src={item.src} />
                    </div>
                  ))}
                </div>
              </div>
              <a
                className={cx(
                  'ImageGallery-nextList',
                  scrollBarTrailing ? 'is-disabled' : ''
                )}
                onMouseDown={this.scrollRight}
              >
                <Icon icon="next" className="icon" />
              </a>
            </div>
          ) : null}
        </Modal>
      </>
    );
  }
}

export default themeable(localeable(ImageGallery));
