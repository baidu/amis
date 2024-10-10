/**
 * @file 角标控件
 */

import React from 'react';
import cx from 'classnames';
import {FormItem, Switch} from 'amis';

import {
  autobind,
  isObject,
  isEmpty,
  anyChanged,
  getI18nEnabled
} from 'amis-editor-core';
import {defaultValue, tipedLabel, getSchemaTpl} from 'amis-editor-core';

import type {FormControlProps} from 'amis-core';
import type {SchemaExpression} from 'amis';

export interface BadgeControlProps extends FormControlProps {
  /**
   * 角标类型
   */
  mode?: 'text' | 'dot' | 'ribbon';
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
    level: 'danger'
  };

  constructor(props: BadgeControlProps) {
    super(props);

    this.state = {
      checked: !!isObject(props?.value)
    };
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
    const {onBulkChange, data} = this.props;

    this.setState({checked});
    if (checked) {
      if (data.badge) {
        onBulkChange?.({badge: data.badge});
      } else {
        onBulkChange?.({badge: {mode: 'dot'}});
      }
    } else {
      onBulkChange?.({badge: undefined});
    }
  }

  handleSubmit(form: BadgeForm, action: any): void {
    form.visibleOn = '${badge}';
    if (form.mode === 'dot') {
      form.text = undefined;
    } else {
      form.text = '${badge}';
    }
    const {onBulkChange} = this.props;
    if (action?.type === 'submit') {
      onBulkChange?.({badge: this.normalizeBadgeValue(form)});
    }
  }

  renderBody() {
    const {render} = this.props;
    const data = this.transformBadgeValue();
    const i18nEnabled = getI18nEnabled();
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
            label: '角标类型',
            name: 'mode',
            type: 'button-group-select',
            size: 'sm',
            tiled: true,
            className: 'ae-BadgeControl-buttonGroup',
            options: [
              {label: '点', value: 'dot'},
              {label: '文字', value: 'text'},
              {label: '缎带', value: 'ribbon'}
            ],
            mode: 'horizontal',
            horizontal: {
              justify: true,
              left: 4
            },
            pipeIn: defaultValue('dot')
          },
          {
            label: tipedLabel('封顶数字', '仅在文本内容为数字下生效'),
            name: 'overflowCount',
            type: 'input-number',
            size: 'sm',
            visibleOn: "data.mode === 'text'",
            mode: 'horizontal',
            horizontal: {
              justify: true,
              left: 4
            }
          },
          {
            label: '大小',
            name: 'size',
            type: 'input-number',
            size: 'sm',
            suffix: 'px',
            mode: 'horizontal',
            horizontal: {
              justify: true,
              left: 4
            }
          },

          {
            label: '主题',
            name: 'level',
            type: 'select',
            size: 'sm',
            mode: 'horizontal',
            horizontal: {
              justify: true,
              left: 4
            },
            tiled: true,
            className: 'input-select',
            options: [
              {label: '成功', value: 'success'},
              {label: '警告', value: 'warning'},
              {label: '危险', value: 'danger'},
              {label: '信息', value: 'info'}
            ],
            pipeIn: defaultValue('danger')
          },
          {
            label: '位置',
            name: 'position',
            type: 'select',
            size: 'sm',
            mode: 'horizontal',
            horizontal: {
              justify: true,
              left: 4
            },
            tiled: true,
            className: 'input-select',
            options: [
              {
                label: '左上角',
                value: 'top-left'
              },
              {
                label: '右上角',
                value: 'top-right'
              },
              {
                label: '左下角',
                value: 'bottom-left'
              },
              {
                label: '右下角',
                value: 'bottom-right'
              }
            ],
            pipeIn: defaultValue('top-right')
          },
          {
            type: 'group',
            mode: 'horizontal',
            horizontal: {
              justify: true,
              left: 4
            },
            label: tipedLabel('偏移量', '角标位置相对”水平“、”垂直“的偏移量'),
            body: [
              {
                type: 'input-text',
                name: 'offset[0]',
                label: false,
                addOn: {
                  label: 'X',
                  type: 'text',
                  position: 'left'
                },
                validateOnChange: true,
                validations: {
                  isNumeric: true
                }
              },
              {
                type: 'input-text',
                label: false,
                name: 'offset[1]',
                addOn: {
                  label: 'Y',
                  type: 'text',
                  position: 'left'
                },
                validateOnChange: true,
                validations: {
                  isNumeric: true
                }
              }
            ]
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
    const {classPrefix, className, labelClassName, label, disabled, render} =
      this.props;
    const {checked} = this.state;

    return (
      <div className={cx('ae-BadgeControl', className)}>
        {render(
          '',
          getSchemaTpl('switch', {
            label: tipedLabel(
              '角标',
              '此处配置角标样式，需同时在菜单项中配置角标内容后角标生效'
            ),
            name: 'checked',
            mode: 'horizontal',
            value: checked,
            onChange: (checked: boolean) => this.handleSwitchChange(checked)
          })
        )}
        {checked ? this.renderBody() : null}
      </div>
    );
  }
}

@FormItem({type: 'ae-nav-badge', renderLabel: false})
export class BadgeControlRenderer extends BadgeControl {}
