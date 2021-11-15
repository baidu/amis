/**
 * @file Collapse-Panel
 * @description 折叠面板子组件
 * @author hongyang03
 */

import React from 'react';
import {RendererProps} from '../factory';
import {Collapse as BasicCollapse} from '../components/Collapse';
import {
  SchemaClassName,
  SchemaCollection
} from '../Schema';
import {SchemaNode} from '../types';

export interface CollapsePanelProps extends RendererProps {
  disabled?: boolean;
  collapsed?: boolean;
  key?: string;
  header?: string | SchemaNode;
  body?: SchemaCollection;
  showArrow?: boolean;
  expandIcon?: SchemaNode;
  bodyClassName?: SchemaClassName;
  headingClassName?: SchemaClassName;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  onChange: (item: CollapsePanelProps, collapsed: boolean) => void;
  className?: string;
  wrapperComponent?: any;
  headingComponent?: any;

  // 内容口子
  children?: JSX.Element | ((props?: any) => JSX.Element);
}

export interface CollapsePanelState {
  collapsed: boolean;
}

class CollapsePanel extends React.Component<
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

export default CollapsePanel;
