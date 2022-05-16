/**
 * @file 移动端人员、部门、角色、岗位选择
 * @author fex
 */

import React from 'react';
import {themeable, ThemeProps} from '../theme';
import {LocaleProps, localeable} from '../locale';
import {ResultBox} from '../components';
import UserSelect from './UserSelect';
import {Option} from '../renderers/Form/Options';
import Sortable from 'sortablejs';
import PopUp from '../components/PopUp';
import {Icon} from '../components/icons';
import {autobind, findTree} from '../utils/helper';
import {default as Tabs, Tab} from './Tabs';
import {UserSelectProps} from './UserSelect';
import {PlainObject} from '../types';
import {resolveVariableAndFilter} from '../utils/tpl-builtin';

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
  tempSelection: Array<Option>;
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
      tempSelection: [],
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
      activeKey: 0
    });
  }

  @autobind
  onOpen() {
    const {selection} = this.state;
    this.setState({
      isOpened: true,
      tempSelection: selection.slice()
    });
  }

  @autobind
  handleBack() {
    this.onClose();
    const {onChange} = this.props;
    onChange(this.state.selection);
  }

  @autobind
  handleSelectChange(option: Option | Array<Option>, isReplace?: boolean) {
    const {multiple, valueField = 'value'} = this.props;
    let selection = this.state.selection.slice();
    let selectionVals = selection.map((option: Option) => option[valueField]);
    if (isReplace && Array.isArray(option)) {
      selection = option.slice();
    } else if (!Array.isArray(option)) {
      let pos = selectionVals.indexOf(option[valueField]);
      if (pos !== -1) {
        selection.splice(selection.indexOf(option), 1);
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
  handleTabChange(key: number) {
    this.setState({
      activeKey: key
    });
  }

  render() {
    let {
      classnames: cx,
      translate: __,
      onChange,
      placeholder = '请选择',
      tabOptions,
      onSearch,
      deferLoad,
      data
    } = this.props;
    const {activeKey, isOpened, selection} = this.state;

    return (
      <div className={cx('UserTabSelect')}>
        <ResultBox
          className={cx('UserTabSelect-input', isOpened ? 'is-active' : '')}
          allowInput={false}
          result={selection}
          onResultChange={value => this.handleSelectChange(value, true)}
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
              <span className="left-arrow-box" onClick={this.handleBack}>
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
                      selection={selection}
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
          </div>
        </PopUp>
      </div>
    );
  }
}

export default themeable(localeable(UserTabSelect));
