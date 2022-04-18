/**
 * @file 移动端人员、部门、角色、岗位选择
 * @author fex
 */

import React from 'react';
import {themeable, ThemeProps} from '../theme';
import {LocaleProps, localeable} from '../locale';
import {ResultBox} from '../components';
import {Option} from '../renderers/Form/Options';
import Sortable from 'sortablejs';
import PopUp from '../components/PopUp';
import InputBox from '../components/InputBox';
import {Icon} from '../components/icons';
import debounce from 'lodash/debounce';
import {autobind, findTree} from '../utils/helper';
import Checkbox from '../components/Checkbox';
import {optionValueCompare, value2array} from './Select';
import Spinner from '../components/Spinner';
import flatten from 'lodash/flatten';

export interface UserSelectProps extends ThemeProps, LocaleProps {
  showNav?: boolean;
  navTitle?: string;
  options: Array<any>;
  value?: Array<Option> | Option | string;
  selectedOptions?: Array<Option>;
  valueField?: string;
  labelField?: string;
  multi?: boolean;
  multiple?: boolean;
  isDep?: boolean;
  isRef?: boolean;
  isRole?: boolean;
  isPost?: boolean;
  searchable?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  onSearch?: (
    term: string,
    cancelExecutor: Function
  ) => Promise<any[]> | undefined;
  deferLoad: (data?: Object, isRef?: boolean) => Promise<Option[]>;
  onChange: (value: Array<Option> | Option) => void;
}

export interface UserSelectState {
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
}

export class UserSelect extends React.Component<
  UserSelectProps,
  UserSelectState
> {
  cancelSearch?: Function;
  sortable?: Sortable;
  unmounted = false;

  constructor(props: UserSelectProps) {
    super(props);
    this.state = {
      isOpened: false,
      isSelectOpened: false,
      inputValue: '',
      options: [],
      breadList: [],
      searchList: [],
      tempSelection: [],
      selection: props.selectedOptions || [],
      isSearch: false,
      searchLoading: false,
      isEdit: false
    };
  }

  static defaultProps = {};

  componentDidMount() {}

  componentDidUpdate(prevProps: UserSelectProps) {
    let {options, value} = this.props;
    if (prevProps.options !== options) {
      if (
        options &&
        options.length === 1 &&
        options[0].leftOptions &&
        Array.isArray(options[0].children)
      ) {
        let leftOptions = options[0].leftOptions as Option[];
        this.setState({
          options: leftOptions
        });
      } else {
        // 部门选择
        this.setState({
          options: options
        });
      }
    }

    if (
      JSON.stringify(value) !== JSON.stringify(prevProps.value) ||
      JSON.stringify(options) !== JSON.stringify(prevProps.options)
    ) {
      const selection: Array<Option> = value2array(value, this.props);
      this.setState({
        selection
      });
    }
  }

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
      searchLoading: false
    });
  }

  @autobind
  handleSearch(text: string) {
    if (text) {
      this.setState(
        {
          isSearch: true,
          searchLoading: true,
          inputValue: text
        },
        () => {
          // 如果有取消搜索，先取消掉。
          this.cancelSearch && this.cancelSearch();
          this.lazySearch(text);
        }
      );
    } else {
      this.handleSeachCancel();
    }
  }

  @autobind
  handleSeachCancel() {
    this.setState({
      isSearch: false,
      searchLoading: false,
      inputValue: ''
    });
  }

  lazySearch = debounce(
    (text: string) => {
      (async (text: string) => {
        const onSearch = this.props.onSearch!;
        let result = await onSearch(
          text,
          (cancelExecutor: () => void) => (this.cancelSearch = cancelExecutor)
        );
        if (this.unmounted) {
          return;
        }

        if (!Array.isArray(result)) {
          throw new Error('onSearch 需要返回数组');
        }

        this.setState({
          searchList: result,
          searchLoading: false
        });
      })(text).catch(e => {
        this.setState({searchLoading: false});
        console.error(e);
      });
    },
    250,
    {
      trailing: true,
      leading: false
    }
  );

  swapSelectPosition(oldIndex: number, newIndex: number) {
    const tempSelection = this.state.tempSelection;
    tempSelection.splice(newIndex, 0, tempSelection.splice(oldIndex, 1)[0]);
    this.setState({tempSelection});
  }

  @autobind
  dragRef(ref: any) {
    if (ref) {
      this.initDragging();
    }
  }

  initDragging() {
    const ns = this.props.classPrefix;
    this.sortable = new Sortable(
      document.querySelector(`.${ns}UserSelect-checkContent`) as HTMLElement,
      {
        group: `UserSelect-checkContent`,
        animation: 150,
        handle: `.${ns}UserSelect-dragBar`,
        ghostClass: `${ns}UserSelect--dragging`,
        onEnd: (e: any) => {
          if (!this.state.isEdit || e.newIndex === e.oldIndex) {
            return;
          }
          const parent = e.to as HTMLElement;
          if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
          } else {
            parent.appendChild(e.item);
          }
          this.swapSelectPosition(e.oldIndex, e.newIndex);
        }
      }
    );
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
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
    this.setState({
      isOpened: false,
      inputValue: '',
      isSearch: false,
      searchList: [],
      breadList: []
    });
  }

  @autobind
  async handleExpand(option: Option) {
    const {deferLoad, isRef} = this.props;
    if (!option.loaded) {
      option.loaded = true;
      if (isRef) {
        // 部门、人员一起加载
        const res = await Promise.all([
          deferLoad(option),
          deferLoad({...option, ref: option.value}, true)
        ]);
        option.children = flatten(res);
      } else {
        // 只加载部门
        const res = await deferLoad(option);
        option.children = res || [];
      }
    }

    const breadList = this.state.breadList;
    breadList.push(option);
    this.setState({
      breadList
    });
  }

  @autobind
  handleSelectChange(option: Option) {
    const {multiple, onChange, valueField = 'value'} = this.props;
    let selection = this.state.selection.slice();
    let selectionVals = selection.map((option: Option) => option[valueField]);
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

    onChange(multiple ? selection : selection?.[0]);
    this.setState({
      selection
    });
    return false;
  }

  @autobind
  onDelete(option: Option, isTemp: boolean = false) {
    const {valueField = 'value'} = this.props;
    const {tempSelection, selection} = this.state;
    let _selection = isTemp ? tempSelection : selection;
    _selection = _selection.filter(
      (item: Option) => item[valueField] !== option[valueField]
    );
    if (isTemp) {
      this.setState({tempSelection: _selection});
    } else {
      this.setState({selection: _selection});
    }
  }

  @autobind
  handleBreadChange(option: Option, index: number) {
    const breadList = this.state.breadList.slice(0, index);
    this.setState({
      breadList
    });
  }

  @autobind
  handleEdit() {
    const {multiple, onChange} = this.props;
    const {isEdit, tempSelection} = this.state;
    if (isEdit) {
      this.setState({
        isSelectOpened: false,
        isEdit: false,
        selection: tempSelection
      });
      onChange(multiple ? tempSelection : tempSelection?.[0]);
    } else {
      this.setState({
        isEdit: true
      });
    }
  }

  renderIcon(option: Option, isSelect?: boolean) {
    const {labelField, classnames: cx, isRef} = this.props;
    const {isSearch} = this.state;

    if (!option.icon) {
      if (option.isRef || ((isSearch || isSelect) && isRef)) {
        return (
          <span className={cx('UserSelect-text-userPic')}>
            {option[labelField || 'label'].slice(0, 1)}
          </span>
        );
      } else {
        // 没有icon默认返回部门图标
        return (
          <span className={cx('icon', 'UserSelect-icon-box', 'department')}>
            <Icon icon="department" className="icon" />
          </span>
        );
      }
    }
    // 支持角色、岗位等图标配置
    let IconHtml;
    switch (option.icon) {
      case 'user-default-department':
        IconHtml = (
          <span className={cx('icon', 'UserSelect-icon-box', 'department')}>
            <Icon icon="department" className="icon" />
          </span>
        );
        break;
      case 'user-default-role':
        IconHtml = (
          <span className={cx('icon', 'UserSelect-icon-box', 'role')}>
            <Icon icon="role" className="icon" />
          </span>
        );
        break;
      case 'user-default-post':
        IconHtml = (
          <span className={cx('icon', 'UserSelect-icon-box', 'post')}>
            <Icon icon="post" className="icon" />
          </span>
        );
        break;
      case '':
        IconHtml = (
          <span className={cx('UserSelect-text-userPic')}>
            {option[labelField || 'label'].slice(0, 1)}
          </span>
        );
        break;
      default:
        IconHtml = (
          <img src={option.icon} className={cx('UserSelect-userPic')} />
        );
    }
    return IconHtml;
  }

  renderList(
    options: Array<object> = [],
    key?: number | string,
    isSearch?: boolean
  ) {
    const {
      classnames: cx,
      valueField = 'value',
      labelField = 'label',
      isDep,
      isRef,
      translate: __
    } = this.props;

    const {selection} = this.state;

    const checkValues = selection.map((item: Option) => item[valueField]);

    return options.length ? (
      <div className={cx('UserSelect-memberList-box')} key={key}>
        <ul className={cx(`UserSelect-memberList`)} key={key}>
          {options.map((option: Option, index: number) => {
            const hasChildren =
              (isRef && !option.isRef) ||
              (isDep && (option.defer || option.children?.length));
            const checkVisible =
              (isDep && isRef) ||
              (isRef && option.isRef) ||
              (isDep && !isRef) ||
              isSearch;

            const userIcon = this.renderIcon(option);

            return (
              <li key={index}>
                {checkVisible ? (
                  <Checkbox
                    size="sm"
                    checked={checkValues.includes(option[valueField])}
                    label={''}
                    onChange={() => this.handleSelectChange(option)}
                  />
                ) : null}
                <span
                  className={cx('UserSelect-memberName')}
                  onClick={() =>
                    checkVisible
                      ? this.handleSelectChange(option)
                      : hasChildren && this.handleExpand(option)
                  }
                >
                  {userIcon ? (
                    <span className={cx('UserSelect-userPic-box')}>
                      {userIcon}
                    </span>
                  ) : null}

                  <span className={cx('UserSelect-label')}>
                    {option[labelField]}
                  </span>
                </span>

                {!isSearch && hasChildren ? (
                  <span
                    className={cx(`UserSelect-more`)}
                    onClick={() => this.handleExpand(option)}
                  >
                    <Icon icon="caret" className="icon" />
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    ) : (
      <div className={cx(`UserSelect-noRecord`)}>
        {__('placeholder.noOption')}~
      </div>
    );
  }

  renderselectList(options: Array<object> = []) {
    const {
      classnames: cx,
      labelField = 'label',
      valueField = 'value',
      translate: __
    } = this.props;
    const {isEdit} = this.state;

    return options.length ? (
      <div className={cx('UserSelect-selection-wrap')}>
        <ul
          className={cx(`UserSelect-selection`, `UserSelect-checkContent`)}
          ref={this.dragRef}
        >
          {options.map((option: Option, index: number) => {
            const userIcon = this.renderIcon(option, true);
            const options = this.state.options;
            const originOption = findTree(
              options,
              (item: Option) => item[valueField] === option[valueField]
            );
            return (
              <li key={index}>
                {isEdit ? (
                  <span
                    className={cx(`UserSelect-del`)}
                    onClick={() => this.onDelete(option, true)}
                  >
                    <Icon icon="user-remove" className="icon" />
                  </span>
                ) : null}

                <span className={cx(`UserSelect-memberName`)}>
                  {userIcon ? (
                    <span className={cx('UserSelect-userPic-box')}>
                      {userIcon}
                    </span>
                  ) : null}

                  <span className={cx('UserSelect-label')}>
                    {originOption
                      ? originOption[labelField]
                      : option[labelField]}
                  </span>
                </span>
                <a className={cx('UserSelect-dragBar')}>
                  <Icon icon="drag-bar" className={cx('icon')} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    ) : (
      <div className={cx(`UserSelect-noRecord`)}>
        {__('placeholder.noOption')}~
      </div>
    );
  }

  render() {
    let {
      classnames: cx,
      translate: __,
      showNav,
      value,
      labelField = 'label',
      valueField = 'value',
      navTitle = '选人',
      placeholder = '请选择',
      searchPlaceholder = '请输入',
      searchable,
      onChange
    } = this.props;

    const {
      isOpened,
      isSearch,
      breadList,
      options,
      selection,
      tempSelection,
      searchList,
      searchLoading,
      isSelectOpened,
      isEdit
    } = this.state;

    return (
      <div className={cx('UserSelect')}>
        <ResultBox
          className={cx('UserSelect-input', isOpened ? 'is-active' : '')}
          allowInput={false}
          result={value}
          onResultChange={value => onChange(value)}
          onResultClick={this.onOpen}
          placeholder={placeholder}
          useMobileUI
        />
        <PopUp
          isShow={isOpened}
          className={cx(`UserSelect-popup`)}
          onHide={this.onClose}
          showClose={false}
        >
          <div className={cx(`UserSelect-wrap`)}>
            {showNav ? (
              <div className={cx('UserSelect-navbar')}>
                <span className="left-arrow-box" onClick={this.handleBack}>
                  <Icon icon="left-arrow" className="icon" />
                </span>
                <div className={cx('UserSelect-navbar-title')}>{navTitle}</div>
              </div>
            ) : null}

            {/* 搜索 */}
            {searchable ? (
              <div className={cx('UserSelect-searchBox')}>
                <InputBox
                  className={cx(`UserSelect-search`)}
                  value={this.state.inputValue}
                  onChange={this.handleSearch}
                  placeholder={searchPlaceholder}
                  clearable={false}
                >
                  {this.state.isSearch ? (
                    <a onClick={this.handleSeachCancel}>
                      <Icon icon="close" className="icon" />
                    </a>
                  ) : (
                    <Icon icon="search" className="icon" />
                  )}
                </InputBox>
              </div>
            ) : null}

            {/* 面包屑 */}
            {breadList.length ? (
              <div className={cx('UserSelect-breadcrumb')}>
                {breadList
                  .map<React.ReactNode>((item, index) => (
                    <span
                      className={cx('UserSelect-breadcrumb-item')}
                      key={index}
                      onClick={() => this.handleBreadChange(item, index)}
                    >
                      {item[labelField]}
                    </span>
                  ))
                  .reduce((prev, curr, index) => [
                    prev,
                    <Icon
                      icon="caret"
                      className={cx('UserSelect-breadcrumb-separator', 'icon')}
                      key={`separator-${index}`}
                    />,
                    curr
                  ])}
              </div>
            ) : null}

            {selection.length ? (
              <div className={cx(`UserSelect-resultBox`)}>
                <ul className={cx(`UserSelect-selectList`)}>
                  {selection.map((item: Option, index) => {
                    const originOption = findTree(
                      options,
                      (op: Option) => op[valueField] === item[valueField]
                    );
                    return (
                      <li
                        key={index}
                        className={cx('UserSelect-selectList-item')}
                      >
                        <span>
                          {originOption
                            ? originOption[labelField]
                            : item[labelField]}
                        </span>
                        <span
                          className={cx('UserSelect-selectList-item-closeBox')}
                          onClick={() => this.onDelete(item)}
                        >
                          <Icon icon="close" className="icon" />
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <span
                  className={cx('UserSelect-selectSort-box')}
                  onClick={() =>
                    this.setState({
                      isSelectOpened: true,
                      tempSelection: selection.slice()
                    })
                  }
                >
                  <Icon
                    icon="menu"
                    className={cx('UserSelect-selectSort', 'icon')}
                  />
                </span>
              </div>
            ) : null}

            {isSearch ? (
              searchLoading ? (
                <div className={cx(`UserSelect-searchLoadingBox`)}>
                  <Spinner />
                </div>
              ) : (
                <div className={cx('UserSelect-searchResult')}>
                  {this.renderList(searchList, -1, true)}
                </div>
              )
            ) : (
              <div className={cx(`UserSelect-contentBox`)}>
                <div
                  className={cx(`UserSelect-scroll`)}
                  style={{
                    width: 100 * (breadList.length + 1) + 'vw',
                    left: -breadList.length * 100 + 'vw'
                  }}
                >
                  {this.renderList(options)}

                  {breadList.map((option: Option, index: number) => {
                    const treeOption = findTree(
                      options,
                      optionValueCompare(
                        option[valueField],
                        valueField || 'value'
                      )
                    ) as Option;
                    const children = treeOption.children;
                    const hasChildren = Array.isArray(children) && children;

                    return hasChildren ? (
                      this.renderList(children, option[valueField])
                    ) : (
                      <div className={cx(`UserSelect-spinnerBox`)} key={index}>
                        <Spinner />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </PopUp>

        <PopUp
          isShow={isSelectOpened}
          className={cx(`UserSelect-selectPopup`)}
          onHide={() => this.setState({isSelectOpened: false})}
          showClose={false}
        >
          <div className={cx('UserSelect-selectBody')}>
            <div className={cx('UserSelect-navbar')}>
              <span
                className="left-arrow-box"
                onClick={() =>
                  this.setState({
                    isSelectOpened: false
                  })
                }
              >
                <Icon icon="left-arrow" className="icon" />
              </span>
              <div className={cx('UserSelect-navbar-title')}>
                {__('UserSelect.resultSort')}
              </div>
              <span
                className={cx('UserSelect-navbar-btnEdit')}
                onClick={this.handleEdit}
              >
                {isEdit ? __('UserSelect.save') : __('UserSelect.edit')}
              </span>
            </div>

            <div className={cx('UserSelect-selectList-box')}>
              <div className={cx('UserSelect-select-head')}>
                <span className={cx('UserSelect-select-head-text')}>
                  {__('UserSelect.selected')}
                </span>
                {isEdit ? (
                  <span
                    className={cx('UserSelect-select-head-btnClear')}
                    onClick={() => this.setState({tempSelection: []})}
                  >
                    {__('UserSelect.clear')}
                  </span>
                ) : null}
              </div>
              {this.renderselectList(tempSelection)}
            </div>
          </div>
        </PopUp>
      </div>
    );
  }
}

export default themeable(localeable(UserSelect));
