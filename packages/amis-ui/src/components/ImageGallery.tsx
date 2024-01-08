import React from 'react';
import debounce from 'lodash/debounce';
import {themeable, ThemeProps} from 'amis-core';
import {autobind} from 'amis-core';
import Modal from './Modal';
import {Icon} from './icons';
import {LocaleProps, localeable} from 'amis-core';
import Range from './Range';
import Spinner, {SpinnerExtraProps} from './Spinner';
import DragProgress from './DragProgress';
import Sliding from './Sliding';
import Pagination from './Pagination';

export enum ImageActionKey {
  /** 拖动 */
  DRAG = 'drag',
  /** 默认视图 */
  DEFAULT_VIEW = 'default-view',
  /** 右旋转 */
  ROTATE_RIGHT = 'rotateRight',
  /** 左旋转 */
  ROTATE_LEFT = 'rotateLeft',
  /** 下载 */
  DOWNLOAD = 'download',
  /** 等比例放大 */
  ZOOM_IN = 'zoomIn',
  /** 等比例缩小 */
  ZOOM_OUT = 'zoomOut',
  /** 恢复原图缩放比例尺 */
  SCALE_ORIGIN = 'scaleOrigin',
  /** 分页 */
  PAGINATE = 'paginate'
}

export interface ImageAction {
  key: ImageActionKey;
  label?: string;
  icon?: string | React.ReactNode;
  iconClassName?: string;
  disabled?: boolean;
  onClick?: (context: ImageGallery) => void;
}

interface ImageGalleryItem {
  src: string;
  originalSrc: string;
  title?: string | React.JSX.Element;
  caption?: string | React.JSX.Element;
}

interface ImageGalleryPosition {
  toolbar: 'top' | 'bottom';
  description: 'left' | 'right';
}

export interface ImageGalleryProps
  extends ThemeProps,
    LocaleProps,
    SpinnerExtraProps {
  children: React.ReactNode | Array<React.ReactNode>;
  modalContainer?: () => HTMLElement;
  /** 操作栏 */
  actions?: ImageAction[];
  imageGallaryClassName?: string;
  showToolbar?: boolean;
  /** 是否内嵌 */
  embed?: boolean;
  items?: Array<ImageGalleryItem>;
  position?: ImageGalleryPosition;
  enlargeWithGallary?: boolean;
}

export interface ImageGalleryState {
  isOpened: boolean;
  index: number;
  items: Array<ImageGalleryItem>;
  /** 图片缩放比例尺 */
  scale: number;
  /** 默认图片缩放比例尺 */
  defaultScale: number;
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
  /** 图片是否加载中 */
  imageLoading: boolean;
  /** 图片信息 */
  imageLoadInfo: {
    naturalWidth: number;
    naturalHeight: number;
    url: string;
  };
  /** 图片是否使用1:1 */
  isNaturalSize: boolean;
  position?: ImageGalleryPosition;
}

export class ImageGallery extends React.Component<
  ImageGalleryProps,
  ImageGalleryState
> {
  static defaultProps: Pick<ImageGalleryProps, 'actions' | 'embed'> = {
    actions: [
      {
        key: ImageActionKey.DRAG,
        label: 'drag'
      },
      {
        key: ImageActionKey.DEFAULT_VIEW,
        icon: 'default-view',
        label: 'default.view'
      },
      {
        key: ImageActionKey.SCALE_ORIGIN,
        icon: 'scale-origin',
        label: 'scale.origin'
      },
      {
        key: ImageActionKey.ROTATE_LEFT,
        icon: 'rotate-left',
        label: 'rotate.left'
      },
      {
        key: ImageActionKey.DOWNLOAD,
        icon: 'image-download',
        label: 'download'
      },
      {
        key: ImageActionKey.PAGINATE
      }
    ],
    embed: false
  };

  state: ImageGalleryState = {
    isOpened: false,
    index: -1,
    items: [],
    tx: 0,
    ty: 0,
    scale: 1,
    defaultScale: 1,
    rotate: 0,
    showToolbar: false,
    imageGallaryClassName: '',
    actions: ImageGallery.defaultProps.actions,
    imageLoading: true,
    isNaturalSize: false,
    imageLoadInfo: {
      naturalWidth: 0,
      naturalHeight: 0,
      url: ''
    }
  };

  galleryMain?: HTMLDivElement;

  constructor(props: ImageGalleryProps) {
    super(props);

    this.state = {
      ...this.state,
      items: props.items ?? [],
      index: !!props?.items ? 0 : -1,
      showToolbar: !!props?.showToolbar
    };
  }

  componentDidUpdate(prevProps: Readonly<ImageGalleryProps>): void {
    if (this.props.items !== prevProps.items) {
      this.setState({
        items: this.props.items ?? []
      });
    }
    if (this.props?.showToolbar !== prevProps?.showToolbar) {
      this.setState({
        showToolbar: !!this.props.showToolbar
      });
    }

    if (this.props.position !== prevProps.position) {
      this.setState({
        position: this.props.position
      });
    }

    if (this.props.enlargeWithGallary !== prevProps.enlargeWithGallary) {
      this.setState({
        enlargeWithGallary: this.props.enlargeWithGallary
      });
    }
  }

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
    position?: ImageGalleryPosition;
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
      position: info?.position,
      imageLoading: true,
      /** 外部传入合法key值的actions才会生效 */
      actions: Array.isArray(info.toolbarActions)
        ? info.toolbarActions.filter(action =>
            validActionKeys.includes(action?.key)
          )
        : actions
    });
  }

  resetImageAction() {
    const {defaultScale} = this.state;
    this.setState({
      scale: defaultScale,
      rotate: 0,
      isNaturalSize: false
    });
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
    this.setIndex(index - 1);
  }

  @autobind
  next() {
    const index = this.state.index;
    this.setIndex(index + 1);
  }

  @autobind
  handleItemClick(e: React.MouseEvent<HTMLDivElement>) {
    const index = parseInt(e.currentTarget.getAttribute('data-index')!, 10);
    this.setIndex(index);
  }

  /**
   * 设置当前选中
   */
  @autobind
  setIndex(cIndex: number) {
    const {items, index} = this.state;
    const bool = items[index].originalSrc === items[cIndex].originalSrc;
    this.setState({
      index: cIndex,
      imageLoading: !bool,
      tx: 0,
      ty: 0
    });
    this.resetImageAction();
  }

  /**
   * 下载图片
   */
  @autobind
  downloadImage() {
    const {items, index} = this.state;
    const url = items[index].originalSrc;
    const image = new Image();
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    image.src = url;
    image.crossOrigin = 'Anonymous';
    image.style.display = 'none';
    image.onload = () => {
      context?.drawImage(image, 0, 0);
      const base64 = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = base64;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    image.onerror = () => {
      window.open(url, '_blank');
    };
  }

  handleToolbarAction = debounce(
    (action: ImageAction) => {
      if (action.disabled) {
        return;
      }

      const {defaultScale} = this.state;
      switch (action.key) {
        case ImageActionKey.DEFAULT_VIEW:
          this.setState({
            scale: defaultScale,
            isNaturalSize: false,
            tx: 0,
            ty: 0
          });
          break;
        case ImageActionKey.ROTATE_LEFT:
          this.setState(prevState => ({
            rotate: prevState.rotate - 90,
            tx: 0,
            ty: 0
          }));
          break;
        case ImageActionKey.SCALE_ORIGIN:
          this.setState(() => ({scale: 1, tx: 0, ty: 0, isNaturalSize: true}));
          break;
        case ImageActionKey.DOWNLOAD:
          this.downloadImage();
          break;
      }

      if (action.onClick && typeof action.onClick === 'function') {
        action.onClick(this);
      }
    },
    100,
    {leading: true, trailing: false}
  );

  @autobind
  handleImageLoadStart() {
    this.setState({
      imageLoading: true
    });
  }

  @autobind
  handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const {index, items} = this.state;
    const {clientWidth, clientHeight} = this.galleryMain!;
    // @ts-ignore
    const naturalHeight = e.target?.naturalHeight;
    // @ts-ignore
    const naturalWidth = e.target?.naturalWidth;
    let scale = 1;
    if (naturalHeight >= clientHeight || naturalWidth >= clientWidth) {
      const p1 = clientHeight / naturalHeight;
      const p2 = clientWidth / naturalWidth;
      scale = p1 > p2 ? p2 : p1;
    }
    this.setState({
      scale,
      defaultScale: scale,
      imageLoadInfo: {
        url: items[index]?.src,
        naturalHeight,
        naturalWidth
      },
      imageLoading: false
    });
  }

  @autobind
  handleImageError() {
    this.setState({
      imageLoading: false
    });
  }

  @autobind
  handleDragProgress(precent: number) {
    this.setState({
      scale: precent / 100,
      tx: 0,
      ty: 0
    });
  }

  @autobind
  handlePageChange(page: number, perPage?: number | undefined) {
    this.setIndex(page - 1);
  }

  renderToolbar(actions: ImageAction[]) {
    const {classnames: cx, translate: __, className} = this.props;
    const {scale, index, items} = this.state;

    return (
      <div className={cx('ImageGallery-toolbar', className)}>
        <div className={cx('ImageGallery-toolbar-list')}>
          {actions.map(action => {
            if (action.key === ImageActionKey.DRAG) {
              return (
                <div className={cx('ImageGallery-toolbar-range')}>
                  <Range
                    onChange={this.handleDragProgress}
                    value={scale * 100}
                    step={1}
                    min={0}
                    max={200}
                  />
                </div>
              );
            }

            if (action.key === ImageActionKey.PAGINATE) {
              return (
                <Pagination
                  className={cx('ImageGallery-toolbar-pagination')}
                  perPage={1}
                  activePage={index + 1}
                  total={items.length}
                  showPerPage
                  hasNext={items.length > index + 1}
                  mode="simple"
                  onPageChange={this.handlePageChange}
                />
              );
            }

            return (
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
            );
          })}
        </div>
      </div>
    );
  }

  @autobind
  renderBody() {
    const {classnames: cx, embed} = this.props;
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
      imageLoadInfo,
      isNaturalSize,
      imageLoading,
      position
    } = this.state;
    const {translate: __, loadingConfig} = this.props;

    const imageStyle = {
      ...(isNaturalSize
        ? {
            width: `${imageLoadInfo?.naturalWidth}px`,
            height: `${imageLoadInfo?.naturalHeight}px`
          }
        : {}),
      ...(imageLoading
        ? {
            display: 'none'
          }
        : {}),
      transform: `translate(${tx}px, ${ty}px) scale(${scale}) rotate(${rotate}deg)`
    };

    return [
      ~index && items[index] ? (
        <>
          <div className={cx('ImageGallery-main')}>
            <div
              className={cx(
                'ImageGallery-preview',
                position?.toolbar === 'top'
                  ? 'ImageGallery-preview-reverse'
                  : ''
              )}
            >
              <div
                className={cx(
                  'ImageGallery-image',
                  enlargeWithGallary === false
                    ? 'ImageGallery-image-bottom'
                    : ''
                )}
              >
                <div
                  className={cx('ImageGallery-image-wrap')}
                  ref={this.galleryMainRef}
                >
                  <img
                    draggable={false}
                    src={items[index].originalSrc}
                    style={imageStyle}
                    onLoadStart={this.handleImageLoadStart}
                    onLoad={this.handleImageLoad}
                    onError={this.handleImageError}
                  />
                  {items.length > 1 && enlargeWithGallary !== false ? (
                    <>
                      {index > 0 ? (
                        <span
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
                        </span>
                      ) : null}
                      {index < items.length - 1 ? (
                        <span
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
                        </span>
                      ) : null}
                    </>
                  ) : null}
                  <Spinner show={imageLoading} loadingConfig={loadingConfig} />
                </div>
              </div>

              {showToolbar && Array.isArray(actions) && actions.length > 0
                ? this.renderToolbar(actions)
                : null}
            </div>

            {items.length > 1 && enlargeWithGallary !== false ? (
              <Sliding
                activeKey={index}
                onChange={this.setIndex}
                skin={embed ? 'light' : 'dark'}
                options={items.map((item, itemIndex) => ({
                  key: itemIndex,
                  node: (
                    <img
                      src={item.src}
                      className={cx('ImageGallery-sliding-img')}
                    />
                  )
                }))}
              />
            ) : null}
          </div>
        </>
      ) : null,
      items[index]?.title && items[index]?.caption ? (
        <div className={cx('ImageGallery-info')}>
          <div className={cx('ImageGallery-info-title')}>
            {items[index]?.title}
          </div>
          <div className={cx('ImageGallery-info-description')}>
            {items[index]?.caption}
          </div>
        </div>
      ) : null
    ];
  }

  renderTitle() {
    const {classnames: cx} = this.props;
    const {items, index} = this.state;

    return items[index]?.title && !items[index]?.caption ? (
      <span className={cx('ImageGallery-toptitle')}>{items[index].title}</span>
    ) : null;
  }

  render() {
    const {children, modalContainer, embed, classnames: cx} = this.props;
    const {items, index, imageGallaryClassName, isOpened, position} =
      this.state;

    const isTopTitle = items[index]?.title && !items[index]?.caption;

    return (
      <>
        {React.cloneElement(children as any, {
          onImageEnlarge: this.handleImageEnlarge
        })}
        {!embed ? (
          <Modal
            closeOnEsc
            size="full"
            onHide={this.close}
            show={isOpened}
            contentClassName={cx(
              'ImageGallery',
              imageGallaryClassName,
              position?.description === 'left' ? 'ImageGallery-reverse' : ''
            )}
            modalMaskClassName={cx('ImageGallery-overlay')}
            container={modalContainer}
          >
            <span className={cx('ImageGallery-close')} onClick={this.close}>
              <Icon icon="close" className="icon" />
            </span>
            {this.renderTitle()}
            {this.renderBody()}
          </Modal>
        ) : (
          <div
            className={cx(
              'ImageGallery',
              imageGallaryClassName,
              'ImageGallery-embed',
              isTopTitle ? 'ImageGallery-embed-title' : ''
            )}
          >
            {this.renderTitle()}
            {this.renderBody()}
          </div>
        )}
      </>
    );
  }
}

export default themeable(localeable(ImageGallery));
