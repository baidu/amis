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
  children: React.ReactNode;
  modalContainer?: () => HTMLElement;
  actions?: ImageAction[];
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
    scale: 1,
    rotate: 0
  };

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
  }) {
    this.setState({
      isOpened: true,
      items: info.list ? info.list : [info],
      index: info.index || 0
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
          this.setState(prevState => ({rotate: prevState.rotate - 90}));
          break;
        case ImageActionKey.ROTATE_RIGHT:
          this.setState(prevState => ({rotate: prevState.rotate + 90}));
          break;
        case ImageActionKey.ZOOM_IN:
          this.setState(prevState => ({scale: prevState.scale + 0.5}));
          break;
        case ImageActionKey.ZOOM_OUT:
          this.setState(prevState => {
            return prevState.scale - 0.5 > 0
              ? {scale: prevState.scale - 0.5}
              : null;
          });
          break;
        case ImageActionKey.SCALE_ORIGIN:
          this.setState(() => ({scale: 1}));
          break;
      }

      if (action.onClick && typeof action.onClick === 'function') {
        action.onClick(this);
      }
    },
    250,
    {leading: true, trailing: false}
  );

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
                React.cloneElement(action.icon, {
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
    const {children, classnames: cx, modalContainer, actions} = this.props;
    const {index, items, rotate, scale} = this.state;
    const __ = this.props.translate;

    return (
      <>
        {React.cloneElement(children as any, {
          onImageEnlarge: this.handleImageEnlarge
        })}

        <Modal
          closeOnEsc
          size="full"
          onHide={this.close}
          show={this.state.isOpened}
          contentClassName={cx('ImageGallery')}
          container={modalContainer}
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
              <div className={cx('ImageGallery-main')}>
                <img
                  src={items[index].originalSrc}
                  style={{transform: `scale(${scale}) rotate(${rotate}deg)`}}
                />

                {Array.isArray(actions) && actions.length > 0
                  ? this.renderToolbar(actions)
                  : null}

                {items.length > 1 ? (
                  <>
                    <a
                      className={cx(
                        'ImageGallery-prevBtn',
                        index <= 0 ? 'is-disabled' : ''
                      )}
                      onClick={this.prev}
                    >
                      <Icon icon="prev" className="icon" />
                    </a>
                    <a
                      className={cx(
                        'ImageGallery-nextBtn',
                        index >= items.length - 1 ? 'is-disabled' : ''
                      )}
                      onClick={this.next}
                    >
                      <Icon icon="next" className="icon" />
                    </a>
                  </>
                ) : null}
              </div>
            </>
          ) : null}

          {items.length > 1 ? (
            <div className={cx('ImageGallery-footer')}>
              <a className={cx('ImageGallery-prevList is-disabled')}>
                <Icon icon="prev" className="icon" />
              </a>
              <div className={cx('ImageGallery-itemsWrap')}>
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
              <a className={cx('ImageGallery-nextList is-disabled')}>
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
