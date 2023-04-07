import {observer} from 'mobx-react';
import React from 'react';
import {Icon} from 'amis';
import {EditorStoreType} from '../../store/editor';

export interface ContextMenuPanelProps {
  store: EditorStoreType;
}

@observer
export class ContextMenuPanel extends React.Component<ContextMenuPanelProps> {
  render() {
    const store = this.props.store;
    const contextMenuPanel = store.contextMenuPanel;
    const menus =
      contextMenuPanel && contextMenuPanel.menus ? contextMenuPanel.menus : [];

    return menus && menus.length > 0 ? (
      <div className="context-menu-setting">
        <div className="setting-header">批量操作</div>
        <div className="setting-body">
          {menus.map(menu => {
            return (
              menu.label && (
                <div
                  key={menu.label}
                  className={`setting-item ${menu.disabled ? 'disabled' : ''}`}
                  onClick={!menu.disabled ? menu.onSelect : null}
                >
                  <div className="icon-box">
                    <Icon icon={menu.icon} className="menu-icon" />
                  </div>
                  <div className="setting-info">{menu.label}</div>
                </div>
              )
            );
          })}
        </div>
      </div>
    ) : null;
  }
}
