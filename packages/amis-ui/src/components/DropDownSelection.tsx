import React from 'react';
import {findDOMNode} from 'react-dom';
import {BaseSelection, BaseSelectionProps} from './Selection';
import {SpinnerExtraProps} from './Spinner';
import PopOverContainer from './PopOverContainer';
import ListSelection from './GroupedSelection';
import TreeSelection from './TreeSelection';
import ResultBox from './ResultBox';
import {
  ThemeProps,
  themeable,
  localeable,
  LocaleProps,
  findTree,
  noop,
  isMobile
} from 'amis-core';
import {Icon} from './icons';
import SearchBox from './SearchBox';

export interface DropDownSelectionProps
  extends ThemeProps,
    LocaleProps,
    SpinnerExtraProps,
    BaseSelectionProps {
  options: Array<any>;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
  searchable?: boolean;
  popOverContainer?: any;
  mode?: 'list' | 'tree';
}

export interface DropDownSelectionState {
  searchText: string;
}

class DropDownSelection extends BaseSelection<
  DropDownSelectionProps,
  DropDownSelectionState
> {
  constructor(props: DropDownSelectionProps) {
    super(props);
    this.state = {
      searchText: ''
    };
    this.onSearch = this.onSearch.bind(this);
    this.filterOptions = this.filterOptions.bind(this);
  }

  onSearch(text: string) {
    let txt = text.toLowerCase();

    this.setState({searchText: txt});
  }

  filterOptions(options: any[]) {
    const {valueField = 'value'} = this.props;
    const txt = this.state.searchText;
    if (!txt) {
      return this.props.options;
    }
    return options
      .map((item: any) => {
        if (item.children) {
          let children = item.children.filter((child: any) => {
            return (
              child[valueField].toLowerCase().includes(txt) ||
              child.label.toLowerCase().includes(txt)
            );
          });
          return children.length > 0
            ? Object.assign({}, item, {children}) // 需要copy一份，防止覆盖原始数据
            : false;
        } else {
          return item[valueField].toLowerCase().includes(txt) ||
            item.label.toLowerCase().includes(txt)
            ? item
            : false;
        }
      })
      .filter((item: any) => {
        return !!item;
      });
  }

  // 选了值，还原options
  onPopClose(onClose: () => void) {
    this.setState({searchText: ''});
    onClose();
  }

  render() {
    const {
      options,
      onChange,
      value,
      classnames: cx,
      disabled,
      translate: __,
      searchable,
      mode = 'list',
      valueField = 'value',
      option2value,
      loadingConfig,
      popOverContainer
    } = this.props;

    return (
      <PopOverContainer
        useMobileUI
        popOverContainer={popOverContainer || (() => findDOMNode(this))}
        popOverRender={({onClose}) => (
          <div>
            {searchable ? (
              <SearchBox mini={false} onSearch={this.onSearch} />
            ) : null}
            {mode === 'list' ? (
              <ListSelection
                multiple={false}
                onClick={() => this.onPopClose(onClose)}
                options={this.filterOptions(this.props.options)}
                value={value}
                option2value={option2value}
                onChange={(value: any) => {
                  onChange(Array.isArray(value) ? value[0] : value);
                }}
              />
            ) : (
              <TreeSelection
                className={'is-scrollable'}
                multiple={false}
                options={this.filterOptions(this.props.options)}
                value={value}
                loadingConfig={loadingConfig}
                onChange={(value: any) => {
                  this.onPopClose(onClose);
                  onChange(value[valueField]);
                }}
              />
            )}
          </div>
        )}
      >
        {({onClick, ref, isOpened}) => (
          <div className={cx('DropDownSelection')}>
            <ResultBox
              className={cx(
                'DropDownSelection-input',
                isOpened ? 'is-active' : ''
              )}
              ref={ref}
              allowInput={false}
              result={
                value
                  ? findTree(options, item => item[valueField] === value)
                  : ''
              }
              onResultChange={noop}
              onResultClick={onClick}
              placeholder={__('Condition.field_placeholder')}
              disabled={disabled}
              useMobileUI
            >
              {!isMobile() ? (
                <span className={cx('DropDownSelection-caret')}>
                  <Icon icon="caret" className="icon" />
                </span>
              ) : null}
            </ResultBox>
          </div>
        )}
      </PopOverContainer>
    );
  }
}

export default themeable(localeable(DropDownSelection));
