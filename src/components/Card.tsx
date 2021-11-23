import React from 'react';
import {isClickOnInput} from '../utils/helper';
import {Icon} from './icons';
import {RootClose} from '../utils/RootClose';
import {ClassNamesFn} from '../theme';
export interface CardProps {
  isamis?: boolean;
  className?: string;
  titleClassName?: string;
  subTitleClassName?: string;
  descriptionClassName?: string;
  descClassName?: string;
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
  actions?: Array<React.ReactNode>;
  actionsLimit?: number;
  title?: string | JSX.Element;
  subTitle?: string | JSX.Element;
  subTitlePlaceholder?: string | JSX.Element;
  description?: string | JSX.Element;
  descriptionPlaceholder?: string | JSX.Element;
  avatar?: string;
  avatarText?: string | JSX.Element;
  highlight?: boolean;
  secondary?: string;
  dragging?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  classnames: ClassNamesFn;
}

export interface CardState {
  isOpen: boolean;
}

export class Card extends React.Component<CardProps, CardState> {
  static defaultProps: Partial<CardProps> = {
    className: '',
    avatarClassName: '',
    avatarTextClassName: '',
    bodyClassName: '',
    titleClassName: '',
    highlightClassName: '',
    subTitleClassName: '',
    descClassName: '',
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
    // e && e.preventDefault();
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
      className,
      bodyClassName,
      highlightClassName,
      titleClassName,
      subTitleClassName,
      descClassName,
      descriptionClassName,
      avatarClassName,
      imageClassName,
      avatarTextClassName,
      dragging,
      media,
      mediaPosition,
      actions,
      actionsLimit,
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
      isamis,
      avatar,
      avatarText,
      highlight,
      classnames: cx
    } = this.props;


    const { isOpen } = this.state;
    let heading = null;
    heading = (
      <div className={cx('Card-heading', className)}>
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
          {highlight ? (
            <i
              className={cx(
                'Card-highlight',
                highlightClassName
              )}
            />
          ) : null}
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
            <div
              className={cx(
                'Card-desc',
                descriptionClassName || descClassName
              )}
            >
              {description ? description : descriptionPlaceholder ? descriptionPlaceholder : null}
            </div>
          ) : null}
        </div>
        {toolbar}
      </div>
    );
    const body = children;

    const avtionWraps = actions ? actions.map((option: React.ReactNode, index: Number) => {
      if (actionsLimit && index >= actionsLimit) {
        return <div className={cx('Card-action-menu-wrapper')} key={'action' + index}>{option}</div>;
      } else {
        return <div className={cx('Card-action-wrapper')} key={'action' + index}>{option}</div>;
      }
    }) : null;

    const actionsArr = avtionWraps ? (actionsLimit ?
      <div className={cx('Card-actions-wrapper')}>
        {avtionWraps.filter((option: React.ReactNode, index: Number) => {
          return index < actionsLimit;
        })}
        <div onClick={(e) => this.stopPropagation(e)} className={cx('Card-action-wrapper')}>
          <div className={cx('Card-action-ellipsis')} onClick={(e: React.MouseEvent<any>) => this.handleEllipsisClick(e)}>
            <Icon icon="ellipsis-v" className="icon" />
          </div>
          {isOpen ? <RootClose
              disabled={!isOpen}
              onRootClose={this.close}
            >
              {(ref: any) => {
                return (
                  <div ref={ref} className={cx('Card-actions-menu')}>
                    {avtionWraps.filter((option: React.ReactNode, index: Number) => {
                      return index >= actionsLimit;
                    })}
                  </div>
                );
              }}
            </RootClose> : null}
        </div>
      </div> : <div className={cx('Card-actions-wrapper')}>{avtionWraps}</div>) : null;

    return (
      <div
        onClick={
          onClick ? this.handleClick : undefined
        }
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
                <div className={cx('Card-body', bodyClassName, isamis ? '' : 'Card-body-cmpt')}>{body}</div>
              ) : null}
              <div className={cx('Card-footer-wrapper')}>
                {secondary ? (
                  <div className={cx('Card-secondary')}>{secondary}</div>
                ) : null}
                {isamis ? actions : (actionsArr ? actionsArr : null)}
              </div>
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
              <div className={cx('Card-body', bodyClassName, isamis ? '' : 'Card-body-cmpt')}>{body}</div>
            ) : null}
            {isamis ? actions :
              <div className={cx('Card-footer-wrapper')}>
                {secondary ? <div className={cx('Card-secondary')}>{secondary}</div> : null}
                {actionsArr ? actionsArr : null}
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

export default Card;
