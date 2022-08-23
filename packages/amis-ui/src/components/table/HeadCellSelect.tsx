/**
 * @file table/HeadCellSelect
 * @author fex
 */

import React from 'react';
import {findDOMNode} from 'react-dom';

import {
  themeable,
  ThemeProps,
  ClassNamesFn,
  LocaleProps,
  localeable
} from 'amis-core';
import HeadCellDropDown, {
  FilterPayload,
  FilterDropdownProps
} from './HeadCellDropDown';
import {RowSelectionOptionProps} from './index';
import {Icon} from '../icons';

export interface Props extends ThemeProps, LocaleProps {
  selections: Array<RowSelectionOptionProps>;
  keys: Array<string | number> | string;
  popOverContainer?: () => Element | Text | null;
  classnames: ClassNamesFn;
  classPrefix: string;
}

export interface State {
  key: Array<string | number> | string;
}

export class HeadCellSelect extends React.Component<Props, State> {
  static defaultProps = {
    selections: []
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      key: ''
    };
  }

  render() {
    const {
      selections,
      keys: allKeys,
      popOverContainer,
      classnames: cx,
      classPrefix: ns
    } = this.props;

    return (
      <HeadCellDropDown
        className={`${ns}TableCell-selectionBtn`}
        layerClassName={`${ns}TableCell-selectionPopOver`}
        filterIcon={<Icon icon="left-arrow" className="icon" />}
        active={false}
        popOverContainer={
          popOverContainer ? popOverContainer : () => findDOMNode(this)
        }
        filterDropdown={({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters
        }: FilterDropdownProps) => {
          return (
            <ul className={cx('DropDown-menu')}>
              {selections.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    item.onSelect && item.onSelect(allKeys);
                    this.handleClick(confirm, setSelectedKeys, item.key);
                  }}
                >
                  {item.text}
                </li>
              ))}
            </ul>
          );
        }}
        setSelectedKeys={(keys: Array<string | number> | string) =>
          this.setState({key: keys})
        }
        selectedKeys={this.state.key}
      ></HeadCellDropDown>
    );
  }

  handleClick(
    confirm: (payload?: FilterPayload) => void,
    setSelectedKeys?: (
      keys?: Array<string | number> | string
    ) => void | undefined,
    selectedKeys?: Array<string> | string
  ) {
    setSelectedKeys && setSelectedKeys(selectedKeys);

    confirm();
  }
}

export default themeable(localeable(HeadCellSelect));
