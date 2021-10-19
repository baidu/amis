import React from 'react';
import {findDOMNode} from 'react-dom';
import {Renderer, RendererProps} from '../factory';
import {SchemaNode, Schema, Action} from '../types';
import {filter, evalExpression} from '../utils/tpl';
import cx from 'classnames';
import Checkbox from '../components/Checkbox';
import {IItem} from '../store/list';
import {
  padArr,
  isVisible,
  isDisabled,
  noop,
  isClickOnInput
} from '../utils/helper';
import {resolveVariable} from '../utils/tpl-builtin';
import QuickEdit, {SchemaQuickEdit} from './QuickEdit';
import PopOver, {SchemaPopOver} from './PopOver';
import {TableCell} from './Table';
import Copyable, {SchemaCopyable} from './Copyable';
import {Icon} from '../components/icons';
import omit = require('lodash/omit');
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaExpression,
  SchemaObject,
  SchemaTpl,
  SchemaUrlPath
} from '../Schema';
import {ActionSchema} from './Action';

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

/**
 * Card 卡片渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/card
 */
export interface CardSchema extends BaseSchema {
  /**
   * 指定为 card 类型
   */
  type: 'card';

  /**
   * 头部配置
   */
  header?: {
    className?: SchemaClassName;

    /**
     * 标题
     */
    title?: SchemaTpl;
    titleClassName?: string;

    /**
     * 副标题
     */
    subTitle?: SchemaTpl;
    subTitleClassName?: SchemaClassName;
    subTitlePlaceholder?: string;

    /**
     * 描述
     */
    description?: SchemaTpl;

    /**
     * 描述占位内容
     */
    descriptionPlaceholder?: string;

    /**
     * 描述占位类名
     */
    descriptionClassName?: string;

    /**
     * @deprecated 建议用 description
     */
    desc?: SchemaTpl;

    /**
     * @deprecated 建议用 descriptionPlaceholder
     */
    descPlaceholder?: SchemaTpl;

    /**
     * @deprecated 建议用 descriptionClassName
     */
    descClassName?: SchemaClassName;

    /**
     * 图片地址
     */
    avatar?: SchemaUrlPath;

    avatarText?: SchemaTpl;
    avatarTextClassName?: SchemaClassName;

    /**
     * 图片包括层类名
     */
    avatarClassName?: SchemaClassName;

    /**
     * 图片类名。
     */
    imageClassName?: SchemaClassName;

    /**
     * 是否点亮
     */
    highlight?: SchemaExpression;
    highlightClassName?: SchemaClassName;

    /**
     * 链接地址
     */
    href?: SchemaTpl;

    /**
     * 是否新窗口打开
     */
    blank?: boolean;
  };

  /**
   * 内容区域
   */
  body?: Array<CardBodyField>;

  /**
   * 底部按钮集合。
   */
  actions?: Array<ActionSchema>;
}

export interface CardProps
  extends RendererProps,
    Omit<CardSchema, 'className'> {
  onCheck: (item: IItem) => void;
  itemIndex?: number;
  multiple?: boolean;
  highlightClassName?: string;
  hideCheckToggler?: boolean;
  item: IItem;
  checkOnItemClick?: boolean;
}
export class Card extends React.Component<CardProps> {
  static defaultProps: Partial<CardProps> = {
    className: '',
    avatarClassName: '',
    bodyClassName: '',
    actionsCount: 4,
    titleClassName: '',
    highlightClassName: '',
    subTitleClassName: '',
    descClassName: '',
    blank: true
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
    this.itemRender = this.itemRender.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleQuickChange = this.handleQuickChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
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

  renderToolbar() {
    const {
      dragging,
      selectable,
      checkable,
      selected,
      onSelect,
      checkOnItemClick,
      multiple,
      hideCheckToggler,
      classnames: cx,
      classPrefix: ns
    } = this.props;

    if (dragging) {
      return (
        <div className={cx('Card-dragBtn')}>
          <Icon icon="drag-bar" className="icon" />
        </div>
      );
    } else if (selectable && !hideCheckToggler) {
      return (
        <div className={cx('Card-checkBtn')}>
          <Checkbox
            classPrefix={ns}
            type={multiple ? 'checkbox' : 'radio'}
            disabled={!checkable}
            checked={selected}
            onChange={checkOnItemClick ? noop : this.handleCheck}
          />
        </div>
      );
    }

    return null;
  }

  renderActions() {
    const {
      actions,
      render,
      dragging,
      actionsCount,
      data,
      classnames: cx
    } = this.props;

    if (Array.isArray(actions)) {
      const group = padArr(
        actions.filter(item => isVisible(item, data)),
        actionsCount
      );
      return group.map((actions, groupIndex) => (
        <div key={groupIndex} className={cx('Card-actions')}>
          {actions.map((action, index) => {
            const size = action.size || 'sm';

            return render(
              `action/${index}`,
              {
                level: 'link',
                type: 'button',
                ...action,
                size
              },
              {
                isMenuItem: true,
                key: index,
                index,
                disabled: dragging || isDisabled(action, data),
                className: cx(
                  'Card-action',
                  action.className || `${size ? `Card-action--${size}` : ''}`
                ),
                componentClass: 'a',
                onAction: this.handleAction
              }
            );
          })}
        </div>
      ));
    }

    return null;
  }

  renderChild(
    node: SchemaNode,
    region: string = 'body',
    key: any = 0
  ): React.ReactNode {
    const {render} = this.props;

    if (typeof node === 'string' || typeof node === 'number') {
      return render(region, node, {key}) as JSX.Element;
    }

    const childNode: Schema = node as Schema;

    if (childNode.type === 'hbox' || childNode.type === 'grid') {
      return render(region, node, {
        key,
        itemRender: this.itemRender
      }) as JSX.Element;
    }

    return this.renderFeild(region, childNode, key, this.props);
  }

  itemRender(field: any, index: number, props: any) {
    return this.renderFeild(`column/${index}`, field, index, props);
  }

  renderFeild(region: string, field: any, key: any, props: any) {
    const {render, classnames: cx, itemIndex} = props;
    const data = this.props.data;
    if (!isVisible(field, data)) {
      return;
    }

    const $$id = field.$$id ? `${field.$$id}-field` : '';

    return (
      <div className={cx('Card-field')} key={key}>
        {field && field.label ? (
          <label className={cx('Card-fieldLabel', field.labelClassName)}>
            {field.label}
          </label>
        ) : null}

        {
          render(
            region,
            {
              ...field,
              field: field,
              $$id,
              type: 'card-item-field'
            },
            {
              className: cx('Card-fieldValue', field.className),
              rowIndex: itemIndex,
              colIndex: key,
              value: field.name ? resolveVariable(field.name, data) : undefined,
              popOverContainer: this.getPopOverContainer,
              onAction: this.handleAction,
              onQuickChange: this.handleQuickChange
            }
          ) as JSX.Element
        }
      </div>
    );
  }

  renderBody() {
    const {body} = this.props;

    if (!body) {
      return null;
    }

    if (Array.isArray(body)) {
      return body.map((child, index) =>
        this.renderChild(child, `body/${index}`, index)
      );
    }

    return this.renderChild(body, 'body');
  }

  render() {
    const {
      className,
      data,
      header,
      render,
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
      itemAction
    } = this.props;

    let heading = null;

    if (header) {
      const {
        highlight: highlightTpl,
        avatar: avatarTpl,
        avatarText: avatarTextTpl,
        title: titleTpl,
        subTitle: subTitleTpl,
        subTitlePlaceholder,
        desc: descTpl
      } = header;

      const descPlaceholder =
        header.descriptionPlaceholder || header.descPlaceholder;

      const highlight = !!evalExpression(highlightTpl!, data as object);
      const avatar = filter(avatarTpl, data, '| raw');
      const avatarText = filter(avatarTextTpl, data);
      const title = filter(titleTpl, data);
      const subTitle = filter(subTitleTpl, data);
      const desc = filter(header.description || descTpl, data);

      heading = (
        <div className={cx('Card-heading', header.className)}>
          {avatar ? (
            <span
              className={cx(
                'Card-avtar',
                header.avatarClassName || avatarClassName
              )}
            >
              <img
                className={cx(
                  'Card-img',
                  header.imageClassName || imageClassName
                )}
                src={avatar}
              />
            </span>
          ) : avatarText ? (
            <span
              className={cx(
                'Card-avtarText',
                header.avatarTextClassName || avatarTextClassName
              )}
            >
              {avatarText}
            </span>
          ) : null}
          <div className={cx('Card-meta')}>
            {highlight ? (
              <i
                className={cx(
                  'Card-highlight',
                  header.highlightClassName || highlightClassName
                )}
              />
            ) : null}

            {title ? (
              <div
                className={cx(
                  'Card-title',
                  header.titleClassName || titleClassName
                )}
              >
                {render('title', title)}
              </div>
            ) : null}

            {subTitle || subTitlePlaceholder ? (
              <div
                className={cx(
                  'Card-subTitle',
                  header.subTitleClassName || subTitleClassName
                )}
              >
                {render('sub-title', subTitle || subTitlePlaceholder!, {
                  className: cx(!subTitle ? 'Card-placeholder' : undefined)
                })}
              </div>
            ) : null}

            {desc || descPlaceholder ? (
              <div
                className={cx(
                  'Card-desc',
                  header.descriptionClassName ||
                    header.descClassName ||
                    descClassName
                )}
              >
                {render('desc', desc || descPlaceholder!, {
                  className: !desc ? 'text-muted' : undefined
                })}
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    const body = this.renderBody();

    return (
      <div
        onClick={
          (checkOnItemClick && checkable) || href || itemAction
            ? this.handleClick
            : undefined
        }
        className={cx('Card', className, {
          'Card--link': href || itemAction
        })}
      >
        {this.renderToolbar()}
        {heading}
        {body ? (
          <div className={cx('Card-body', bodyClassName)}>{body}</div>
        ) : null}
        {this.renderActions()}
      </div>
    );
  }
}

@Renderer({
  type: 'card'
})
export class CardRenderer extends Card {
  static propsList = ['multiple', ...Card.propsList];
}

@Renderer({
  type: 'card-item-field'
})
@QuickEdit()
@PopOver()
@Copyable()
export class CardItemFieldRenderer extends TableCell {
  static defaultProps = {
    ...TableCell.defaultProps,
    wrapperComponent: 'div'
  };

  static propsList = [
    'quickEdit',
    'quickEditEnabledOn',
    'popOver',
    'copyable',
    'inline',
    ...TableCell.propsList
  ];

  render() {
    let {
      type,
      className,
      render,
      style,
      wrapperComponent: Component,
      labelClassName,
      value,
      data,
      children,
      width,
      innerClassName,
      label,
      tabIndex,
      onKeyUp,
      field,
      ...rest
    } = this.props;

    const schema = {
      ...field,
      className: innerClassName,
      type: (field && field.type) || 'plain'
    };

    let body = children
      ? children
      : render('field', schema, {
          ...omit(rest, Object.keys(schema)),
          value,
          data
        });

    if (width) {
      style = style || {};
      style.width = style.width || width;
      body = (
        <div style={{width: !/%/.test(String(width)) ? width : ''}}>{body}</div>
      );
    }

    if (!Component) {
      return body as JSX.Element;
    }

    return (
      <Component
        style={style}
        className={className}
        tabIndex={tabIndex}
        onKeyUp={onKeyUp}
      >
        {body}
      </Component>
    );
  }
}
