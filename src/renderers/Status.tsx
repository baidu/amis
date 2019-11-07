import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode, PlainObject} from '../types';
import {filter} from '../utils/tpl';
import cx from 'classnames';

export interface StatusProps extends RendererProps {
  className?: string;
  placeholder?: string;
  map: PlainObject;
}

export class StatusField extends React.Component<StatusProps, object> {
  static defaultProps: Partial<StatusProps> = {
    placeholder: '-',
    map: {
      0: 'fa fa-times text-danger',
      1: 'fa fa-check text-success'
    },
    labelMap: {
      // 0: '失败',
      // 1: '成功'
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
      viewValue = (
        <i className={cx('StatusField-icon', map[value])} key="icon" />
      );

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
