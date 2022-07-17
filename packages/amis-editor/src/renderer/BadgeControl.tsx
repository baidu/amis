/**
 * @file 角标控件
 */

import React from 'react';
import cx from 'classnames';
import camelCase from 'lodash/camelCase';
import mapKeys from 'lodash/mapKeys';
import {FormItem, Switch} from 'amis';

import {autobind, isObject, isEmpty, anyChanged} from 'amis-editor-core';
import {defaultValue} from 'amis-editor-core';

import type {FormControlProps} from 'amis-core';
import type {SchemaExpression} from 'amis/lib/Schema';
import { tipedLabel } from '../component/BaseControl';

export interface BadgeControlProps extends FormControlProps {
  /**
   * 角标类型
   */
  mode?: 'text' | 'dot' | 'ribbon';

  /**
   * 文本内容
   */
  text?: string | number;

  /**
   * 角标大小
   */
  size?: any;

  /**
   * 角标位置，优先级大于position
   */
  offset?: [number, number];

  /**
   * 角标位置
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  /**
   * 封顶的数字值
   */
  overflowCount?: number;

  /**
   * 动态控制是否显示
   */
  visibleOn?: SchemaExpression;

  /**
   * 是否显示动画
   */
  animation?: boolean;

  /**
   * 角标的自定义样式
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * 提示类型
   */
  level?: 'info' | 'warning' | 'success' | 'danger' | SchemaExpression;
}

interface BadgeControlState {
  checked: boolean;
}

interface BadgeForm
  extends Partial<
    Pick<
      BadgeControlProps,
      | 'mode'
      | 'text'
      | 'size'
      | 'position'
      | 'overflowCount'
      | 'visibleOn'
      | 'animation'
      | 'style'
      | 'level'
    >
  > {
  offset: [number, number];
}

export default class BadgeControl extends React.Component<
  BadgeControlProps,
  BadgeControlState
> {
  static defaultProps = {
    mode: 'dot',
    overflowCount: 99,
    position: 'top-right',
    level: 'danger',
    animation: false
  };

  constructor(props: BadgeControlProps) {
    super(props);

    this.state = {
      checked: !!isObject(props?.value)
    };
  }

  componentDidUpdate(prevProps: BadgeControlProps) {
    const props = this.props;

    if (
      anyChanged(
        [
          'mode',
          'text',
          'size',
          'offset',
          'position',
          'overflowCount',
          'visibleOn',
          'animation',
          'style',
          'level'
        ],
        prevProps?.value ?? {},
        props?.value ?? {}
      )
    ) {
      this.setState({checked: !!isObject(props?.value)});
    }
  }

  transformBadgeValue(): BadgeForm {
    const {data: ctx} = this.props;
    const badge = ctx?.badge ?? {};
    // 避免获取到上层的size
    const size = ctx?.badge?.size;
    const offset = [0, 0];

    // 转换成combo可以识别的格式
    if (Array.isArray(badge?.offset) && badge?.offset.length >= 2) {
      offset[0] = badge.offset[0];
      offset[1] = badge.offset[1];
    }

    return {...badge, size, offset};
  }

  normalizeBadgeValue(form: BadgeForm) {
    const offset =
      isObject(form?.offset) && form?.offset?.[0] && form?.offset?.[1]
        ? {offset: [form.offset[0], form.offset[1]]}
        : {};

    return {
      ...form,
      ...offset
    };
  }

  @autobind
  handleSwitchChange(checked: boolean): void {
    const {onChange, disabled} = this.props;

    if (disabled) {
      return;
    }

    this.setState({checked});
    onChange?.(checked ? {mode: 'dot'} : undefined);
  }

  handleSubmit(form: BadgeForm, action: any): void {
    const {onBulkChange} = this.props;

    if (action?.type === 'submit') {
      onBulkChange?.({badge: this.normalizeBadgeValue(form)});
    }
  }

  renderBody() {
    const {render} = this.props;
    const data = this.transformBadgeValue();

    return render(
      'badge-form',
      {
        type: 'form',
        className: 'ae-BadgeControl-form w-full',
        wrapWithPanel: false,
        panelClassName: 'border-none shadow-none mb-0',
        bodyClassName: 'p-none',
        actionsClassName: 'border-none mt-2.5',
        wrapperComponent: 'div',
        preventEnterSubmit: true,
        submitOnChange: true,
        body: [
          {
            label: '类型',
            name: 'mode',
            type: 'button-group-select',
            size: 'sm',
            mode: 'row',
            tiled: true,
            className: 'ae-BadgeControl-buttonGroup',
            options: [
              {label: '点', value: 'dot', icon: 'fa fa-circle'},
              {label: '文字', value: 'text', icon: 'fa fa-font'},
              {label: '缎带', value: 'ribbon', icon: 'fa fa-ribbon'}
            ],
            pipeIn: defaultValue('dot')
          },
          {
            label: '文本内容',
            name: 'text',
            type: 'input-text',
            mode: 'row',
            visibleOn: "data.mode !== 'dot'",
            pipeOut: (value: any) => {
              return Number.isNaN(Number(value)) || value === '' ? value : Number(value);
            }
          },
          {
            label: '角标主题',
            name: 'level',
            type: 'button-group-select',
            size: 'sm',
            mode: 'row',
            tiled: true,
            className: 'ae-BadgeControl-buttonGroup',
            options: [
              {label: '成功', value: 'success'},
              {label: '警告', value: 'warning'},
              {label: '危险', value: 'danger'},
              {label: '信息', value: 'info'}
            ],
            pipeIn: defaultValue('danger')
          },
          {
            label: '角标位置',
            name: 'position',
            type: 'button-group-select',
            size: 'sm',
            mode: 'row',
            tiled: true,
            className: 'ae-BadgeControl-buttonGroup',
            options: [
              {
                label: '',
                value: 'top-left',
                icon: 'fa fa-long-arrow-alt-up',
                className: 'ae-BadgeControl-position--antiClockwise'
              },
              {
                label: '',
                value: 'top-right',
                icon: 'fa fa-long-arrow-alt-up',
                className: 'ae-BadgeControl-position--clockwise'
              },
              {
                label: '',
                value: 'bottom-left',
                icon: 'fa fa-long-arrow-alt-down',
                className: 'ae-BadgeControl-position--clockwise'
              },
              {
                label: '',
                value: 'bottom-right',
                icon: 'fa fa-long-arrow-alt-down',
                className: 'ae-BadgeControl-position--antiClockwise'
              }
            ],
            pipeIn: defaultValue('top-right')
          },
          {
            type: 'input-group',
            mode: 'row',
            inputClassName: 'inline-flex justify-right flex-row-reverse',
            label: tipedLabel(
              '偏移量',
              '角标位置相对”水平“、”垂直“的偏移量'
            ),
            body: [
              {
                type: 'input-number',
                name: 'offset',
                suffix: 'px',
                pipeIn: (value: any) =>
                  Array.isArray(value) ? value[0] || 0 : 0,
                pipeOut: (value: any, oldValue: any, data: any) => [
                  value,
                  data.offset[1]
                ]
              },
              {
                type: 'input-number',
                name: 'offset',
                suffix: 'px',
                pipeIn: (value: any) =>
                  Array.isArray(value) ? value[1] || 0 : 0,
                pipeOut: (value: any, oldValue: any, data: any) => [
                  data.offset[0],
                  value
                ]
              }
            ]
          },
          {
            label: '自定义角标尺寸',
            name: 'size',
            type: 'switch',
            mode: 'row',
            inputClassName: 'inline-flex justify-between flex-row-reverse',
            pipeIn: (value: any) => !!value,
            pipeOut: (value: any, oldValue: any, data: any) =>
              value
                ? data?.mode === 'dot'
                  ? 6
                  : data?.mode === 'ribbon'
                  ? 12
                  : 16
                : undefined
          },
          {
            label: '',
            name: 'size',
            type: 'input-number',
            size: 'sm',
            mode: 'row',
            min: 1,
            max: 100,
            suffix: 'px',
            visibleOn: 'this.size',
            pipeIn: (value: any) => (typeof value === 'number' ? value : 0)
          },
          {
            label: tipedLabel('封顶数字', '尽在文本内容为数字下生效'),
            name: 'overflowCount',
            type: 'input-number',
            size: 'sm',
            mode: 'row',
            visibleOn: "data.mode === 'text'"
          },
          {
            label: '动画',
            name: 'animation',
            type: 'switch',
            mode: 'row',
            inputClassName: 'inline-flex justify-between flex-row-reverse'
          }
        ]
      },
      {
        data,
        onSubmit: this.handleSubmit.bind(this)
      }
    );
  }

  render() {
    const {
      classPrefix,
      className,
      labelClassName,
      label,
      disabled
    } = this.props;
    const {checked} = this.state;

    return (
      <div className={cx('ae-BadgeControl', className)}>
        <div className={cx('ae-BadgeControl-switch')}>
          <label className={cx(`${classPrefix}Form-label`, labelClassName)}>
            {label || '角标'}
          </label>
          <Switch
            value={checked}
            onChange={this.handleSwitchChange}
            disabled={disabled}
          />
        </div>
        {checked ? this.renderBody() : null}
      </div>
    );
  }
}

@FormItem({type: 'ae-badge', renderLabel: false})
export class BadgeControlRenderer extends BadgeControl {}
