import React from 'react';
import {
  OptionsControl,
  OptionsControlProps,
  FormOptionsControl,
  filter,
  getVariable
} from 'amis-core';
import {Option, TestIdBuilder} from 'amis-core';
import {ActionObject, isObject} from 'amis-core';
import type {BadgeObject} from 'amis-ui';
import {getLevelFromClassName, autobind, isEmpty} from 'amis-core';
import {ButtonGroupSchema} from '../ButtonGroup';
import {supportStatic} from './StaticHoc';

/**
 * 按钮组控件。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/button-group
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
  testIdBuilder?: TestIdBuilder;
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
    const {resetValue, onChange, formStore, store, name} = this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange('');
    } else if (actionType === 'reset') {
      const pristineVal =
        getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
      onChange(pristineVal ?? '');
    }
  }

  @autobind
  handleToggle(option: Option) {
    const {onToggle, multiple, autoFill, onBulkChange} = this.props;
    onToggle(option);
  }

  reload(subpath?: string, query?: any) {
    const reload = this.props.reloadOptions;
    reload && reload(subpath, query);
  }

  getBadgeConfig(config: BadgeObject, item: Option) {
    return config
      ? item?.badge &&
        (typeof item.badge === 'string' || typeof item.badge === 'number')
        ? {...config, text: item.badge}
        : item?.badge && isObject(item.badge)
        ? {...config, ...item.badge}
        : null
      : item.badge;
  }

  @supportStatic()
  render(props = this.props) {
    const {
      render,
      classPrefix: ns,
      classnames: cx,
      className,
      style,
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
      badge,
      testIdBuilder,
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
        const optionBadge = this.getBadgeConfig(badge, option);

        return render(
          `option/${key}`,
          {
            label: option[labelField || 'label'],
            icon: option.icon,
            size: option.size || size,
            badge: optionBadge,
            type: 'button',
            block: block
          },
          {
            key: key,
            level: (active ? btnActiveLevel : '') || option.level || btnLevel,
            className: cx(
              option.className,
              btnClassName,
              active && 'ButtonGroup-button--active'
            ),
            disabled: option.disabled || disabled,
            testIdBuilder: testIdBuilder?.getChild(
              `item-${option[labelField || 'label'] || key}`
            ),
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
      body = buttons.map((button, key) => {
        const buttonBadge = this.getBadgeConfig(badge, button);
        return render(
          `button/${key}`,
          {
            size: size,
            block: block,
            activeLevel: btnActiveLevel,
            level: btnLevel,
            disabled,
            ...button,
            badge: buttonBadge
          },
          {
            key,
            className: cx(button.className, btnClassName)
          }
        );
      });
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
