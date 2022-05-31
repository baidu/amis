import React from 'react';
import {themeable, ClassNamesFn, ThemeProps} from 'amis-core';
import {autobind} from 'amis-core';
import Modal from './Modal';
import {Icon} from './icons';
import {LocaleProps, localeable} from 'amis-core';

export interface ImageGalleryProps extends ThemeProps, LocaleProps {
  children: React.ReactNode;
  modalContainer?: () => HTMLElement;
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
}

export class ImageGallery extends React.Component<
  ImageGalleryProps,
  ImageGalleryState
> {
  state: ImageGalleryState = {
    isOpened: false,
    index: -1,
    items: []
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

  @autobind
  close() {
    this.setState({
      isOpened: false
    });
  }

  @autobind
  prev() {
    const index = this.state.index;
    this.setState({
      index: index - 1
    });
  }

  @autobind
  next() {
    const index = this.state.index;
    this.setState({
      index: index + 1
    });
  }

  @autobind
  handleItemClick(e: React.MouseEvent<HTMLDivElement>) {
    const index = parseInt(e.currentTarget.getAttribute('data-index')!, 10);
    this.setState({
      index
    });
  }

  render() {
    const {children, classnames: cx, modalContainer} = this.props;
    const {index, items} = this.state;
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
                <img src={items[index].originalSrc} />

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
