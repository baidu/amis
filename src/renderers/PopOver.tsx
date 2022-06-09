/**
 * @file scoped.jsx.
 * @author fex
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import {RendererProps} from '../factory';
import cx from 'classnames';
import hoistNonReactStatic from 'hoist-non-react-statics';
import PopOver, {Offset} from '../components/PopOver';
import Overlay from '../components/Overlay';
import {Icon} from '../components/icons';
import {SchemaCollection, SchemaExpression} from '../Schema';
import {RootClose} from '../utils/RootClose';

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
   * 配置当前行是否启动，要用表达式
   */
  popOverEnableOn?: SchemaExpression;

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
    | 'left-top-left-top'
    | 'left-top-left-center'
    | 'left-top-left-bottom'
    | 'left-top-center-top'
    | 'left-top-center-center'
    | 'left-top-center-bottom'
    | 'left-top-right-top'
    | 'left-top-right-center'
    | 'left-top-right-bottom'
    | 'right-top'
    | 'right-top-left-top'
    | 'right-top-left-center'
    | 'right-top-left-bottom'
    | 'right-top-center-top'
    | 'right-top-center-center'
    | 'right-top-center-bottom'
    | 'right-top-right-top'
    | 'right-top-right-center'
    | 'right-top-right-bottom'
    | 'left-bottom'
    | 'left-bottom-left-top'
    | 'left-bottom-left-center'
    | 'left-bottom-left-bottom'
    | 'left-bottom-center-top'
    | 'left-bottom-center-center'
    | 'left-bottom-center-bottom'
    | 'left-bottom-right-top'
    | 'left-bottom-right-center'
    | 'left-bottom-right-bottom'
    | 'right-bottom'
    | 'right-bottom-left-top'
    | 'right-bottom-left-center'
    | 'right-bottom-left-bottom'
    | 'right-bottom-center-top'
    | 'right-bottom-center-center'
    | 'right-bottom-center-bottom'
    | 'right-bottom-right-top'
    | 'right-bottom-right-center'
    | 'right-bottom-right-bottom'
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

export const HocPopOver =
  (
    config: {
      targetOutter?: boolean; // 定位目标为整个外层
      position?: string;
    } = {}
  ) =>
  (Component: React.ComponentType<any>): any => {
    let lastOpenedInstance: PopOverComponent | null = null;
    class PopOverComponent extends React.Component<PopOverProps, PopOverState> {
      target: HTMLElement;
      timer: ReturnType<typeof setTimeout>;
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
            body: `\${${name}}`
          };
        } else if (
          popOver &&
          (popOver.mode === 'dialog' || popOver.mode === 'drawer')
        ) {
          schema = {
            actions: [
              {
                label: __('Dialog.close'),
                type: 'button',
                actionType: 'cancel'
              }
            ],
            ...popOver,
            type: popOver.mode
          };
        } else if (typeof popOver === 'string') {
          schema = {
            type: 'panel',
            body: popOver
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
          <RootClose
            disabled={!this.state.isOpened}
            onRootClose={this.closePopOver}
          >
            {(ref: any) => {
              return (
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
                  ref={ref}
                >
                  {content}
                </div>
              );
            }}
          </RootClose>
        ) : (
          <Overlay
            container={popOverContainer}
            placement={position || config.position || 'center'}
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
          popOverEnable,
          className,
          noHoc,
          classnames: cx,
          showIcon
        } = this.props;
        if (
          !popOver ||
          popOverEnabled === false ||
          noHoc ||
          popOverEnable === false
        ) {
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
            ref={config.targetOutter ? this.targetRef : undefined}
          >
            {(popOver as SchemaPopOverObject)?.showIcon !== false ? (
              <>
                <Component {...this.props} wrapperComponent={''} noHoc />
                <span
                  key="popover-btn"
                  className={cx('Field-popOverBtn')}
                  {...triggerProps}
                  ref={config.targetOutter ? undefined : this.targetRef}
                >
                  <Icon icon="zoom-in" className="icon" />
                </span>
                {this.state.isOpened ? this.renderPopOver() : null}
              </>
            ) : (
              <>
                <div
                  className={cx('Field-popOverWrap')}
                  {...triggerProps}
                  ref={config.targetOutter ? undefined : this.targetRef}
                >
                  <Component {...this.props} wrapperComponent={''} noHoc />
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
