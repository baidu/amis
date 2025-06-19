/**
 * @file 控制功能开关的控件，这里的功能指需要加子组件来支持的功能
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import Sortable from 'sortablejs';
import cx from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import isPlainObject from 'lodash/isPlainObject';
import {FormItem, Button, Icon, FormControlProps, autobind} from 'amis';
import {Checkbox} from 'amis-ui';
import {evalExpression} from 'amis-core';
import {GoConfigControl} from './GoConfigControl';

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
  checkable?: boolean;
  checkableOn?: string;
  features: Array<FeatureOption> | ((schema: any) => Array<FeatureOption>);
  goFeatureComp?: (item: FeatureOption, index: number) => string; // 去子组件
  onSort?: (data: any, value: {oldIndex: number; newIndex: number}) => void;
  // 自定义添加内容，按钮变成普通按钮
  customAction?: (props: {schema: any; onBulkChange: any}) => any;
  onItemCheck?: (checked: boolean, index: number, schema: any) => void;
  // 所有都添加完成后，隐藏添加按钮
  hideAddWhenAll?: boolean;
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
    const schema = cloneDeep(data);
    const {inUseFeat, unUseFeat} = this.state;
    item.remove?.(schema);
    removeFeature?.(item, schema);

    remove(inUseFeat as any, item);
    item.add && unUseFeat.push(item);
    onBulkChange?.(schema);

    this.setState({inUseFeat, unUseFeat});
  }

  handleSort(e: any) {
    const {data, onBulkChange, onSort} = this.props;
    let schema = cloneDeep(data);
    onSort?.(schema, e);
    onBulkChange?.(schema);
  }

  @autobind
  handleAdd(item: any) {
    const {addFeature, data, onBulkChange} = this.props;
    const {inUseFeat, unUseFeat} = this.state;

    inUseFeat.push(item);
    remove(unUseFeat as any, item);

    const schema = cloneDeep(data);
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
          if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(
              e.item,
              parent.childNodes[
                e.oldIndex > e.newIndex ? e.oldIndex + 1 : e.oldIndex
              ]
            );
          } else {
            parent.appendChild(e.item);
          }

          const value = this.state.inUseFeat.concat();
          value[e.oldIndex] = value.splice(e.newIndex, 1, value[e.oldIndex])[0];

          this.setState({inUseFeat: value}, () => {
            this.handleSort({
              oldIndex: e.oldIndex,
              newIndex: e.newIndex
            });
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

  @autobind
  handleCheck(res: boolean, index: number) {
    const {data, onBulkChange, onItemCheck} = this.props;
    const schema = cloneDeep(data);
    onItemCheck?.(res, index, schema);
    onBulkChange?.(schema);
  }

  renderItem(item: FeatureOption, index: number, checkable: boolean) {
    const {
      sortable,
      goFeatureComp,
      node,
      manager,
      onItemCheck,
      isItemChecked,
      data
    } = this.props;

    let content = null;

    if (goFeatureComp) {
      content = (
        // @ts-ignore
        <GoConfigControl
          className={cx(`${klass}Item-go`)}
          label={item.label}
          manager={manager}
          compId={() => goFeatureComp(item, index)}
        />
      );
    } else {
      content = <div className={cx(`${klass}Item-label`)}>{item.label}</div>;
    }

    return (
      <li className={klass + 'Item'} key={index}>
        {checkable && onItemCheck && (
          <Checkbox
            checked={isItemChecked(item, index, data)}
            onChange={(val: any) => this.handleCheck(val, index)}
          />
        )}

        <div className={klass + 'Item-content'}>
          {sortable && (
            <a className={klass + 'Item-dragBar'}>
              <Icon icon="drag-bar" className="icon" />
            </a>
          )}
          {content}
        </div>
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
    const {
      addable,
      addText,
      render,
      customAction,
      data,
      onBulkChange,
      hideAddWhenAll
    } = this.props;
    if (!addable) {
      return null;
    }

    if (customAction && typeof customAction === 'function') {
      const schema = customAction({onBulkChange, schema: cloneDeep(data)});

      if (isPlainObject(schema) && typeof schema.type === 'string') {
        return render('custom-action', schema);
      }
    }

    if (hideAddWhenAll && !this.state.unUseFeat.length) {
      return null;
    }

    return render('action', {
      type: 'dropdown-button',
      closeOnClick: true,
      label: addText || '添加',
      className: `${klass}-action`,
      btnClassName: `${klass}-action--btn`,
      menuClassName: `${klass}-action--menus`,
      buttons: this.state.unUseFeat.map(
        item => {
          return {
            label: item.label,
            onClick: () => this.handleAdd(item)
          };
        },
        {
          popOverContainer: null // amis 渲染挂载节点会使用 this.target
        }
      )
    });
  }

  render() {
    const {className, checkable, checkableOn, data} = this.props;

    let isCheckable = false;

    if (checkable !== undefined) {
      isCheckable = checkable;
    } else if (checkableOn) {
      isCheckable = evalExpression(checkableOn, data) === true;
    }

    return (
      <div className={cx('ae-FeatureControl', className)}>
        <ul className={cx('ae-FeatureControl-features')} ref={this.dragRef}>
          {this.state.inUseFeat.map((item, index) =>
            this.renderItem(item, index, isCheckable)
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
