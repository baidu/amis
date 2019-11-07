/**
 * @file scoped.jsx.
 * @author fex
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import {RendererProps} from '../factory';
import cx from 'classnames';
import hoistNonReactStatic = require('hoist-non-react-statics');
import {RootCloseWrapper} from 'react-overlays';
import PopOver, {Offset} from '../components/PopOver';
import Overlay from '../components/Overlay';

const allowedPositions = ['center', 'top'];

export interface PopOverConfig {
  saveImmediately?: boolean;
  mode?: 'dialog' | 'drawer' | 'popOver';
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position:
    | 'center'
    | 'left-top'
    | 'right-top'
    | 'left-bottom'
    | 'right-bottom'
    | 'fixed-center'
    | 'fixed-left-top'
    | 'fixed-right-top'
    | 'fixed-left-bottom'
    | 'fixed-right-bottom';
  [propName: string]: any;
  offset: Offset;
}

export interface PopOverProps extends RendererProps {
  name?: string;
  label?: string;
  popOver: boolean | PopOverConfig;
  onPopOverOpen: (popover: any) => void;
  onPopOverClose: (popover: any) => void;
}

export interface PopOverState {
  isOpened: boolean;
}

export const HocPopOver = (config: Partial<PopOverConfig> = {}) => (
  Component: React.ComponentType<any>
): any => {
  class PopOverComponent extends React.Component<PopOverProps, PopOverState> {
    target: HTMLElement;
    static ComposedComponent = Component;
    constructor(props: PopOverProps) {
      super(props);

      this.openPopOver = this.openPopOver.bind(this);
      this.closePopOver = this.closePopOver.bind(this);
      this.targetRef = this.targetRef.bind(this);
      // this.handleClickOutside = this.handleClickOutside.bind(this);
      this.state = {
        isOpened: false
      };
    }

    targetRef(ref: any) {
      this.target = ref;
    }

    openPopOver() {
      const onPopOverOpen = this.props.onPopOverOpen;
      this.setState(
        {
          isOpened: true
        },
        () => onPopOverOpen && onPopOverOpen(this.props.popOver)
      );
    }

    closePopOver() {
      if (!this.state.isOpened) {
        return;
      }

      const onPopOverClose = this.props.onPopOverClose;
      this.setState(
        {
          isOpened: false
        },
        () => onPopOverClose && onPopOverClose(this.props.popOver)
      );
    }

    buildSchema() {
      const {popOver, name, label} = this.props;

      let schema;

      if (popOver === true) {
        schema = {
          type: 'panel',
          body: '${name}'
        };
      } else if (
        popOver &&
        (popOver.mode === 'dialog' || popOver.mode === 'drawer')
      ) {
        schema = {
          type: popOver.mode,
          actions: [
            {
              label: '关闭',
              type: 'button',
              actionType: 'cancel'
            }
          ],
          ...popOver
        };
      } else if (popOver) {
        schema = {
          type: 'panel',
          ...popOver
        };
      }

      return schema || 'error';
    }

    renderPopOver() {
      let {
        popOver,
        render,
        popOverContainer,
        classnames: cx,
        classPrefix: ns
      } = this.props;
      if (
        popOver &&
        ((popOver as PopOverConfig).mode === 'dialog' ||
          (popOver as PopOverConfig).mode === 'drawer')
      ) {
        return render('popover-detail', this.buildSchema(), {
          show: true,
          onClose: this.closePopOver,
          onConfirm: this.closePopOver
        });
      }

      const content = render('popover-detail', this.buildSchema(), {
        className: cx((popOver as PopOverConfig).className)
      }) as JSX.Element;

      if (!popOverContainer) {
        popOverContainer = () => findDOMNode(this);
      }

      const position = (popOver && (popOver as PopOverConfig).position) || '';
      const isFixed = /^fixed\-/.test(position);

      return isFixed ? (
        <RootCloseWrapper
          disabled={!this.state.isOpened}
          onRootClose={this.closePopOver}
        >
          <div className={cx(`PopOverAble--fixed PopOverAble--${position}`)}>
            {content}
          </div>
        </RootCloseWrapper>
      ) : (
        <Overlay
          container={popOverContainer}
          placement={position || 'center'}
          target={() => this.target}
          onHide={this.closePopOver}
          rootClose
          show
        >
          <PopOver
            classPrefix={ns}
            className={cx('PopOverAble-popover')}
            offset={popOver.offset}
          >
            {content}
          </PopOver>
        </Overlay>
      );
    }

    render() {
      const {
        onQuickChange,
        popOver,
        popOverEnabled,
        className,
        noHoc,
        classnames: cx,
        render
      } = this.props;

      if (!popOver || popOverEnabled === false || noHoc) {
        return <Component {...this.props} />;
      }

      return (
        <Component
          {...this.props}
          className={cx(`Field--popOverAble`, className, {
            in: this.state.isOpened
          })}
        >
          <Component
            {...this.props}
            wrapperComponent={''}
            noHoc
            ref={this.targetRef}
          />
          <i
            key="popover-btn"
            className={cx('Field-popOverBtn fa fa-search-plus')}
            onClick={this.openPopOver}
          />
          {this.state.isOpened ? this.renderPopOver() : null}
        </Component>
      );
    }
  }

  hoistNonReactStatic(PopOverComponent, Component);

  return PopOverComponent;
};

export default HocPopOver;
