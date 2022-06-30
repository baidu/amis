import React from 'react';
import {
  OptionsControl,
  OptionsControlProps,
  FormOptionsControl
} from 'amis-core';
import type {Option} from 'amis-core';
import {ActionObject} from 'amis-core';
import {getLevelFromClassName, autobind, isEmpty} from 'amis-core';
import {ButtonGroupSchema} from '../ButtonGroup';

/**
 * 按钮组控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/button-group
 */
export interface ButtonGroupControlSchema
  extends Omit<ButtonGroupSchema, 'type'>,
    Omit<FormOptionsControl, 'size'> {
  type: 'button-group-select';
}

export interface ButtonGroupProps
  extends OptionsControlProps,
    Omit<
      ButtonGroupControlSchema,
      | 'size'
      | 'source'
      | 'type'
      | 'className'
      | 'descriptionClassName'
      | 'inputClassName'
      | 'btnClassName'
    > {
  options: Array<Option>;
}

export default class ButtonGroupControl extends React.Component<
  ButtonGroupProps,
  any
> {
  static defaultProps: Partial<ButtonGroupProps> = {
    btnLevel: 'default',
    btnActiveLevel: 'primary',
    clearable: false,
    vertical: false
  };

  doAction(action: ActionObject, data: object, throwErrors: boolean) {
    const {resetValue, onChange} = this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange('');
    } else if (actionType === 'reset') {
      onChange(resetValue ?? '');
    }
  }

  @autobind
  handleToggle(option: Option) {
    const {onToggle, multiple, autoFill, onBulkChange} = this.props;
    onToggle(option);
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  render(props = this.props) {
    const {
      render,
      classPrefix: ns,
      classnames: cx,
      className,
      disabled,
      options,
      value,
      labelField,
      placeholder,
      btnClassName,
      btnActiveClassName,
      selectedOptions,
      buttons,
      size,
      block,
      vertical,
      tiled,
      translate: __
    } = props;

    let body: Array<React.ReactNode> = [];
    let btnLevel = props.btnLevel;
    let btnActiveLevel = props.btnActiveLevel;

    btnClassName && (btnLevel = getLevelFromClassName(btnClassName));
    btnActiveClassName &&
      (btnActiveLevel = getLevelFromClassName(btnActiveClassName));

    if (options && options.length) {
      body = options.map((option, key) => {
        const active = !!~selectedOptions.indexOf(option);
        return render(
          `option/${key}`,
          {
            label: option[labelField || 'label'],
            icon: option.icon,
            size: option.size || size,
            type: 'button',
            block: block
          },
          {
            key: key,
            active,
            level: (active ? btnActiveLevel : '') || option.level || btnLevel,
            className: cx(option.className, btnClassName),
            disabled: option.disabled || disabled,
            onClick: (e: React.UIEvent<any>) => {
              if (disabled) {
                return;
              }
              this.handleToggle(option);
              e.preventDefault(); // 禁止 onAction 触发
            }
          }
        );
      });
    } else if (Array.isArray(buttons)) {
      body = buttons.map((button, key) =>
        render(
          `button/${key}`,
          {
            size: size,
            block: block,
            activeLevel: btnActiveLevel,
            level: btnLevel,
            disabled,
            ...button
          },
          {
            key,
            className: cx(button.className, btnClassName)
          }
        )
      );
    }

    return (
      <div
        className={cx(
          `ButtonGroup`,
          {
            'ButtonGroup--block': block,
            'ButtonGroup--vertical': vertical,
            'ButtonGroup--tiled': tiled,
            [`ButtonGroup--${size}`]: size
          },
          className
        )}
      >
        {body.length ? (
          body
        ) : (
          <span className={`${ns}ButtonGroup-placeholder`}>
            {__(placeholder)}
          </span>
        )}
      </div>
    );
  }
}

@OptionsControl({
  type: 'button-group-select',
  sizeMutable: false,
  strictMode: false
})
export class ButtonGroupControlRenderer extends ButtonGroupControl {}
