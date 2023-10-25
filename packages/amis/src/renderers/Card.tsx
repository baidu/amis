import React from 'react';
import omit from 'lodash/omit';
import extend from 'lodash/extend';
import {Renderer, RendererProps} from 'amis-core';
import {SchemaNode, Schema, ActionObject, PlainObject} from 'amis-core';
import {filter, evalExpression} from 'amis-core';
import {Checkbox} from 'amis-ui';
import {padArr, isVisible, isDisabled, noop, hashCode} from 'amis-core';
import {
  resolveVariable,
  resolveVariableAndFilter,
  filterClassNameObject
} from 'amis-core';
import QuickEdit, {SchemaQuickEdit} from './QuickEdit';
import PopOver, {SchemaPopOver} from './PopOver';
import {TableCell} from './Table';
import Copyable, {SchemaCopyable} from './Copyable';
import {
  BaseSchema,
  SchemaClassName,
  SchemaExpression,
  SchemaObject,
  SchemaTpl,
  SchemaUrlPath
} from '../Schema';
import {ActionSchema} from './Action';
import {Card} from 'amis-ui';
import {findDOMNode} from 'react-dom';
import {Icon} from 'amis-ui';
import type {IItem} from 'amis-core';

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
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/card
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
    titleClassName?: SchemaClassName;

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
    descriptionClassName?: SchemaClassName;

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
    avatarTextBackground?: String[];
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
   * 多媒体区域
   */
  media?: {
    className?: SchemaClassName;

    /**
     * 多媒体类型
     */
    type?: 'image' | 'video';

    /**
     * 多媒体链接地址
     */
    url?: SchemaUrlPath;

    /**
     * 多媒体区域位置
     */
    position?: 'top' | 'left' | 'right' | 'bottom';

    /**
     * 类型为video时是否自动播放
     */
    autoPlay?: boolean;

    /**
     * 类型为video时是否是直播
     */
    isLive?: boolean;

    /**
     * 类型为video时视频封面
     */
    poster?: SchemaUrlPath;
  };

  /**
   * 底部按钮集合。
   */
  actions?: Array<ActionSchema>;

  /**
   * 工具栏按钮
   */
  toolbar?: Array<ActionSchema>;

  /**
   * 次要说明
   */
  secondary?: SchemaTpl;

  /**
   * 卡片内容区的表单项label是否使用Card内部的样式，默认为true
   */
  useCardLabel?: boolean;
}
export interface CardProps
  extends RendererProps,
    Omit<CardSchema, 'className'> {
  onCheck: (item: IItem) => void;
  actionsCount: number;
  itemIndex?: number;
  dragging?: boolean;
  selectable?: boolean;
  selected?: boolean;
  checkable?: boolean;
  multiple?: boolean;
  hideCheckToggler?: boolean;
  item: IItem;
  checkOnItemClick?: boolean;
}

@Renderer({
  type: 'card'
})
export class CardRenderer extends React.Component<CardProps> {
  static defaultProps = {
    className: '',
    avatarClassName: '',
    headerClassName: '',
    footerClassName: '',
    secondaryClassName: '',
    avatarTextClassName: '',
    bodyClassName: '',
    actionsCount: 4,
    titleClassName: '',
    highlightClassName: '',
    subTitleClassName: '',
    descClassName: '',
    descriptionClassName: '',
    imageClassName: '',
    highlight: false,
    blank: true,
    dragging: false,
    selectable: false,
    checkable: true,
    selected: false,
    hideCheckToggler: false,
    useCardLabel: true
  };

  static propsList: Array<string> = [
    'avatarClassName',
    'avatarTextClassName',
    'bodyClassName',
    'actionsCount',
    'titleClassName',
    'highlightClassName',
    'subTitleClassName',
    'descClassName',
    'descriptionClassName',
    'imageClassName',
    'hideCheckToggler'
  ];

  constructor(props: CardProps) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.getPopOverContainer = this.getPopOverContainer.bind(this);
    this.handleQuickChange = this.handleQuickChange.bind(this);
  }

  isHaveLink() {
    const {href, itemAction, onCheck, checkOnItemClick, checkable} = this.props;
    return href || itemAction || onCheck || (checkOnItemClick && checkable);
  }

  handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const {
      item,
      href,
      data,
      env,
      blank,
      itemAction,
      onAction,
      onCheck,
      selectable,
      checkOnItemClick
    } = this.props;

    if (href) {
      env.jumpTo(
        filter(href, data),
        {
          type: 'button',
          actionType: 'url',
          blank
        },
        data
      );
      return;
    }

    if (itemAction) {
      onAction && onAction(e, itemAction, item?.data || data);
      return;
    }

    selectable && checkOnItemClick && onCheck?.(item);
  }

  handleAction(e: React.UIEvent<any>, action: ActionObject, ctx: object) {
    const {onAction, item} = this.props;

    onAction && onAction(e, action, ctx || item.data);
  }

  handleCheck() {
    const item = this.props.item;
    this.props.onCheck && this.props.onCheck(item);
  }

  getPopOverContainer() {
    return findDOMNode(this);
  }

  handleQuickChange(
    values: object,
    saveImmediately?: boolean,
    savePristine?: boolean,
    options?: {
      resetOnFailed?: boolean;
      reload?: string;
    }
  ) {
    const {onQuickChange, item} = this.props;
    onQuickChange &&
      onQuickChange(item, values, saveImmediately, savePristine, options);
  }

  renderToolbar() {
    const {
      selectable,
      checkable,
      selected,
      multiple,
      hideCheckToggler,
      classnames: cx,
      toolbar,
      render,
      dragging,
      data,
      header
    } = this.props;

    const toolbars: Array<JSX.Element> = [];
    if (header) {
      const {highlightClassName, highlight} = header;
      if (
        typeof highlight === 'string'
          ? evalExpression(highlight, data)
          : highlight
      ) {
        toolbars.push(
          <i
            key="highlight"
            className={cx('Card-highlight', highlightClassName)}
          />
        );
      }
    }

    if (selectable && !hideCheckToggler) {
      toolbars.push(
        <Checkbox
          key="check"
          className={cx('Card-checkbox')}
          type={multiple !== false ? 'checkbox' : 'radio'}
          disabled={!checkable}
          checked={selected}
          onChange={this.handleCheck}
        />
      );
    }

    if (Array.isArray(toolbar)) {
      toolbar.forEach((action, index) =>
        toolbars.push(
          render(
            `toolbar/${index}`,
            {
              type: 'button',
              level: 'link',
              size: 'sm',
              ...(action as any)
            },
            {
              key: index
            }
          )
        )
      );
    }

    if (dragging) {
      toolbars.push(
        <div className={cx('Card-dragBtn')}>
          <Icon icon="drag-bar" className="icon" />
        </div>
      );
    }

    return toolbars.length ? (
      <div className={cx('Card-toolbar')}>{toolbars}</div>
    ) : null;
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
                  filterClassNameObject(
                    action.className || `${size ? `Card-action--${size}` : ''}`,
                    data
                  )
                ),
                componentClass: 'a',
                onAction: this.handleAction
              }
            );
          })}
        </div>
      ));
    }
    return;
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
        itemRender: this.itemRender.bind(this)
      }) as JSX.Element;
    }

    return this.renderFeild(region, childNode, key, this.props);
  }

  itemRender(field: any, index: number, props: any) {
    return this.renderFeild(`column/${index}`, field, index, props);
  }

  renderFeild(region: string, field: Schema, key: any, props: any) {
    const {render, classnames: cx, itemIndex} = props;
    const useCardLabel = props?.useCardLabel !== false;
    const data = this.props.data;
    if (!field || !isVisible(field, data)) {
      return;
    }

    const $$id = field.$$id ? `${field.$$id}-field` : '';

    return (
      <div className={cx('Card-field')} key={key}>
        {useCardLabel && field.label ? (
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
              useCardLabel,
              className: cx(
                'Card-fieldValue',
                filterClassNameObject(field.className, data)
              ),
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

  rederTitle() {
    const {render, data, header} = this.props;
    if (header) {
      const {title: titleTpl} = header || {};
      const title = filter(titleTpl, data);
      return title ? render('title', titleTpl!) : undefined;
    }
    return;
  }

  renderSubTitle() {
    const {render, data, header} = this.props;
    if (header) {
      const {subTitle: subTitleTpl} = header || {};

      const subTitle = filter(subTitleTpl, data);
      return subTitle ? render('sub-title', subTitleTpl!) : undefined;
    }
    return;
  }

  renderSubTitlePlaceholder() {
    const {render, header, classnames: cx} = this.props;
    if (header) {
      const {subTitlePlaceholder} = header || {};

      return subTitlePlaceholder
        ? render('sub-title', subTitlePlaceholder, {
            className: cx('Card-placeholder')
          })
        : undefined;
    }
    return;
  }

  renderDesc() {
    const {render, data, header} = this.props;

    if (header) {
      const {desc: descTpl, description: descriptionTpl} = header || {};
      const desc = filter(descriptionTpl! || descTpl!, data);
      return desc
        ? render('desc', descriptionTpl! || descTpl!, {
            className: !desc ? 'text-muted' : null
          })
        : undefined;
    }
    return;
  }

  renderDescPlaceholder() {
    const {render, header} = this.props;

    if (header) {
      const descPlaceholder =
        header.descriptionPlaceholder || header.descPlaceholder;
      return descPlaceholder
        ? render('desc', descPlaceholder, {
            className: !descPlaceholder ? 'text-muted' : null
          })
        : undefined;
    }
    return;
  }

  renderAvatar() {
    const {data, header} = this.props;
    if (header) {
      const {avatar: avatarTpl} = header || {};
      const avatar = filter(avatarTpl, data, '| raw');
      return avatar ? avatar : undefined;
    }
    return;
  }

  renderAvatarText() {
    const {render, data, header} = this.props;
    if (header) {
      const {avatarText: avatarTextTpl} = header || {};

      const avatarText = filter(avatarTextTpl, data);

      return avatarText ? render('avatarText', avatarTextTpl!) : undefined;
    }
    return;
  }

  renderSecondary() {
    const {render, data, secondary: secondaryTextTpl} = this.props;

    const secondary = filter(secondaryTextTpl, data);
    return secondary ? render('secondary', secondaryTextTpl!) : undefined;
  }

  renderAvatarTextStyle() {
    const {header, data} = this.props;
    if (header) {
      const {avatarText: avatarTextTpl, avatarTextBackground} = header;
      const avatarText = filter(avatarTextTpl, data);
      const avatarTextStyle: PlainObject = {};
      if (avatarText && avatarTextBackground && avatarTextBackground.length) {
        avatarTextStyle['background'] =
          avatarTextBackground[
            Math.abs(hashCode(avatarText)) % avatarTextBackground.length
          ];
      }
      return avatarTextStyle;
    }
    return;
  }

  renderMedia() {
    const {media, classnames: cx, render, region, data} = this.props;
    if (media) {
      const {type, url, className, autoPlay, isLive, poster} = media;
      const mediaUrl = resolveVariableAndFilter(url, data, '| raw');

      if (type === 'image' && mediaUrl) {
        return (
          <img
            className={cx('Card-multiMedia-img', className)}
            src={mediaUrl}
          />
        );
      } else if (type === 'video' && mediaUrl) {
        return (
          <div className={cx('Card-multiMedia-video', className)}>
            {
              render(region, {
                type: type,
                autoPlay: autoPlay,
                poster: poster,
                src: mediaUrl,
                isLive: isLive
              }) as JSX.Element
            }
          </div>
        );
      }
    }
    return;
  }

  render() {
    const {
      header,
      className,
      avatarClassName,
      avatarTextClassName,
      descClassName,
      descriptionClassName,
      titleClassName,
      subTitleClassName,
      bodyClassName,
      imageClassName,
      headerClassName,
      secondaryClassName,
      footerClassName,
      mediaClassName,
      media,
      ...rest
    } = this.props;
    const ctx = this.props.data;
    const headerCn =
      filterClassNameObject(header?.className, ctx) || headerClassName;
    const titleCn =
      filterClassNameObject(header?.titleClassName, ctx) || titleClassName;
    const subTitleCn =
      filterClassNameObject(header?.subTitleClassName, ctx) ||
      subTitleClassName;
    const descCn =
      filterClassNameObject(header?.descClassName, ctx) || descClassName;
    const descriptionCn =
      filterClassNameObject(header?.descriptionClassName, ctx) ||
      descriptionClassName ||
      descCn;
    const avatarTextCn =
      filterClassNameObject(header?.avatarTextClassName, ctx) ||
      avatarTextClassName;
    const avatarCn =
      filterClassNameObject(header?.avatarClassName, ctx) || avatarClassName;
    const imageCn =
      filterClassNameObject(header?.imageClassName, ctx) || imageClassName;
    const mediaPosition = media?.position;

    return (
      <Card
        {...rest}
        title={this.rederTitle()}
        subTitle={this.renderSubTitle()}
        subTitlePlaceholder={this.renderSubTitlePlaceholder()}
        description={this.renderDesc()}
        descriptionPlaceholder={this.renderDescPlaceholder()}
        children={this.renderBody()}
        actions={this.renderActions()}
        avatar={this.renderAvatar()}
        avatarText={this.renderAvatarText()}
        secondary={this.renderSecondary()}
        toolbar={this.renderToolbar()}
        avatarClassName={avatarCn}
        avatarTextStyle={this.renderAvatarTextStyle()}
        avatarTextClassName={avatarTextCn}
        className={className}
        titleClassName={titleCn}
        media={this.renderMedia()}
        subTitleClassName={subTitleCn}
        mediaPosition={mediaPosition}
        descriptionClassName={descriptionCn}
        imageClassName={imageCn}
        headerClassName={headerCn}
        footerClassName={footerClassName}
        secondaryClassName={secondaryClassName}
        bodyClassName={bodyClassName}
        onClick={this.isHaveLink() ? this.handleClick : this.handleCheck}
      ></Card>
    );
  }
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
      contentsOnly,
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
      useCardLabel,
      ...rest
    } = this.props;
    const schema = {
      ...field,
      /** 针对带有label的表单项组件，默认不渲染组件自带的label，否则会出现重复的label */
      renderLabel: !useCardLabel,
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

    if (contentsOnly) {
      return body as JSX.Element;
    }
    Component = Component || 'div';

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
