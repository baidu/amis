/**
 * @file scoped.jsx.
 * @author fex
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import {RendererProps} from '../factory';
import cx from 'classnames';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {RootCloseWrapper} from 'react-overlays';
import PopOver, {Offset} from '../components/PopOver';
import Overlay from '../components/Overlay';
import {Icon} from '../components/icons';
import {SchemaCollection} from '../Schema';

export interface SchemaPopOverObject {
  /**
   * 类名
   */
  className?: string;

  /**
   * 弹框外层类名
   */
  popOverClassName?: string;

  /**
   * 弹出模式
   */
  mode?: 'dialog' | 'drawer' | 'popOver';

  /**
   * 是弹窗形式的时候有用。
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * 弹出位置
   */
  position?:
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

  /**
   * 触发条件，默认是 click
   */
  trigger?: 'click' | 'hover';

  /**
   * 是否显示查看更多的 icon，通常是放大图标。
   */
  showIcon?: boolean;

  /**
   * 偏移量
   */
  offset?: {
    top?: number;
    left?: number;
  };

  /**
   * 标题
   */
  title?: string;

  body?: SchemaCollection;
}

export type SchemaPopOver = boolean | SchemaPopOverObject;

export interface PopOverProps extends RendererProps {
  name?: string;
  label?: string;
  popOver: boolean | SchemaPopOverObject;
  onPopOverOpened: (popover: any) => void;
  onPopOverClosed: (popover: any) => void;
}

export interface PopOverState {
  isOpened: boolean;
}

export const HocPopOver = (config: Partial<SchemaPopOverObject> = {}) => (
  Component: React.ComponentType<any>
): any => {
  let lastOpenedInstance: PopOverComponent | null = null;
  class PopOverComponent extends React.Component<PopOverProps, PopOverState> {
    target: HTMLElement;
    timer: NodeJS.Timeout;
    static ComposedComponent = Component;
    constructor(props: PopOverProps) {
      super(props);

      this.openPopOver = this.openPopOver.bind(this);
      this.closePopOver = this.closePopOver.bind(this);
      this.closePopOverLater = this.closePopOverLater.bind(this);
      this.clearCloseTimer = this.clearCloseTimer.bind(this);
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
      const onPopOverOpened = this.props.onPopOverOpened;
      lastOpenedInstance?.closePopOver();
      lastOpenedInstance = this;
      this.setState(
        {
          isOpened: true
        },
        () => onPopOverOpened && onPopOverOpened(this.props.popOver)
      );
    }

    closePopOver() {
      clearTimeout(this.timer);
      if (!this.state.isOpened) {
        return;
      }

      lastOpenedInstance = null;
      const onPopOverClosed = this.props.onPopOverClosed;
      this.setState(
        {
          isOpened: false
        },
        () => onPopOverClosed && onPopOverClosed(this.props.popOver)
      );
    }

    closePopOverLater() {
      // 5s 后自动关闭。
      this.timer = setTimeout(this.closePopOver, 2000);
    }

    clearCloseTimer() {
      clearTimeout(this.timer);
    }

    buildSchema() {
      const {popOver, name, label, translate: __} = this.props;

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
              label: __('关闭'),
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
        ((popOver as SchemaPopOverObject).mode === 'dialog' ||
          (popOver as SchemaPopOverObject).mode === 'drawer')
      ) {
        return render('popover-detail', this.buildSchema(), {
          show: true,
          onClose: this.closePopOver,
          onConfirm: this.closePopOver
        });
      }

      const content = render('popover-detail', this.buildSchema(), {
        className: cx((popOver as SchemaPopOverObject).className)
      }) as JSX.Element;

      if (!popOverContainer) {
        popOverContainer = () => findDOMNode(this);
      }

      const position =
        (popOver && (popOver as SchemaPopOverObject).position) || '';
      const isFixed = /^fixed\-/.test(position);

      return isFixed ? (
        // @ts-ignore
        <RootCloseWrapper
          disabled={!this.state.isOpened}
          onRootClose={this.closePopOver}
        >
          <div
            className={cx(`PopOverAble--fixed PopOverAble--${position}`)}
            onMouseLeave={
              (popOver as SchemaPopOverObject)?.trigger === 'hover'
                ? this.closePopOver
                : undefined
            }
            onMouseEnter={
              (popOver as SchemaPopOverObject)?.trigger === 'hover'
                ? this.clearCloseTimer
                : undefined
            }
          >
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
            className={cx(
              'PopOverAble-popover',
              (popOver as SchemaPopOverObject).popOverClassName
            )}
            offset={(popOver as SchemaPopOverObject).offset}
            onMouseLeave={
              (popOver as SchemaPopOverObject)?.trigger === 'hover'
                ? this.closePopOver
                : undefined
            }
            onMouseEnter={
              (popOver as SchemaPopOverObject)?.trigger === 'hover'
                ? this.clearCloseTimer
                : undefined
            }
          >
            {content}
          </PopOver>
        </Overlay>
      );
    }

    render() {
      const {
        popOver,
        popOverEnabled,
        className,
        noHoc,
        classnames: cx,
        showIcon
      } = this.props;

      if (!popOver || popOverEnabled === false || noHoc) {
        return <Component {...this.props} />;
      }

      const triggerProps: any = {};
      const trigger = (popOver as SchemaPopOverObject)?.trigger;
      if (trigger === 'hover') {
        triggerProps.onMouseEnter = this.openPopOver;
        triggerProps.onMouseLeave = this.closePopOverLater;
      } else {
        triggerProps.onClick = this.openPopOver;
      }

      return (
        <Component
          {...this.props}
          className={cx(`Field--popOverAble`, className, {
            in: this.state.isOpened
          })}
          ref={this.targetRef}
        >
          {(popOver as SchemaPopOverObject)?.showIcon !== false ? (
            <>
              <Component {...this.props} wrapperComponent={''} noHoc />
              <span
                key="popover-btn"
                className={cx('Field-popOverBtn')}
                {...triggerProps}
              >
                <Icon icon="zoom-in" className="icon" />
              </span>
              {this.state.isOpened ? this.renderPopOver() : null}
            </>
          ) : (
            <>
              <div className={cx('Field-popOverWrap')} {...triggerProps}>
                <Component
                  {...this.props}
                  wrapperComponent={''}
                  noHoc
                  ref={this.targetRef}
                />
              </div>
              {this.state.isOpened ? this.renderPopOver() : null}
            </>
          )}
        </Component>
      );
    }
  }

  hoistNonReactStatic(PopOverComponent, Component);

  return PopOverComponent;
};

export default HocPopOver;
