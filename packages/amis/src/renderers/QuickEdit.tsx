/**
 * @file scoped.jsx.
 * @author fex
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import {
  RendererProps,
  difference,
  getPropValue,
  getRendererByName,
  noop,
  setVariable
} from 'amis-core';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {ActionObject} from 'amis-core';
import keycode from 'keycode';
import {Overlay} from 'amis-core';
import {PopOver} from 'amis-core';
import omit from 'lodash/omit';
import {Icon} from 'amis-ui';
import {SchemaCollection, SchemaObject} from '../Schema';

export type SchemaQuickEditObject =
  /**
   * 直接就是个表单项
   */
  | ({
      /**
       * 是否立即保存
       */
      saveImmediately?: boolean;

      /**
       * 接口保存失败后，是否重置组件编辑状态
       */
      resetOnFailed?: boolean;

      /**
       * 配置刷新目标，默认就会刷新所属 crud 组件，
       * 如果不需要，请配置为 "none"
       */
      reload?: string;

      /**
       * 是否直接内嵌
       */
      mode?: 'inline';
      /**
       * 配置按钮图标
       */
      icon?: string;
    } & SchemaObject)

  /**
   * 表单项集合
   */
  | {
      /**
       * 是否立即保存
       */
      saveImmediately?: boolean;

      /**
       * 接口保存失败后，是否重置组件编辑状态
       */
      resetOnFailed?: boolean;

      /**
       * 配置刷新目标，默认就会刷新所属 crud 组件，
       * 如果不需要，请配置为 "none"
       */
      reload?: string;

      /**
       * 是否直接内嵌
       */
      mode?: 'inline';
      /**
       * 配置按钮图标
       */
      icon?: string;

      body: SchemaCollection;
    };

export type SchemaQuickEdit = boolean | SchemaQuickEditObject;

export interface QuickEditConfig {
  saveImmediately?: boolean;
  resetOnFailed?: boolean;
  reload?: string;
  mode?: 'inline' | 'dialog' | 'popOver' | 'append';
  type?: string;
  body?: any;
  focusable?: boolean;
  popOverClassName?: string;
  isFormMode?: boolean;
  icon?: string;
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

export const HocQuickEdit =
  (config: Partial<QuickEditConfig> = {}) =>
  (Component: React.ComponentType<any>): any => {
    class QuickEditComponent extends React.PureComponent<
      QuickEditProps,
      QuickEditState
    > {
      target: HTMLElement;
      overlay: HTMLElement;
      form?: any;
      formItem?: any;
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
        this.formItemRef = this.formItemRef.bind(this);
        this.handleInit = this.handleInit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFormItemChange = this.handleFormItemChange.bind(this);
        this.handleBulkChange = this.handleBulkChange.bind(this);

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

        while (ref && ref.getWrappedInstance) {
          ref = ref.getWrappedInstance();
        }

        this.form = ref;
        quickEditFormRef?.(ref, colIndex, rowIndex);
      }
      formItemRef(ref: any) {
        const {quickEditFormItemRef, rowIndex, colIndex} = this.props;

        while (ref && ref.getWrappedInstance) {
          ref = ref.getWrappedInstance();
        }

        this.formItem = ref;
        quickEditFormItemRef?.(ref, colIndex, rowIndex);
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
                if (prevTd.matches(`.${ns}Field--quickEditable[tabindex]`)) {
                  break;
                }
                prevTd = prevTd.previousElementSibling;
              }

              if (prevTd) {
                (prevTd as HTMLElement).focus();
              } else if ((current.parentNode as HTMLElement).previousSibling) {
                let tds = (
                  (current.parentNode as HTMLElement)
                    .previousSibling as HTMLElement
                ).querySelectorAll(`.${ns}Field--quickEditable[tabindex]`);

                if (tds.length) {
                  (tds[tds.length - 1] as HTMLElement).focus();
                }
              }
              break;
            case 'right':
              nextTd = current.nextSibling;
              while (nextTd) {
                if (
                  (nextTd as Element).matches(
                    `.${ns}Field--quickEditable[tabindex]`
                  )
                ) {
                  break;
                }

                nextTd = nextTd.nextSibling;
              }

              if (nextTd) {
                (nextTd as HTMLElement).focus();
              } else if ((current.parentNode as HTMLElement).nextSibling) {
                nextTd = (
                  (current.parentNode as HTMLElement).nextSibling as HTMLElement
                ).querySelector(`.${ns}Field--quickEditable[tabindex]`);

                if (nextTd) {
                  (nextTd as any).focus();
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

      handleAction(e: any, action: ActionObject, ctx: object) {
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
        onQuickChange(
          values,
          (quickEdit as QuickEditConfig).saveImmediately,
          false,
          quickEdit as QuickEditConfig
        );

        return false;
      }

      handleInit(values: object) {
        const {onQuickChange, data} = this.props;

        const diff = difference(values, data);
        Object.keys(diff).length && onQuickChange(diff, false, true);
      }

      handleChange(values: object, diff?: any) {
        const {onQuickChange, quickEdit} = this.props;

        Object.keys(diff).length &&
          onQuickChange(
            diff, // 只变化差异部分，其他值有可能是旧的
            (quickEdit as QuickEditConfig).saveImmediately,
            false,
            quickEdit as QuickEditConfig
          );
      }

      handleFormItemChange(value: any) {
        const {onQuickChange, quickEdit, name} = this.props;

        const data = {};
        setVariable(data, name!, value);
        onQuickChange(
          data,
          (quickEdit as QuickEditConfig).saveImmediately,
          false,
          quickEdit as QuickEditConfig
        );
      }

      // autoFill 是通过 onBulkChange 触发的
      // quickEdit 需要拦截这个，否则修改的数据就是错的
      handleBulkChange(values: any) {
        const {onQuickChange, quickEdit} = this.props;
        onQuickChange(
          values,
          (quickEdit as QuickEditConfig).saveImmediately,
          false,
          quickEdit as QuickEditConfig
        );
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
        const {quickEdit, name, label, translate: __, id} = this.props;
        let schema;
        const isline = (quickEdit as QuickEditConfig).mode === 'inline';

        if (quickEdit === true) {
          schema = {
            type: 'form',
            title: '',
            autoFocus: true,
            body: [
              {
                type: 'input-text',
                name,
                placeholder: label,
                label: false
              }
            ]
          };
        } else if (quickEdit) {
          if (quickEdit?.isFormMode) {
            schema = {
              mode: 'normal',
              type: 'form',
              wrapWithPanel: false,
              body: [
                {
                  ...omit(quickEdit, 'isFormMode'),
                  label: false
                }
              ]
            };
          } else if (
            quickEdit.body &&
            !~['combo', 'group', 'panel', 'fieldSet', 'fieldset'].indexOf(
              (quickEdit as any).type
            )
          ) {
            schema = {
              title: '',
              autoFocus: !isline,
              ...quickEdit,
              mode: 'normal',
              type: 'form'
            };
          } else {
            schema = {
              title: '',
              className: quickEdit.formClassName,
              type: 'form',
              autoFocus: !isline,
              mode: 'normal',
              body: [
                {
                  type: quickEdit.type || 'input-text',
                  name: quickEdit.name || name,
                  ...(isline ? {id: id} : {}),
                  ...quickEdit,
                  mode: undefined
                }
              ]
            };
          }
        }

        const isFormMode = (quickEdit as QuickEditConfig)?.isFormMode;

        if (schema) {
          schema = {
            ...schema,
            wrapWithPanel: !(isline || isFormMode),
            actions:
              isline || isFormMode
                ? []
                : [
                    {
                      type: 'button',
                      label: __('cancel'),
                      actionType: 'cancel'
                    },

                    {
                      label: __('confirm'),
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

          if (this.formItem) {
            this.formItem?.focus?.();
          } else if (this.form) {
            this.form?.focus?.();
          } else {
            this.openQuickEdit();
          }
        }
      }

      renderPopOver() {
        let {
          quickEdit,
          render,
          popOverContainer,
          classPrefix: ns,
          classnames: cx,
          canAccessSuperData
        } = this.props;

        const content = (
          <div
            ref={this.overlayRef}
            className={cx((quickEdit as QuickEditConfig).className)}
          >
            {render('quick-edit-form', this.buildSchema(), {
              value: undefined,
              defaultStatic: false,
              onSubmit: this.handleSubmit,
              onAction: this.handleAction,
              onChange: null,
              formLazyChange: false,
              ref: this.formRef,
              popOverContainer: () => this.overlay,
              canAccessSuperData,
              formStore: undefined
            })}
          </div>
        );

        popOverContainer = popOverContainer || (() => findDOMNode(this));

        return (
          <Overlay
            container={popOverContainer}
            target={() => this.target}
            onHide={this.closeQuickEdit}
            placement="left-top right-top left-bottom right-bottom left-top-right-top left-bottom-right-bottom left-top"
            show
          >
            <PopOver
              classPrefix={ns}
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

      renderInlineForm() {
        const {
          render,
          classnames: cx,
          canAccessSuperData,
          disabled,
          value,
          name
        } = this.props;

        const schema: any = this.buildSchema();

        // 有且只有一个表单项时，直接渲染表单项
        if (
          Array.isArray(schema.body) &&
          schema.body.length === 1 &&
          !schema.body[0].unique && // 唯一模式还不支持
          !schema.body[0].value && // 不能有默认值表达式什么的情况
          !schema.body[0]?.extraName &&
          schema.body[0].name &&
          schema.body[0].name === name &&
          schema.body[0].type &&
          getRendererByName(schema.body[0].type)?.isFormItem
        ) {
          return (
            <InlineFormItem
              {...this.props}
              schema={schema.body[0]}
              onChange={this.handleFormItemChange}
              onBulkChange={this.handleBulkChange}
              formItemRef={this.formItemRef}
            />
          );
        }

        return render('inline-form', schema, {
          value: undefined,
          wrapperComponent: 'div',
          className: cx('Form--quickEdit'),
          ref: this.formRef,
          simpleMode: true,
          onInit: this.handleInit,
          onChange: this.handleChange,
          onBulkChange: this.handleBulkChange,
          formLazyChange: false,
          canAccessSuperData,
          disabled,
          defaultStatic: false,
          // 不下发这下面的属性，否则当使用表格类型的 Picker 时（或其他会用到 Table 的自定义组件），会导致一些异常行为
          buildItemProps: null,
          // quickEditFormRef: null,
          // ^ 不知道为什么，这里不能阻挡下发，否则单测 Renderer:input-table formula 过不了
          quickEditFormItemRef: null
        });
      }

      render() {
        const {
          onQuickChange,
          quickEdit,
          quickEditEnabled,
          className,
          classnames: cx,
          render,
          noHoc,
          canAccessSuperData,
          disabled,
          static: isStatic
        } = this.props;

        // 静态渲染等情况也把 InputTable 相关的回调函数剔除，防止嵌套渲染表格时出问题
        const {
          buildItemProps,
          quickEditFormRef,
          quickEditFormItemRef,
          ...restProps
        } = this.props;
        if (
          isStatic ||
          !quickEdit ||
          !onQuickChange ||
          (!(typeof quickEdit === 'object' && quickEdit?.isQuickEditFormMode) &&
            quickEditEnabled === false) ||
          noHoc
          // 此处的readOnly会导致组件值无法传递出去，如 value: "${a + b}" 这样的 value 变化需要同步到数据域
          // || readOnly
        ) {
          return <Component {...restProps} formItemRef={this.formItemRef} />;
        }

        if (
          (quickEdit as QuickEditConfig).mode === 'inline' ||
          (quickEdit as QuickEditConfig).isFormMode
        ) {
          return (
            <Component
              {...restProps}
              className={cx(`Field--quickEditable`, className)}
              tabIndex={
                (quickEdit as QuickEditConfig).focusable === false
                  ? undefined
                  : '0'
              }
              onKeyUp={disabled ? noop : this.handleKeyUp}
            >
              {this.renderInlineForm()}
            </Component>
          );
        } else {
          return (
            <Component
              {...restProps}
              className={cx(`Field--quickEditable`, className, {
                in: this.state.isOpened
              })}
              tabIndex={
                (quickEdit as QuickEditConfig).focusable === false
                  ? undefined
                  : '0'
              }
              onKeyUp={disabled ? noop : this.handleKeyUp}
            >
              <Component {...restProps} contentsOnly noHoc />
              {disabled
                ? null
                : render('quick-edit-button', {
                    type: 'button',
                    tabIndex: '-1',
                    onClick: this.openQuickEdit,
                    className: 'Field-quickEditBtn',
                    icon: (quickEdit as QuickEditConfig).icon || 'edit',
                    level: 'link'
                  })}
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

export function InlineFormItem(
  props: RendererProps & {
    schema: any;
    onChange: Function;
    onBulkChange: Function;
    formItemRef: Function;
  }
) {
  const {
    render,
    schema,
    data,
    onChange,
    onBulkChange,
    formItemRef,
    canAccessSuperData
  } = props;

  canAccessSuperData &&
    React.useEffect(() => {
      const value = getPropValue(props);

      if (
        value &&
        value !== getPropValue({...props, canAccessSuperData: false})
      ) {
        onChange(value);
      }
    }, []);

  return render('inline-form-item', schema, {
    mode: 'normal',
    value: getPropValue(props) ?? '',
    onChange: onChange,
    onBulkChange: onBulkChange,
    formItemRef: formItemRef,
    defaultStatic: false,
    // 不下发下面的属性，否则当使用表格类型的 Picker 时（或其他会用到 Table 的自定义组件），会导致一些异常行为
    buildItemProps: null,
    quickEditFormRef: null,
    quickEditFormItemRef: null
  });
}
