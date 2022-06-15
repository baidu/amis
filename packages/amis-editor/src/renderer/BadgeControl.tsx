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
  offset?: [number | string, number | string];

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
  offset: {x: number; y: number};
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
    const offset = {x: 0, y: 0};

    // 转换成combo可以识别的格式
    if (Array.isArray(badge?.offset) && badge?.offset.length >= 2) {
      offset.x = badge?.offset[0];
      offset.y = badge?.offset[1];
    }

    return {...badge, size, offset};
  }

  normalizeBadgeValue(form: BadgeForm) {
    const offset =
      isObject(form?.offset) && form?.offset?.x && form?.offset?.y
        ? {offset: [form.offset.x, form.offset.y]}
        : {};
    const style =
      isObject(form?.style) && !isEmpty(form?.style)
        ? {
            style: mapKeys(form?.style, (value, key) => {
              return camelCase(key);
            })
          }
        : {};

    return {
      ...form,
      ...offset,
      ...style
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
            size: 'xs',
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
            visibleOn: "data.mode !== 'dot'"
          },
          {
            label: '角标主题色',
            name: 'level',
            type: 'button-group-select',
            size: 'xs',
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
            size: 'xs',
            mode: 'row',
            tiled: true,
            className: 'ae-BadgeControl-buttonGroup',
            options: [
              {
                label: '左上',
                value: 'top-left',
                icon: 'fa fa-long-arrow-alt-up',
                className: 'ae-BadgeControl-position--antiClockwise'
              },
              {
                label: '右上',
                value: 'top-right',
                icon: 'fa fa-long-arrow-alt-up',
                className: 'ae-BadgeControl-position--clockwise'
              },
              {
                label: '左下',
                value: 'bottom-left',
                icon: 'fa fa-long-arrow-alt-down',
                className: 'ae-BadgeControl-position--clockwise'
              },
              {
                label: '右下',
                value: 'bottom-right',
                icon: 'fa fa-long-arrow-alt-down',
                className: 'ae-BadgeControl-position--antiClockwise'
              }
            ],
            pipeIn: defaultValue('top-right')
          },
          {
            type: 'group',
            className: 'ae-BadgeControl-offset',
            body: [
              {
                label: '水平偏移量',
                name: 'offset.x',
                type: 'input-number',
                suffix: 'px',
                step: 1
              },
              {
                label: '垂直偏移量',
                name: 'offset.y',
                type: 'input-number',
                suffix: 'px',
                step: 1
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
            label: '封顶数字',
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
