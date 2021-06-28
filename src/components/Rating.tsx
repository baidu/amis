/**
 * @file Rating
 * @description
 * @author fex
 */

import React from 'react';
import cx from 'classnames';
import {ClassNamesFn, themeable} from '../theme';

interface RatingProps {
  id?: string;
  key?: string | number;
  style?: React.CSSProperties;
  count: number;
  half: boolean;
  char: string;
  size: number;
  className?: string;
  onChange?: (value: any) => void;
  value: number;
  containerClass: string;
  readOnly: boolean;
  classPrefix: string;
  disabled?: boolean;
  allowClear?: boolean;
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
    char: '★',
    size: 24
  };

  constructor(props: RatingProps) {
    super(props);

    this.state = {
      value: props.value || 0,
      stars: [],
      isClear: false,
      halfStar: {
        at: Math.floor(props.value),
        hidden: props.half && props.value % 1 < 0.5
      }
    };

    this.getRate = this.getRate.bind(this);
    this.getStars = this.getStars.bind(this);
    this.moreThanHalf = this.moreThanHalf.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const {value} = this.state;
    this.setState({
      stars: this.getStars(value)
    });
  }

  componentDidUpdate(prevProps: RatingProps) {
    const props = this.props;

    if (props.value !== prevProps.value) {
      this.setState({
        stars: this.getStars(props.value),
        value: props.value,
        halfStar: {
          at: Math.floor(props.value),
          hidden: props.half && props.value % 1 < 0.5
        }
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

  mouseOver(event: React.ChangeEvent<any>) {
    const {isClear} = this.state;
    if (isClear) return;
    let {readOnly, size, half} = this.props;
    if (readOnly) return;
    let index = Number(event.target.getAttribute('data-index'));
    if (half) {
      const isAtHalf = this.moreThanHalf(event, size);
      if (isAtHalf) index = index + 1;
      this.setState({
        halfStar: {
          at: index,
          hidden: isAtHalf
        }
      });
    } else {
      index = index + 1;
    }
    this.setState({
      stars: this.getStars(index)
    });
  }

  moreThanHalf(event: any, size: number) {
    let {target} = event;
    let mouseAt = event.clientX - target.getBoundingClientRect().left;
    mouseAt = Math.round(Math.abs(mouseAt));
    return mouseAt > size / 2;
  }

  mouseLeave() {
    const {value, isClear} = this.state;
    const {half, readOnly} = this.props;
    if (readOnly) return;
    if (isClear) return this.setState({isClear: false});
    if (half) {
      this.setState({
        halfStar: {
          at: Math.floor(value),
          hidden: value % 1 === 0 // check value is decimal or not
        }
      });
    }
    this.setState({
      stars: this.getStars()
    });
  }

  handleClick(event: React.ChangeEvent<any>) {
    const {half, readOnly, onChange, size, allowClear} = this.props;
    if (readOnly) return;
    let index = Number(event.target.getAttribute('data-index'));

    let value;
    if (half) {
      const isAtHalf = this.moreThanHalf(event, size);
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
    onChange && onChange(value);
  }

  renderStars() {
    const {halfStar, stars} = this.state;
    const {char, half, disabled, readOnly, classnames: cx} = this.props;
    return stars.map((star: any, i: number) => {
      let className = cx('Rating', {
        'Rating-half': half && !halfStar.hidden && halfStar.at === i,
        'is-active': star.active,
        'is-disabled': readOnly || disabled
      });

      return (
        <span
          className={className}
          key={i}
          data-index={i}
          data-forhalf={char}
          onMouseOver={this.mouseOver}
          onMouseMove={this.mouseOver}
          onMouseLeave={this.mouseLeave}
          onClick={this.handleClick}
        >
          {char}
        </span>
      );
    });
  }

  render() {
    let {className} = this.props;

    return (
      <div className={cx(className ? className : '')}>{this.renderStars()}</div>
    );
  }
}

export default themeable(Rating);
