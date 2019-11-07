import React from 'react';
import {FormItem, FormControlProps} from './Item';
import Rating from '../../components/Rating';

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
      onChange,
      size,
      classnames: cx
    } = this.props;

    return (
      <div className={cx('RatingControl', className)}>
        <Rating
          classnames={cx}
          value={value}
          count={count}
          half={half}
          readOnly={readOnly}
          size={size}
          onChange={(value: any) => onChange(value)}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'rating',
  sizeMutable: false
})
export class RatingControlRenderer extends RatingControl {}
