import React from 'react';
import {
  ActionObject,
  IScopedContext,
  Renderer,
  RendererProps,
  ScopedContext,
  autobind,
  resolveEventData,
  isPureVariable,
  resolveVariableAndFilter
} from 'amis-core';
import {Collapse as BasicCollapse, Icon} from 'amis-ui';
import {BaseSchema, SchemaCollection, SchemaTpl, SchemaObject} from '../Schema';

/**
 * Collapse 折叠渲染器，格式说明。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/collapse
 */
export interface CollapseSchema extends BaseSchema {
  /**
   * 指定为折叠器类型
   */
  type: 'collapse';

  /**
   * 标识
   */
  key?: string;

  /**
   * 标题展示位置
   */
  headerPosition?: 'top' | 'bottom';

  /**
   * 标题
   */
  header?: string | SchemaCollection;

  /**
   * 内容区域
   */
  body: SchemaCollection;

  /**
   * 配置 Body 容器 className
   */
  bodyClassName?: string;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 是否可折叠
   */
  collapsable?: boolean;

  /**
   * 默认是否折叠
   */
  collapsed?: boolean;

  /**
   * 图标是否展示
   */
  showArrow?: boolean;

  /**
   * 自定义切换图标
   */
  expandIcon?: SchemaObject;

  /**
   * 标题 CSS 类名
   */
  headingClassName?: string;

  /**
   * 收起的标题
   */
  collapseHeader?: SchemaTpl;

  /**
   * 控件大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'base';

  /**
   * 点开时才加载内容
   */
  mountOnEnter?: boolean;

  /**
   * 卡片隐藏就销毁内容。
   */
  unmountOnExit?: boolean;
  /**
   * 标题内容分割线
   */
  divideLine?: boolean;
}

export interface CollapseProps
  extends RendererProps,
    Omit<CollapseSchema, 'type' | 'className'> {
  wrapperComponent?: any;
  headingComponent?: any;

  // 内容口子
  children?: JSX.Element | ((props?: any) => JSX.Element);
  /** 当Collapse作为Form组件的子元素时，开启该属性后组件样式设置为FieldSet组件的样式，默认开启 */
  enableFieldSetStyle?: boolean;
}

export default class Collapse extends React.Component<CollapseProps, {}> {
  static propsList: Array<string> = [
    'collapsable',
    'collapsed',
    'collapseTitle',
    'showArrow',
    'headerPosition',
    'bodyClassName',
    'headingClassName',
    'collapseHeader',
    'size'
  ];

  basicCollapse = React.createRef<any>();

  @autobind
  async handleCollapseChange(props: any, collapsed: boolean) {
    const {dispatchEvent, onCollapse} = this.props;
    const eventData = resolveEventData(this.props, {
      collapsed
    });

    // 触发折叠器状态变更事件
    const changeEvent = await dispatchEvent('change', eventData);

    // 单独触发折叠 or 收起事件
    const toggleEvent = await dispatchEvent(
      collapsed ? 'collapse' : 'expand',
      eventData
    );

    if (changeEvent?.prevented || toggleEvent?.prevented) {
      return;
    }

    onCollapse?.(props, collapsed);
  }

  doAction(action: ActionObject, args: object, throwErrors: boolean): any {
    if (this.props.disabled || this.props.collapsable === false) {
      return;
    }
    if (['expand', 'collapse'].includes(action.actionType!)) {
      const targetState = action.actionType === 'collapse';
      this.handleCollapseChange(this.props, targetState);
      const collapseInstance = (
        this.basicCollapse?.current as any
      )?.getWrappedInstance?.();
      collapseInstance?.changeCollapsedState?.(targetState);
    }
  }

  render() {
    const {
      id,
      classPrefix: ns,
      classnames: cx,
      size,
      wrapperComponent,
      headingComponent,
      className,
      style,
      headingClassName,
      children,
      titlePosition,
      headerPosition,
      title,
      collapseTitle,
      collapseHeader,
      header,
      body,
      bodyClassName,
      render,
      collapsable,
      translate: __,
      mountOnEnter,
      unmountOnExit,
      showArrow,
      expandIcon,
      disabled,
      collapsed,
      propsUpdate,
      mobileUI,
      divideLine,
      enableFieldSetStyle
    } = this.props;
    const heading = title || header || '';

    return (
      <BasicCollapse
        id={id}
        ref={this.basicCollapse}
        classnames={cx}
        classPrefix={ns}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
        size={size}
        wrapperComponent={wrapperComponent}
        headingComponent={headingComponent}
        className={className}
        style={style}
        headingClassName={headingClassName}
        bodyClassName={bodyClassName}
        headerPosition={titlePosition || headerPosition}
        collapsable={collapsable}
        collapsed={collapsed}
        showArrow={showArrow}
        disabled={disabled}
        propsUpdate={propsUpdate}
        expandIcon={
          expandIcon ? (
            typeof (expandIcon as any).icon === 'object' ? (
              <Icon
                cx={cx}
                icon={(expandIcon as any).icon}
                className={cx('Collapse-icon-tranform')}
              />
            ) : (
              render('arrow-icon', expandIcon || '', {
                className: cx('Collapse-icon-tranform')
              })
            )
          ) : null
        }
        collapseHeader={
          collapseTitle || collapseHeader
            ? render('heading', collapseTitle || collapseHeader)
            : null
        }
        header={heading ? render('heading', heading) : null}
        body={
          children
            ? typeof children === 'function'
              ? children(this.props)
              : children
            : body
            ? render('body', body)
            : null
        }
        mobileUI={mobileUI}
        onCollapse={this.handleCollapseChange}
        divideLine={divideLine}
        enableFieldSetStyle={enableFieldSetStyle}
      ></BasicCollapse>
    );
  }
}

@Renderer({
  type: 'collapse'
})
export class CollapseRenderer extends Collapse {
  static contextType = ScopedContext;

  constructor(props: CollapseProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }
}
