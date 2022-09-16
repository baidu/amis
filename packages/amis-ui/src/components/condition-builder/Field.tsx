import React from 'react';
import {findDOMNode} from 'react-dom';
import PopOverContainer from '../PopOverContainer';
import ListSelection from '../GroupedSelection';
import ResultBox from '../ResultBox';
import {
  ClassNamesFn,
  ThemeProps,
  themeable,
  utils,
  localeable,
  LocaleProps,
  findTree,
  noop
} from 'amis-core';
import {Icon} from '../icons';
import SearchBox from '../SearchBox';
import TreeSelection from '../TreeSelection';

export interface ConditionFieldProps extends ThemeProps, LocaleProps {
  options: Array<any>;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
  fieldClassName?: string;
  searchable?: boolean;
  popOverContainer?: any;
  selectMode?: 'list' | 'tree';
}

export interface ConditionFieldState {
  searchText: string;
}

const option2value = (item: any) => item.name;

export class ConditionField extends React.Component<
  ConditionFieldProps,
  ConditionFieldState
> {
  constructor(props: ConditionFieldProps) {
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
    const txt = this.state.searchText;
    if (!txt) {
      return this.props.options;
    }
    return options
      .map((item: any) => {
        if (item.children) {
          let children = item.children.filter((child: any) => {
            return (
              child.name.toLowerCase().includes(txt) ||
              child.label.toLowerCase().includes(txt)
            );
          });
          return children.length > 0
            ? Object.assign({}, item, {children}) // 需要copy一份，防止覆盖原始数据
            : false;
        } else {
          return item.name.toLowerCase().includes(txt) ||
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
  onPopClose(e: React.MouseEvent, onClose: () => void) {
    this.setState({searchText: ''});
    onClose();
  }

  render() {
    const {
      options,
      onChange,
      value,
      classnames: cx,
      fieldClassName,
      disabled,
      translate: __,
      searchable,
      popOverContainer,
      selectMode = 'list'
    } = this.props;

    return (
      <PopOverContainer
        popOverContainer={popOverContainer || (() => findDOMNode(this))}
        popOverRender={({onClose}) => (
          <>
            {searchable ? (
              <SearchBox mini={false} onSearch={this.onSearch} />
            ) : null}
            {selectMode === 'tree' ? (
              <TreeSelection
                className={'is-scrollable'}
                multiple={false}
                options={this.filterOptions(this.props.options)}
                value={value}
                onChange={(value: any) => {
                  this.onPopClose(null, onClose);
                  onChange(value.name);
                }}
              />
            ) : (
              <ListSelection
                multiple={false}
                onClick={(e: any) => this.onPopClose(e, onClose)}
                options={this.filterOptions(this.props.options)}
                value={[value]}
                option2value={option2value}
                onChange={(value: any) =>
                  onChange(Array.isArray(value) ? value[0] : value)
                }
              />
            )}
          </>
        )}
      >
        {({onClick, ref, isOpened}) => (
          <div className={cx('CBGroup-field')}>
            <ResultBox
              className={cx(
                'CBGroup-fieldInput',
                fieldClassName,
                isOpened ? 'is-active' : ''
              )}
              ref={ref}
              allowInput={false}
              result={
                value ? findTree(options, item => item.name === value) : ''
              }
              onResultChange={noop}
              onResultClick={onClick}
              placeholder={__('Condition.field_placeholder')}
              disabled={disabled}
            >
              <span className={cx('CBGroup-fieldCaret')}>
                <Icon icon="caret" className="icon" />
              </span>
            </ResultBox>
          </div>
        )}
      </PopOverContainer>
    );
  }
}

export default themeable(localeable(ConditionField));
