import React from 'react';
import {RendererProps} from 'amis-core';
import {isApiOutdated, isEffectiveApi, normalizeApi} from 'amis-core';
import {Icon} from 'amis-ui';
import {Overlay} from 'amis-core';
import {PopOver} from 'amis-core';
import {findDOMNode} from 'react-dom';
import {Checkbox} from 'amis-ui';
import xor from 'lodash/xor';
import {
  normalizeOptions,
  getVariable,
  createObject,
  isNumeric
} from 'amis-core';
import type {Option} from 'amis-core';

export interface QuickFilterConfig {
  options: Array<any>;
  // source: Api;
  multiple: boolean;
  /* 是否开启严格对比模式 */
  strictMode?: boolean;
  [propName: string]: any;
  refreshOnOpen?: boolean; // 展开是否重新加载数据 当source配置api时才起作用
}

export interface HeadCellFilterProps extends RendererProps {
  data: any;
  name: string;
  filterable: QuickFilterConfig;
  onQuery: (
    values: object,
    forceReload?: boolean,
    replace?: boolean,
    resetPage?: boolean
  ) => void;
}

export class HeadCellFilterDropDown extends React.Component<
  HeadCellFilterProps,
  any
> {
  state = {
    isOpened: false,
    filterOptions: []
  };

  sourceInvalid: boolean = false;
  constructor(props: HeadCellFilterProps) {
    super(props);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentDidMount() {
    const {filterable} = this.props;

    if (filterable.source) {
      this.fetchOptions();
    } else if (filterable.options?.length > 0) {
      this.setState({
        filterOptions: this.alterOptions(filterable.options)
      });
    }
  }

  componentDidUpdate(prevProps: HeadCellFilterProps, prevState: any) {
    const name = this.props.name;

    const props = this.props;

    this.sourceInvalid = false;

    if (
      prevProps.name !== props.name ||
      prevProps.filterable !== props.filterable ||
      prevProps.data !== props.data
    ) {
      if (props.filterable.source) {
        this.sourceInvalid = isApiOutdated(
          prevProps.filterable.source,
          props.filterable.source,
          prevProps.data,
          props.data
        );
      } else if (props.filterable.options) {
        this.setState({
          filterOptions: this.alterOptions(props.filterable.options || [])
        });
      } else if (
        name &&
        !this.state.filterOptions.length &&
        (Array.isArray(props.store?.data.itemsRaw) ||
          Array.isArray(props.store?.data.items))
      ) {
        const itemsRaw = props.store?.data.itemsRaw || props.store?.data.items;
        const values: Array<any> = [];
        itemsRaw.forEach((item: any) => {
          const value = getVariable(item, name);

          if (!~values.indexOf(value)) {
            values.push(value);
          }
        });

        if (values.length) {
          this.setState({
            filterOptions: this.alterOptions(values)
          });
        }
      }
    }
    const value = this.props.data ? this.props.data[name] : undefined;
    const prevValue = prevProps.data ? prevProps.data[name] : undefined;
    if (
      value !== prevValue &&
      this.state.filterOptions.length &&
      prevState.filterOptions !== this.props.filterOptions
    ) {
      this.setState({
        filterOptions: this.alterOptions(this.state.filterOptions)
      });
    }

    this.sourceInvalid && this.fetchOptions();
  }

  async fetchOptions() {
    const {env, filterable, data} = this.props;
    if (!isEffectiveApi(filterable.source, data)) {
      return;
    }

    const api = normalizeApi(filterable.source);
    api.cache = 3000; // 开启 3s 缓存，因为固顶位置渲染1次会额外多次请求。

    const ret = await env.fetcher(api, data);
    let options = (ret.data && ret.data.options) || [];
    this.setState({
      filterOptions: ret && ret.data && this.alterOptions(options)
    });
  }

  alterOptions(options: Array<any>) {
    const {data, filterable, name} = this.props;
    const filterValue =
      data && typeof data[name] !== 'undefined' ? data[name] : '';
    options = normalizeOptions(options);

    if (filterable.multiple) {
      options = options.map(option => ({
        ...option,
        selected: filterValue.split(',').indexOf(option.value) > -1
      }));
    } else {
      options = options.map(option => ({
        ...option,
        selected: this.optionComparator(option, filterValue)
      }));
    }
    return options;
  }

  optionComparator(option: Option, selected: any) {
    const {filterable} = this.props;

    /**
     * 无论是否严格模式，需要考虑CRUD开启syncLocation后，参数值会被转化为string的情况：
     * 数字类需要特殊处理，如果两边都为数字类时才进行比较，否则不相等，排除 1 == true 这种情况
     */
    if (isNumeric(option.value)) {
      return isNumeric(selected) ? option.value == selected : false;
    }

    return filterable?.strictMode === true
      ? option.value === selected
      : option.value == selected;
  }

  handleClickOutside() {
    this.close();
  }

  async open() {
    const {filterable} = this.props;
    if (filterable.refreshOnOpen && filterable.source) {
      await this.fetchOptions();
    }
    this.setState({
      isOpened: true
    });
  }

  close() {
    this.setState({
      isOpened: false
    });
  }

  async handleClick(value: string) {
    const {onQuery, name, data, dispatchEvent} = this.props;

    const rendererEvent = await dispatchEvent(
      'columnFilter',
      createObject(data, {
        filterName: name,
        filterValue: value
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onQuery(
      {
        [name]: value
      },
      false,
      false,
      true
    );
    this.close();
  }

  async handleCheck(value: string) {
    const {data, name, onQuery, dispatchEvent} = this.props;
    let query: string;

    if (data[name] && data[name] === value) {
      query = '';
    } else {
      query =
        (data[name] && xor(data[name].split(','), [value]).join(',')) || value;
    }

    const rendererEvent = await dispatchEvent(
      'columnFilter',
      createObject(data, {
        filterName: name,
        filterValue: query
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onQuery({
      [name]: query
    });
  }

  async handleReset() {
    const {name, dispatchEvent, data, onQuery} = this.props;

    const rendererEvent = await dispatchEvent(
      'columnFilter',
      createObject(data, {
        filterName: name,
        filterValue: undefined
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onQuery(
      {
        [name]: undefined
      },
      false,
      false,
      true
    );
    this.close();
  }

  render() {
    const {isOpened, filterOptions} = this.state;
    const {
      data,
      name,
      filterable,
      popOverContainer,
      classPrefix: ns,
      classnames: cx,
      translate: __
    } = this.props;

    return (
      <span
        className={cx(
          `${ns}TableCell-filterBtn`,
          data && typeof data[name] !== 'undefined' ? 'is-active' : ''
        )}
      >
        <span onClick={this.open}>
          <Icon icon="column-filter" className="icon" />
        </span>
        {isOpened ? (
          <Overlay
            container={popOverContainer || (() => findDOMNode(this))}
            placement="left-bottom-left-top right-bottom-right-top"
            target={
              popOverContainer ? () => findDOMNode(this)!.parentNode : null
            }
            show
          >
            <PopOver
              classPrefix={ns}
              onHide={this.close}
              className={cx(
                `${ns}TableCell-filterPopOver`,
                (filterable as any).className
              )}
              overlay
            >
              {filterOptions && filterOptions.length > 0 ? (
                <ul className={cx('DropDown-menu')}>
                  {!filterable.multiple
                    ? filterOptions.map((option: any, index) => (
                        <li
                          key={index}
                          className={cx({
                            'is-active': option.selected
                          })}
                          onClick={this.handleClick.bind(this, option.value)}
                        >
                          {option.label}
                        </li>
                      ))
                    : filterOptions.map((option: any, index) => (
                        <li key={index}>
                          <Checkbox
                            classPrefix={ns}
                            onChange={this.handleCheck.bind(this, option.value)}
                            checked={option.selected}
                          >
                            {option.label}
                          </Checkbox>
                        </li>
                      ))}
                  {filterOptions.some((item: any) => item.selected) ? (
                    <li
                      key="DropDown-menu-reset"
                      onClick={this.handleReset.bind(this)}
                    >
                      {__('reset')}
                    </li>
                  ) : null}
                </ul>
              ) : null}
            </PopOver>
          </Overlay>
        ) : null}
      </span>
    );
  }
}
