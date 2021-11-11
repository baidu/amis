import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Collapse as BasicCollapse} from '../components/Collapse';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection
} from '../Schema';
import {SchemaNode} from '../types';

/**
 * CollapsePanel 折叠渲染器，格式说明。
 * 文档：https://baidu.gitee.io/amis/docs/components/collapse
 */
export interface CollapsePanelSchema extends BaseSchema {
  /**
   * 指定为折叠器类型
   */
  type: 'collapse-panel';

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 默认是否折叠
   */
  collapsed?: boolean;

  /**
   * 标识
   */
  key?: string;

  /**
   * 标题
   */
  header?: string | SchemaNode;

  /**
   * 内容区域
   */
  body?: SchemaCollection;

  /**
   * 图标是否展示
   */
  showArrow?: boolean;

  /**
   * 自定义切换图标
   */
  expandIcon?: SchemaNode;

  /**
   * 配置 Body 容器 className
   */
  bodyClassName?: SchemaClassName;

  /**
   * 标题 CSS 类名
   */
  headingClassName?: SchemaClassName;

  /**
   * 点开时才加载内容
   */
  mountOnEnter?: boolean;

  /**
   * 卡片隐藏就销毁内容。
   */
  unmountOnExit?: boolean;

  /**
   * 变更事件
   */
  onChange: (item: CollapsePanelProps, collapsed: boolean) => void;
}

export interface CollapsePanelProps
  extends RendererProps,
    Omit<CollapsePanelSchema, 'type' | 'className'> {
  wrapperComponent?: any;
  headingComponent?: any;

  // 内容口子
  children?: JSX.Element | ((props?: any) => JSX.Element);
}

export interface CollapsePanelState {
  collapsed: boolean;
}

export default class CollapsePanel extends React.Component<
  CollapsePanelProps,
  CollapsePanelState
> {
  static propsList: Array<string> = [
    'wrapperComponent',
    'headingComponent',
    'bodyClassName',
    'collapsed',
    'headingClassName',
    'header',
    'mountOnEnter',
    'unmountOnExit'
  ];

  static defaultProps: Partial<CollapsePanelProps> = {
    wrapperComponent: 'div',
    headingComponent: 'div',
    className: '',
    headingClassName: '',
    bodyClassName: '',
    disabled: false,
    showArrow: true
  };

  state = {
    collapsed: true // 默认折叠
  };

  constructor(props: CollapsePanelProps) {
    super(props);

    this.toggleCollapsed = this.toggleCollapsed.bind(this);
    if (props.collapsed !== undefined) {
      this.state.collapsed = !!props.collapsed;
    }
  }

  componentWillReceiveProps(nextProps: CollapsePanelProps) {
    if (nextProps.collapsed !== this.state.collapsed) {
      this.setState({
        collapsed: !!nextProps.collapsed
      });
    }
  }

  toggleCollapsed() {
    const props = this.props;
    if (props.disabled !== true) {
      this.setState({
        collapsed: !this.state.collapsed
      });
      props.onChange(props, !this.state.collapsed)
    }
  }

  render() {
    const {
      classPrefix: ns,
      classnames: cx,
      wrapperComponent: WrapperComponent,
      headingComponent: HeadingComponent,
      className,
      headingClassName,
      children,
      header,
      body,
      bodyClassName,
      render,
      disabled,
      translate: __,
      mountOnEnter,
      unmountOnExit,
      showArrow,
      expandIcon
    } = this.props;

    let dom = [
      <HeadingComponent
        key="title"
        onClick={this.toggleCollapsed}
        className={cx(`CollapsePanel-header`, headingClassName)}
      >
        {showArrow
          ? expandIcon
            ? render('arrow-icon', expandIcon, {className: cx('CollapsePanel-icon-tranform')})
            : <span className={cx('CollapsePanel-arrow')} />
            : ''}
        {render('heading', header || '')}
      </HeadingComponent>,

      <BasicCollapse
        show={!this.state.collapsed}
        classnames={cx}
        classPrefix={ns}
        key="body"
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
      >
        <div className={cx(`CollapsePanel-body`, bodyClassName)}>
          <div className={cx('CollapsePanel-content-box')}>
            {children
              ? typeof children === 'function'
                ? children(this.props)
                : children
              : body
              ? render('body', body)
              : null}
          </div>
        </div>
      </BasicCollapse>
    ];

    return (
      <WrapperComponent
        className={cx(
          `CollapsePanel`,
          {
            'is-active': !this.state.collapsed,
            'CollapsePanel--disabled': disabled,
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
  type: 'collapse-panel'
})
export class CollapsePanelRenderer extends CollapsePanel {}
