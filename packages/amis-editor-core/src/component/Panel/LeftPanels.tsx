import {observer} from 'mobx-react';
import React from 'react';
import {Icon} from 'amis';
import cx from 'classnames';
import {EditorManager} from '../../manager';
import {EditorStoreType} from '../../store/editor';
import {Tab, Tabs} from 'amis';
import {autobind} from '../../util';
import {findDOMNode} from 'react-dom';
import find from 'lodash/find';
import {PanelItem} from '../../plugin';
import {DrawerPanel} from './DrawerPanel';
import {DrawerRendererPanel} from './DrawerRendererPanel';

interface LeftPanelsProps {
  store: EditorStoreType;
  manager: EditorManager;
  theme?: string;
}

interface LeftPanelsStates {
  isFixedStatus: boolean;
}

@observer
export class LeftPanels extends React.Component<
  LeftPanelsProps,
  LeftPanelsStates
> {
  constructor(props: any) {
    super(props);

    this.state = {
      isFixedStatus: false // 默认非fixed模式
    };
  }

  @autobind
  handleHidden() {
    const {changeLeftPanelOpenStatus, leftPanelOpenStatus, changeLeftPanelKey} =
      this.props.store;
    const nextStatus = !leftPanelOpenStatus;
    changeLeftPanelOpenStatus(nextStatus);
    if (nextStatus) {
      // 展开则默认显示大纲面板
      changeLeftPanelKey('outline');
    } else {
      // 折叠时则不显示任何tab面板
      changeLeftPanelKey('none');
    }
  }

  @autobind
  handleFixed() {
    this.setState({
      isFixedStatus: !this.state.isFixedStatus
    });
  }

  @autobind
  handleSelect(key: string) {
    const {changeLeftPanelOpenStatus, changeLeftPanelKey} = this.props.store;
    if (key) {
      // 先展开再显示指定面板内容
      changeLeftPanelOpenStatus(true);
      changeLeftPanelKey(key);
    }
  }

  @autobind
  getPopOverContainer() {
    return findDOMNode(this) as HTMLElement;
  }

  render() {
    const {store, manager, theme} = this.props;
    const {isFixedStatus} = this.state;
    const leftPanelOpenStatus = store.leftPanelOpenStatus;
    const panels = store.getLeftPanels();
    const id = store.activeId;
    const node = store.getNodeById(id);
    const panelKey = store.getLeftPanelKey();
    const insertPanel =
      store.insertId &&
      store.insertRegion &&
      find(panels, p => p.key === 'insert');

    const insertRendererPanel = find(panels, p => p.key === 'insertRenderer');

    const renderPanel = (panel: PanelItem) => {
      return panel.render ? (
        panel.render({
          id,
          info: node?.info,
          path: node?.path,
          node: node,
          value: store.value,
          onChange: manager.panelChangeValue,
          store: store,
          manager: manager,
          popOverContainer: this.getPopOverContainer
        })
      ) : panel.component ? (
        <panel.component
          node={node}
          key={panel.key}
          id={id}
          info={node?.info}
          path={node?.path}
          value={store.value}
          onChange={manager.panelChangeValue}
          store={store}
          manager={manager}
          popOverContainer={this.getPopOverContainer}
        />
      ) : null;
    };

    return (
      <>
        {panels.length > 0 && (
          <div
            className={cx(
              'editor-left-panel width-draggable',
              leftPanelOpenStatus ? '' : 'hidden-status',
              isFixedStatus ? 'fixed-status' : ''
            )}
          >
            <div
              className={`editor-panel-btn`}
              editor-tooltip={isFixedStatus ? '关闭悬浮模式' : '开启悬浮模式'}
              tooltip-position="right"
            >
              <Icon
                icon={isFixedStatus ? 'editor-fixed' : 'editor-no-fixed'}
                className="panel-btn"
                onClick={this.handleFixed}
              />
            </div>
            <Tabs
              className="editorPanel-tabs"
              linksClassName="editorPanel-tabs-header"
              contentClassName="editorPanel-tabs-content"
              theme={theme}
              activeKey={panelKey}
              onSelect={this.handleSelect}
              tabsMode="sidebar"
              sidePosition="left"
            >
              {panels.map(panel => {
                return panel.key !== 'insert' &&
                  panel.key !== 'insertRenderer' ? (
                  <Tab
                    key={panel.key}
                    eventKey={panel.key}
                    title={panel.title}
                    // icon={panel.icon}
                    className={`editorPanel-tabs-pane ae-Editor-${panel.key}Pane`}
                    mountOnEnter={true}
                    unmountOnExit={false}
                  >
                    {renderPanel(panel)}
                  </Tab>
                ) : null;
              })}
            </Tabs>
            <div
              className={cx(
                'left-panel-arrow',
                leftPanelOpenStatus ? '' : 'hidden-status'
              )}
              onClick={this.handleHidden}
            ></div>
          </div>
        )}
        {isFixedStatus && (
          <div className="editor-left-panel-fixed-placeholder"></div>
        )}
        <DrawerPanel
          store={store}
          manager={manager}
          node={node}
          panelItem={insertPanel}
          theme={theme}
        />
        {/* 插入组件面板（复用现有组件面板）*/}
        <DrawerRendererPanel
          store={store}
          manager={manager}
          node={node}
          panelItem={insertRendererPanel}
          theme={theme}
        />
      </>
    );
  }
}
