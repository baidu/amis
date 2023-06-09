import React from 'react';
import {findDOMNode} from 'react-dom';
import omit from 'lodash/omit';
import PopOverContainer from '../PopOverContainer';
import ListSelection from '../GroupedSelection';
import ResultBox from '../ResultBox';
import {
  ThemeProps,
  themeable,
  localeable,
  LocaleProps,
  findTree,
  noop,
  isMobile,
  autobind
} from 'amis-core';
import {Icon} from '../icons';
import SearchBox from '../SearchBox';
import TreeSelection from '../TreeSelection';
import {Options} from '../Select';
import {SpinnerExtraProps} from '../Spinner';

export interface FieldProps extends ThemeProps, LocaleProps, SpinnerExtraProps {
  options: Array<any>;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
  fieldClassName?: string;
  searchable?: boolean;
  popOverContainer?: any;
  selectMode?: 'list' | 'tree' | 'chained';
}

export interface FieldState {
  searchText: string;
}

const option2value = (item: any) => item.name;

class Field extends React.Component<FieldProps, FieldState> {
  constructor(props: FieldProps) {
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
      fieldClassName,
      disabled,
      translate: __,
      searchable,
      popOverContainer,
      selectMode = 'list',
      loadingConfig
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
            {selectMode === 'tree' ? (
              <TreeSelection
                className={'is-scrollable'}
                multiple={false}
                options={this.filterOptions(this.props.options)}
                value={value}
                loadingConfig={loadingConfig}
                onChange={(value: any) => {
                  this.onPopClose(onClose);
                  onChange(value.name);
                }}
              />
            ) : (
              <ListSelection
                multiple={false}
                onClick={() => this.onPopClose(onClose)}
                options={this.filterOptions(this.props.options)}
                value={[value]}
                option2value={option2value}
                onChange={(value: any) =>
                  onChange(Array.isArray(value) ? value[0] : value)
                }
              />
            )}
          </div>
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
              useMobileUI
            >
              {!isMobile() ? (
                <span className={cx('CBGroup-fieldCaret')}>
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

interface ConditionFieldState {
  stacks: Array<Options>;
  values: Array<string>;
}

export class ConditionField extends React.Component<
  FieldProps,
  ConditionFieldState
> {
  constructor(props: FieldProps) {
    super(props);

    this.state = this.computed(props.value, props.options);
  }

  componentDidUpdate(
    prevProps: Readonly<FieldProps>,
    prevState: Readonly<ConditionFieldState>,
    snapshot?: any
  ): void {
    const {options, value} = this.props;
    if (options !== prevProps.options) {
      this.setState(this.computed(value, options));
    }
  }

  computed(value: string, options: Options) {
    let values: Array<string> = [];
    const getValues = (opts: Options, arr: Array<string> = []) => {
      opts.forEach(item => {
        if (item?.name === value) {
          values = [...arr, item?.name];
        } else if (item.children) {
          getValues(item.children, [...arr, item?.name]);
        }
      });
    };
    getValues(options);
    return {
      values,
      stacks: this.computedStask(values)
    };
  }

  getFlatOptions(options: Options) {
    return options.map(item => omit(item, 'children'));
  }

  @autobind
  handleSelect(item: Options, index: number, value: string) {
    // 当前层级点击时，需要重新设置下values的值，以及重新计算stacks列表
    const {values} = this.state;
    values.splice(index, values.length - index);
    value && values.push(value);
    const stacks = this.computedStask(values);
    this.setState(
      {
        stacks,
        values
      },
      () => {
        this.props.onChange(value);
      }
    );
  }

  // 根据树结构层级，寻找最后一层
  computedStask(values: string[]) {
    const options = this.props.options;
    const getDeep = (opts: Options, index: number, tems: Array<Options>) => {
      tems.push(this.getFlatOptions(opts));
      opts.forEach(op => {
        if (
          op?.name === values[index] &&
          op.children &&
          values.length - 1 >= index
        ) {
          getDeep(op.children, index + 1, tems);
        }
      });
      return tems;
    };

    return getDeep(options, 0, []);
  }

  render() {
    const {selectMode} = this.props;
    const {stacks, values} = this.state;

    return (
      <>
        {selectMode === 'chained' ? (
          stacks.map((item, index) => (
            <span key={index}>
              <Field
                {...this.props}
                options={item}
                value={values[index]}
                onChange={(value: string) =>
                  this.handleSelect(item, index, value)
                }
              />
            </span>
          ))
        ) : (
          <Field {...this.props} />
        )}
      </>
    );
  }
}

export default themeable(localeable(ConditionField));
