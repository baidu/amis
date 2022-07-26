/**
 * @file LazyComponent
 * @description
 * @author fex
 */

import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

export interface LazyComponentProps {
  component?: React.ReactType;
  getComponent?: () => Promise<React.ReactType>;
  placeholder?: React.ReactNode;
  unMountOnHidden?: boolean;
  childProps?: object;
  visiblilityProps?: object;
  [propName: string]: any;
}

export interface LazyComponentState {
  visible: boolean;
  component?: React.ReactType;
}

export default class LazyComponent extends React.Component<
  LazyComponentProps,
  LazyComponentState
> {
  static defaultProps = {
    placeholder: <span>Loading...</span>,
    unMountOnHidden: false,
    partialVisibility: true
  };

  mounted: boolean = false;
  constructor(props: LazyComponentProps) {
    super(props);

    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.mounted = true;

    this.state = {
      visible: false,
      component: props.component as React.ReactType
    };
  }

  componentDidMount() {
    // jest 里面有点异常，先手动让它总是可见
    if (typeof jest !== 'undefined') {
      this.handleVisibleChange(true);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleVisibleChange(visible: boolean) {
    this.setState({
      visible: visible
    });

    if (!visible || this.state.component || !this.props.getComponent) {
      return;
    }

    this.props
      .getComponent()
      .then(
        component =>
          this.mounted &&
          typeof component === 'function' &&
          this.setState({
            component: component
          })
      )
      .catch(
        reason =>
          this.mounted &&
          this.setState({
            component: () => (
              <div className="alert alert-danger">{String(reason)}</div>
            )
          })
      );
  }

  render() {
    const {
      placeholder,
      unMountOnHidden,
      childProps,
      visiblilityProps,
      partialVisibility,
      children,
      ...rest
    } = this.props;

    const {visible, component: Component} = this.state;

    // 需要监听从可见到不可见。
    if (unMountOnHidden) {
      return (
        <VisibilitySensor
          {...visiblilityProps}
          partialVisibility={partialVisibility}
          onChange={this.handleVisibleChange}
        >
          <div className="visibility-sensor">
            {Component && visible ? (
              <Component {...rest} {...childProps} />
            ) : children && visible ? (
              children
            ) : (
              placeholder
            )}
          </div>
        </VisibilitySensor>
      );
    }

    if (!visible) {
      return (
        <VisibilitySensor
          {...visiblilityProps}
          partialVisibility={partialVisibility}
          onChange={this.handleVisibleChange}
        >
          <div className="visibility-sensor">{placeholder}</div>
        </VisibilitySensor>
      );
    } else if (Component) {
      // 只监听不可见到可见，一旦可见了，就销毁检查。
      return <Component {...rest} {...childProps} />;
    } else if (children) {
      return children;
    }

    return <div>{placeholder}</div>;
  }
}
