import React from 'react';
import {themeable, ThemeProps} from 'amis-core';

let now = 0;
let count = 0;
let timer: null | NodeJS.Timer = null;
let speed = 50;

interface SquareNineProps extends ThemeProps {
  //宽度，默认300px
  width?: number;
  //高度，默认300px
  height?: number;
  //奖品列表
  items: {name: string; pictureUrl: string; id: number}[];
  // 开始按钮
  children?: React.ReactNode;
  //目标索引（中奖）
  targetIndex?: number;
  // 结束回调
  callback?: (index: number) => void;
}

interface CallBackFn {
  (now: number): number;
}

interface SquareNineState {
  width: number;
  height: number;
  off: 0 | 1;
}

interface CustomElement extends HTMLElement {
  start: (index: number, fn: CallBackFn) => void;
  reset: () => void;
  flag: 0 | 1;
}

export class Lottery extends React.Component<SquareNineProps, SquareNineState> {
  lightRef: React.RefObject<CustomElement> = React.createRef();

  constructor(props: SquareNineProps) {
    super(props);
    this.state = {
      width: this.props.width || 300,
      height: this.props.height || 300,
      off: 1
    };
  }

  start = (index: number, fn?: CallBackFn) => {
    //开始抽奖
    if (!this.state.off) return;
    this.setState({off: 0});
    this.changeFn(index, fn);
  };

  //重置抽奖状态
  reset = () => {
    this.setState({off: 1});
    now = 0;
    timer && clearTimeout(timer as unknown as number);
  };

  componentDidMount() {
    if (this.lightRef.current) {
      this.lightRef.current.start = this.start;
      this.lightRef.current.reset = this.reset;
      this.lightRef.current.flag = this.state.off;
    }
  }

  componentDidUpdate(prevProps: SquareNineProps, prevState: SquareNineState) {
    if (this.lightRef.current && prevState.off !== this.state.off) {
      this.lightRef.current.flag = this.state.off;
    }
  }

  //抽奖动画效果
  changeFn = (index: number, fn?: CallBackFn) => {
    let _item = document.querySelectorAll('.luckNineWrap .luckNineItem');
    now = ++now % (_item.length - 1);
    now == 0 && count++;
    _item.forEach((res: HTMLElement) => {
      Number(res.dataset.index) == now
        ? res.classList.add('active')
        : res.classList.remove('active');
    });
    timer = setTimeout(() => {
      this.changeFn(index, fn);
    }, speed);
    if (count > 3) speed += 10;
    if (speed > 300 && now == index) {
      timer && clearTimeout(timer);
      count = 0;
      speed = 50;
      this.setState({off: 1});
      fn && fn(now);
      this.props.callback && this.props.callback(now);
    }
  };

  render() {
    const {width, height} = this.state;
    const {classnames: cx} = this.props;
    return (
      <div
        className={cx('Lottery light')}
        ref={this.lightRef as any}
        style={{width: width + 'px', height: height + 'px'}}
      >
        <div className="luckNineWrap">
          <div className="luckNineItem" data-index="0">
            <img
              className="luckNineItem-img"
              src={this.props.items[0].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.props.items[0].name}</div>
          </div>
          <div className="luckNineItem" data-index="1">
            <img
              className="luckNineItem-img"
              src={this.props.items[1].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.props.items[1].name}</div>
          </div>
          <div className="luckNineItem" data-index="2">
            <img
              className="luckNineItem-img"
              src={this.props.items[2].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.props.items[2].name}</div>
          </div>
          <div className="luckNineItem" data-index="7">
            <img
              className="luckNineItem-img"
              src={this.props.items[7].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.props.items[7].name}</div>
          </div>
          <div
            className="luckNineItem startBtn"
            data-index="8"
            onClick={() => this.start(this.props.targetIndex || 0)}
          >
            {this.props.children ? this.props.children : <span>开始</span>}
          </div>
          <div className="luckNineItem" data-index="3">
            <img
              className="luckNineItem-img"
              src={this.props.items[3].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.props.items[3].name}</div>
          </div>
          <div className="luckNineItem" data-index="6">
            <img
              className="luckNineItem-img"
              src={this.props.items[6].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.props.items[6].name}</div>
          </div>
          <div className="luckNineItem" data-index="5">
            <img
              className="luckNineItem-img"
              src={this.props.items[5].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.props.items[5].name}</div>
          </div>
          <div className="luckNineItem" data-index="4">
            <img
              className="luckNineItem-img"
              src={this.props.items[5].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.props.items[5].name}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default themeable(Lottery);
