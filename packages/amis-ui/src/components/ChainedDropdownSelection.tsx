import React from 'react';
import omit from 'lodash/omit';
import {
  uncontrollable,
  autobind,
  ThemeProps,
  themeable,
  localeable,
  LocaleProps
} from 'amis-core';

import {Options} from './Select';
import {BaseSelection, BaseSelectionProps} from './Selection';

import DropDownSelection from './DropDownSelection';
import type {TestIdBuilder} from 'amis-core';

export interface ChainedDropDownSelectionProps
  extends ThemeProps,
    LocaleProps,
    BaseSelectionProps {
  options: Array<any>;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
  searchable?: boolean;
  popOverContainer?: any;
  testIdBuilder?: TestIdBuilder;
}

interface ChainedDropdownSelectionState {
  stacks: Array<Options>;
  values: Array<string>;
}

export class ChainedDropdownSelection extends BaseSelection<
  ChainedDropDownSelectionProps,
  ChainedDropdownSelectionState
> {
  constructor(props: ChainedDropDownSelectionProps) {
    super(props);

    this.state = this.computed(props.value, props.options);
  }

  componentDidUpdate(prevProps: ChainedDropDownSelectionProps) {
    const {options, value} = this.props;
    if (options !== prevProps.options || prevProps.value !== value) {
      this.setState(this.computed(value, options));
    }
  }

  computed(value: string, options: Options) {
    const {valueField} = this.props;
    let values: Array<string> = [];
    const getValues = (opts: Options, arr: Array<string> = []) => {
      opts.forEach(item => {
        const cValue = valueField ? item[valueField] : item?.value ?? '';
        if (cValue === value) {
          values = [...arr, cValue];
        } else if (item.children) {
          getValues(item.children, [...arr, cValue]);
        }
      });
    };
    getValues(options);
    return {
      values,
      stacks: this.computedStask(values)
    };
  }

  getFlatOptions(options: Options) {
    return options.map(item => omit(item, 'children'));
  }

  @autobind
  handleSelect(index: number, value: string) {
    // 当前层级点击时，需要重新设置下values的值，以及重新计算stacks列表
    const {values} = this.state;
    values.splice(index, values.length - index);
    value && values.push(value);
    const stacks = this.computedStask(values);
    this.setState(
      {
        stacks,
        values
      },
      () => {
        this.props?.onChange?.(value);
      }
    );
  }

  // 根据树结构层级，寻找最后一层
  computedStask(values: string[]) {
    const {options, valueField} = this.props;
    const getDeep = (opts: Options, index: number, tems: Array<Options>) => {
      tems.push(this.getFlatOptions(opts));
      opts.forEach(op => {
        const cValue = valueField ? op[valueField] : op?.value ?? '';
        if (
          cValue === values[index] &&
          op.children &&
          values.length - 1 >= index
        ) {
          getDeep(op.children, index + 1, tems);
        }
      });
      return tems;
    };

    return getDeep(options, 0, []);
  }

  render() {
    const {stacks, values} = this.state;
    const {className, classnames: cx, testIdBuilder} = this.props;

    return (
      <div className={cx('ChainedDropdownSelection', className)}>
        {stacks.map((item, index) => (
          <div className={cx('ChainedDropdownSelection-item')} key={index}>
            <DropDownSelection
              {...this.props}
              value={values[index]}
              options={item}
              onChange={value => this.handleSelect(index, value)}
              testIdBuilder={testIdBuilder?.getChild(`chained-${index}`)}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(ChainedDropdownSelection, {
      value: 'onChange'
    })
  )
);
