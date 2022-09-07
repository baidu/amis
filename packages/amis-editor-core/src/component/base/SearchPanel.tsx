import React from 'react';
import {observer} from 'mobx-react';
import {Icon, InputBox} from 'amis';
import cx from 'classnames';
import {autobind} from '../../util';
import isString from 'lodash/isString';

/**
 * 通用搜索功能组件，附带以下功能：
 * 1、搜索历史：会自动记录用户搜索过的关键字，方便用户下次使用；
 * 2、自动提示补全：autoComplete 设置为 true 后，每次输入关键字后会展示当前所有含有关键字的信息（并以分类的形式展示）；
 * 3、搜索分类：取决于当前搜索数据结构是否带tag，如果不带tag则不展示搜索分类；
 */
interface SearchProps {
  allResult: Array<any>; // 当前所有可用搜索数据
  searchPanelUUID: string; // 搜索面板ID，需要确保唯一，前端web存储搜索记录需要
  closeAutoComplete?: boolean; // 是否关闭 autoComplete，默认开启
  externalKeyword?: string; // 外部记录的搜索关键字：主要用于外部主动触发搜索操作
  tagKey?: string; // 根据搜索结果中的那个字段进行分类，默认为 ‘tags’
  onChange: (keyword: string) => void; // 搜索关键字变动时执行
  onTagChange?: (tag: string) => void; // 点击搜索分类时执行
  immediateChange?: boolean; // 是否开启即时反馈，数值变动立即触发onChange，默认为false
}

interface SearchStates {
  resultTags: Array<string>; // 存储当前所有分类，不随搜索关键字变化
  resultByTag: {
    // 按tag分类存放allResult中的数据: 不随搜索关键字变化
    [propName: string]: Array<any>;
  };
  curKeyword: string; // 当前搜索关键字
  searchResult: Array<any>; // 存储匹配当前搜索关键字的结果数据: 随搜索关键字变化
  searchResultByTag: {
    // 用于存储含有当前搜索关键字的列表（按tag分类存放）: 随搜索关键字变化
    [propName: string]: Array<any>;
  };
  visible: boolean; // 用于控制是否显示搜索下拉面板
  curKeywordSearchHistory: string[]; // 历史搜索记录
  toggleTagFolderStatus: boolean;
}
@observer
export default class SearchPanel extends React.Component<
  SearchProps,
  SearchStates
> {
  ref = React.createRef<HTMLDivElement>();
  curInputBox: any;
  localStorageKey = 'amis-editor-search-panel';
  // 用于搜索联动面板（autoComplete）中的分类展示折叠状态
  curTagFolded: {
    [propName: string]: boolean;
  } = {};
  lastSearchTag: string; // 用于记录上一次的tag

  constructor(props: any) {
    super(props);

    if (props.searchPanelUUID) {
      this.localStorageKey = props.searchPanelUUID;
    }

    let curResultTags: Array<string> = [];
    let curResultByTag: {
      [propName: string]: Array<any>;
    } = {};
    if (props.allResult && props.allResult.length > 0) {
      // 获取分类信息
      const curResultTagsObj = this.getResultTags(props.allResult);
      curResultTags = curResultTagsObj.curResultTags;
      curResultByTag = curResultTagsObj.curResultByTag;
    }

    this.state = {
      resultTags: curResultTags,
      resultByTag: curResultByTag,
      curKeyword: props.externalKeyword || '',
      searchResult: [],
      searchResultByTag: {},
      visible: false,
      curKeywordSearchHistory: this.getSearchHistory(),
      toggleTagFolderStatus: true
    };
  }

  componentDidMount() {
    if (this.ref.current?.childNodes[0]?.childNodes[0]) {
      this.curInputBox = this.ref.current.childNodes[0].childNodes[0];
      this.curInputBox.addEventListener('keyup', this.bindEnterEvent);
    }
  }

  componentWillUnmount() {
    if (this.curInputBox) {
      this.curInputBox.removeEventListener('keyup', this.bindEnterEvent);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    const {externalKeyword, allResult} = nextProps;
    // 当externalKeyword在外部发现变动，则将其值同步给curKeyword，并执行一次搜索
    if (externalKeyword !== this.state.curKeyword) {
      this.setState(
        {
          curKeyword: externalKeyword,
        },
        () => {
          this.groupedResultByKeyword(externalKeyword);
        }
      );
    }
    // 外部搜索数据变更时
    if (allResult !== this.props.allResult) {
      let curResultTags: string[] = [];
      let curResultByTag: {
        [propName: string]: any[];
      } = {};
      if (allResult && allResult.length > 0) {
        // 获取分类信息
        const curResultTagsObj = this.getResultTags(allResult);
        curResultTags = curResultTagsObj.curResultTags;
        curResultByTag = curResultTagsObj.curResultByTag;
      }
      this.setState({
        resultTags: curResultTags,
        resultByTag: curResultByTag,
      });
    }
  }

  @autobind
  getSearchHistory() {
    let searchHistory = [];
    if (window.localStorage) {
      const historyDataStr = window.localStorage.getItem(this.localStorageKey);
      if (historyDataStr) {
        const historyData = JSON.parse(historyDataStr);
        if (historyData && Array.isArray(historyData)) {
          searchHistory = historyData;
        }
      }
    }
    return searchHistory;
  }

  /**
   * 从搜索数据中获取分类信息，并按分类存放搜索数据，方便后续通过分类直接获取搜索数据
   */
  getResultTags(allResult: Array<any>) {
    let curResultTags: Array<string> = [];
    let curResultByTag: {
      [propName: string]: Array<any>;
    } = {};
    const curTagKey = this.props.tagKey || 'tags';

    allResult.forEach(item => {
      if (!isString(item) && item[curTagKey]) {
        const tags = Array.isArray(item.tags)
          ? item.tags.concat()
          : item.tags
          ? [item.tags]
          : ['其他'];
        tags.forEach((tag: string) => {
          if (curResultTags.indexOf(tag) < 0) {
            curResultTags.push(tag);
          }
          if (curResultByTag[tag]) {
            curResultByTag[tag].push(item);
          } else {
            curResultByTag[tag] = [];
            curResultByTag[tag].push(item);
          }
        });
      }
    });

    return {
      curResultTags,
      curResultByTag
    };
  }

  /**
   * 根据关键字过滤数据，按分组存放
   */
  groupedResultByKeyword(keywords?: string) {
    const {allResult} = this.props;
    let curSearchResult: Array<any> = [];
    let curSearchResultByTag: {
      [propName: string]: Array<any>;
    } = {};
    const curKeyword = keywords ? keywords : this.state.curKeyword;
    const grouped: {
      [propName: string]: Array<any>;
    } = {};
    const regular = curKeyword ? new RegExp(curKeyword, 'i') : null;

    allResult.forEach(item => {
      if (isString(item) && regular && regular.test(item)) {
        // 兼容字符串类型
        curSearchResult.push(item);
      } else if (
        !keywords ||
        ['name', 'description', 'scaffold.type'].some(
          key => item[key] && regular && regular.test(item[key])
        )
      ) {
        if (item.tags) {
          const tags = Array.isArray(item.tags)
            ? item.tags.concat()
            : item.tags
            ? [item.tags]
            : ['其他'];
          tags.forEach((tag: string) => {
            curSearchResultByTag[tag] = grouped[tag] || [];
            curSearchResultByTag[tag].push(item);
          });
        } else {
          curSearchResult.push(item);
        }
      }
    });

    // 更新当前搜索结果数据（备注: 附带重置功能）
    this.setState({
      searchResult: curSearchResult,
      searchResultByTag: curSearchResultByTag
    });
  }

  @autobind
  bindFocusEvent() {
    this.setState({
      visible: true
    });
  }

  @autobind
  bindBlurEvent() {
    const {curKeyword} = this.state;
    this.setState(
      {
        visible: false
      },
      () => {
        if (curKeyword) {
          this.addSearchHistory(curKeyword);
        }
        this.props.onChange(curKeyword);
      }
    );
  }

  @autobind
  updateCurKeyword(keywords: string) {
    let curKeyword = keywords;
    curKeyword = curKeyword ? curKeyword.trim() : curKeyword;
    this.setState(
      {
        curKeyword: curKeyword
      },
      () => {
        this.groupedResultByKeyword(curKeyword);
        if (this.props.immediateChange) {
          this.props.onChange(curKeyword);
        }
      }
    );
  }

  // 改变折叠状态
  @autobind
  changeTagFoldStatus(tagKey: string, event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.curInputBox.focus(); // 让输入框获取焦点
    this.curTagFolded[tagKey] = !this.curTagFolded[tagKey];
    this.setState({
      toggleTagFolderStatus: !this.state.toggleTagFolderStatus
    });
  }

  // 快捷键事件
  @autobind
  bindEnterEvent(event: any) {
    event.preventDefault();
    const {curKeyword} = this.state;
    if (event?.keyCode === 13) {
      // Enter 快捷键
      this.setState(
        {
          visible: false
        },
        () => {
          // enter执行搜索后记录当前查询关键字
          this.addSearchHistory(curKeyword);
          this.props.onChange(curKeyword);
        }
      );
    }
  }

  /** 删除搜索关键字 */
  @autobind
  bindClearActionEvent() {
    this.setState(
      {
        curKeyword: '',
        searchResult: [],
        searchResultByTag: {}
      },
      () => {
        this.props.onChange('');
      }
    );
  }

  /** 组件分类tag点击事件 */
  @autobind
  bindTagClickEvent(tag: string) {
    const searchResult = this.state.resultByTag[tag];
    this.setState(
      {
        visible: false,
        curKeyword: tag,
        searchResult: searchResult,
        searchResultByTag: {
          [tag]: searchResult
        }
      },
      () => {
        this.props.onTagChange && this.props.onTagChange(tag);
      }
    );
  }

  /** 添加搜索历史 */
  @autobind
  addSearchHistory(newKeywords: string) {
    const {curKeywordSearchHistory} = this.state;
    // 判断是否有相同的搜索记录
    if (curKeywordSearchHistory.indexOf(newKeywords) > -1) {
      return;
    }
    // 最多存储10条搜索记录
    if (curKeywordSearchHistory.length === 10) {
      curKeywordSearchHistory.shift();
      curKeywordSearchHistory.push(newKeywords);
    } else {
      curKeywordSearchHistory.push(newKeywords);
    }
    this.updateSearchHistory();
  }

  /** 搜索历史/点击 */
  @autobind
  clickKeywordEvent(keywords: string) {
    this.setState(
      {
        visible: false,
        curKeyword: keywords
      },
      () => {
        this.groupedResultByKeyword(keywords);
        this.props.onChange(keywords);
      }
    );
  }

  @autobind
  deleteSearchHistory(event: any, newKeywords: string) {
    event.preventDefault();
    event.stopPropagation();
    this.curInputBox.focus(); // 让输入框获取焦点
    const {curKeywordSearchHistory} = this.state;
    const deleteKeywordIndex = curKeywordSearchHistory.indexOf(newKeywords);
    curKeywordSearchHistory.splice(deleteKeywordIndex, 1);
    this.updateSearchHistory();
  }

  @autobind
  clearSearchHistory(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.curInputBox.focus(); // 让输入框获取焦点
    const {curKeywordSearchHistory} = this.state;
    if (curKeywordSearchHistory && curKeywordSearchHistory.length > 0) {
      this.setState(
        {
          curKeywordSearchHistory: []
        },
        () => {
          this.updateSearchHistory();
        }
      );
    }
  }

  /** 将搜索记录保存到localStorage */
  @autobind
  updateSearchHistory() {
    if (window.localStorage) {
      const {curKeywordSearchHistory} = this.state;
      window.localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(curKeywordSearchHistory)
      );
    }
  }

  /** 显示搜索关键字 */
  @autobind
  renderNameByKeyword(rendererName: string, curKeyword: string) {
    if (curKeyword && ~rendererName.indexOf(curKeyword)) {
      const keywordStartIndex = rendererName.indexOf(curKeyword);
      const keywordEndIndex = keywordStartIndex + curKeyword.length;
      return (
        <span>
          {rendererName.substring(0, keywordStartIndex)}
          <span className="is-keyword">{curKeyword}</span>
          {rendererName.substring(keywordEndIndex)}
        </span>
      );
    } else {
      return rendererName;
    }
  }

  /** 判断搜索展示内容是否有滚动（交互优化） */
  @autobind
  resultIsHasScroll(
    searchSubRenderers: {
      [propName: string]: Array<any>;
    },
    maxShowLine: number
  ) {
    let curShowLine = 0;
    const curSearchKwTag = searchSubRenderers
      ? Object.keys(searchSubRenderers)
      : [];
    curSearchKwTag.map((tag: string) => {
      if (!!this.curTagFolded[tag]) {
        curShowLine += 1;
      } else {
        curShowLine += searchSubRenderers[tag].length + 1;
      }
    });
    return curShowLine > maxShowLine; // isHasScroll
  }

  render() {
    const {allResult, closeAutoComplete, immediateChange} = this.props;
    const {
      resultTags,
      curKeyword,
      searchResult,
      searchResultByTag,
      visible
    } = this.state;
    const searchResultTags = searchResultByTag
      ? Object.keys(searchResultByTag)
      : [];
    const curKeywordSearchHistory = [
      ...this.state.curKeywordSearchHistory
    ].reverse();
    let isShowSearchPanel = false;
    if (visible && allResult && allResult.length > 0) {
      isShowSearchPanel = true;
    }
    // 关闭 autoComplete 时不需要展示搜索列表
    if (closeAutoComplete && curKeyword) {
      isShowSearchPanel = false;
    }

    // 关闭 autoComplete 时，当历史记录和搜索分类都为空时也不展示
    if (
      closeAutoComplete &&
      (!resultTags || (resultTags && resultTags.length === 0)) &&
      (!curKeywordSearchHistory ||
        (curKeywordSearchHistory && curKeywordSearchHistory.length === 0))
    ) {
      isShowSearchPanel = false;
    }

    return (
      <div className="editor-InputSearch-panel" ref={this.ref}>
        <InputBox
          className="editor-InputSearch"
          value={curKeyword}
          onChange={this.updateCurKeyword}
          placeholder={'输入关键字查询组件'}
          clearable={false}
          onFocus={this.bindFocusEvent}
          onBlur={this.bindBlurEvent}
        >
          <>
            {immediateChange &&
              (curKeyword ? (
                <Icon
                  icon="search-clear"
                  className="icon delete-btn-icon"
                  onClick={this.bindClearActionEvent}
                />
              ) : (
                <Icon
                  icon="editor-search"
                  className="icon"
                  onClick={this.bindBlurEvent}
                />
              ))}
            {!immediateChange && (
              <>
                {curKeyword && (
                  <Icon
                    icon="search-clear"
                    className="icon delete-btn-icon margin-right"
                    onClick={this.bindClearActionEvent}
                  />
                )}
                <Icon
                  icon="editor-search"
                  className="icon"
                  onClick={this.bindBlurEvent}
                />
              </>
            )}
          </>
        </InputBox>
        <div
          className={`editor-InputSearch-content ${
            isShowSearchPanel ? '' : 'hidden-status'
          }`}
        >
          {!curKeyword &&
            curKeywordSearchHistory &&
            curKeywordSearchHistory.length > 0 && (
              <div
                className={`search-history ${
                  resultTags && resultTags.length > 0 ? 'has-border-bottom' : ''
                }`}
              >
                <div className="header">
                  <div className="header-title">搜索历史</div>
                  <div
                    className="header-clear-icon"
                    onClick={(event: any) => this.clearSearchHistory(event)}
                  >
                    清空
                  </div>
                </div>
                <div
                  className={`history-cont ${
                    curKeywordSearchHistory.length > 6 ? 'hasScrollBtn' : ''
                  }`}
                >
                  {curKeywordSearchHistory.map((keyword, index) => (
                    <div
                      className="history-item"
                      key={`${keyword}-${index}`}
                      onClick={() => this.clickKeywordEvent(keyword)}
                    >
                      <div className="history-keyword">{keyword}</div>
                      <div className="delete-icon" title="点击删除这条搜索记录">
                        <Icon
                          icon="close"
                          onClick={(event: any) =>
                            this.deleteSearchHistory(event, keyword)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          {curKeyword &&
            searchResult.length === 0 &&
            searchResultTags.length === 0 && (
              <div className={`search-result-list`}>
                <div className="search-result-placeholder">
                  搜索结果为空，您可以换个关键字继续查找。
                </div>
              </div>
            )}
          {curKeyword && searchResult.length > 0 && (
            <div
              className={`search-result-list ${
                searchResult.length > 6 ? 'hasScrollBtn' : ''
              }`}
            >
              {searchResult.length > 1 && (
                <div className="subRenderers-list only-one-tag">
                  {searchResult.map((item2, itemIndex2) => (
                    <div
                      className="subRenderers-item"
                      key={`subRenderers-only-one-tag-${itemIndex2}`}
                      onClick={() => this.clickKeywordEvent(item2.name)}
                    >
                      {item2.name || item2.type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {curKeyword && searchResultTags.length > 0 && (
            <div
              className={`search-result-list ${
                this.resultIsHasScroll(searchResultByTag, 6)
                  ? 'hasScrollBtn'
                  : ''
              }`}
            >
              {searchResultTags.length > 1 &&
                searchResultTags.map((cTag, index) => (
                  <div
                    className="multiple-subRenderers-list"
                    key={`${cTag}-subRenderers-list`}
                  >
                    <div
                      className={cx('subRenderers-header', {
                        'is-folded': !!this.curTagFolded[cTag]
                      })}
                      title={
                        !!this.curTagFolded[cTag] ? '点击展开' : '点击折叠'
                      }
                      onClick={(event: any) => {
                        this.changeTagFoldStatus(cTag, event);
                      }}
                    >
                      {cTag}
                      <Icon icon="right-arrow-bold" />
                    </div>
                    <div
                      className={cx('subRenderers-list', {
                        'is-folded': !!this.curTagFolded[cTag]
                      })}
                    >
                      {searchResultByTag[cTag] &&
                        searchResultByTag[cTag].map((item, itemIndex) => (
                          <div
                            className="subRenderers-item"
                            key={itemIndex}
                            onClick={() => this.clickKeywordEvent(item.name)}
                          >
                            {this.renderNameByKeyword(item.name, curKeyword)}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              {searchResultTags.length === 1 &&
                searchResultTags.map((cTag2, index2) => (
                  <div
                    className="subRenderers-list only-one-tag"
                    key={`subRenderers-tag-${cTag2}`}
                  >
                    {searchResultByTag[cTag2] &&
                      searchResultByTag[cTag2].map((item2, itemIndex2) => (
                        <div
                          className="subRenderers-item"
                          key={`subRenderers-only-one-tag-${itemIndex2}`}
                          onClick={() => this.clickKeywordEvent(item2.name)}
                        >
                          {item2.name || item2.type}
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          )}
          {!curKeyword && resultTags && resultTags.length > 0 && (
            <div className="tag-list">
              <div className="header">组件分类</div>
              <div className="tag-list-cont">
                {resultTags.length
                  ? resultTags.map((tag, index) => (
                      <div
                        className="tag-item"
                        key={`${tag}-${index}`}
                        onClick={() => this.bindTagClickEvent(tag)}
                      >
                        {tag}
                      </div>
                    ))
                  : null}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
