import {observer} from 'mobx-react';
import React from 'react';
import {EditorManager} from '../../manager';
import {EditorStoreType} from '../../store/editor';
import {Drawer} from 'amis';
import {autobind} from '../../util';
import {findDOMNode} from 'react-dom';
import {EditorNodeType} from '../../store/node';

export interface PanelsProps {
  store: EditorStoreType;
  manager: EditorManager;
  node: EditorNodeType | undefined;
  panelItem: any;
  theme?: string;
}

@observer
export class DrawerPanel extends React.Component<PanelsProps> {
  @autobind
  getPopOverContainer() {
    return findDOMNode(this) as HTMLElement;
  }

  render() {
    const {store, manager, node, panelItem, theme} = this.props;
    const id = store.activeId;

    return (
      <Drawer
        position="left"
        size="md"
        theme={theme}
        show={!!panelItem}
        onHide={store.closeInsertPanel}
        className="ae-InsertPanel-drawer"
      >
        {panelItem && panelItem.component ? (
          <panelItem.component
            key={panelItem.key}
            id={id}
            info={node?.info}
            path={node?.path}
            value={store.value}
            onChange={manager.panelChangeValue}
            store={store}
            manager={manager}
            popOverContainer={this.getPopOverContainer}
          />
        ) : null}
      </Drawer>
    );
  }
}
