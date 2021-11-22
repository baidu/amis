import React from 'react';
import {Renderer} from '../factory';
import {SchemaNode, Schema} from '../types';
import {filter, evalExpression} from '../utils/tpl';
import Checkbox from '../components/Checkbox';
import {
  padArr,
  isVisible,
  isDisabled,
  noop
} from '../utils/helper';
import {resolveVariable} from '../utils/tpl-builtin';
import QuickEdit from './QuickEdit';
import PopOver from './PopOver';
import {TableCell} from './Table';
import Copyable from './Copyable';
import omit = require('lodash/omit');
import {
  BaseSchema,
  SchemaClassName,
  SchemaExpression,
  SchemaTpl,
  SchemaUrlPath
} from '../Schema';
import {ActionSchema} from './Action';
import { Card, CardBodyField } from '../components/Card';

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

  /**
   * 工具栏按钮
   */
  toolbar?: Array<ActionSchema>;

  /**
   * 次要说明
   */
  secondary?: SchemaTpl;
}

@Renderer({
  type: 'card'
})
export class CardRenderer extends Card {
  static propsList = ['multiple', ...Card.propsList];

  renderToolbar() {
    const {
      selectable,
      checkable,
      selected,
      checkOnItemClick,
      multiple,
      hideCheckToggler,
      classnames: cx,
      toolbar,
      render
    } = this.props;
    const toolbars: Array<JSX.Element> = [];

    if (selectable && !hideCheckToggler) {
      toolbars.push(
        <Checkbox
          key="check"
          className={cx('Card-checkbox')}
          type={multiple ? 'checkbox' : 'radio'}
          disabled={!checkable}
          checked={selected}
          onChange={checkOnItemClick ? noop : this.handleCheck}
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

  rederTitle() {
    const {
      render,
      data,
      header
    } = this.props;
    if (header) {
      const {
        title: titleTpl
      } = header || {};
      const title = filter(titleTpl, data);
      return title ? render('title', title) : undefined;
    }
    return;
  }

  renderSubTitle() {
    const {
      render,
      data,
      header
    } = this.props;
    if (header) {
      const {
        subTitle: subTitleTpl
      } = header || {};

      const subTitle = filter(subTitleTpl, data);
      return subTitle ? render('sub-title', subTitle) : undefined;
    }
    return;
  }

  renderSubTitlePlaceholder() {
    const {
      render,
      header,
      classnames: cx
    } = this.props;
    if (header) {
      const {
        subTitlePlaceholder
      } = header || {};

      return subTitlePlaceholder ? render('sub-title', subTitlePlaceholder, {
        className: cx('Card-placeholder')
      }) : undefined;
    }
    return;
  }

  renderDesc() {
    const {
      render,
      data,
      header
    } = this.props;

    if (header) {
      const {
        desc: descTpl
      } = header || {};
      const desc = filter(header.description || descTpl, data);
      return desc ? render('desc', desc, {
        className: !desc ? 'text-muted' : null
      }) : undefined;
    }
    return;
  }

  renderDescPlaceholder() {
    const {
      render,
      header
    } = this.props;

    if (header) {
      const descPlaceholder =
          header.descriptionPlaceholder || header.descPlaceholder;
      return descPlaceholder ? render('desc', descPlaceholder, {
        className: !descPlaceholder ? 'text-muted' : null
      }) : undefined;
    }
    return;
  }

  renderAvatar() {
    const {
      data,
      header
    } = this.props;
    if (header) {
      const {
        avatar: avatarTpl
      } = header || {};
      const avatar = filter(avatarTpl, data, '| raw');
      return avatar ? avatar : undefined;
    }
    return;
  }

  renderAvatarText() {
    const {
      render,
      data,
      header
    } = this.props;
    if (header) {
      const {
        avatarText: avatarTextTpl
      } = header || {};

      const avatarText = filter(avatarTextTpl, data);

      return avatarText ? render('avatarText', avatarText) : undefined;
    }
    return;
  }

  renderSecondary() {
    const {
      render,
      data,
      secondary: secondaryTpl
    } = this.props;
    const secondary = filter(secondaryTpl, data);

    return secondary ? render('secondary', secondary) : undefined;
  }

  renderHighlight() {
    const {
      data,
      header
    } = this.props;
    if (header) {
      const {
        highlight: highlightTpl
      } = header || {};
      const highlight = !!evalExpression(highlightTpl!, data as object);
      return highlight;
    }
    return;
  }

  render() {
    const {render, ...rest} = this.props;

    return <Card
      render={render}
      {...rest}
      isamis={true}
      title={this.rederTitle()}
      subTitle={this.renderSubTitle()}
      subTitlePlaceholder={this.renderSubTitlePlaceholder()}
      description={this.renderDesc()}
      descriptionPlaceholder={this.renderDescPlaceholder()}
      toolbar={this.renderToolbar()}
      children={this.renderBody()}
      actions={this.renderActions()}
      secondary={this.renderSecondary()}
      avatar={this.renderAvatar()}
      avatarText={this.renderAvatarText()}
      highlight={this.renderHighlight()}
    ></Card>;
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
