import React from 'react';
import {observer} from 'mobx-react';
import SearchPanel from './SearchPanel';
import {EditorStoreType} from '../../store/editor';
import {SubRendererInfo} from '../../plugin';

interface SearchRendererProps {
  store: EditorStoreType;
}

interface SearchRendererStates {
  subRenderersByOrder: Array<SubRendererInfo>; // 仅获取一次
  defaultKeyword: string;
}

@observer
export default class SearchRendererPanel extends React.Component<
  SearchRendererProps,
  SearchRendererStates
> {
  localStorageKey = 'amis-editor-renderer-search-history';
  lastSubRenderersTag: string; // 用于记录上一次的tag

  constructor(props: any) {
    super(props);
    let subRenderersByOrder = props.store.subRenderersByOrder;
    // 剔除隐藏的组件
    subRenderersByOrder = subRenderersByOrder.filter(
      (item: SubRendererInfo) => !item.disabledRendererPlugin
    );
    const {subRenderersKeywords, subRenderersTag} = props.store;
    this.state = {
      subRenderersByOrder: subRenderersByOrder,
      defaultKeyword: subRenderersKeywords || subRenderersTag || ''
    };
    this.lastSubRenderersTag = props.store.subRenderersTag;

    this.changeSubRenderersTag = this.changeSubRenderersTag.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    const subRenderersTag = nextProps.store.subRenderersTag;
    const subRenderersKeywords = nextProps.store.subRenderersKeywords;
    /**
     * 当subRenderersTag在外部发现变动，则将其值同步给curKeyword
     * 备注：外部重置tag时，也会将subRenderersKeywords重置。
     */
    if (subRenderersTag !== this.lastSubRenderersTag && !subRenderersKeywords) {
      this.lastSubRenderersTag = subRenderersTag;
      this.setState({
        defaultKeyword: subRenderersTag
      });
    }
  }

  changeSubRenderersTag(curTag: string) {
    this.lastSubRenderersTag = curTag;
    this.props.store.changeSubRenderersTag(curTag);
  }

  render() {
    const {subRenderersByOrder, defaultKeyword} = this.state;
    const {changeSubRenderersKeywords} = this.props.store;

    return (
      <SearchPanel
        allResult={subRenderersByOrder}
        externalKeyword={defaultKeyword}
        searchPanelUUID={this.localStorageKey}
        onChange={changeSubRenderersKeywords}
        onTagChange={this.changeSubRenderersTag}
        immediateChange={true}
        closeAutoComplete={true}
      />
    );
  }
}
