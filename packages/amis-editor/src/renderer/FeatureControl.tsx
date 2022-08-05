/**
 * @file 控制功能开关的控件，这里的功能指需要加子组件来支持的功能
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import {FormItem, Button, Icon, FormControlProps, autobind} from 'amis';

import {clone, remove} from 'lodash';
import {GoConfigControl} from './GoConfigControl';
import Sortable from 'sortablejs';

const klass = 'ae-FeatureControl';
export type FeatureOption = {
  label: string;
  value: any;
  remove?: (data: any) => void;
  /** 提供该字段表示删除后还可以再新增回来 */
  add?: (data: any) => void;
  isActive?: (data: any) => boolean;
};

interface FeatureControlProps extends FormControlProps {
  className?: string;
  removable?: boolean;
  addable?: boolean;
  addText?: string;
  sortable?: boolean;
  features: Array<FeatureOption> | ((schema: any) => Array<FeatureOption>);
  goFeatureComp?: (item: FeatureOption) => string; // 去子组件
  onSort?: (value: FeatureOption[]) => void;
}

interface FeatureControlState {
  /**
   * 当前启用的功能
   */
  inUseFeat: FeatureOption[];

  /**
   * 未启用的功能
   */
  unUseFeat: FeatureOption[];
}

export default class FeatureControl extends React.Component<
  FeatureControlProps,
  FeatureControlState
> {
  constructor(props: FeatureControlProps) {
    super(props);
    this.state = FeatureControl.initState(props.data, props.features);
  }

  static getDerivedStateFromProps(
    nextProps: FeatureControlProps,
    preState: FeatureControlState
  ) {
    return FeatureControl.initState(
      nextProps.data,
      nextProps.features,
      preState.inUseFeat,
      preState.unUseFeat
    );
  }

  static initState(
    data: any,
    features: FeatureOption[] | ((schema: any) => Array<FeatureOption>),
    lastInUseFeat?: FeatureOption[],
    lastUnUseFeat?: FeatureOption[]
  ) {
    const inUseFeat: FeatureOption[] = [];
    const unUseFeat: FeatureOption[] = [];

    if (!Array.isArray(features)) {
      features = features(data);
    }

    features.forEach(item => {
      if (item.isActive == null || item.isActive?.(data)) {
        inUseFeat.push(item);
      } else if (item.add) {
        unUseFeat.push(item);
      }
    });

    return {
      inUseFeat,
      unUseFeat
    };
  }

  @autobind
  handleRemove(item: FeatureOption, index: number) {
    const {removeFeature, data, onBulkChange} = this.props;
    const {inUseFeat, unUseFeat} = this.state;

    item.remove?.(data);
    removeFeature?.(item, data);
    onBulkChange?.(data);

    remove(inUseFeat, item);
    item.add && unUseFeat.push(item);

    this.setState({inUseFeat, unUseFeat});
  }

  @autobind
  handleAdd(item: any) {
    const {addFeature, data, onBulkChange} = this.props;
    const {inUseFeat, unUseFeat} = this.state;

    inUseFeat.push(item);
    remove(unUseFeat, item);

    const schema = clone(data);
    item.add?.(schema);
    addFeature?.(item, schema);
    onBulkChange?.(schema);
  }

  sortable?: Sortable;
  drag?: HTMLElement | null;
  @autobind
  dragRef(ref: any) {
    const {sortable} = this.props;
    if (!sortable) {
      return;
    }

    if (!this.drag && ref) {
      this.initDragging();
    } else if (this.drag && !ref) {
      this.destroyDragging();
    }

    this.drag = ref;
  }

  /**
   * 初始化拖动
   */
  initDragging() {
    const dom = findDOMNode(this) as HTMLElement;
    this.sortable = new Sortable(
      dom.querySelector(`.${klass}-features`) as HTMLElement,
      {
        group: 'FeatureControlGroup',
        animation: 150,
        handle: `.${klass}Item-dragBar`,
        ghostClass: `${klass}Item-dragging`,
        onEnd: (e: any) => {
          // 没有移动
          if (e.newIndex === e.oldIndex) {
            return;
          }
          // 换回来
          const parent = e.to as HTMLElement;
          if (
            e.newIndex < e.oldIndex &&
            e.oldIndex < parent.childNodes.length - 1
          ) {
            parent.insertBefore(e.item, parent.childNodes[e.oldIndex + 1]);
          } else if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
          } else {
            parent.appendChild(e.item);
          }

          const value = this.state.inUseFeat.concat();
          value[e.oldIndex] = value.splice(e.newIndex, 1, value[e.oldIndex])[0];
          this.setState({inUseFeat: value}, () => {
            this.props.onSort?.(value);
          });
        }
      }
    );
  }

  /**
   * 拖动的销毁
   */
  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  renderItem(item: FeatureOption, index: number) {
    const {sortable, goFeatureComp, node, manager} = this.props;

    let content = null;

    if (goFeatureComp) {
      content = (
        // @ts-ignore
        <GoConfigControl
          className={cx(`${klass}Item-go`)}
          label={item.label}
          manager={manager}
          compId={() => goFeatureComp(item)}
        />
      );
    } else {
      content = <div className={cx(`${klass}Item-label`)}>{item.label}</div>;
    }

    return (
      <li className={klass + 'Item'} key={index}>
        {sortable && (
          <a className={klass + 'Item-dragBar'}>
            <Icon icon="drag-bar" className="icon" />
          </a>
        )}
        {content}
        <Button
          className={klass + 'Item-action'}
          onClick={() => this.handleRemove(item, index)}
        >
          <Icon icon="delete-btn" className="icon" />
        </Button>
      </li>
    );
  }

  renderAction() {
    const {addable, addText, render} = this.props;
    if (!addable) {
      return null;
    }

    return render('action', {
      type: 'dropdown-button',
      closeOnClick: true,
      label: '添加' || addText,
      className: `${klass}-action`,
      btnClassName: `${klass}-action--btn`,
      menuClassName: `${klass}-action--menus`,
      buttons: this.state.unUseFeat.map(item => {
        return {
          label: item.label,
          onClick: () => this.handleAdd(item)
        };
      })
    });
  }

  render() {
    const {className} = this.props;

    return (
      <div className={cx('ae-FeatureControl', className)}>
        <ul className={cx('ae-FeatureControl-features')} ref={this.dragRef}>
          {this.state.inUseFeat.map((item, index) =>
            this.renderItem(item, index)
          )}
        </ul>

        {this.renderAction()}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-feature-control'
})
export class FeatureControlRenderer extends FeatureControl {}
