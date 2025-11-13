import React from 'react';
import {findDomCompat as findDOMNode} from 'amis-core';
import {localeable, LocaleProps} from 'amis-core';
import {themeable, ThemeProps} from 'amis-core';
// @ts-ignore
import {matchSorter} from 'match-sorter';
import PopOverContainer from './PopOverContainer';
import SearchBox from './SearchBox';
import ListSelection from './GroupedSelection';
import InputBox from './InputBox';
import {Icon} from './icons';

export interface InputBoxWithSuggestionProps extends ThemeProps, LocaleProps {
  options: Array<any>;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
  searchable?: boolean;
  popOverContainer?: any;
  hasError?: boolean;
  placeholder?: string;
  clearable?: boolean;
}

const option2value = (item: any) => item.value;

export class InputBoxWithSuggestion extends React.Component<InputBoxWithSuggestionProps> {
  constructor(props: InputBoxWithSuggestionProps) {
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
    return this.props.value
      ? matchSorter(options, this.props.value, {
          keys: ['label', 'value'],
          threshold: matchSorter.rankings.CONTAINS
        }).filter((item: any) => item.value !== this.props.value)
      : options;
  }

  // 选了值，还原options
  onPopClose(e: React.MouseEvent, onClose: () => void) {
    this.setState({searchText: ''});
    onClose();
  }

  render() {
    const {
      placeholder,
      onChange,
      value,
      classnames: cx,
      disabled,
      translate: __,
      searchable,
      popOverContainer,
      clearable,
      hasError,
      mobileUI,
      className
    } = this.props;
    const options = this.filterOptions(
      Array.isArray(this.props.options) ? this.props.options : []
    );

    return (
      <PopOverContainer
        show={!!options.length}
        popOverContainer={popOverContainer || (() => findDOMNode(this))}
        popOverRender={({onClose}) => (
          <>
            {searchable ? (
              <SearchBox mini={false} onSearch={this.onSearch} />
            ) : null}
            <ListSelection
              multiple={false}
              onClick={e => this.onPopClose(e, onClose)}
              options={options}
              value={[value]}
              option2value={option2value}
              onChange={(value: any) => {
                onChange?.(value);
              }}
            />
          </>
        )}
      >
        {({onClick, ref, isOpened}) => (
          <InputBox
            className={cx(
              'InputBox--sug',
              className,
              isOpened ? 'is-active' : ''
            )}
            ref={ref}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            blurValue={
              (Array.isArray(this.props.options)
                ? this.props.options
                : []
              ).find(o => o.value === value)?.label
            }
            onChange={onChange}
            clearable={clearable}
            onClick={onClick}
            hasError={hasError}
            mobileUI={mobileUI}
          >
            {options.length ? (
              <span className={cx('InputBox-caret')}>
                <Icon icon="right-arrow-bold" className="icon" />
              </span>
            ) : null}
          </InputBox>
        )}
      </PopOverContainer>
    );
  }
}

export default themeable(localeable(InputBoxWithSuggestion));
