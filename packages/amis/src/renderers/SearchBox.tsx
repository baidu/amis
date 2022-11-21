import {
  createObject,
  IScopedContext,
  Renderer,
  RendererProps,
  resolveEventData,
  ScopedContext
} from 'amis-core';
import React from 'react';
import {BaseSchema, SchemaClassName} from '../Schema';
import {SearchBox} from 'amis-ui';
import {autobind, getPropValue, getVariable, setVariable} from 'amis-core';
import type {ListenerAction} from 'amis-core';
import type {ScopedComponentType} from 'amis-core/lib/Scoped';

/**
 * 搜索框渲染器
 */
export interface SearchBoxSchema extends BaseSchema {
  /**
   * 指定为搜索框。
   *
   * 文档：https://baidu.gitee.io/amis/docs/components/search-box
   */
  type: 'search-box';

  /**
   * 外层 css 类名
   */
  className?: SchemaClassName;

  /**
   * 关键字名字。
   *
   * @default keywords
   */
  name?: string;

  /**
   * 占位符
   */
  placeholder?: string;

  /**
   * 是否为 Mini 样式。
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
   * 是否立马搜索。
   */
  searchImediately?: boolean;
}

interface SearchBoxProps
  extends RendererProps,
    Omit<SearchBoxSchema, 'type' | 'className'> {
  name: string;
  onQuery?: (query: {[propName: string]: string}) => void;
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
    searchImediately: false
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
      resolveEventData(
        this.props,
        {
          value
        },
        'value'
      )
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
      resolveEventData(this.props, {value: this.state.value}, 'value')
    );
  }

  doAction(action: ListenerAction, args: any) {
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      this.setState({value: ''});
    }
  }

  setData(value: any) {
    this.setState({value});
  }

  render() {
    const {
      data,
      name,
      onQuery: onQuery,
      mini,
      enhance,
      clearable,
      searchImediately,
      placeholder,
      onChange,
      className
    } = this.props;

    const value = this.state.value;

    return (
      <SearchBox
        className={className}
        name={name}
        disabled={!onQuery}
        defaultActive={!!value}
        defaultValue={onChange ? undefined : value}
        value={value}
        mini={mini}
        enhance={enhance}
        clearable={clearable}
        searchImediately={searchImediately}
        onSearch={this.handleSearch}
        onCancel={this.handleCancel}
        placeholder={placeholder}
        onChange={this.handleChange}
        onFocus={() => this.dispatchEvent('focus')}
        onBlur={() => this.dispatchEvent('blur')}
      />
    );
  }
}
