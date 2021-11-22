import React from 'react';
import { Action } from '../types';
import { RendererProps } from '../factory';
import { SchemaCopyable } from '../renderers/Copyable';
import { SchemaPopOver } from '../renderers/PopOver';
import { SchemaQuickEdit } from '../renderers/QuickEdit';
import { SchemaClassName, SchemaObject, SchemaTpl } from '../Schema';
import { IItem } from '../store/list';
import { isClickOnInput } from '../utils/helper';
import { filter } from '../utils/tpl';
import { findDOMNode } from 'react-dom';
import { Icon } from './icons';
import { RootClose } from '../utils/RootClose';
import { ActionSchema } from '../renderers/Action';

export type CardBodyField = SchemaObject & {
  /**
   * 列标题
   */
  label: string;

  /**
   * label 类名
   */
  labelClassName?: SchemaClassName;

  /**
   * 绑定字段名
   */
  name?: string;

  /**
   * 配置查看详情功能
   */
  popOver?: SchemaPopOver;

  /**
   * 配置快速编辑功能
   */
  quickEdit?: SchemaQuickEdit;

  /**
   * 配置点击复制功能
   */
  copyable?: SchemaCopyable;
};

export interface CardProps extends RendererProps {
  onCheck: (item: IItem) => void;
  itemIndex?: number;
  multiple?: boolean;
  className?: SchemaClassName;
  titleClassName?: string;
  subTitleClassName?: SchemaClassName;
  descriptionClassName?: string;
  descClassName?: SchemaClassName;
  avatarTextClassName?: SchemaClassName;
  avatarClassName?: SchemaClassName;
  imageClassName?: SchemaClassName;
  highlightClassName?: SchemaClassName;
  hideCheckToggler?: boolean;
  href?: string | JSX.Element;
  blank?: boolean;
  item: IItem;
  checkOnItemClick?: boolean;
  media?: React.ReactNode;
  mediaPosition?: 'top' | 'left' | 'right';
  toolbar?: React.ReactNode;
  children?: React.ReactNode;
  extra?: React.ReactNode;
  actions?: Array<React.ReactNode> | Array<ActionSchema>;
  actionsLimit?: number;
  title?: string | JSX.Element;
  subTitle?: string | JSX.Element;
  subTitlePlaceholder?: string | JSX.Element;
  description?: string | JSX.Element;
  descriptionPlaceholder?: string | JSX.Element;
  avatar?: string;
  avatarText?: string | JSX.Element;
  highlight?: boolean;
  secondary?: string | JSX.Element;
  dragging?: boolean;
  onClick?: () => void;
}

interface CardState {
  isOpen: boolean;
}

export class Card extends React.Component<CardProps, CardState> {
  static defaultProps: Partial<CardProps> = {
    className: '',
    avatarClassName: '',
    bodyClassName: '',
    actionsCount: 4,
    titleClassName: '',
    highlightClassName: '',
    subTitleClassName: '',
    descClassName: '',
    blank: true,
    mediaPosition: 'left'
  };

  static propsList: Array<string> = [
    'avatarClassName',
    'bodyClassName',
    'actionsCount',
    'titleClassName',
    'highlightClassName',
    'subTitleClassName',
    'descClassName',
    'hideCheckToggler'
  ];

  constructor(props: CardProps) {
    super(props);

    this.getPopOverContainer = this.getPopOverContainer.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleQuickChange = this.handleQuickChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleEllipsisClick = this.handleEllipsisClick.bind(this);
    this.close = this.close.bind(this);

    this.state = {
      isOpen: false
    };
  }

  handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (isClickOnInput(e)) {
      return;
    }

    const {item, href, data, env, blank, itemAction, onAction} = this.props;
    if (href) {
      env.jumpTo(filter(href, data), {
        type: 'button',
        actionType: 'url',
        blank
      });
      return;
    }

    if (itemAction) {
      onAction && onAction(e, itemAction, item?.data || data);
      return;
    }

    this.props.onCheck && this.props.onCheck(item);

    this.props.onClick && this.props.onClick();
  }

  handleCheck() {
    const item = this.props.item;
    this.props.onCheck && this.props.onCheck(item);
  }

  handleAction(e: React.UIEvent<any>, action: Action, ctx: object) {
    const {onAction, item} = this.props;
    onAction && onAction(e, action, ctx || item.data);
  }

  handleQuickChange(
    values: object,
    saveImmediately?: boolean,
    savePristine?: boolean,
    resetOnFailed?: boolean
  ) {
    const {onQuickChange, item} = this.props;
    onQuickChange &&
      onQuickChange(item, values, saveImmediately, savePristine, resetOnFailed);
  }

  getPopOverContainer() {
    return findDOMNode(this);
  }

  stopPropagation(e: React.MouseEvent<any>) {
    e && e.stopPropagation();
  }

  handleEllipsisClick(e: React.MouseEvent<any>, actions: Array<React.ReactNode>, limit: Number) {
    e && e.stopPropagation();
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
      header,
      bodyClassName,
      highlightClassName,
      titleClassName,
      subTitleClassName,
      descClassName,
      checkOnItemClick,
      avatarClassName,
      checkable,
      classnames: cx,
      classPrefix: ns,
      imageClassName,
      avatarTextClassName,
      href,
      itemAction,
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
      highlight
    } = this.props;

    const { isOpen } = this.state;
    let heading = null;

    if (header || toolbar) {
      heading = (
        <div className={cx('Card-heading', header?.className)}>
          {avatar ? (
            <span
              className={cx(
                'Card-avtar',
                header?.avatarClassName || avatarClassName
              )}
            >
              <img
                className={cx(
                  'Card-img',
                  header?.imageClassName || imageClassName
                )}
                src={avatar}
              />
            </span>
          ) : avatarText ? (
            <span
              className={cx(
                'Card-avtarText',
                header?.avatarTextClassName || avatarTextClassName
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
                  header?.highlightClassName || highlightClassName
                )}
              />
            ) : null}

            {title ? (
              <div
                className={cx(
                  'Card-title',
                  header?.titleClassName || titleClassName
                )}
              >
                {title}
              </div>
            ) : null}

            {subTitle || subTitlePlaceholder ? (
              <div
                className={cx(
                  'Card-subTitle',
                  header?.subTitleClassName || subTitleClassName
                )}
              >
                {subTitle ? subTitle : subTitlePlaceholder ? subTitlePlaceholder : null}
              </div>
            ) : null}

            {description || descriptionPlaceholder ? (
              <div
                className={cx(
                  'Card-desc',
                  header?.descriptionClassName ||
                    header?.descClassName ||
                    descClassName
                )}
              >
                {description ? description : descriptionPlaceholder ? descriptionPlaceholder : null}
              </div>
            ) : null}
          </div>
          {toolbar}
        </div>
      );
    }
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
          <div className={cx('Card-action-ellipsis')} onClick={(e: React.MouseEvent<any>) => this.handleEllipsisClick(e, avtionWraps, actionsLimit)}>
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
          (checkOnItemClick && checkable) || href || itemAction || onClick
            ? this.handleClick
            : undefined
        }
        className={cx('Card', className, {
          'Card--link': href || itemAction || onClick
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
