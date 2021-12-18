/**
 * @file Picker
 * @description 移动端列滚动选择器
 */
import React, {
  memo,
  ReactNode,
  useState
} from 'react';
import {uncontrollable} from 'uncontrollable';

import {themeable, ThemeProps} from '../theme';
import {localeable, LocaleProps} from '../locale';

import Button from './Button';
import {PickerColumnItem, default as Column} from './PickerColumn';

export type PickerValue = string | number;

export interface PickerProps extends ThemeProps, LocaleProps {
  title?: String | ReactNode,
  labelField?: string;
  className?: string;
  showToolbar?: boolean;
  defaultValue?: PickerValue[];
  value?: PickerValue[];
  swipeDuration?: number;
  visibleItemCount?: number;
  itemHeight?: number;
  columns: PickerColumnItem[] | PickerColumnItem;
  onChange?: (
    value?: PickerValue[],
    index?: number,
    confirm?: boolean
  ) => void;
  onClose?: (
    value?: PickerValue[]
  ) => void;
  onConfirm?: (
    value?: PickerValue[]
  ) => void;
}

function fixToArray(data: any) {
  if (!Array.isArray(data)) {
    return [data];
  }
  return data;
}

const Picker = memo<PickerProps>((props) => {
  const {
    labelField,
    visibleItemCount = 5,
    value = [],
    swipeDuration = 1000,
    columns = [],
    itemHeight = 30,
    showToolbar = true,
    className='',
    classnames: cx,
    classPrefix: ns,
    translate: __
  } = props;

  const _columns = fixToArray(columns);
  const [innerValue, setInnerValue] = useState<PickerValue[]>(
    fixToArray(props.value === undefined ? props.defaultValue || [] : value )
  );

  const close = () => {
    if (props.onClose) {
      props.onClose(innerValue);
    }
  };

  const confirm = () => {
    if (props.onConfirm) {
      props.onConfirm(innerValue);
    }
  };

  const onChange = (itemValue: PickerValue, columnIndex: number, confirm?: boolean) => {
    const nextInnerValue = [...innerValue];
    nextInnerValue[columnIndex] = itemValue;
    setInnerValue(nextInnerValue);
    if (props.onChange) {
      props.onChange(nextInnerValue, columnIndex, confirm);
    }
  };

  const renderColumnItem = (item: PickerColumnItem, index: number) => {
    return (
      <Column
        {...item}
        classnames={cx}
        classPrefix={ns}
        labelField={labelField}
        itemHeight={itemHeight}
        swipeDuration={swipeDuration}
        visibleItemCount={visibleItemCount}
        value={innerValue[index]}
        onChange={(val: string | number, i, confirm) => {
          onChange(val, index, confirm);
        }}
    />)
  };

  const wrapHeight = itemHeight * +visibleItemCount;
  const frameStyle = {height: `${itemHeight}px`};
  const columnsStyle = {height: `${wrapHeight}px`};
  const maskStyle = {
    backgroundSize: `100% ${(wrapHeight - itemHeight) / 2}px`
  };

  return (
    <div
      className={cx(className, 'PickerColumns', 'PickerColumns-popOver')}
    >
      {showToolbar && <div className={cx('PickerColumns-toolbar')}>
        <Button className="PickerColumns-cancel" level="default" onClick={close}>
          {__('cancel')}
        </Button>
        <Button className="PickerColumns-confirm" level="primary" onClick={confirm}>
          {__('confirm')}
        </Button>
      </div>}
      <div className={cx('PickerColumns-columns')} style={columnsStyle}>
          {
              _columns.map((column: PickerColumnItem, index: number) => renderColumnItem(column, index))
          }
        <div className={cx('PickerColumns-mask')} style={maskStyle}></div>
        <div className={cx('PickerColumns-frame')} style={frameStyle}></div>
      </div>
    </div>
  );
});

export default themeable(
  localeable(
    uncontrollable(Picker, {
      value: 'onChange'
    })
  )
);
