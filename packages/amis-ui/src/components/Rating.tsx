/**
 * @file Rating
 * @description
 * @author fex
 */

import React from 'react';
import {ClassNamesFn, themeable} from 'amis-core';
import {isObject} from 'amis-core';
import {validations} from 'amis-core';
import {Icon} from './icons';
import {isObjectShallowModified} from 'amis-core';
import isEmpty from 'lodash/isEmpty';

export type textPositionType = 'left' | 'right';

interface RatingProps {
  id?: string;
  key?: string | number;
  style?: React.CSSProperties;
  count: number;
  half: boolean;
  char: string | React.ReactNode;
  className?: string;
  charClassName?: string;
  textClassName?: string;
  onChange?: (value: number) => void;
  onHoverChange?: (value: number) => void;
  value: number;
  containerClass?: string;
  readOnly: boolean;
  classPrefix: string;
  disabled?: boolean;
  allowClear?: boolean;
  inactiveColor?: string;
  colors?: string | {[propName: string]: string};
  texts?: {[propName: string]: string};
  textPosition?: textPositionType;
  classnames: ClassNamesFn;
}

export class Rating extends React.Component<RatingProps, any> {
  static defaultProps = {
    containerClass: 'rating',
    readOnly: false,
    half: true,
    allowClear: true,
    value: 0,
    count: 5,
    char: <Icon icon="star" className="icon" iconContent="Rating-star-icon" />,
    colors: '',
    textPosition: 'right' as textPositionType
  };
  ratingRef = React.createRef<HTMLDivElement>();

  starsNode: Record<string, any>;

  constructor(props: RatingProps) {
    super(props);

    this.starsNode = {};

    this.state = {
      value: props.value || 0,
      stars: [],
      isClear: false,
      halfStar: {
        at: Math.floor(props.value),
        hidden: props.half && props.value % 1 < 0.5
      },
      showColor: '',
      showText: null,
      hoverValue: null
    };

    this.getRate = this.getRate.bind(this);
    this.getStars = this.getStars.bind(this);
    this.moreThanHalf = this.moreThanHalf.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.saveRef = this.saveRef.bind(this);
    this.handleStarMouseLeave = this.handleStarMouseLeave.bind(this);
  }

  componentDidMount() {
    const {value} = this.state;
    this.setState({
      stars: this.getStars(value)
    });

    this.getShowColorAndText(value);
  }

  componentDidUpdate(prevProps: RatingProps) {
    const props = this.props;

    if (
      isObjectShallowModified(
        {
          value: props.value,
          count: props.count
        },
        {
          value: prevProps.value,
          count: prevProps.count
        }
      )
    ) {
      this.setState(
        {
          stars: this.getStars(props.value),
          value: props.value,
          halfStar: {
            at: Math.floor(props.value),
            hidden: props.half && props.value % 1 < 0.5
          }
        },
        () => {
          this.getShowColorAndText(props.value);
        }
      );
    } else if (
      isObjectShallowModified(props.colors, prevProps.colors) ||
      isObjectShallowModified(props.texts, prevProps.texts)
    ) {
      this.getShowColorAndText(props.value);
    }
  }

  sortKeys(map: {[propName: number]: string}) {
    // 需验证 key 是否是数字，需要过滤掉非数字key，如 $$id
    return Object.keys(map)
      .filter(item => validations.isNumeric({}, item))
      .sort((a: number | string, b: number | string) => Number(a) - Number(b));
  }

  getShowColorAndText(value: number) {
    const {colors, texts, half} = this.props;
    let tempColor = colors;
    if (this.ratingRef.current) {
      const style = getComputedStyle(this.ratingRef.current);
      let defaultColors = [];
      try {
        defaultColors = JSON.parse(
          JSON.parse(style.getPropertyValue('content'))
        );
      } catch (e) {
        console.warn(e);
      }
      const obj: any = {};
      defaultColors.forEach((item: any) => {
        obj[item.id] = item.value;
      });
      if (isEmpty(colors) && !isEmpty(obj)) {
        tempColor = obj;
      }
    }
    if (!value)
      return this.setState({
        showText: null
      });

    // 对 value 取整
    if (half) {
      value = Math.floor(Number(value) * 2) / 2;
    } else {
      value = Math.floor(value);
    }

    if (tempColor && typeof tempColor !== 'string') {
      const keys: string[] = this.sortKeys(tempColor);
      const showKey = keys.filter(item => Number(item) < value).length;

      const showColor = keys[showKey] !== undefined && tempColor[keys[showKey]];

      // 取最大 key 的颜色，避免如下情况：tempColor 只设置了 1-4，value 为 5，导致取不到颜色而无法显示
      const lastColor = keys.length && tempColor[keys[keys.length - 1]];

      this.setState({
        showColor: showColor || lastColor || ''
      });
    } else if (tempColor && typeof tempColor === 'string') {
      this.setState({
        showColor: tempColor
      });
    }

    if (texts && isObject(texts)) {
      const keys: string[] = this.sortKeys(texts);
      const showKey = keys.filter(item => Number(item) < value).length;
      const showText =
        keys[showKey] !== undefined &&
        texts[keys[showKey] as keyof typeof texts];

      this.setState({
        showText: showText || ''
      });
    }
  }

  getRate() {
    let stars;
    const {value} = this.state;
    const {half} = this.props;
    if (half) {
      stars = Math.floor(value);
    } else {
      stars = Math.round(value);
    }
    return stars;
  }

  getStars(activeCount?: number) {
    if (typeof activeCount === 'undefined') {
      activeCount = this.getRate();
    }
    let stars = [];
    const {count} = this.props;
    for (let i = 0; i < count; i++) {
      stars.push({
        active: i <= activeCount - 1
      });
    }
    return stars;
  }

  saveRef(index: number) {
    return (node?: HTMLLIElement | null) => {
      this.starsNode[String(index)] = node;
    };
  }

  mouseOver(event: React.ChangeEvent<any>, index: number) {
    const {isClear} = this.state;
    if (isClear) return;

    const {readOnly, half} = this.props;

    if (readOnly) return;

    if (half) {
      const isAtHalf = this.moreThanHalf(event, index);

      const tmpValue = isAtHalf ? index + 1 : index + 0.5;

      this.getShowColorAndText(tmpValue);
      this.onHoverChange(tmpValue);

      if (isAtHalf) index = index + 1;
      this.setState({
        halfStar: {
          at: index,
          hidden: isAtHalf
        }
      });
    } else {
      index = index + 1;
      this.onHoverChange(index);
      this.getShowColorAndText(index);
    }
    this.setState({
      stars: this.getStars(index)
    });
  }

  onHoverChange(value: number) {
    const {onHoverChange} = this.props;
    const {hoverValue} = this.state;

    if (!hoverValue || (hoverValue && hoverValue !== value)) {
      this.setState({
        hoverValue: value
      });
      onHoverChange && onHoverChange(value);
    }
  }

  moreThanHalf(event: any, index: number) {
    const star = this.starsNode[index];
    const leftPos = star.getBoundingClientRect().left;

    return event.clientX - leftPos > star.clientWidth / 2;
  }

  mouseLeave() {
    const {value, isClear} = this.state;
    const {half, readOnly} = this.props;
    if (readOnly) return;
    if (isClear)
      return this.setState({
        isClear: false,
        hoverValue: null
      });

    if (half) {
      this.setState({
        halfStar: {
          at: Math.floor(value),
          hidden: value % 1 === 0 // check value is decimal or not
        }
      });
    }
    this.setState({
      stars: this.getStars(),
      hoverValue: null
    });
    this.getShowColorAndText(value);
  }

  handleStarMouseLeave(event: any, index: number) {
    const star = this.starsNode[index];
    const leftSideX = star.getBoundingClientRect().left;
    const {isClear} = this.state;

    if (isClear) return this.setState({isClear: false});

    // leave star from left side
    if (event.clientX <= leftSideX) {
      this.getShowColorAndText(index);
      this.setState({
        stars: this.getStars(index),
        halfStar: {
          at: index,
          hidden: true
        }
      });
    }
  }

  handleClick(event: React.ChangeEvent<any>, index: number) {
    const {half, readOnly, onChange, allowClear} = this.props;
    if (readOnly) return;

    let value;
    if (half) {
      const isAtHalf = this.moreThanHalf(event, index);
      if (isAtHalf) index = index + 1;
      value = isAtHalf ? index : index + 0.5;
      this.setState({
        halfStar: {
          at: index,
          hidden: isAtHalf
        }
      });
    } else {
      value = index = index + 1;
    }

    const isClear = allowClear && value === this.state.value;
    if (isClear) value = index = 0;
    this.setState({
      value,
      stars: this.getStars(index),
      isClear
    });

    this.getShowColorAndText(value);

    onChange && onChange(value);
  }

  renderStars() {
    const {halfStar, stars, showColor} = this.state;
    const {
      inactiveColor,
      char,
      half,
      disabled,
      readOnly,
      charClassName,
      classnames: cx
    } = this.props;

    return (
      <ul onMouseLeave={this.mouseLeave}>
        {stars.map((star: any, i: number) => {
          const isThisHalf = half && !halfStar.hidden && halfStar.at === i;

          return (
            <li
              ref={this.saveRef(i)}
              className={cx('Rating-star', charClassName, {
                'is-half': isThisHalf,
                'is-active': star.active,
                'is-disabled': readOnly || disabled
              })}
              key={i}
              style={{
                color: star.active ? showColor : inactiveColor
              }}
              onMouseOver={e => this.mouseOver(e, i)}
              onMouseMove={e => this.mouseOver(e, i)}
              onClick={e => this.handleClick(e, i)}
              onMouseLeave={e => this.handleStarMouseLeave(e, i)}
            >
              {isThisHalf && (
                <div
                  className={cx('Rating-star-half')}
                  style={{
                    color: showColor
                  }}
                >
                  {char}
                </div>
              )}
              {char}
            </li>
          );
        })}
      </ul>
    );
  }

  renderText() {
    const {showText} = this.state;
    const {textClassName, textPosition, classnames: cx} = this.props;

    if (!showText) return null;

    return (
      <span
        className={cx('Rating-text', textClassName, {
          [`Rating-text--${textPosition === 'left' ? 'left' : 'right'}`]:
            textPosition
        })}
      >
        {showText}
      </span>
    );
  }

  render() {
    const {className, textPosition, classnames: cx} = this.props;

    return (
      <div className={cx('Rating', className)} ref={this.ratingRef}>
        {textPosition === 'left' ? (
          <>
            {this.renderText()}
            {this.renderStars()}
          </>
        ) : (
          <>
            {this.renderStars()}
            {this.renderText()}
          </>
        )}
      </div>
    );
  }
}

export default themeable(Rating);
