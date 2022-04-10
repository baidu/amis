import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import {autobind, createObject} from '../../utils/helper';
import {Action} from '../../types';
import Rating, {textPositionType} from '../../components/Rating';

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

  /**
   * 是否只读
   */
  readonly?: boolean;

  /**
   * 星星被选中的颜色
   */
  // colors?: string | {
  //   [propName: string | number]: string;
  // };

  colors?: string | {[propName: string]: string};

  /**
   * 未被选中的星星的颜色
   */
  inactiveColor?: string;

  /**
   * 星星被选中时的提示文字
   */
  texts?: {[propName: string]: string};

  /**
   * 文字的位置
   */
  textPosition?: textPositionType;

  /**
   * 自定义字符
   */
  char?: string;

  /**
   * 自定义字符类名
   */
  charClassName?: string;

  /**
   * 自定义文字类名
   */
  textClassName?: string;
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

  doAction(action: Action, data: object, throwErrors: boolean) {
    const {resetValue} = this.props;
    if (action.actionType && ['clear', 'reset'].includes(action.actionType)) {
      this.handleChange(resetValue ?? '');
    }
  }

  @autobind
  async handleChange(value: any) {
    const {onChange, dispatchEvent, data} = this.props;

    const rendererEvent = await dispatchEvent('change', createObject(data, {
      value
    }));

    if (rendererEvent?.prevented) {
      return;
    }
    
    onChange && onChange(value);
  }

  render() {
    const {
      className,
      value,
      count,
      half,
      readOnly,
      disabled,
      onHoverChange,
      allowClear,
      char,
      inactiveColor,
      colors,
      texts,
      charClassName,
      textClassName,
      textPosition,
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
          char={char}
          inactiveColor={inactiveColor}
          colors={colors}
          texts={texts}
          charClassName={charClassName}
          textClassName={textClassName}
          textPosition={textPosition}
          onChange={this.handleChange}
          onHoverChange={(value: number) => {
            onHoverChange && onHoverChange(value);
          }}
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
