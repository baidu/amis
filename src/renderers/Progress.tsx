import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode, PlainObject} from '../types';
import {filter} from '../utils/tpl';
import cx from 'classnames';
import {BaseSchema, SchemaClassName} from '../Schema';
import {getPropValue} from '../utils/helper';

/**
 * 进度展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/progress
 */
export interface ProgressSchema extends BaseSchema {
  type: 'progress';

  /**
   * 关联字段名。
   */
  name?: string;

  /**
   * 进度条 CSS 类名
   */
  progressClassName?: SchemaClassName;

  /**
   * 进度外层 CSS 类名
   */
  progressBarClassName?: SchemaClassName;

  /**
   * 配置不通的值段，用不通的样式提示用户
   */
  map?: Array<SchemaClassName>;

  /**
   * 是否显示值
   */
  showLabel?: boolean;

  /**
   * 占位符
   */
  placeholder?: string;

  /**
   * 是否显示背景间隔
   */
  stripe?: boolean;

  /**
   * 是否显示动画（只有在开启的时候才能看出来）
   */
  animate?: boolean;
}

export interface ProgressProps
  extends RendererProps,
    Omit<ProgressSchema, 'type' | 'className'> {
  map: Array<SchemaClassName>;
}

export class ProgressField extends React.Component<ProgressProps, object> {
  static defaultProps = {
    placeholder: '-',
    progressClassName: '',
    progressBarClassName: '',
    map: ['bg-danger', 'bg-warning', 'bg-info', 'bg-success', 'bg-success'],
    showLabel: true,
    stripe: false,
    animate: false
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
      stripe,
      animate,
      showLabel,
      classnames: cx
    } = this.props;

    let value = getPropValue(this.props);
    let viewValue: React.ReactNode = (
      <span className="text-muted">{placeholder}</span>
    );

    if (/^\d*\.?\d+$/.test(value)) {
      value = parseFloat(value);
    }

    if (typeof value === 'number') {
      viewValue = [
        <div key="progress" className={cx('Progress', progressClassName)}>
          <div
            className={cx(
              'Progress-bar',
              progressBarClassName || this.autoClassName(value),
              {'Progress-bar--stripe': stripe},
              {'Progress-bar--animate': animate}
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
  type: 'progress'
})
export class ProgressFieldRenderer extends ProgressField {}
