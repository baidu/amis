import React from 'react';
import {ThemeProps, themeable} from 'amis-core';
import {LocaleProps, localeable} from 'amis-core';
import InputBox from './InputBox';
import {Icon} from './icons';
import Button from './Button';
import {autobind, guid} from 'amis-core';
import {uncontrollable} from 'uncontrollable';
import Sortable from 'sortablejs';
import {findDOMNode} from 'react-dom';

export interface ArrayInputProps extends ThemeProps, LocaleProps {
  value?: Array<any>;
  onChange?: (value: Array<any>) => void;
  placeholder: string;
  itemRender: (props: {
    value: any;
    onChange: (value: any) => void;
    index: number;
    disabled?: boolean;
  }) => JSX.Element;
  itemInitalValue?: any;
  maxLength?: number;
  minLength?: number;
  disabled?: boolean;
  sortable?: boolean;
  removable?: boolean;
  addable?: boolean;
  editable?: boolean;
  sortTip?: string;
}

export class ArrayInput extends React.Component<ArrayInputProps> {
  static defaultProps = {
    placeholder: 'empty',
    itemRender: ({
      value,
      onChange
    }: {
      value: any;
      onChange: (value: any) => void;
      index: number;
      disabled?: boolean;
    }) => <InputBox value={value} onChange={onChange} />
  };

  id: string = guid();
  dragTip?: HTMLElement;
  sortable?: Sortable;

  handleItemOnChange(index: number, itemValue: any) {
    const {onChange} = this.props;
    const value = this.props.value;
    const newValue = Array.isArray(value) ? value.concat() : [];
    newValue.splice(index, 1, itemValue);
    onChange?.(newValue);
  }

  @autobind
  dragTipRef(ref: any) {
    if (!this.dragTip && ref) {
      this.initDragging();
    } else if (this.dragTip && !ref) {
      this.destroyDragging();
    }

    this.dragTip = ref;
  }

  @autobind
  handleAdd() {
    const {value, onChange, itemInitalValue} = this.props;
    const newValue = Array.isArray(value) ? value.concat() : [];

    newValue.push(itemInitalValue);

    onChange?.(newValue);
  }

  @autobind
  handleRemove(e: React.MouseEvent<HTMLElement>) {
    const indx = parseInt(e.currentTarget.getAttribute('data-index')!, 10);
    const {value, onChange, itemInitalValue} = this.props;
    const newValue = Array.isArray(value) ? value.concat() : [];
    newValue.splice(indx, 1);
    onChange?.(newValue);
  }

  initDragging() {
    const onChange = this.props.onChange;
    const ns = this.props.classPrefix;
    const dom = findDOMNode(this) as HTMLElement;
    this.sortable = new Sortable(
      dom.querySelector(`.drag-group`) as HTMLElement,
      {
        group: `array-input-${this.id}`,
        animation: 150,
        handle: `.drag-bar`,
        ghostClass: `${ns}ArrayInput-item--dragging`,
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

          const value = this.props.value;
          if (!Array.isArray(value)) {
            return;
          }
          const newValue = value.concat();
          newValue.splice(e.newIndex, 0, newValue.splice(e.oldIndex, 1)[0]);
          onChange?.(newValue);
        }
      }
    );
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  renderItem(value: any, index: number, collection: Array<any>) {
    const {
      itemRender,
      disabled,
      classnames: cx,
      sortable,
      removable,
      minLength
    } = this.props;

    return (
      <div className={cx('ArrayInput-item')} key={index}>
        {sortable && collection.length > 1 && !disabled ? (
          <a className={cx('ArrayInput-itemDrager drag-bar')}>
            <Icon icon="drag-bar" className="icon" />
          </a>
        ) : null}

        {itemRender({
          value,
          onChange: this.handleItemOnChange.bind(this, index),
          index,
          disabled
        })}

        {removable !== false &&
        !disabled &&
        (!minLength || collection.length > minLength) ? (
          <a
            data-index={index}
            className={cx('ArrayInput-itemRemove')}
            onClick={this.handleRemove}
          >
            <Icon icon="close" className="icon" />
          </a>
        ) : null}
      </div>
    );
  }

  render() {
    const {
      classnames: cx,
      value,
      placeholder,
      translate: __,
      maxLength,
      sortable,
      sortTip,
      disabled
    } = this.props;

    return (
      <div className={cx('ArrayInput')}>
        {Array.isArray(value) && value.length ? (
          <div className={cx('ArrayInput-items drag-group')}>
            {value.map((item, index) => this.renderItem(item, index, value))}
          </div>
        ) : (
          <div className={cx('ArrayInput-placeholder')}>{__(placeholder)}</div>
        )}

        <div
          className={cx(
            'ArrayInput-toolbar',
            sortable && Array.isArray(value) && value.length > 1
              ? 'ArrayInput-toolbar--dnd'
              : ''
          )}
        >
          {!Array.isArray(value) || !maxLength || value.length < maxLength ? (
            <Button
              className={cx('ArrayInput-addBtn')}
              onClick={this.handleAdd}
              level=""
              disabled={disabled}
            >
              <Icon icon="plus" className="icon" />
              <span>{__('Combo.add')}</span>
            </Button>
          ) : null}

          {sortable && Array.isArray(value) && value.length ? (
            <span className={cx(`ArrayInput-sortTip`)} ref={this.dragTipRef}>
              {Array.isArray(value) && value.length > 1 ? __(sortTip) : ''}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(ArrayInput, {
      value: 'onChange'
    })
  )
);
