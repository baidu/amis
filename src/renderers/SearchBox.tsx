import Spinner from '../components/Spinner';
import {Renderer, RendererProps} from '../factory';
import React from 'react';
import {BaseSchema} from '../Schema';
import SearchBox from '../components/SearchBox';
import {autobind, getVariable, setVariable} from '../utils/helper';

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
   * 关键字名字。
   *
   * @default keywords
   */
  name?: string;

  /**
   * 是否为 Mini 样式。
   */
  mini?: boolean;

  /**
   * 是否立马搜索。
   */
  searchImediately?: boolean;
}

interface SearchBoxProps extends RendererProps, SearchBoxSchema {
  name: string;
  onQuery?: (query: {[propName: string]: string}) => void;
}

@Renderer({
  test: /(^|\/)search\-box$/,
  name: 'search'
})
export class SearchBoxRenderer extends React.Component<SearchBoxProps> {
  static defaultProps = {
    name: 'keywords',
    mini: false,
    searchImediately: false
  };

  static propsList: Array<string> = ['mini', 'searchImediately'];

  @autobind
  handleCancel() {
    const name = this.props.name;
    const onQuery = this.props.onQuery;
    const data: any = {};
    setVariable(data, name, '');
    onQuery?.(data);
  }

  @autobind
  handleSearch(text: string) {
    const {name, onQuery: onQuery} = this.props;
    const data: any = {};
    setVariable(data, name, text);
    onQuery?.(data);
  }

  render() {
    const {data, name, onQuery: onQuery, mini, searchImediately} = this.props;

    const value = getVariable(data, name);
    return (
      <SearchBox
        name={name}
        disabled={!onQuery}
        defaultActive={!!value}
        defaultValue={value}
        mini={mini}
        searchImediately={searchImediately}
        onSearch={this.handleSearch}
        onCancel={this.handleCancel}
      />
    );
  }
}
