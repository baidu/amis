import React from 'react';
import {observer} from 'mobx-react';
import SearchPanel from './SearchPanel';
import {EditorStoreType} from '../../store/editor';
import {SubRendererInfo} from '../../plugin';

interface SearchCustomRendererProps {
  store: EditorStoreType;
}

interface SearchCustomRendererStates {
  customRenderersByOrder: Array<SubRendererInfo>; // 仅获取一次
  defaultKeyword: string;
}

@observer
export default class SearchCustomRendererPanel extends React.Component<
  SearchCustomRendererProps,
  SearchCustomRendererStates
> {
  localStorageKey = 'amis-editor-custom-renderer-search-history';

  constructor(props: any) {
    super(props);
    let customRenderersByOrder = props.store.customRenderersByOrder;
    // 剔除隐藏的组件
    customRenderersByOrder = customRenderersByOrder.filter(
      (item: SubRendererInfo) => !item.disabledRendererPlugin
    );
    const {customRenderersKeywords, customRenderersTag} = props.store;
    this.state = {
      customRenderersByOrder: customRenderersByOrder,
      defaultKeyword: customRenderersKeywords || customRenderersTag || ''
    };
  }

  render() {
    const {customRenderersByOrder, defaultKeyword} = this.state;
    const {changeCustomRenderersKeywords, changeCustomRenderersTag} =
      this.props.store;

    return customRenderersByOrder && customRenderersByOrder.length > 0 ? (
      <SearchPanel
        allResult={customRenderersByOrder}
        externalKeyword={defaultKeyword}
        searchPanelUUID={this.localStorageKey}
        onChange={changeCustomRenderersKeywords}
        onTagChange={changeCustomRenderersTag}
      />
    ) : null;
  }
}
