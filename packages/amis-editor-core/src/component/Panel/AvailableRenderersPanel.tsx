import {observer} from 'mobx-react';
import React from 'react';
import {Tab, Tabs} from 'amis';
import RenderersPanel from './RenderersPanel';
import {PanelProps} from '../../plugin';
import {autobind} from '../../util';

type PanelStates = {
  toggleCollapseFolderStatus: boolean;
};

@observer
export class AvailableRenderersPanel extends React.Component<
  PanelProps,
  PanelStates
> {
  @autobind
  handleSelect(key: string) {
    if (key) {
      this.props.store.changeRenderersTabsKey(key);
    }
  }

  render() {
    const {store, manager} = this.props;
    const renderersTabsKey = store.renderersTabsKey || 'base-renderers';
    const curTheme = store.theme;
    const customRenderersByOrder = store.customRenderersByOrder || [];
    const groupedSubRenderers = store.groupedSubRenderers || {};
    const groupedCustomRenderers = store.groupedCustomRenderers || {}; // 自定义组件

    return (
      <div className="ae-RendererPanel">
        <div className="panel-header">组件</div>
        <div className="ae-RendererPanel-content">
          {store.showCustomRenderersPanel && customRenderersByOrder.length > 0 && (
            <Tabs
              theme={curTheme}
              tabsMode={'line'} // tiled
              className="ae-RendererList-tabs"
              linksClassName="ae-RendererList-tabs-header"
              contentClassName="ae-RendererList-tabs-content"
              activeKey={renderersTabsKey}
              onSelect={this.handleSelect}
            >
              <Tab
                key={'base-renderers'}
                eventKey={'base-renderers'}
                title={'系统组件'}
                className={`ae-RendererList-tabs-panel base-renderers`}
                mountOnEnter={true}
                unmountOnExit={false}
              >
                <RenderersPanel
                  groupedRenderers={groupedSubRenderers}
                  store={store}
                  manager={manager}
                  searchRendererType={'renderer'}
                />
              </Tab>
              <Tab
                key={'custom-renderers'}
                eventKey={'custom-renderers'}
                title={'自定义组件'}
                className={`ae-RendererList-tabs-panel custom-renderers`}
                mountOnEnter={true}
                unmountOnExit={false}
              >
                <RenderersPanel
                  groupedRenderers={groupedCustomRenderers}
                  store={store}
                  manager={manager}
                  searchRendererType={'custom-renderer'}
                />
              </Tab>
            </Tabs>
          )}
          {(!store.showCustomRenderersPanel ||
            Object.keys(groupedCustomRenderers).length < 1) && (
            <RenderersPanel
              className={'only-base-component'}
              groupedRenderers={groupedSubRenderers}
              store={store}
              manager={manager}
              searchRendererType={'renderer'}
            />
          )}
          {(!store.showCustomRenderersPanel ||
            Object.keys(groupedCustomRenderers).length < 1) && (
            <RenderersPanel
              className={'only-base-component'}
              groupedRenderers={groupedSubRenderers}
              store={store}
              manager={manager}
              searchRendererType={'renderer'}
            />
          )}
        </div>
      </div>
    );
  }
}
