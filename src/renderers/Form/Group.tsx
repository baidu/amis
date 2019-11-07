import React from 'react';
import {Renderer, RendererProps} from '../../factory';
import {Schema} from '../../types';
import {
  isVisible,
  getWidthRate,
  makeHorizontalDeeper
} from '../../utils/helper';
import cx from 'classnames';
import {FormItemWrap} from './Item';

export interface InputGroupProps extends RendererProps {
  formMode?: string;
  controls: Array<any>;
  gap?: 'xs' | 'sm' | 'normal';
  direction: 'horizontal' | 'vertical';
}

@Renderer({
  test: /(^|\/)form(?:\/.+)?\/control\/(?:\d+\/)?group$/,
  sizeMutable: false,
  name: 'group-control'
})
export class ControlGroupRenderer extends React.Component<InputGroupProps> {
  constructor(props: InputGroupProps) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
  }

  renderControl(control: any, index: any, otherProps?: any) {
    const {render} = this.props;

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
      control.hiddenOn && (subSchema.hiddenOn = control.hiddenOn);
      control.visibleOn && (subSchema.visibleOn = control.visibleOn);
    }

    return render(`${index}`, subSchema, {
      ...otherProps
    });
  }

  renderVertical(props = this.props) {
    let {controls, className, classnames: cx, mode, formMode, data} = props;

    formMode = mode || formMode;
    controls = controls.filter(item => isVisible(item, data));

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

    formMode = mode || formMode;

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
            (control && control.type === 'formula')
          ) {
            return this.renderControl(control, index, {
              formMode: 'inline',
              key: index,
              className: cx(control.className, control.columnClassName)
            });
          }

          const columnWidth =
            control.columnRatio ||
            getWidthRate(control && control.columnClassName);
          let horizontalDeeper =
            horizontal ||
            makeHorizontalDeeper(
              formHorizontal,
              controls.filter(item => item.mode !== 'inline').length
            );

          return (
            <div
              key={index}
              className={cx(
                `${ns}Form-groupColumn`,
                columnWidth ? `${ns}Form-groupColumn--${columnWidth}` : ''
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
          {...rest as any}
          sizeMutable={false}
          label={label}
          renderControl={this.renderInput}
        />
      );
    }

    return this.renderInput();
  }
}
