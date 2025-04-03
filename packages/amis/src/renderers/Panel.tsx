import React from 'react';
import {
  CustomStyle,
  RENDERER_TRANSMISSION_OMIT_PROPS,
  Renderer,
  RendererProps,
  setThemeClassName
} from 'amis-core';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaTpl
} from '../Schema';
import {ActionSchema} from './Action';
import {FormHorizontal} from 'amis-core';
import omit from 'lodash/omit';
import {Icon} from 'amis-ui';

/**
 * Panel渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/panel
 */
export interface PanelSchema extends BaseSchema {
  /**
   * 指定为Panel渲染器。
   */
  type: 'panel';

  /**
   * 按钮集合
   */
  actions?: Array<ActionSchema>;

  /**
   * 按钮集合外层类名
   */
  actionsClassName?: SchemaClassName;

  /**
   * 内容区域
   */
  body?: SchemaCollection;

  /**
   * 配置 Body 容器 className
   */
  bodyClassName?: SchemaClassName;

  /**
   * 底部内容区域
   */
  footer?: SchemaCollection;

  /**
   * 配置 footer 容器 className
   */
  footerClassName?: SchemaClassName;

  /**
   * footer 和 actions 外层 div 类名。
   */
  footerWrapClassName?: SchemaClassName;

  /**
   * 头部内容, 和 title 二选一。
   */
  header?: SchemaCollection;

  /**
   * 配置 header 容器 className
   */
  headerClassName?: SchemaClassName;

  /**
   * Panel 标题
   */
  title?: SchemaTpl;

  /**
   * 固定底部, 想要把按钮固定在底部的时候配置。
   */
  affixFooter?: boolean | 'always';

  /**\
   * 可折叠。先简单实现一下
   */
  collapsible?: boolean;

  /**
   * 配置子表单项默认的展示方式。
   */
  subFormMode?: 'normal' | 'inline' | 'horizontal';
  /**
   * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
   */
  subFormHorizontal?: FormHorizontal;

  /**
   * 外观配置的classname
   */
  headerControlClassName: string;
  bodyControlClassName: string;
  actionsControlClassName: string;
}

export interface PanelProps
  extends RendererProps,
    Omit<
      PanelSchema,
      'type' | 'className' | 'panelClassName' | 'bodyClassName'
    > {}
export default class Panel<
  T extends PanelProps = PanelProps
> extends React.Component<T> {
  static propsList: Array<string> = [
    'header',
    'actions',
    'children',
    'headerClassName',
    'footerClassName',
    'footerWrapClassName',
    'actionsClassName',
    'bodyClassName'
  ];
  static defaultProps = {
    // className: 'Panel--default',
    // headerClassName: 'Panel-heading',
    // footerClassName: 'Panel-footer bg-light lter Wrapper',
    // actionsClassName: 'Panel-footer',
    // bodyClassName: 'Panel-body'
  };

  state = {
    collapsed: false
  };

  constructor(props: T) {
    super(props);
    props.mobileUI && props.collapsible && (this.state.collapsed = true);
  }

  renderBody(): JSX.Element | null {
    const {
      type,
      className,
      style,
      data,
      header,
      body,
      render,
      bodyClassName,
      headerClassName,
      actionsClassName,
      footerClassName,
      children,
      title,
      actions,
      footer,
      classPrefix: ns,
      formMode,
      formHorizontal,
      subFormMode,
      subFormHorizontal,
      id,
      themeCss,
      wrapperCustomStyle,
      ...rest
    } = this.props;

    const subProps = {
      data,
      ...omit(rest, RENDERER_TRANSMISSION_OMIT_PROPS),
      formMode: subFormMode || formMode,
      formHorizontal: subFormHorizontal || formHorizontal
    };

    return children
      ? typeof children === 'function'
        ? children(this.props)
        : children
      : body
      ? render('body', body, subProps)
      : null;
  }

  renderActions() {
    const {actions, render} = this.props;

    if (Array.isArray(actions)) {
      return actions.map((action, key) =>
        render('action', action, {
          type: action.type || 'button',
          key: key
        })
      );
    }

    return null;
  }

  render() {
    const {
      type,
      className,
      style,
      data,
      header,
      body,
      render,
      bodyClassName,
      headerClassName,
      actionsClassName,
      footerClassName,
      footerWrapClassName,
      headerControlClassName,
      headerTitleControlClassName,
      bodyControlClassName,
      actionsControlClassName,
      children,
      title,
      footer,
      affixFooter,
      classPrefix: ns,
      classnames: cx,
      id,
      collapsible,
      themeCss,
      wrapperCustomStyle,
      ...rest
    } = this.props;

    const subProps = {
      data,
      ...rest
    };

    const footerDoms = [];
    const collapsed = this.state.collapsed;

    if (!collapsed) {
      if (Array.isArray(this.props.actions) && this.props.actions.length) {
        footerDoms.push(
          <div
            key="actions"
            className={cx(
              `Panel-btnToolbar`,
              actionsClassName || `Panel-footer`,
              actionsControlClassName
            )}
          >
            {this.renderActions()}
          </div>
        );
      }

      footer &&
        footerDoms.push(
          <div
            key="footer"
            className={cx(
              footerClassName || `Panel-footer`,
              actionsControlClassName
            )}
          >
            {render('footer', footer, subProps)}
          </div>
        );
    }

    let footerDom = footerDoms.length ? (
      <div
        className={cx(
          'Panel-footerWrap',
          footerWrapClassName,
          affixFooter ? 'Panel-fixedBottom' : '',
          setThemeClassName({
            ...this.props,
            name: 'footerControlClassName',
            id,
            themeCss
          })
        )}
      >
        {footerDoms}
      </div>
    ) : null;

    return (
      <div
        data-id={id}
        data-role="container"
        className={cx(
          `Panel`,
          className || `Panel--default`,
          setThemeClassName({
            ...this.props,
            name: 'baseControlClassName',
            id,
            themeCss
          }),
          setThemeClassName({
            ...this.props,
            name: 'wrapperCustomStyle',
            id,
            themeCss: wrapperCustomStyle
          })
        )}
        style={style}
      >
        {header ? (
          <div
            className={cx(
              headerClassName || `Panel-heading`,
              headerControlClassName,
              setThemeClassName({
                ...this.props,
                name: 'headerControlClassName',
                id,
                themeCss
              })
            )}
          >
            {render('header', header, subProps)}
          </div>
        ) : title ? (
          <div
            className={cx(
              headerClassName || `Panel-heading`,
              headerControlClassName,
              {
                'is-collapsible': collapsible
              },
              setThemeClassName({
                ...this.props,
                name: 'headerControlClassName',
                id,
                themeCss
              })
            )}
          >
            <h3
              className={cx(
                `Panel-title`,
                headerTitleControlClassName,
                setThemeClassName({
                  ...this.props,
                  name: 'titleControlClassName',
                  id,
                  themeCss
                })
              )}
            >
              {render('title', title, subProps)}
            </h3>
            {collapsible ? (
              <span
                className={cx('Panel-arrow-wrap')}
                onClick={() => {
                  this.setState({
                    collapsed: !collapsed
                  });
                }}
              >
                <Icon
                  icon="down-arrow-bold"
                  className={cx('Panel-arrow', 'icon', {
                    'is-collapsed': collapsed
                  })}
                />
              </span>
            ) : null}
          </div>
        ) : null}

        {!collapsed ? (
          <div
            className={cx(
              bodyClassName || `Panel-body`,
              bodyControlClassName,
              setThemeClassName({
                ...this.props,
                name: 'bodyControlClassName',
                id,
                themeCss
              })
            )}
          >
            {this.renderBody()}
          </div>
        ) : null}

        {footerDom}

        <CustomStyle
          {...this.props}
          config={{
            wrapperCustomStyle,
            id,
            themeCss,
            classNames: [
              {
                key: 'baseControlClassName'
              },
              {
                key: 'bodyControlClassName'
              },
              {
                key: 'headerControlClassName',
                weights: {
                  default: {
                    suf: `.${ns}Panel-heading`
                  }
                }
              },
              {
                key: 'titleControlClassName'
              },
              {
                key: 'footerControlClassName'
              }
            ]
          }}
          env={this.props.env}
        />
      </div>
    );
  }
}

@Renderer({
  type: 'panel'
})
export class PanelRenderer extends Panel {}
