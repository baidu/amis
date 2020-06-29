import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode, PlainObject} from '../types';
import {filter} from '../utils/tpl';
import cx from 'classnames';
import {Icon} from '../components/icons';

export interface StatusProps extends RendererProps {
  className?: string;
  placeholder?: string;
  map: PlainObject;
}

export class StatusField extends React.Component<StatusProps, object> {
  static defaultProps: Partial<StatusProps> = {
    placeholder: '-',
    map: {
      0: 'svg-fail',
      1: 'svg-success',
      success: 'svg-success',
      pending: 'rolling',
      fail: 'svg-fail',
      queue: 'svg-warning',
      schedule: 'svg-schedule'
    },
    labelMap: {
      success: '成功',
      pending: '运行中',
      fail: '失败',
      queue: '排队中',
      schedule: '调度中'
    }
  };

  render() {
    const {
      className,
      placeholder,
      map,
      labelMap,
      classnames: cx,
      data
    } = this.props;
    let value = this.props.value;
    let viewValue: React.ReactNode = (
      <span className="text-muted">{placeholder}</span>
    );
    let wrapClassName: string = '';

    if (value !== undefined && value !== '' && map) {
      if (typeof value === 'boolean') {
        value = value ? 1 : 0;
      } else if (/^\d+$/.test(value)) {
        value = parseInt(value, 10) || 0;
      }

      wrapClassName = `StatusField--${value}`;
      let itemClassName = map[value] || '';
      let svgIcon: string = '';

      itemClassName = itemClassName.replace(
        /\bsvg-([^\s|$]+)\b/g,
        (_: string, icon: string) => {
          svgIcon = icon;
          return 'icon';
        }
      );

      if (svgIcon) {
        viewValue = (
          <Icon
            icon={svgIcon}
            className={cx('Status-icon icon', itemClassName)}
            key="icon"
          />
        );
      } else if (itemClassName) {
        viewValue = (
          <i className={cx('Status-icon', itemClassName)} key="icon" />
        );
      }

      if (labelMap && labelMap[value]) {
        viewValue = [
          viewValue,
          <span className={cx('StatusField-label')} key="label">
            {filter(labelMap[value], data)}
          </span>
        ];
      }
    }

    return (
      <span className={cx('StatusField', wrapClassName, className)}>
        {viewValue}
      </span>
    );
  }
}

@Renderer({
  test: /(^|\/)status$/,
  name: 'status'
})
export class StatusFieldRenderer extends StatusField {}
