import React from 'react';
import {filter, Renderer, RendererProps} from 'amis-core';
import {isVisible, getWidthRate, makeHorizontalDeeper} from 'amis-core';
import {FormBaseControl, FormItemWrap} from 'amis-core';

import {
  FormBaseControlSchema,
  SchemaClassName,
  SchemaObject
} from '../../Schema';
import {FormHorizontal} from 'amis-core';
import {reaction} from 'mobx';

export type GroupSubControl = SchemaObject & {
  /**
   * 列类名
   */
  columnClassName?: SchemaClassName;

  /**
   * 宽度占用比率。在某些容器里面有用比如 group
   */
  columnRatio?: number | 'auto';

  /**
   * 列名称
   */
  name?: string;
};

/**
 * Group 表单集合渲染器，能让多个表单在一行显示
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/group
 */
export interface GroupControlSchema extends FormBaseControlSchema {
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
  reaction: any;
  constructor(props: InputGroupProps) {
    super(props);
    this.renderInput = this.renderInput.bind(this);

    const body = props.body;

    if (Array.isArray(body)) {
      // 监听statusStore更新
      this.reaction = reaction(
        () => {
          return body
            .map(item => {
              const id = filter(item.id, props.data);
              const name = filter(item.name, props.data);
              return `${
                props.statusStore.visibleState[id] ??
                props.statusStore.visibleState[name]
              }`;
            })
            .join('-');
        },
        () => this.forceUpdate()
      );
    }
  }

  componentWillUnmount(): void {
    this.reaction?.();
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
      disabled: control.disabled || disabled,
      formMode: subFormMode || mode || formMode,
      formHorizontal: subFormHorizontal || horizontal || formHorizontal,
      ...otherProps
    });
  }

  renderVertical(props = this.props) {
    let {
      body,
      className,
      style,
      classnames: cx,
      mode,
      formMode,
      data,
      statusStore
    } = props;
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
          if (!isVisible(control, data, statusStore)) {
            return null;
          }

          return this.renderControl(control, index, {
            key: `${control.name ?? ''}-${index}`
          });
        })}
      </div>
    );
  }

  renderHorizontal(props = this.props) {
    let {
      body,
      className,
      style,
      classPrefix: ns,
      classnames: cx,
      mode,
      horizontal,
      formMode,
      formHorizontal,
      subFormMode,
      subFormHorizontal,
      data,
      gap,
      statusStore
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
                isVisible(item, data, statusStore)
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
          if (!isVisible(control, data, statusStore)) {
            return null;
          }
          const controlMode = (control as FormBaseControl)?.mode || formMode;

          if (
            controlMode === 'inline' ||
            // hidden 直接渲染，否则会有个空 Form-groupColumn 层
            (control?.type &&
              ['formula', 'hidden'].includes((control as any).type))
          ) {
            return this.renderControl(control, index, {
              key: `${control.name ?? ''}-${index}`,
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
                key: `${control.name ?? ''}-${index}`,
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
