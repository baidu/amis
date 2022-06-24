import {observer} from 'mobx-react';
import React from 'react';
import {Tab, Tabs} from 'amis';
import cx from 'classnames';
import {EditorManager} from '../../manager';
import {EditorStoreType} from '../../store/editor';
import {Icon} from '../../icons/index';
import {autobind, isHasPluginIcon} from '../../util';
import {findDOMNode} from 'react-dom';
import {PanelItem} from '../../plugin';
import {WidthDraggableBtn} from '../base/WidthDraggableBtn';

interface RightPanelsProps {
  store: EditorStoreType;
  manager: EditorManager;
  theme?: string;
}

interface RightPanelsStates {
  isOpenStatus: boolean;
  isFixedStatus: boolean;
}

@observer
export class RightPanels extends React.Component<
  RightPanelsProps,
  RightPanelsStates
> {
  constructor(props: any) {
    super(props);

    this.state = {
      isOpenStatus: true, // 默认展开
      isFixedStatus: false // 默认非fixed模式
    };
  }

  @autobind
  handleFixed() {
    this.setState({
      isFixedStatus: !this.state.isFixedStatus
    });
  }

  @autobind
  handleSelect(key: string) {
    const store = this.props.store;
    store.changePanelKey(key);
  }

  @autobind
  handleHidden() {
    this.setState({
      isOpenStatus: !this.state.isOpenStatus
    });
  }

  @autobind
  getPopOverContainer() {
    return findDOMNode(this) as HTMLElement;
  }

  render() {
    const {store, manager, theme} = this.props;
    const {isOpenStatus, isFixedStatus} = this.state;
    const panels = store.getPanels();
    const id = store.activeId;
    const node = store.getNodeById(id);
    const panelKey = store.getPanelKey();

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

    return panels.length > 0 ? (
      <div
        className={cx(
          'editor-right-panel width-draggable',
          panels.length > 1 ? 'mul-tabs-panel' : '',
          isOpenStatus ? '' : 'hidden-status',
          isFixedStatus ? 'fixed-status' : ''
        )}
      >
        <div
          className={`editor-panel-btn`}
          editor-tooltip={isFixedStatus ? '关闭悬浮模式' : '开启悬浮模式'}
          tooltip-position="left"
        >
          <Icon
            icon={isFixedStatus ? 'editor-fixed' : 'editor-no-fixed'}
            className="panel-btn"
            onClick={this.handleFixed}
          />
        </div>
        <div className="editorPanel-inner">
          {panels.length === 1 ? (
            renderPanel(panels[0])
          ) : (
            <Tabs
              theme={theme}
              tabsMode="sidebar"
              sidePosition="right"
              className="editorPanel-tabs"
              linksClassName="editorPanel-tabs-header"
              contentClassName="editorPanel-tabs-content"
              activeKey={panelKey}
              onSelect={this.handleSelect}
            >
              {panels.map(panel => {
                const usePluginIcon = isHasPluginIcon(panel);
                return (
                  <Tab
                    key={panel.key}
                    eventKey={panel.key}
                    // title={panel.title}
                    // icon={panel.icon}
                    title={
                      <span
                        className="editor-tab-icon"
                        editor-tooltip={panel.title}
                        tooltip-position="left"
                      >
                        {
                          usePluginIcon && (
                            <Icon icon={panel.pluginIcon} className='pluginIcon' />
                          )
                        }
                        {
                          !usePluginIcon && (
                             <i className={`fa ${panel.icon}`} />
                          )
                        } 
                      </span>
                    }
                    className={`editorPanel-tabs-pane ae-Editor-${panel.key}Pane`}
                    mountOnEnter={true}
                    unmountOnExit={false}
                  >
                    {renderPanel(panel)}
                  </Tab>
                );
              })}
            </Tabs>
          )}
        </div>
        <WidthDraggableBtn isLeftDragIcon={true} />
        <div
          className={cx(
            'right-panel-arrow',
            isOpenStatus ? '' : 'hidden-status'
          )}
          onClick={this.handleHidden}
        ></div>
      </div>
    ) : null;
  }
}
