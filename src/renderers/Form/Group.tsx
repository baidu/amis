import React from 'react';
import {Renderer, RendererProps} from '../../factory';
import {Schema} from '../../types';
import {
  isVisible,
  getWidthRate,
  makeHorizontalDeeper
} from '../../utils/helper';
import cx from 'classnames';
import {FormBaseControl, FormControlSchema, FormItemWrap} from './Item';
import getExprProperties from '../../utils/filter-schema';
import {SchemaClassName} from '../../Schema';

export type GroupSubControl = FormControlSchema & {
  /**
   * 列类名
   */
  columnClassName?: SchemaClassName;

  /**
   * 宽度占用比率。在某些容器里面有用比如 group
   */
  columnRatio?: number;
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
  controls: Array<GroupSubControl>;

  /**
   * 子表单项默认的展示模式
   */
  formMode?: 'normal' | 'horizontal' | 'inline';

  /**
   * 间隔
   */
  gap?: 'xs' | 'sm' | 'normal';

  /**
   * 配置时垂直摆放还是左右摆放。
   */
  direction?: 'horizontal' | 'vertical';
}

export interface InputGroupProps
  extends RendererProps,
    Omit<GroupControlSchema, 'type'> {}

@Renderer({
  test: /(^|\/)form(?:\/.+)?\/control\/(?:\d+\/)?group$/,
  name: 'group-control'
})
export class ControlGroupRenderer extends React.Component<InputGroupProps> {
  constructor(props: InputGroupProps) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
  }

  renderControl(control: any, index: any, otherProps?: any) {
    const {render, disabled, data} = this.props;

    if (!control) {
      return null;
    }

    const subSchema: any =
      control && (control as Schema).type === 'control'
        ? control
        : {
            type: 'control',
            control
          };

    if (subSchema.control) {
      let control = subSchema.control as Schema;

      control = subSchema.control = {
        ...control,
        ...getExprProperties(control, data)
      };

      control.hiddenOn && (subSchema.hiddenOn = control.hiddenOn);
      control.visibleOn && (subSchema.visibleOn = control.visibleOn);
    }

    return render(`${index}`, subSchema, {
      ...otherProps,
      disabled
    });
  }

  renderVertical(props = this.props) {
    let {controls, className, classnames: cx, mode, formMode, data} = props;
    formMode = mode || formMode;

    return (
      <div
        className={cx(
          `Form-group Form-group--ver Form-group--${formMode}`,
          className
        )}
      >
        {controls.map((control, index) => {
          if (!isVisible(control, data)) {
            return null;
          }

          const controlMode = (control && control.mode) || formMode;

          return this.renderControl(control, index, {
            key: index,
            formMode: controlMode
          });
        })}
      </div>
    );
  }

  renderHorizontal(props = this.props) {
    let {
      controls,
      className,
      classPrefix: ns,
      classnames: cx,
      mode,
      horizontal,
      formMode,
      formHorizontal,
      data,
      gap
    } = props;

    if (!Array.isArray(controls)) {
      return null;
    }

    formMode = mode || formMode;

    let horizontalDeeper =
      horizontal ||
      makeHorizontalDeeper(
        formHorizontal,
        controls.filter(item => item.mode !== 'inline' && isVisible(item, data))
          .length
      );

    return (
      <div
        className={cx(
          `Form-group Form-group--hor Form-group--${formMode}`,
          gap ? `Form-group--${gap}` : '',
          className
        )}
      >
        {controls.map((control, index) => {
          if (!isVisible(control, data)) {
            return null;
          }
          const controlMode = (control && control.mode) || formMode;

          if (
            controlMode === 'inline' ||
            (control && (control as any).type === 'formula')
          ) {
            return this.renderControl(control, index, {
              formMode: 'inline',
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

    if (label) {
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
