/**
 * @file Elevator
 * @description 电梯导航
 * @author hsm-lv
 */

import React from 'react';
import Transition, {ENTERED, ENTERING} from 'react-transition-group/Transition';
import {Schema} from '../types';
import {ThemeProps, themeable} from '../theme';
import {PlainObject} from '../types';
import {autobind} from '../utils/helper';
import {uncontrollable} from 'uncontrollable';
import {find} from 'lodash';

export interface FloorProps extends ThemeProps {
  title?: string; // 标题
  name: string | number; // 标识
  body?: Schema; // Schema
  className?: string; // 样式名
}

class FloorComponent extends React.PureComponent<FloorProps> {
  contentDom: any;
  contentRef = (ref: any) => (this.contentDom = ref);

  render() {
    const {classnames: cx, children, className} = this.props;

    return (
      <div ref={this.contentRef} className={cx('Elevator-floor', className)}>
        {children}
      </div>
    );
  }
}

export const Floor = themeable(FloorComponent);

export interface ElevatorProps extends ThemeProps {
  floors?: Array<FloorProps>; // 楼层数据
  active?: string | number; // 激活标识
  navClassName?: string; // 导航 CSS类名
  floorClassName?: string; // 楼层 CSS类名
  floorRender?: (floor: FloorProps, props?: ElevatorProps) => JSX.Element; // 楼层渲染器
  onSelect?: (key: string | number) => void; // 选中回调方法
}

export interface ElevatorState {
  offsetArr: PlainObject[]; // 记录每个楼层的offsetTop
  fromSelect: boolean; // 标识滚动触发来源
}

export class Elevator extends React.Component<ElevatorProps, ElevatorState> {
  static defaultProps: Pick<
    ElevatorProps,
    'navClassName' | 'floorClassName'
  > = {
    navClassName: '',
    floorClassName: ''
  };

  // 滚动区域DOM
  contentDom: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount() {
    // 初始化滚动标识
    this.setState({fromSelect: false});

    // add scroll event
    const floorRootDom =
      this.contentDom && (this.contentDom.current as HTMLElement);
    floorRootDom.addEventListener('scroll', this.scrollToNav);
    let offsetArr: Array<object> = [];
    const {children, active} = this.props;

    // 收集楼层offsetTop
    children &&
      React.Children.forEach(
        children,
        (floor: FloorComponent, index: number) => {
          offsetArr.push({
            key: floor.props.name,
            offsetTop: (floorRootDom.children[index] as HTMLElement).offsetTop
          });
        }
      );

    this.setState(
      {
        offsetArr
      },
      () => active && this.scrollToFloor(active)
    );
  }

  @autobind
  scrollToNav(e: Event) {
    if (this.state.fromSelect) {
      return;
    }

    // 获取滚动的scrollTop
    const scrollTop: number = (e.target as HTMLElement).scrollTop;

    // 判断scrollTop所在区域
    const offsetArr = this.state.offsetArr;
    const firstFloor = offsetArr[0];
    const lastFloor = offsetArr[offsetArr.length - 1];
    // 首层偏移
    const offset = scrollTop + firstFloor.offsetTop;

    // 首层
    if (offset <= firstFloor.offsetTop) {
      this.fireSelect(firstFloor.key);
    }
    // 最后一层
    else if (offset >= lastFloor.offsetTop) {
      this.fireSelect(lastFloor.key);
    } else {
      // 区间楼层判断
      offsetArr.forEach((item, index) => {
        if (
          offset >= item.offsetTop &&
          offset < offsetArr[index + 1].offsetTop
        ) {
          this.fireSelect(item.key);
        }
      });
    }
  }

  scrollToFloor(key: string | number) {
    // 获取指定楼层的offsettop
    const offsetArr = this.state.offsetArr;
    const floor = find(offsetArr, item => item.key === key);
    const floorRootDom =
      this.contentDom && (this.contentDom.current as HTMLElement);

    // 滚动到指定楼层
    floor &&
      (floorRootDom.scrollTop = floor.offsetTop - offsetArr[0].offsetTop);
  }

  handleSelect(key: string | number) {
    // 标记滚动来自导航选择
    this.setState({fromSelect: true});
    // 滚动到对应楼层
    this.scrollToFloor(key);

    const floorRootDom =
      this.contentDom && (this.contentDom.current as HTMLElement);

    // 如果已经滚到底就不去更新导航选中了
    if (
      floorRootDom.scrollHeight - floorRootDom.scrollTop <
      floorRootDom.clientHeight
    ) {
      // fire event
      this.fireSelect(key);
    }

    // 取消标记
    this.setState({fromSelect: false});
  }

  fireSelect(key: string | number) {
    const {onSelect} = this.props;
    onSelect && onSelect(key);
  }

  renderNav(nav: any, index: number) {
    if (!nav) {
      return;
    }

    const {classnames: cx, active: activeProp} = this.props;
    const {title, name} = nav.props;
    const active = activeProp === undefined && index === 0 ? name : activeProp;

    return (
      <li
        className={cx('Elevator-nav', active === name ? 'is-active' : '')}
        key={index}
        onClick={() => this.handleSelect(name)}
      >
        <a>{title}</a>
      </li>
    );
  }

  renderFloor(floor: any, index: number) {
    if (!floor) {
      return;
    }

    const {active: activeProp, classnames} = this.props;
    const name = floor.props.name;
    const active = activeProp === undefined && index === 0 ? name : activeProp;

    return React.cloneElement(floor, {
      ...floor.props,
      key: index,
      classnames,
      active
    });
  }

  render() {
    const {
      classnames: cx,
      className,
      navClassName,
      floorClassName,
      children
    } = this.props;

    if (!Array.isArray(children)) {
      return null;
    }

    return (
      <div className={cx(`Elevator`, className)}>
        <ul
          className={cx('Elevator-nav-wrap', navClassName)}
          role="elevatorlist"
        >
          {children.map((nav, index) => this.renderNav(nav, index))}
        </ul>

        <div
          className={cx('Elevator-floor-wrap', floorClassName)}
          ref={this.contentDom}
        >
          {children.map((floor, index) => {
            return this.renderFloor(floor, index);
          })}
        </div>
      </div>
    );
  }
}

const ThemedElevator = themeable(
  uncontrollable(Elevator, {
    active: 'onSelect'
  })
);

export default ThemedElevator as typeof ThemedElevator & {
  Floor: typeof Floor;
};
