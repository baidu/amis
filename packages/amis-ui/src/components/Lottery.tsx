import React from 'react';
import {
  isPureVariable,
  resolveVariableAndFilter,
  themeable,
  ThemeProps
} from 'amis-core';
import {SchemaTokenizeableString} from 'amis/src/Schema';

interface SquareNineProps extends ThemeProps {
  //宽度，默认300px
  width?: string;
  //高度，默认300px
  height?: string;
  //奖品列表
  items?: {name: string; pictureUrl: string; id: number}[];
  // 开始按钮
  children?: React.ReactNode;
  //目标索引（中奖）
  targetIndex?: number;
  // 结束回调
  callback?: (index: number) => void;
  // 数据源： 绑定当前环境变量, @default: '${items}'
  source?: SchemaTokenizeableString;
  //数据
  data: any;
}

interface CallBackFn {
  (now: number): number;
}

interface SquareNineState {
  off: 0 | 1;
  now: number;
  count: number;
  speed: number;
}

interface CustomElement extends HTMLElement {
  start: (index: number, fn: CallBackFn) => void;
  reset: () => void;
  flag: 0 | 1;
}

export class Lottery extends React.Component<SquareNineProps, SquareNineState> {
  lightRef: React.RefObject<CustomElement> = React.createRef();

  list: Array<any> = [];
  constructor(props: SquareNineProps) {
    super(props);
    this.state = {
      off: 1,
      now: -1,
      count: 0,
      speed: 50
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
    this.setState({now: -1});
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
    let now = this.state.now;
    now = ++now % (this.list.length - 1);
    this.setState({now: now});
    this.state.now == 0 && this.setState({count: this.state.count + 1});
    let timer = setTimeout(() => {
      this.changeFn(index, fn);
    }, this.state.speed);
    if (this.state.count > 3) {
      this.setState({speed: this.state.speed + 10});
    }
    if (this.state.speed > 300 && this.state.now == index) {
      timer && clearTimeout(timer);
      this.setState({off: 1, count: 0, speed: 50});
      fn && fn(this.state.now);
      this.props.callback && this.props.callback(this.state.now);
    }
  };

  render() {
    const {now} = this.state;
    const {classnames: cx} = this.props;
    const {source, items, data} = this.props;
    const width = this.props.width || '300';
    const height = this.props.height || '300';

    let list: any;
    let value: any;

    if (typeof source === 'string' && isPureVariable(source)) {
      list = resolveVariableAndFilter(source, data, '| raw') || undefined;
    } else if (Array.isArray(items)) {
      list = items;
    }

    this.list = list;

    return (
      <div
        className={cx('Lottery light')}
        ref={this.lightRef as any}
        style={{width: width + 'px', height: height + 'px'}}
      >
        <div className="luckNineWrap">
          <div
            className={now === 0 ? 'luckNineItem active' : 'luckNineItem'}
            data-index="0"
          >
            <img
              className="luckNineItem-img"
              src={this.list[0].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.list[0].name}</div>
          </div>
          <div
            className={now === 1 ? 'luckNineItem active' : 'luckNineItem'}
            data-index="1"
          >
            <img
              className="luckNineItem-img"
              src={this.list[1].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.list[1].name}</div>
          </div>
          <div
            className={now === 2 ? 'luckNineItem active' : 'luckNineItem'}
            data-index="2"
          >
            <img
              className="luckNineItem-img"
              src={this.list[2].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.list[2].name}</div>
          </div>
          <div
            className={now === 7 ? 'luckNineItem active' : 'luckNineItem'}
            data-index="7"
          >
            <img
              className="luckNineItem-img"
              src={this.list[7].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.list[7].name}</div>
          </div>
          <div
            className="luckNineItem startBtn"
            data-index="8"
            onClick={() => this.start(this.props.targetIndex || 0)}
          >
            {this.props.children ? this.props.children : <span>开始</span>}
          </div>
          <div
            className={now === 3 ? 'luckNineItem active' : 'luckNineItem'}
            data-index="3"
          >
            <img
              className="luckNineItem-img"
              src={this.list[3].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.list[3].name}</div>
          </div>
          <div
            className={now === 6 ? 'luckNineItem active' : 'luckNineItem'}
            data-index="6"
          >
            <img
              className="luckNineItem-img"
              src={this.list[6].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.list[6].name}</div>
          </div>
          <div
            className={now === 5 ? 'luckNineItem active' : 'luckNineItem'}
            data-index="5"
          >
            <img
              className="luckNineItem-img"
              src={this.list[5].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.list[5].name}</div>
          </div>
          <div
            className={now === 4 ? 'luckNineItem active' : 'luckNineItem'}
            data-index="4"
          >
            <img
              className="luckNineItem-img"
              src={this.list[5].pictureUrl}
              alt="奖品图片"
            />
            <div className="luckNineItem-title">{this.list[5].name}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default themeable(Lottery);
