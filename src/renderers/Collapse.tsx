import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Collapse as BasicCollapse} from '../components/Collapse';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaTpl
} from '../Schema';
import {isClickOnInput} from '../utils/helper';

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

  /**
   * 点开时才加载内容
   */
  mountOnEnter?: boolean;

  /**
   * 卡片隐藏就销毁内容。
   */
  unmountOnExit?: boolean;
}

export interface CollapseProps
  extends RendererProps,
    Omit<CollapseSchema, 'type' | 'className'> {
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
    'headingClassName',
    'title',
    'mountOnEnter',
    'unmountOnExit'
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

  componentDidUpdate(prevProps: CollapseProps) {
    const props = this.props;

    if (prevProps.collapsed !== props.collapsed) {
      this.setState({
        collapsed: !!props.collapsed
      });
    }
  }

  toggleCollapsed(e: React.MouseEvent<HTMLElement>) {
    if (isClickOnInput(e)) {
      return;
    }
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
      title,
      collapseTitle,
      body,
      bodyClassName,
      render,
      collapsable,
      translate: __,
      mountOnEnter,
      unmountOnExit
    } = this.props;
    // 默认给个 title，不然没法点
    const finalTitle = this.state.collapsed ? title : collapseTitle || title;

    let dom = [
      finalTitle ? (
        <HeadingComponent
          key="title"
          onClick={this.toggleCollapsed}
          className={cx(`Collapse-header`, headingClassName)}
        >
          {collapsable && <span className={cx('Collapse-arrow')} />}
          {render('heading', finalTitle)}
        </HeadingComponent>
      ) : null,

      <BasicCollapse
        show={collapsable ? !this.state.collapsed : true}
        classnames={cx}
        classPrefix={ns}
        key="body"
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
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
    ];

    if (titlePosition === 'bottom') {
      dom.reverse();
    }

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
        {dom}
      </WrapperComponent>
    );
  }
}

@Renderer({
  type: 'collapse'
})
export class CollapseRenderer extends Collapse {}
