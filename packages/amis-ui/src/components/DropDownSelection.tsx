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
  filterTree,
  noop
} from 'amis-core';
import {matchSorter} from 'match-sorter';

import {Icon} from './icons';
import SearchBox from './SearchBox';
import {Option} from './Select';
import type {TestIdBuilder} from 'amis-core';

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
  testIdBuilder?: TestIdBuilder;
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
    this.setState({searchText: text});
  }

  filterOptions(options: any[]) {
    const {valueField = 'value', labelField} = this.props;
    const text = this.state.searchText;
    if (!text) {
      return this.props.options;
    }
    return filterTree(
      options,
      (option: Option, key: number, level: number, paths: Array<Option>) => {
        return !!(
          (Array.isArray(option.children) && option.children.length) ||
          !!matchSorter([option].concat(paths), text, {
            keys: [labelField || 'label', valueField || 'value'],
            threshold: matchSorter.rankings.CONTAINS
          }).length
        );
      },
      0,
      true
    );
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
      popOverContainer,
      testIdBuilder,
      mobileUI,
      classPrefix: ns
    } = this.props;

    return (
      <PopOverContainer
        mobileUI={mobileUI}
        overlayWidthField="width"
        popOverContainer={popOverContainer || (() => findDOMNode(this))}
        popOverRender={({onClose}) => (
          <div>
            {searchable ? (
              <SearchBox
                className={cx(`${ns}DropDownSelection-searchbox`)}
                mini={false}
                onSearch={this.onSearch}
                testIdBuilder={testIdBuilder?.getChild('searchbox')}
              />
            ) : null}
            {mode === 'list' ? (
              <ListSelection
                multiple={false}
                onClick={() => this.onPopClose(onClose)}
                options={this.filterOptions(this.props.options)}
                value={value}
                option2value={option2value}
                testIdBuilder={testIdBuilder?.getChild('selection')}
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
                testIdBuilder={testIdBuilder?.getChild('selection')}
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
              mobileUI={mobileUI}
              testIdBuilder={testIdBuilder?.getChild('resultbox')}
            >
              {!mobileUI ? (
                <span className={cx('DropDownSelection-caret')}>
                  <Icon icon="right-arrow-bold" className="icon" />
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
