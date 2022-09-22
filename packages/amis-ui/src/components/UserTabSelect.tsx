/**
 * @file 移动端人员、部门、角色、岗位选择
 * @author fex
 */

import React from 'react';
import {themeable, ThemeProps} from 'amis-core';
import {LocaleProps, localeable} from 'amis-core';
import {ResultBox} from '.';
import UserSelect from './UserSelect';
import type {Option} from 'amis-core';
import Sortable from 'sortablejs';
import PopUp from './PopUp';
import {Icon} from './icons';
import {autobind, findTree} from 'amis-core';
import {default as Tabs, Tab} from './Tabs';
import {UserSelectProps} from './UserSelect';
import type {PlainObject} from 'amis-core';
import {resolveVariableAndFilter} from 'amis-core';

export interface UserSelectTop extends UserSelectProps {
  title: string;
  deferApi?: string;
  searchApi?: string;
  searchable?: boolean;
  searchParam?: PlainObject;
  searchTerm?: string;
}
export interface UserTabSelectProps extends ThemeProps, LocaleProps {
  tabOptions?: Array<UserSelectTop>;
  multiple?: boolean;
  placeholder?: string;
  valueField?: string;
  labelField?: string;
  selection?: Array<Option>;
  data?: PlainObject;
  onChange: (value: Array<Option> | Option) => void;
  onSearch?: (
    term: string,
    cancelExecutor: Function,
    paramObj?: PlainObject
  ) => Promise<any[]> | undefined;
  deferLoad: (
    data?: Object,
    isRef?: boolean,
    param?: PlainObject
  ) => Promise<Option[]>;
}

export interface UserTabSelectState {
  isOpened: boolean;
  isSearch: boolean;
  isSelectOpened: boolean;
  inputValue: string;
  breadList: Array<any>;
  options: Array<Option>;
  selection: Array<Option>;
  searchList: Array<Option>;
  searchLoading: boolean;
  isEdit: boolean;
  activeKey: number;
}

export class UserTabSelect extends React.Component<
  UserTabSelectProps,
  UserTabSelectState
> {
  cancelSearch?: Function;
  sortable?: Sortable;
  unmounted = false;

  constructor(props: UserTabSelectProps) {
    super(props);
    this.state = {
      isOpened: false,
      isSelectOpened: false,
      inputValue: '',
      options: [],
      breadList: [],
      searchList: [],
      selection: props.selection ? props.selection : [],
      isSearch: false,
      searchLoading: false,
      isEdit: false,
      activeKey: 0
    };
  }

  static defaultProps = {};

  componentDidMount() {}

  componentDidUpdate(prevProps: UserTabSelectProps) {}

  componentWillUnmount() {
    this.unmounted = true;
  }

  @autobind
  onClose() {
    this.setState({
      isOpened: false,
      isSearch: false,
      inputValue: '',
      searchList: [],
      searchLoading: false,
      activeKey: 0,
      selection: []
    });
  }

  @autobind
  onOpen() {
    const {selection = []} = this.props;
    this.setState({
      isOpened: true,
      selection: selection.slice()
    });
  }

  @autobind
  handleSubmit() {
    const {onChange} = this.props;
    onChange(this.state.selection);
    this.onClose();
  }

  @autobind
  handleSelectChange(
    option: Option | Array<Option>,
    isReplace?: boolean,
    isDelete?: boolean
  ) {
    const {multiple, valueField = 'value'} = this.props;
    let selection = this.state.selection.slice();
    let selectionVals = selection.map((option: Option) => option[valueField]);
    if (isDelete) {
      selection = selection.filter(
        (item: Option) => item[valueField] !== (option as Option)[valueField]
      );
    } else if (isReplace && Array.isArray(option)) {
      selection = option.slice();
    } else if (!Array.isArray(option)) {
      let pos = selectionVals.indexOf(option[valueField]);
      if (pos !== -1) {
        selection.splice(pos, 1);
      } else {
        if (multiple) {
          selection.push(option);
        } else {
          selection = [option];
        }
      }
    }

    this.setState({
      selection: selection
    });
    return false;
  }

  @autobind
  handleImmediateChange(option: Array<Option>) {
    const {onChange} = this.props;
    if (Array.isArray(option)) {
      this.setState({
        selection: option
      });
      onChange(option);
    }
  }

  @autobind
  handleTabChange(key: number) {
    this.setState({
      activeKey: key
    });
  }

  @autobind
  getResult() {
    const {
      selection,
      tabOptions,
      valueField = 'value',
      labelField = 'label'
    } = this.props;
    const _selection = selection?.slice() || [];
    if (tabOptions) {
      for (let item of tabOptions) {
        for (let item2 of item.options) {
          const res = _selection.find(
            item => item[valueField] === item2[valueField]
          );
          if (res) {
            res[labelField] = item2[labelField];
          }
        }
      }
    }

    return _selection;
  }

  render() {
    let {
      classnames: cx,
      translate: __,
      placeholder = '请选择',
      tabOptions,
      onSearch,
      deferLoad,
      data
    } = this.props;
    const {activeKey, isOpened} = this.state;

    return (
      <div className={cx('UserTabSelect')}>
        <ResultBox
          className={cx('UserTabSelect-input', isOpened ? 'is-active' : '')}
          allowInput={false}
          result={this.getResult()}
          onResultChange={this.handleImmediateChange}
          onResultClick={this.onOpen}
          placeholder={placeholder}
          useMobileUI
        />
        <PopUp
          isShow={isOpened}
          className={cx(`UserTabSelect-popup`)}
          onHide={this.onClose}
          showClose={false}
        >
          <div className={cx('UserTabSelect-wrap')}>
            <div className={cx('UserSelect-navbar')}>
              <span className="left-arrow-box" onClick={this.onClose}>
                <Icon icon="left-arrow" className="icon" />
              </span>
              <div className={cx('UserSelect-navbar-title')}>人员选择</div>
            </div>
            <Tabs
              mode="tiled"
              className={cx('UserTabSelect-tabs')}
              onSelect={this.handleTabChange}
              activeKey={activeKey}
            >
              {tabOptions?.map((item: UserSelectTop, index: number) => {
                return (
                  <Tab
                    {...this.props}
                    eventKey={index}
                    key={index}
                    title={item.title}
                    className="TabsTransfer-tab"
                  >
                    <UserSelect
                      selection={this.state.selection}
                      showResultBox={false}
                      {...item}
                      options={
                        typeof item.options === 'string' && data
                          ? resolveVariableAndFilter(
                              item.options,
                              data,
                              '| raw'
                            )
                          : item.options
                      }
                      multiple
                      controlled
                      onChange={this.handleSelectChange}
                      onSearch={(input: string, cancelExecutor: Function) =>
                        item.searchable && onSearch
                          ? onSearch(input, cancelExecutor, {
                              searchApi: item.searchApi,
                              searchParam: item.searchParam,
                              searchTerm: item.searchTerm
                            })
                          : undefined
                      }
                      deferLoad={(
                        data?: PlainObject,
                        isRef?: boolean,
                        param?: PlainObject
                      ) =>
                        deferLoad(data, isRef, {
                          deferApi: item.deferApi,
                          ...(param || {})
                        })
                      }
                    />
                  </Tab>
                );
              })}
            </Tabs>

            <div className={cx('UserTabSelect-footer')}>
              <button
                type="button"
                className={cx('Button Button--md Button--primary')}
                onClick={this.handleSubmit}
              >
                {__('UserSelect.sure')}
              </button>
            </div>
          </div>
        </PopUp>
      </div>
    );
  }
}

export default themeable(localeable(UserTabSelect));
