import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {isVisible, getWidthRate, makeHorizontalDeeper} from 'amis-core';
import {FormBaseControl, FormItemWrap} from 'amis-core';

import {SchemaClassName, SchemaObject} from '../../Schema';
import Form, {FormHorizontal} from 'amis-core';

export type GroupSubControl = SchemaObject & {
  /**
   * 列类名
   */
  columnClassName?: SchemaClassName;

  /**
   * 宽度占用比率。在某些容器里面有用比如 group
   */
  columnRatio?: number | 'auto';
};

/**
 * Group 表单集合渲染器，能让多个表单在一行显示
 * 文档：https://baidu.gitee.io/amis/docs/components/form/group
 */
export interface GroupControlSchema extends FormBaseControl {
  type: 'group';

  /**
   * FormItem 集合
   */
  body: Array<GroupSubControl>;

  /**
   * 间隔
   */
  gap?: 'xs' | 'sm' | 'normal';

  /**
   * 配置时垂直摆放还是左右摆放。
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * 配置子表单项默认的展示方式。
   */
  subFormMode?: 'normal' | 'inline' | 'horizontal';
  /**
   * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
   */
  subFormHorizontal?: FormHorizontal;
}

export interface InputGroupProps
  extends RendererProps,
    Omit<GroupControlSchema, 'type' | 'className'> {}

@Renderer({
  type: 'group'
})
export class ControlGroupRenderer extends React.Component<InputGroupProps> {
  constructor(props: InputGroupProps) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
  }

  renderControl(control: any, index: any, otherProps?: any) {
    const {
      render,
      disabled,
      data,
      mode,
      horizontal,
      formMode,
      formHorizontal,
      subFormMode,
      subFormHorizontal
    } = this.props;

    if (!control) {
      return null;
    }

    const subSchema: any = control;

    return render(`${index}`, subSchema, {
      disabled,
      formMode: subFormMode || mode || formMode,
      formHorizontal: subFormHorizontal || horizontal || formHorizontal,
      ...otherProps
    });
  }

  renderVertical(props = this.props) {
    let {body, className, classnames: cx, mode, formMode, data} = props;
    formMode = mode || formMode;

    if (!Array.isArray(body)) {
      return null;
    }

    return (
      <div
        className={cx(
          `Form-group Form-group--ver Form-group--${formMode}`,
          className
        )}
      >
        {body.map((control, index) => {
          if (!isVisible(control, data)) {
            return null;
          }

          return this.renderControl(control, index, {
            key: index
          });
        })}
      </div>
    );
  }

  renderHorizontal(props = this.props) {
    let {
      body,
      className,
      classPrefix: ns,
      classnames: cx,
      mode,
      horizontal,
      formMode,
      formHorizontal,
      subFormMode,
      subFormHorizontal,
      data,
      gap
    } = props;

    if (!Array.isArray(body)) {
      return null;
    }

    formMode = subFormMode || mode || formMode;

    let horizontalDeeper =
      subFormHorizontal ||
      horizontal ||
      (formHorizontal
        ? makeHorizontalDeeper(
            formHorizontal,
            body.filter(
              item =>
                (item as FormBaseControl)?.mode !== 'inline' &&
                isVisible(item, data)
            ).length
          )
        : undefined);

    return (
      <div
        className={cx(
          `Form-group Form-group--hor Form-group--${formMode}`,
          gap ? `Form-group--${gap}` : '',
          className
        )}
      >
        {body.map((control, index) => {
          if (!isVisible(control, data)) {
            return null;
          }
          const controlMode = (control as FormBaseControl)?.mode || formMode;

          if (
            controlMode === 'inline' ||
            (control && (control as any).type === 'formula')
          ) {
            return this.renderControl(control, index, {
              key: index,
              className: cx(control.className, control.columnClassName)
            });
          }

          const columnWidth =
            control.columnRatio ||
            getWidthRate(control && control.columnClassName, true);

          return (
            <div
              key={index}
              className={cx(
                `${ns}Form-groupColumn`,
                columnWidth ? `${ns}Form-groupColumn--${columnWidth}` : '',
                control && control.columnClassName
              )}
            >
              {this.renderControl(control, index, {
                formHorizontal: horizontalDeeper,
                formMode: controlMode
              })}
            </div>
          );
        })}
      </div>
    );
  }

  renderInput(props = this.props) {
    const direction = props.direction;
    return direction === 'vertical'
      ? this.renderVertical(props)
      : this.renderHorizontal(props);
  }

  render() {
    const {label, ...rest} = this.props;

    if (typeof label !== 'undefined') {
      return (
        <FormItemWrap
          {...(rest as any)}
          sizeMutable={false}
          label={label}
          renderControl={this.renderInput}
        />
      );
    }

    return this.renderInput();
  }
}
