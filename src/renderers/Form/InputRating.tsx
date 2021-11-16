import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import Rating from '../../components/Rating';

/**
 * Rating
 * 文档：https://baidu.gitee.io/amis/docs/components/form/rating
 */
export interface RatingControlSchema extends FormBaseControl {
  type: 'input-rating';

  /**
   * 分数
   */
  count?: number;

  /**
   * 允许半颗星
   */
  half?: boolean;

  /**
   * 是否允许再次点击后清除
   */
  allowClear?: boolean;
}

export interface RatingProps extends FormControlProps {
  value: number;
  count: number;
  half: boolean;
  readOnly: boolean;
}

export default class RatingControl extends React.Component<RatingProps, any> {
  static defaultProps: Partial<RatingProps> = {
    value: 0,
    count: 5,
    half: false,
    readOnly: false
  };

  render() {
    const {
      className,
      value,
      count,
      half,
      readOnly,
      disabled,
      onChange,
      size,
      allowClear,
      classnames: cx
    } = this.props;

    return (
      <div className={cx('RatingControl', className)}>
        <Rating
          classnames={cx}
          value={value}
          disabled={disabled}
          count={count}
          half={half}
          allowClear={allowClear}
          readOnly={readOnly}
          onChange={(value: any) => onChange(value)}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'input-rating',
  sizeMutable: false
})
export class RatingControlRenderer extends RatingControl {}
