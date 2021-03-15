import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Elevator as CElevator, Floor} from '../components/Elevator';
import {isVisible, autobind} from '../utils/helper';
import {filter} from '../utils/tpl';
import {find} from 'lodash';
import {BaseSchema, SchemaClassName, SchemaCollection} from '../Schema';

/**
 * Floor 楼层渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/icon
 */

export type FloorSchema = {
  /**
   * 文字说明
   */
  title: string;

  /**
   * 锚点标识
   */
  anchor?: string;

  /**
   * 内容
   */
  body?: SchemaCollection;
} & Omit<BaseSchema, 'type'>;

/**
 * Elevator 电梯渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/nav
 */
export interface ElevatorSchema extends BaseSchema {
  /**
   * 指定为 Elevator 导航渲染器
   */
  type: 'elevator';

  /**
   * 楼层集合
   */
  floors: Array<FloorSchema>;

  /**
   * 被激活（定位）的楼层
   */
  active?: string | number;

  /**
   * 样式名
   */
  className?: SchemaClassName;

  /**
   * 导航样式名
   */
  navClassName?: SchemaClassName;

  /**
   * 楼层样式名
   */
  floorClassName?: SchemaClassName;
}

export interface ElevatorProps
  extends RendererProps,
    Omit<ElevatorSchema, 'className' | 'navClassName' | 'floorClassName'> {
  active?: string | number;
  floorRender?: (
    floor: FloorSchema,
    props: ElevatorProps,
    index: number
  ) => JSX.Element;
}

export interface ElevatorState {
  active: any;
}

export default class Elevator extends React.Component<
  ElevatorProps,
  ElevatorState
> {
  static defaultProps: Partial<ElevatorProps> = {
    className: '',
    navClassName: '',
    floorClassName: ''
  };

  renderFloor?: (
    floor: FloorSchema,
    props: ElevatorProps,
    index: number
  ) => JSX.Element;

  constructor(props: ElevatorProps) {
    super(props);

    // 设置默认激活项
    const floors = props.floors;
    let active: any = 0;

    if (typeof props.active !== 'undefined') {
      active = props.active;
    } else {
      const floor: FloorSchema = find(
        floors,
        floor => floor.anchor === props.active
      ) as FloorSchema;
      active =
        floor && floor.anchor
          ? floor.anchor
          : (floors[0] && floors[0].anchor) || 0;
    }

    this.state = {
      active
    };
  }

  @autobind
  handleSelect(key: any) {
    this.setState({
      active: key
    });
  }

  @autobind
  locateTo(index: number) {
    const {floors} = this.props;

    Array.isArray(floors) &&
      floors[index] &&
      this.setState({
        active: floors[index].anchor || index
      });
  }

  render() {
    const {
      classnames: cx,
      classPrefix: ns,
      className,
      navClassName,
      floorClassName,
      floorRender,
      render,
      data
    } = this.props;

    let floors = this.props.floors;
    if (!floors) {
      return null;
    }

    floors = Array.isArray(floors) ? floors : [floors];
    let children: Array<JSX.Element | null> = [];

    children = floors.map((floor, index) =>
      isVisible(floor, data) ? (
        <Floor
          {...(floor as any)}
          title={filter(floor.title, data)}
          key={index}
          name={floor.anchor || index}
        >
          {this.renderFloor
            ? this.renderFloor(floor, this.props, index)
            : floorRender
            ? floorRender(floor, this.props, index)
            : render(`floor/${index}`, floor.body || '')}
        </Floor>
      ) : null
    );

    return (
      <CElevator
        classPrefix={ns}
        classnames={cx}
        className={className}
        navClassName={navClassName}
        floorClassName={floorClassName}
        onSelect={this.handleSelect}
        active={this.state.active}
      >
        {children}
      </CElevator>
    );
  }
}

@Renderer({
  test: /(^|\/)elevator$/,
  name: 'elevator'
})
export class ElevatorRenderer extends Elevator {}
