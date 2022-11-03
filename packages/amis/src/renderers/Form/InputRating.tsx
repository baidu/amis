import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData
} from 'amis-core';
import {autobind, createObject, tokenize, toNumber} from 'amis-core';
import {ActionObject} from 'amis-core';
import {Rating} from 'amis-ui';
import type {textPositionType} from 'amis-ui/lib/components/Rating';
import {FormBaseControlSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';

/**
 * Rating
 * 文档：https://baidu.gitee.io/amis/docs/components/form/rating
 */
export interface RatingControlSchema extends FormBaseControlSchema {
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

  doAction(action: ActionObject, data: object, throwErrors: boolean) {
    const actionType = action?.actionType as string;
    const {onChange, resetValue} = this.props;

    if (actionType === 'clear') {
      onChange?.('');
    } else if (actionType === 'reset') {
      onChange?.(resetValue ?? '');
    }
  }

  @autobind
  async handleChange(value: any) {
    const {onChange, dispatchEvent} = this.props;

    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value}, 'value')
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onChange?.(value);
  }

  renderStatic() {
    const {
      className,
      value,
      count,
      half,
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
          disabled={true}
          count={count}
          half={half}
          char={char}
          inactiveColor={inactiveColor}
          colors={colors}
          texts={texts}
          charClassName={charClassName}
          textClassName={textClassName}
          textPosition={textPosition}
        />
      </div>
    );
  }

  @supportStatic()
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

    let finalCount: number = getFinalCount(count, this.props.data);
    // 限制最大 100 星，避免渲染卡死问题
    finalCount > 100 && (finalCount = 100);

    return (
      <div className={cx('RatingControl', className)}>
        <Rating
          classnames={cx}
          value={value}
          disabled={disabled}
          count={finalCount}
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

function getFinalCount(name: number | string, data: any): number {
  if (typeof name === 'number') {
    return name;
  }

  return toNumber(tokenize(name, data));
}

@FormItem({
  type: 'input-rating',
  sizeMutable: false,
  shouldComponentUpdate: (props: any, prevProps: any) =>
    getFinalCount(props.count, props.data) !==
    getFinalCount(prevProps.count, prevProps.data),
  detectProps: [
    'half',
    'allowClear',
    'colors',
    'inactiveColor',
    'texts',
    'textPosition',
    'char'
  ]
})
export class RatingControlRenderer extends RatingControl {}
