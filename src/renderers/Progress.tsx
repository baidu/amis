import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode, PlainObject} from '../types';
import {filter} from '../utils/tpl';
import cx from 'classnames';
import {BaseSchema, SchemaClassName} from '../Schema';

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
}

export interface ProgressProps extends RendererProps, ProgressSchema {
  map: Array<SchemaClassName>;
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
