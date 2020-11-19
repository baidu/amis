import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Collapse as BasicCollapse} from '../components/Collapse';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaTpl
} from '../Schema';

/**
 * Collapse 折叠渲染器，格式说明。
 * 文档：https://baidu.gitee.io/amis/docs/components/collapse
 */
export interface CollapseSchema extends BaseSchema {
  /**
   * 指定为折叠器类型
   */
  type: 'collapse';

  /**
   * 标题展示位置
   */
  titlePosition: 'top' | 'bottom';

  /**
   * 内容区域
   */
  body: SchemaCollection;

  /**
   * 配置 Body 容器 className
   */
  bodyClassName?: SchemaClassName;

  /**
   * 是否可折叠
   */
  collapsable?: boolean;

  /**
   * 默认是否折叠
   */
  collapsed?: boolean;

  /**
   * 标题 CSS 类名
   */
  headingClassName?: string;

  /**
   * 标题
   */
  title?: SchemaTpl;

  /**
   * 收起的标题
   */
  collapseTitle?: SchemaTpl;

  /**
   * 控件大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'base';
}

export interface CollapseProps
  extends RendererProps,
    Omit<CollapseSchema, 'type'> {
  wrapperComponent?: any;
  headingComponent?: any;

  // 内容口子
  children?: JSX.Element | ((props?: any) => JSX.Element);
}

export interface CollapseState {
  collapsed: boolean;
}

export default class Collapse extends React.Component<
  CollapseProps,
  CollapseState
> {
  static propsList: Array<string> = [
    'wrapperComponent',
    'headingComponent',
    'bodyClassName',
    'collapsed',
    'headingClassName'
  ];

  static defaultProps: Partial<CollapseProps> = {
    titlePosition: 'top',
    wrapperComponent: 'div',
    headingComponent: 'h4',
    className: '',
    headingClassName: '',
    bodyClassName: '',
    collapsable: true
  };

  state = {
    collapsed: false
  };

  constructor(props: CollapseProps) {
    super(props);

    this.toggleCollapsed = this.toggleCollapsed.bind(this);
    this.state.collapsed = !!props.collapsed;
  }

  componentWillReceiveProps(nextProps: CollapseProps) {
    const props = this.props;

    if (props.collapsed !== nextProps.collapsed) {
      this.setState({
        collapsed: !!nextProps.collapsed
      });
    }
  }

  toggleCollapsed() {
    this.props.collapsable !== false &&
      this.setState({
        collapsed: !this.state.collapsed
      });
  }

  render() {
    const {
      classPrefix: ns,
      classnames: cx,
      size,
      wrapperComponent: WrapperComponent,
      headingComponent: HeadingComponent,
      className,
      headingClassName,
      children,
      titlePosition,
      collapseTitle,
      body,
      bodyClassName,
      render,
      collapsable,
      translate: __
    } = this.props;
    // 默认给个 title，不然没法点
    const title = this.props.title || 'Collapse';

    return (
      <WrapperComponent
        className={cx(
          `Collapse`,
          {
            'is-collapsed': this.state.collapsed,
            [`Collapse--${size}`]: size,
            'Collapse--collapsable': collapsable,
            'Collapse--title-bottom': titlePosition === 'bottom'
          },
          className
        )}
      >
        {titlePosition === 'top' ? (
          <HeadingComponent
            onClick={this.toggleCollapsed}
            className={cx(`Collapse-header`, headingClassName)}
          >
            {this.state.collapsed
              ? render('heading', title)
              : render('heading', collapseTitle || title)}
            {collapsable && <span className={cx('Collapse-arrow')} />}
          </HeadingComponent>
        ) : null}

        <BasicCollapse
          show={collapsable ? !this.state.collapsed : true}
          classnames={cx}
          classPrefix={ns}
        >
          <div className={cx(`Collapse-body`, bodyClassName)}>
            {children
              ? typeof children === 'function'
                ? children(this.props)
                : children
              : body
              ? render('body', body)
              : null}
          </div>
        </BasicCollapse>

        {titlePosition === 'bottom' ? (
          <div
            className={cx(`Collapse-header`, headingClassName)}
            onClick={this.toggleCollapsed}
          >
            {this.state.collapsed
              ? render('heading', title)
              : render('heading', collapseTitle || title)}
            {collapsable && <span className={cx('Collapse-arrow')} />}
          </div>
        ) : null}
      </WrapperComponent>
    );
  }
}

@Renderer({
  test: /(^|\/)collapse$/,
  name: 'collapse'
})
export class CollapseRenderer extends Collapse {}
