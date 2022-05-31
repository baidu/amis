/**
 * @file table/HeadCellFilter
 * @author fex
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import isEqual from 'lodash/isEqual';

import {themeable, ThemeProps} from 'amis-core';
import {LocaleProps, localeable} from 'amis-core';
import HeadCellDropDown, {
  FilterDropdownProps,
  FilterPayload
} from './HeadCellDropDown';
import CheckBox from '../Checkbox';
import Button from '../Button';
import {Icon} from '../icons';

export interface Props extends ThemeProps, LocaleProps {
  column: any;
  onFilter?: Function;
  filteredValue?: Array<string>;
  filterMultiple?: boolean;
  popOverContainer?: () => Element | Text | null;
}

export interface OptionProps {
  text: string;
  value: string;
  selected?: boolean;
  children?: Array<OptionProps>;
}

export interface State {
  options: Array<OptionProps>;
  filteredValue: Array<string>;
}

export class HeadCellFilter extends React.Component<Props, State> {
  static defaultProps = {
    filteredValue: [],
    filterMultiple: false
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      options: [],
      filteredValue: props.filteredValue || []
    };
  }

  alterOptions(options: Array<any>) {
    options = options.map(option => ({
      ...option,
      selected: this.state.filteredValue.indexOf(option.value) > -1
    }));

    return options;
  }

  componentDidMount() {
    const {column} = this.props;
    if (column.filters && column.filters.length > 0) {
      this.setState({options: this.alterOptions(column.filters)});
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {column} = this.props;
    if (
      column.filters &&
      column.filters.length > 0 &&
      !isEqual(prevState.filteredValue, this.state.filteredValue)
    ) {
      this.setState({options: this.alterOptions(column.filters)});
    }
  }

  render() {
    const {options} = this.state;
    const {
      column,
      popOverContainer,
      classnames: cx,
      classPrefix: ns
    } = this.props;

    const filterProps = {
      filterDropdown: (payload: FilterDropdownProps) => {
        const {setSelectedKeys, selectedKeys, confirm, clearFilters} = payload;
        return options && options.length > 0 ? (
          <ul className={cx('DropDown-menu')}>
            {!column.filterMultiple
              ? options.map((option: any, index) => (
                  <li
                    key={index}
                    className={cx({
                      'is-active': option.selected
                    })}
                    onClick={() =>
                      this.handleClick(confirm, setSelectedKeys, [option.value])
                    }
                  >
                    {option.text}
                  </li>
                ))
              : options.map((option: any, index) => (
                  <li key={index}>
                    <CheckBox
                      classPrefix={ns}
                      onChange={e =>
                        this.handleCheck(
                          confirm,
                          setSelectedKeys,
                          e ? [option.value] : option.value
                        )
                      }
                      checked={option.selected}
                    >
                      {option.text}
                    </CheckBox>
                  </li>
                ))}
            {column.filterMultiple ? (
              <li
                key="dropDown-multiple-menu"
                className={cx('DropDown-multiple-menu')}
              >
                <Button
                  size={'xs'}
                  level={'primary'}
                  onClick={() => this.handleConfirmClick(confirm)}
                >
                  确定
                </Button>
                <Button
                  size={'xs'}
                  onClick={() =>
                    this.handleCancelClick(confirm, setSelectedKeys)
                  }
                >
                  取消
                </Button>
              </li>
            ) : null}
          </ul>
        ) : null;
      },
      setSelectedKeys: (keys: Array<string>) =>
        this.setState({filteredValue: keys})
    };

    return (
      <HeadCellDropDown
        className={`${ns}TableCell-filterBtn`}
        layerClassName={`${ns}TableCell-filterPopOver`}
        filterIcon={<Icon icon="column-filter" className="icon" />}
        active={
          column.filtered ||
          (options && options.some((item: any) => item.selected))
        }
        popOverContainer={
          popOverContainer ? popOverContainer : () => findDOMNode(this)
        }
        selectedKeys={this.state.filteredValue}
        {...filterProps}
      ></HeadCellDropDown>
    );
  }

  async handleClick(
    confirm: (payload?: FilterPayload) => void,
    setSelectedKeys?: (keys?: string | Array<string | number>) => void,
    selectedKeys?: Array<string>
  ) {
    const {onFilter, column} = this.props;
    const payload = {[column.key]: selectedKeys};

    if (onFilter) {
      const prevented = await onFilter(payload);
      if (prevented) {
        return;
      }
    }

    setSelectedKeys && setSelectedKeys(selectedKeys);

    onFilter && onFilter(payload);
    confirm();
  }

  handleCheck(
    confirm: (payload?: FilterPayload) => void,
    setSelectedKeys?: (
      keys: string | Array<string | number>
    ) => void | undefined,
    selectedKeys?: Array<string>
  ) {
    const filteredValue = this.state.filteredValue;
    // 选中
    if (Array.isArray(selectedKeys)) {
      setSelectedKeys && setSelectedKeys([...filteredValue, ...selectedKeys]);
    } else {
      // 取消选中
      setSelectedKeys &&
        setSelectedKeys(filteredValue.filter(v => v !== selectedKeys));
    }
  }

  handleConfirmClick(confirm: (payload?: FilterPayload) => void) {
    const {onFilter, column} = this.props;
    onFilter && onFilter({[column.key]: this.state.filteredValue});
    confirm();
  }

  handleCancelClick(
    confirm: (payload?: FilterPayload) => void,
    setSelectedKeys?: (
      keys: string | Array<string | number>
    ) => void | undefined
  ) {
    setSelectedKeys && setSelectedKeys([]);
    confirm();
  }
}

export default themeable(localeable(HeadCellFilter));
