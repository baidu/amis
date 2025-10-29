import React from 'react';
import {
  createObject,
  IScopedContext,
  Renderer,
  RendererProps,
  resolveEventData,
  ScopedComponentType,
  ScopedContext,
  autobind,
  getPropValue,
  setVariable,
  AMISSchemaBase
} from 'amis-core';

import {BaseSchema, AMISClassName} from '../Schema';
import {SearchBox} from 'amis-ui';

import {ListenerAction, TestIdBuilder} from 'amis-core';
import type {SpinnerExtraProps} from 'amis-ui';

/**
 * 搜索框渲染器
 */
/**
 * 搜索框组件，用于关键字搜索与表单查询。支持占位提示与快捷操作。
 */
export interface AMISSearchBoxSchema extends AMISSchemaBase {
  /**
   * 指定为 search-box 组件
   */
  type: 'search-box';

  /**
   * 外层 CSS 类名
   */
  className?: AMISClassName;

  /**
   * 关键字字段名
   */
  name?: string;

  /**
   * 占位符
   */
  placeholder?: string;

  /**
   * 是否为 Mini 样式
   */
  mini?: boolean;

  /**
   * 是否为加强样式
   */
  enhance?: boolean;

  /**
   * 是否可清除
   */
  clearable?: boolean;

  /**
   * 是否立马搜索
   */
  searchImediately?: boolean;

  /**
   * 是否开启清空内容后立即重新搜索
   */
  clearAndSubmit?: boolean;

  /** 是否处于加载状态 */
  loading?: boolean;
}

interface SearchBoxProps
  extends RendererProps,
    Omit<AMISSearchBoxSchema, 'type' | 'className'>,
    SpinnerExtraProps {
  name: string;
  onQuery?: (query: {[propName: string]: string}) => any;
  loading?: boolean;
  testIdBuilder?: TestIdBuilder;
}

export interface SearchBoxState {
  value: string;
}

@Renderer({
  type: 'search-box'
})
export class SearchBoxRenderer extends React.Component<
  SearchBoxProps,
  SearchBoxState
> {
  static defaultProps = {
    name: 'keywords',
    mini: false,
    enhance: false,
    clearable: false,
    searchImediately: false,
    clearAndSubmit: false
  };
  static contextType = ScopedContext;

  static propsList: Array<string> = ['mini', 'searchImediately'];

  constructor(props: SearchBoxProps, context: IScopedContext) {
    super(props);
    this.state = {
      value: getPropValue(props) || ''
    };

    const scoped = context;
    scoped.registerComponent(this as ScopedComponentType);
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this as ScopedComponentType);
  }

  @autobind
  async handleChange(value: string) {
    const {onChange, dispatchEvent} = this.props;
    this.setState({value});

    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {
        value
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onChange?.(value);
  }

  @autobind
  handleCancel() {
    const name = this.props.name;
    const onQuery = this.props.onQuery;

    const value = getPropValue(this.props);
    if (value !== '') {
      const data: any = {};
      setVariable(data, name, '');
      onQuery?.(data);
    }
  }

  @autobind
  async handleSearch(text: string) {
    const {name, onQuery: onQuery, dispatchEvent} = this.props;
    const data: any = {};
    setVariable(data, name, text);

    const rendererEvent = await dispatchEvent(
      'search',
      createObject(this.props.data, data)
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onQuery?.(data);
  }

  @autobind
  dispatchEvent(name: string) {
    const {dispatchEvent} = this.props;
    dispatchEvent(
      name,
      resolveEventData(this.props, {value: this.state.value})
    );
  }

  doAction(
    action: ListenerAction,
    data: any,
    throwErrors: boolean,
    args?: any
  ) {
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      this.setState({value: ''});
    }
  }
  setData(value: any) {
    if (typeof value === 'string') {
      this.handleChange(value);
    }
  }

  render() {
    const {
      data,
      name,
      disabled,
      onQuery: onQuery,
      mini,
      enhance,
      clearable,
      searchImediately,
      clearAndSubmit,
      placeholder,
      onChange,
      className,
      style,
      mobileUI,
      loading,
      loadingConfig,
      onEvent,
      testIdBuilder
    } = this.props;
    const value = this.state.value;
    /** 有可能通过Search事件处理 */
    const isDisabled = (!onQuery && !onEvent?.search) || disabled;

    return (
      <SearchBox
        className={className}
        style={style}
        name={name}
        disabled={isDisabled}
        loading={loading}
        loadingConfig={loadingConfig}
        defaultActive={!!value}
        defaultValue={onChange ? undefined : value}
        value={value}
        mini={mini}
        enhance={enhance}
        clearable={clearable}
        searchImediately={searchImediately}
        clearAndSubmit={clearAndSubmit}
        onSearch={this.handleSearch}
        onCancel={this.handleCancel}
        placeholder={placeholder}
        onChange={this.handleChange}
        onFocus={() => this.dispatchEvent('focus')}
        onBlur={() => this.dispatchEvent('blur')}
        mobileUI={mobileUI}
        testIdBuilder={testIdBuilder}
      />
    );
  }
}
