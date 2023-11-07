import React from 'react';
import {
  ThemeProps,
  themeable,
  localeable,
  LocaleProps,
  autobind
} from 'amis-core';

interface DragProgrocessProp extends ThemeProps, LocaleProps {
  value: number;
  onChange?: (value?: number) => void;
  skin: 'light' | 'dark';
}

interface DragProgrocessState {
  left: number;
  precent: number;
}

const dragWidth = 160;
const dragBtnWidth = 16;
const leftStartPoint = -(dragBtnWidth / 2);
const leftEndPoint = dragWidth + leftStartPoint;
const getLeftByValue = (value: number) => {
  return value * dragWidth + leftStartPoint;
};
const getPrecentByLeft = (left: number) => {
  return Math.round(((left - leftStartPoint) / dragWidth) * 100);
};

/**
 * 拖动组件
 */
class DragProgress extends React.PureComponent<
  DragProgrocessProp,
  DragProgrocessState
> {
  isDragging: boolean = false;
  previousX: number;

  static defaultProps: Pick<DragProgrocessProp, 'skin'> = {
    skin: 'light'
  };

  constructor(props: DragProgrocessProp) {
    super(props);

    const left = props?.value ? getLeftByValue(props.value) : leftStartPoint;
    this.state = {
      left,
      precent: getPrecentByLeft(left)
    };

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  @autobind
  handleMouseDown(e: React.SyntheticEvent<HTMLDivElement>) {
    this.isDragging = true;
    const target: any = e.nativeEvent;
    if (target?.clientX) {
      this.previousX = target.clientX;
    }
  }

  @autobind
  handleMouseUp() {
    this.isDragging = false;
  }

  @autobind
  handleMouseMove(target: MouseEvent) {
    if (this.isDragging) {
      const {left} = this.state;
      if (target?.clientX) {
        const distance = target.clientX - this.previousX;
        let finalLeft = left + distance;
        if (finalLeft <= leftStartPoint) {
          finalLeft = leftStartPoint;
        } else if (finalLeft > leftEndPoint) {
          finalLeft = leftEndPoint;
        }
        this.setState(
          {
            left: finalLeft,
            precent: getPrecentByLeft(left)
          },
          () => this.handleDrag(target.clientX)
        );
      }
    }
  }

  @autobind
  handleDrag(clientX: number) {
    this.previousX = clientX;
    const {precent} = this.state;
    this.props?.onChange?.(precent);
  }

  render() {
    const {classnames: cx, skin} = this.props;
    const {left, precent} = this.state;

    return (
      <div className={cx('DrapProgress', `DrapProgress-${skin}`)}>
        <div
          className={cx('DrapProgress-wrap')}
          style={{width: `${dragWidth}px`}}
        >
          <div className={cx('DrapProgress-wrap-line')}>
            <div
              className={cx('DrapProgress-wrap-line-highlight')}
              style={{width: `${precent}%`}}
            ></div>
          </div>
          <div
            className={cx('DrapProgress-wrap-item')}
            onMouseDown={this.handleMouseDown}
            style={{
              width: `${dragBtnWidth}px`,
              height: `${dragBtnWidth}px`,
              borderRadius: `${dragBtnWidth / 2}px`,
              left: `${left}px`
            }}
          ></div>
        </div>
        <div className={cx('DrapProgress-precent')}>{precent}%</div>
      </div>
    );
  }
}

export default themeable(localeable(DragProgress));
