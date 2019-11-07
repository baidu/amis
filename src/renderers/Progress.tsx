import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode, PlainObject} from '../types';
import {filter} from '../utils/tpl';
import cx from 'classnames';

export interface ProgressProps extends RendererProps {
  className?: string;
  placeholder?: string;
  format?: string;
  valueFormat?: string;
  map: PlainObject;
}

export class ProgressField extends React.Component<ProgressProps, object> {
  static defaultProps = {
    placeholder: '-',
    progressClassName: 'progress-xs progress-striped active m-b-none',
    progressBarClassName: '',
    map: ['bg-danger', 'bg-warning', 'bg-info', 'bg-success', 'bg-success'],
    showLabel: true
  };

  autoClassName(value: number) {
    const map = this.props.map;
    let index = Math.floor((value * map.length) / 100);
    index = Math.max(0, Math.min(map.length - 1, index));
    return map[index];
  }

  render() {
    const {
      className,
      placeholder,
      progressClassName,
      progressBarClassName,
      map,
      showLabel,
      classnames: cx
    } = this.props;

    let value = this.props.value;
    let viewValue: React.ReactNode = (
      <span className="text-muted">{placeholder}</span>
    );

    if (/^\d*\.?\d+$/.test(value)) {
      value = parseFloat(value);
    }

    if (typeof value === 'number') {
      viewValue = [
        <div key="progress" className={cx('progress', progressClassName)}>
          <div
            className={cx(
              'progress-bar',
              progressBarClassName || this.autoClassName(value)
            )}
            title={`${value}%`}
            style={{
              width: `${value}%`
            }}
          />
        </div>,
        showLabel ? <div key="value">{value}%</div> : null
      ];
    }

    return <span className={cx('ProgressField', className)}>{viewValue}</span>;
  }
}

@Renderer({
  test: /(^|\/)progress$/,
  name: 'progress'
})
export class ProgressFieldRenderer extends ProgressField {}
