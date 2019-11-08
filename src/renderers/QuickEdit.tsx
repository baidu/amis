/**
 * @file scoped.jsx.
 * @author fex
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import find = require('lodash/find');
import PropTypes from 'prop-types';
import isPlainObject = require('lodash/isPlainObject');
import {RendererProps} from '../factory';
import cx from 'classnames';
import hoistNonReactStatic = require('hoist-non-react-statics');
import onClickOutside from 'react-onclickoutside';
import {Action} from '../types';
import keycode from 'keycode';
import matches = require('dom-helpers/query/matches');
import Overlay from '../components/Overlay';
import PopOver from '../components/PopOver';

export interface QuickEditConfig {}

export interface QuickEditConfig {
  saveImmediately?: boolean;
  mode?: 'inline' | 'dialog' | 'popOver' | 'append';
  type?: string;
  controls?: any;
  tabs?: any;
  fieldSet?: any;
  focusable?: boolean;
  popOverClassName?: string;
  [propName: string]: any;
}

export interface QuickEditProps extends RendererProps {
  name?: string;
  label?: string;
  quickEdit: boolean | QuickEditConfig;
  quickEditEnabled?: boolean;
}

export interface QuickEditState {
  isOpened: boolean;
}

let inited: boolean = false;
let currentOpened: any;

export const HocQuickEdit = (config: Partial<QuickEditConfig> = {}) => (
  Component: React.ComponentType<any>
): any => {
  class QuickEditComponent extends React.PureComponent<
    QuickEditProps,
    QuickEditState
  > {
    target: HTMLElement;
    overlay: HTMLElement;
    static ComposedComponent = Component;
    constructor(props: QuickEditProps) {
      super(props);

      this.openQuickEdit = this.openQuickEdit.bind(this);
      this.closeQuickEdit = this.closeQuickEdit.bind(this);
      this.handleAction = this.handleAction.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleKeyUp = this.handleKeyUp.bind(this);
      this.overlayRef = this.overlayRef.bind(this);
      this.handleWindowKeyPress = this.handleWindowKeyPress.bind(this);
      this.handleWindowKeyDown = this.handleWindowKeyDown.bind(this);
      this.formRef = this.formRef.bind(this);
      this.handleInit = this.handleInit.bind(this);
      this.handleChange = this.handleChange.bind(this);

      this.state = {
        isOpened: false
      };
    }

    componentDidMount() {
      this.target = findDOMNode(this) as HTMLElement;

      if (inited) {
        return;
      }

      inited = true;
      document.body.addEventListener('keypress', this.handleWindowKeyPress);
      document.body.addEventListener('keydown', this.handleWindowKeyDown);
    }

    formRef(ref: any) {
      const {quickEditFormRef, rowIndex, colIndex} = this.props;

      if (quickEditFormRef) {
        while (ref && ref.getWrappedInstance) {
          ref = ref.getWrappedInstance();
        }

        quickEditFormRef(ref, colIndex, rowIndex);
      }
    }

    handleWindowKeyPress(e: Event) {
      const ns = this.props.classPrefix;
      let el: HTMLElement = (e.target as HTMLElement).closest(
        `.${ns}Field--quickEditable`
      ) as HTMLElement;
      if (!el) {
        return;
      }
      const table = el.closest('table');
      if (!table) {
        return;
      }

      if (
        keycode(e) === 'space' &&
        !~['INPUT', 'TEXTAREA'].indexOf(el.tagName)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    handleWindowKeyDown(e: Event) {
      const code = keycode(e);

      if (code === 'esc' && currentOpened) {
        currentOpened.closeQuickEdit();
      } else if (
        ~['INPUT', 'TEXTAREA'].indexOf((e.target as HTMLElement).tagName) ||
        (e.target as HTMLElement).contentEditable === 'true' ||
        !~['up', 'down', 'left', 'right'].indexOf(code)
      ) {
        return;
      }

      e.preventDefault();
      const ns = this.props.classPrefix;
      let el: HTMLElement =
        ((e.target as HTMLElement).closest(
          `.${ns}Field--quickEditable`
        ) as HTMLElement) ||
        document.querySelector(`.${ns}Field--quickEditable`);
      if (!el) {
        return;
      }

      let table = el.closest('table');
      if (!table) {
        return;
      }

      let current = table.querySelector(
        `.${ns}Field--quickEditable:focus`
      ) as HTMLTableDataCellElement;

      if (!current) {
        let dom = table.querySelector(
          `.${ns}Field--quickEditable[tabindex]`
        ) as HTMLElement;
        dom && dom.focus();
      } else {
        let prevTr, nextTr, prevTd, nextTd;

        switch (code) {
          case 'up':
            prevTr = (current.parentNode as HTMLElement)
              .previousSibling as HTMLTableCellElement;

            if (prevTr) {
              let index = current.cellIndex;
              (prevTr.children[index] as HTMLElement).focus();
            }
            break;
          case 'down':
            nextTr = (current.parentNode as HTMLElement)
              .nextSibling as HTMLTableCellElement;

            if (nextTr) {
              let index = current.cellIndex;
              (nextTr.children[index] as HTMLElement).focus();
            }
            break;
          case 'left':
            prevTd = current.previousElementSibling as HTMLTableCellElement;

            while (prevTd) {
              if (matches(prevTd, `.${ns}Field--quickEditable[tabindex]`)) {
                break;
              }
              prevTd = prevTd.previousElementSibling;
            }

            if (prevTd) {
              (prevTd as HTMLElement).focus();
            } else if ((current.parentNode as HTMLElement).previousSibling) {
              let tds = ((current.parentNode as HTMLElement)
                .previousSibling as HTMLElement).querySelectorAll(
                `.${ns}Field--quickEditable[tabindex]`
              );

              if (tds.length) {
                (tds[tds.length - 1] as HTMLElement).focus();
              }
            }
            break;
          case 'right':
            nextTd = current.nextSibling;
            while (nextTd) {
              if (matches(nextTd, `.${ns}Field--quickEditable[tabindex]`)) {
                break;
              }

              nextTd = nextTd.nextSibling;
            }

            if (nextTd) {
              (nextTd as HTMLElement).focus();
            } else if ((current.parentNode as HTMLElement).nextSibling) {
              nextTd = ((current.parentNode as HTMLElement)
                .nextSibling as HTMLElement).querySelector(
                `.${ns}Field--quickEditable[tabindex]`
              );

              if (nextTd) {
                nextTd.focus();
              }
            }
            break;
        }
      }
    }

    // handleClickOutside() {
    //     this.closeQuickEdit();
    // }

    overlayRef(ref: any) {
      this.overlay = ref;
    }

    handleAction(e: any, action: Action, ctx: object) {
      const {onAction} = this.props;

      if (action.actionType === 'cancel' || action.actionType === 'close') {
        this.closeQuickEdit();
        return;
      }

      onAction && onAction(e, action, ctx);
    }

    handleSubmit(values: object) {
      const {onQuickChange, quickEdit} = this.props;

      this.closeQuickEdit();
      onQuickChange(values, (quickEdit as QuickEditConfig).saveImmediately);
    }

    handleInit(values: object) {
      const {onQuickChange} = this.props;
      onQuickChange(values, false, true);
    }

    handleChange(values: object) {
      const {onQuickChange, quickEdit} = this.props;

      onQuickChange(values, (quickEdit as QuickEditConfig).saveImmediately);
    }

    openQuickEdit() {
      currentOpened = this;
      this.setState({
        isOpened: true
      });
    }

    closeQuickEdit() {
      if (!this.state.isOpened) {
        return;
      }
      currentOpened = null;
      const ns = this.props.classPrefix;
      this.setState(
        {
          isOpened: false
        },
        () => {
          let el = findDOMNode(this) as HTMLElement;
          let table = el.closest('table') as HTMLElement;
          ((table &&
            table.querySelectorAll(`td.${ns}Field--quickEditable:focus`)
              .length) ||
            el) &&
            el.focus();
        }
      );
    }

    buildSchema() {
      const {quickEdit, name, label} = this.props;

      let schema;

      if (quickEdit === true) {
        schema = {
          type: 'form',
          title: '',
          autoFocus: true,
          controls: [
            {
              type: 'text',
              name,
              placeholder: label,
              label: false
            }
          ]
        };
      } else if (quickEdit) {
        if (
          (quickEdit.controls &&
            !~['combo', 'group', 'panel', 'fieldSet'].indexOf(
              (quickEdit as any).type
            )) ||
          quickEdit.tabs ||
          quickEdit.fieldSet
        ) {
          schema = {
            title: '',
            autoFocus: (quickEdit as QuickEditConfig).mode !== 'inline',
            mode:
              (quickEdit as QuickEditConfig).mode === 'inline'
                ? 'inline'
                : 'normal',
            ...quickEdit,
            type: 'form'
          };
        } else {
          schema = {
            title: '',
            className: quickEdit.formClassName,
            type: 'form',
            autoFocus: (quickEdit as QuickEditConfig).mode !== 'inline',
            mode:
              (quickEdit as QuickEditConfig).mode === 'inline'
                ? 'inline'
                : 'normal',
            controls: [
              {
                type: quickEdit.type || 'text',
                name: quickEdit.name || name,
                ...quickEdit
              }
            ]
          };
        }
      }

      if (schema) {
        schema = {
          ...schema,
          wrapWithPanel: (quickEdit as QuickEditConfig).mode !== 'inline',
          actions:
            (quickEdit as QuickEditConfig).mode === 'inline'
              ? []
              : [
                  {
                    type: 'button',
                    label: '取消',
                    actionType: 'cancel'
                  },

                  {
                    label: '确认',
                    type: 'submit',
                    primary: true
                  }
                ]
        };
      }

      return schema || 'error';
    }

    handleKeyUp(e: Event) {
      const code = keycode(e);
      if (
        code === 'space' &&
        !~['INPUT', 'TEXTAREA'].indexOf((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        e.stopPropagation();
        this.openQuickEdit();
      }
    }

    renderPopOver() {
      let {
        quickEdit,
        render,
        popOverContainer,
        classPrefix: ns,
        classnames: cx
      } = this.props;

      const content = (
        <div className={cx((quickEdit as QuickEditConfig).className)}>
          {render('quick-edit-form', this.buildSchema(), {
            onSubmit: this.handleSubmit,
            onAction: this.handleAction,
            onChange: null,
            ref: this.formRef,
            popOverContainer: popOverContainer ? () => this.overlay : null
          })}
        </div>
      );

      popOverContainer = popOverContainer || (() => findDOMNode(this));

      return (
        <Overlay
          container={popOverContainer}
          target={() => this.target}
          onHide={this.closeQuickEdit}
          show
        >
          <PopOver
            classPrefix={ns}
            ref={this.overlayRef}
            className={cx(
              `${ns}QuickEdit-popover`,
              (quickEdit as QuickEditConfig).popOverClassName
            )}
            onHide={this.closeQuickEdit}
            overlay
          >
            {content}
          </PopOver>
        </Overlay>
      );
    }

    render() {
      const {
        onQuickChange,
        quickEdit,
        quickEditEnabled,
        className,
        classnames: cx,
        render,
        noHoc
      } = this.props;

      if (!quickEdit || !onQuickChange || quickEditEnabled === false || noHoc) {
        return <Component {...this.props} />;
      }

      if ((quickEdit as QuickEditConfig).mode === 'inline') {
        return (
          <Component {...this.props}>
            {render('inline-form', this.buildSchema(), {
              wrapperComponent: 'div',
              className: cx('Form--quickEdit'),
              ref: this.formRef,
              onInit: this.handleInit,
              onChange: this.handleChange
            })}
          </Component>
        );
      } else {
        return (
          <Component
            {...this.props}
            className={cx(`Field--quickEditable`, className, {
              in: this.state.isOpened
            })}
            tabIndex={
              (quickEdit as QuickEditConfig).focusable === false
                ? undefined
                : '0'
            }
            onKeyUp={this.handleKeyUp}
          >
            <Component {...this.props} wrapperComponent={''} noHoc />
            <i
              key="edit-btn"
              className={cx('Field-quickEditBtn fa fa-edit')}
              onClick={this.openQuickEdit}
            />
            {this.state.isOpened ? this.renderPopOver() : null}
          </Component>
        );
      }
    }
  }

  hoistNonReactStatic(QuickEditComponent, Component);

  return QuickEditComponent;
};

export default HocQuickEdit;
