import React from 'react';
import {isClickOnInput} from '../utils/helper';
import {Icon} from './icons';
import {RootClose} from '../utils/RootClose';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
export interface CardProps extends ThemeProps {
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  subTitleClassName?: string;
  descriptionClassName?: string;
  avatarTextClassName?: string;
  avatarClassName?: string;
  imageClassName?: string;
  highlightClassName?: string;
  bodyClassName?: string;
  media?: React.ReactNode;
  mediaPosition?: 'top' | 'left' | 'right' | 'bottom';
  toolbar?: React.ReactNode;
  children?: React.ReactNode;
  extra?: React.ReactNode;
  actions?: React.ReactNode;
  actionsEllipsis?: React.ReactNode;
  title?: string | JSX.Element;
  subTitle?: string | JSX.Element;
  subTitlePlaceholder?: string | JSX.Element;
  description?: string | JSX.Element;
  descriptionPlaceholder?: string | JSX.Element;
  avatar?: string;
  avatarText?: string | JSX.Element;
  secondary?: string;
  dragging?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  classnames: ClassNamesFn;
  classPrefix: string;
}

export interface CardState {
  isOpen: boolean;
}

export class Card extends React.Component<CardProps, CardState> {
  static defaultProps: Partial<CardProps> = {
    className: '',
    avatarClassName: '',
    headerClassName: '',
    avatarTextClassName: '',
    bodyClassName: '',
    titleClassName: '',
    highlightClassName: '',
    subTitleClassName: '',
    descriptionClassName: '',
    imageClassName: '',
    mediaPosition: 'left'
  };
  state: CardState = {
    isOpen: false
  };
  constructor(props: CardProps) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);
    this.handleEllipsisClick = this.handleEllipsisClick.bind(this);
    this.close = this.close.bind(this);
  }

  handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (isClickOnInput(e)) {
      return;
    }

    this.props.onClick && this.props.onClick(e);
  }

  stopPropagation(e: React.MouseEvent<any>) {
    e && e.stopPropagation();
    e && e.preventDefault();
  }

  handleEllipsisClick(e: React.MouseEvent<any>) {
    this.stopPropagation(e);
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  close() {
    this.setState({
      isOpen: false
    });
  }

  render() {
    const {
      classPrefix: ns,
      classnames: cx,
      className,
      headerClassName,
      bodyClassName,
      titleClassName,
      subTitleClassName,
      descriptionClassName,
      avatarClassName,
      imageClassName,
      avatarTextClassName,
      dragging,
      media,
      mediaPosition,
      actions,
      actionsEllipsis,
      children,
      onClick,
      toolbar,
      title,
      subTitle,
      subTitlePlaceholder,
      description,
      descriptionPlaceholder,
      extra,
      secondary,
      avatar,
      avatarText
    } = this.props;

    const { isOpen } = this.state;
    let heading = null;
    const isShowHeading = avatar || avatarText || extra || title || subTitle || subTitlePlaceholder || description || descriptionPlaceholder || toolbar;
    if (isShowHeading) {
      heading = (
        <div className={cx('Card-heading', headerClassName)}>
          {avatar ? (
            <span
              className={cx(
                'Card-avtar',
                avatarClassName
              )}
            >
              <img
                className={cx(
                  'Card-img',
                  imageClassName
                )}
                src={avatar}
              />
            </span>
          ) : avatarText ? (
            <span
              className={cx(
                'Card-avtarText',
                avatarTextClassName
              )}
            >
              {avatarText}
            </span>
          ) : null}
          <div className={cx('Card-meta')}>
            {extra ? <div className={cx('Card-extra')}>{extra}</div> : null}
            {title ? (
              <div
                className={cx(
                  'Card-title',
                  titleClassName
                )}
              >
                {title}
              </div>
            ) : null}
            {subTitle || subTitlePlaceholder ? (
              <div
                className={cx(
                  'Card-subTitle',
                  subTitleClassName
                )}
              >
                {subTitle ? subTitle : subTitlePlaceholder ? subTitlePlaceholder : null}
              </div>
            ) : null}
            {description || descriptionPlaceholder ? (
              <div className={cx('Card-desc', descriptionClassName)}>
                {description ? description : descriptionPlaceholder ? descriptionPlaceholder : null}
              </div>
            ) : null}
          </div>
          {toolbar}
        </div>
      );
    }

    const body = children;

    const ellipsis = actionsEllipsis ?
      <div className={cx('Card-action-wrapper')} onClick={(e) => this.stopPropagation(e)}>
        <div className={cx('Card-action-ellipsis')} onClick={(e: React.MouseEvent<any>) => this.handleEllipsisClick(e)}>
          <Icon icon="ellipsis-v" className="icon" />
        </div>
        {isOpen ?
          <RootClose
            disabled={!isOpen}
            onRootClose={this.close}
          >
            {(ref: any) => {
              return <div ref={ref} className={cx('Card-actions-menu')}>
                {actionsEllipsis}
              </div>
            }}
          </RootClose> : null}
      </div>
    : null;

    const actionsArr = actions || ellipsis ? (
      <div className={cx('Card-actions-array')}>
        {actions ? <div className={cx('Card-actions-wrapper')}>{actions}</div> : null}
        {ellipsis}
      </div>
    ) : null;
    return (
      <div
        onClick={this.handleClick}
        className={cx('Card', className, {
          'Card--link': onClick
        })}
      >
        {media ?
          <div className={cx(`Card-multiMedia--${mediaPosition}`)}>
            <div className={cx('Card-multiMedia')}>{media}</div>
            <div className={cx('Card-multiMedia-flex')}>
              {dragging ? (
                <div className={cx('Card-dragBtn')}>
                  <Icon icon="drag-bar" className="icon" />
                </div>
              ) : null}
              {heading}
              {body ? (
                <div className={cx('Card-body', bodyClassName)}>{body}</div>
              ) : null}
              {secondary || actionsArr ?
                <div className={cx('Card-footer-wrapper')}>
                  {secondary ? (
                    <div className={cx('Card-secondary')}>{secondary}</div>
                  ) : null}
                  {actionsArr}
                </div>
              : null}
            </div>
          </div> :
          <div>
            {dragging ? (
              <div className={cx('Card-dragBtn')}>
                <Icon icon="drag-bar" className="icon" />
              </div>
            ) : null}
            {heading}
            {body ? (
              <div className={cx('Card-body', bodyClassName)}>{body}</div>
            ) : null}
            {secondary || actionsArr ?
              <div className={cx('Card-footer-wrapper')}>
                {secondary ? (
                  <div className={cx('Card-secondary')}>{secondary}</div>
                ) : null}
                {actionsArr}
              </div>
            : null}
          </div>
        }
      </div>
    );
  }
}

export default themeable(Card);
