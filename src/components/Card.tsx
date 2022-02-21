import React from 'react';
import {isClickOnInput} from '../utils/helper';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {buildStyle} from '../utils/style';
export interface CardProps extends ThemeProps {
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  subTitleClassName?: string;
  descriptionClassName?: string;
  avatarTextStyle?: object;
  avatarTextClassName?: string;
  avatarClassName?: string;
  secondaryClassName?: string;
  imageClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  media?: React.ReactNode;
  mediaPosition?: 'top' | 'left' | 'right' | 'bottom';
  toolbar?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  title?: string | JSX.Element;
  subTitle?: string | JSX.Element;
  subTitlePlaceholder?: string | JSX.Element;
  description?: string | JSX.Element;
  descriptionPlaceholder?: string | JSX.Element;
  avatar?: string;
  avatarText?: string | JSX.Element;
  secondary?: string | JSX.Element;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  classnames: ClassNamesFn;
  data?: any;
}

export class Card extends React.Component<CardProps> {
  static defaultProps: Partial<CardProps> = {
    className: '',
    avatarClassName: '',
    headerClassName: '',
    footerClassName: '',
    secondaryClassName: '',
    avatarTextClassName: '',
    bodyClassName: '',
    titleClassName: '',
    subTitleClassName: '',
    descriptionClassName: '',
    imageClassName: '',
    mediaPosition: 'left'
  };

  constructor(props: CardProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (isClickOnInput(e)) {
      return;
    }

    this.props.onClick && this.props.onClick(e);
  }

  render() {
    const {
      classnames: cx,
      className,
      headerClassName,
      bodyClassName,
      titleClassName,
      subTitleClassName,
      descriptionClassName,
      avatarClassName,
      avatarTextStyle,
      imageClassName,
      avatarTextClassName,
      secondaryClassName,
      footerClassName,
      media,
      mediaPosition,
      actions,
      children,
      onClick,
      toolbar,
      title,
      subTitle,
      subTitlePlaceholder,
      description,
      descriptionPlaceholder,
      secondary,
      avatar,
      avatarText,
      data
    } = this.props;

    let heading = null;
    const isShowHeading =
      avatar ||
      avatarText ||
      title ||
      subTitle ||
      subTitlePlaceholder ||
      description ||
      descriptionPlaceholder ||
      toolbar;
    if (isShowHeading) {
      heading = (
        <div className={cx('Card-heading', headerClassName)}>
          {avatar ? (
            <span className={cx('Card-avtar', avatarClassName)}>
              <img className={cx('Card-img', imageClassName)} src={avatar} />
            </span>
          ) : avatarText ? (
            <span
              className={cx('Card-avtarText', avatarTextClassName)}
              style={buildStyle(avatarTextStyle, data)}
            >
              {avatarText}
            </span>
          ) : null}
          <div className={cx('Card-meta')}>
            {title ? (
              <div className={cx('Card-title', titleClassName)}>{title}</div>
            ) : null}
            {subTitle || subTitlePlaceholder ? (
              <div className={cx('Card-subTitle', subTitleClassName)}>
                {subTitle
                  ? subTitle
                  : subTitlePlaceholder
                  ? subTitlePlaceholder
                  : null}
              </div>
            ) : null}
            {description || descriptionPlaceholder ? (
              <div className={cx('Card-desc', descriptionClassName)}>
                {description
                  ? description
                  : descriptionPlaceholder
                  ? descriptionPlaceholder
                  : null}
              </div>
            ) : null}
          </div>
          {toolbar}
        </div>
      );
    }

    const body = children;

    return (
      <div
        onClick={this.handleClick}
        className={cx('Card', className, {
          'Card--link': onClick
        })}
      >
        {media ? (
          <div className={cx(`Card-multiMedia--${mediaPosition}`)}>
            {media}
            <div className={cx('Card-multiMedia-flex')}>
              {heading}
              {body ? (
                <div className={cx('Card-body', bodyClassName)}>{body}</div>
              ) : null}
              {secondary || actions ? (
                <div className={cx('Card-footer-wrapper', footerClassName)}>
                  {secondary ? (
                    <div className={cx('Card-secondary', secondaryClassName)}>
                      {secondary}
                    </div>
                  ) : null}
                  {actions ? (
                    <div className={cx('Card-actions-wrapper')}>{actions}</div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            {heading}
            {body ? (
              <div className={cx('Card-body', bodyClassName)}>{body}</div>
            ) : null}
            {secondary || actions ? (
              <div className={cx('Card-footer-wrapper', footerClassName)}>
                {secondary ? (
                  <div className={cx('Card-secondary', secondaryClassName)}>
                    {secondary}
                  </div>
                ) : null}
                {actions ? (
                  <div className={cx('Card-actions-wrapper')}>{actions}</div>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </div>
    );
  }
}

export default themeable(Card);
