import React from 'react';
import {PanelProps} from '../../plugin';
import {autobind} from '../../util';
import AMisCodeEditor from './AMisCodeEditor';
import AmisStyleCodeEditor from './AmisStyleCodeEditor';
import {Tab, Tabs} from 'amis-ui';

export default class CodeEditorPanel extends React.Component<PanelProps> {
  state = {
    tabsKey: 'schema'
  };
  @autobind
  handleCodePaste() {
    setTimeout(() => {
      this.props.manager.patchSchema(true);
    }, 500);
  }

  @autobind
  handleSelect(key: string) {
    this.setState({tabsKey: key});
  }

  render() {
    const {onChange, manager, store} = this.props;

    return (
      <div className="ae-CodePanel">
        <div className="panel-header">代码</div>
        <div className="ae-CodePanel-content">
          <Tabs
            tabsMode="line"
            activeKey={this.state.tabsKey}
            onSelect={this.handleSelect}
            className="editor-code-tabs"
            linksClassName="editor-code-tabs-links"
            contentClassName="editor-code-tabs-cont"
          >
            <Tab
              key={'schema'}
              eventKey={'schema'}
              title={'Schema'}
              mountOnEnter={true}
              unmountOnExit={false}
            >
              <AMisCodeEditor
                value={store.valueWithoutHiddenProps}
                onChange={onChange}
                $schema={store.jsonSchemaUri}
                $schemaUrl={manager.config.$schemaUrl}
                onPaste={this.handleCodePaste}
              />
            </Tab>
            <Tab
              key={'style'}
              eventKey={'style'}
              title={'Style'}
              mountOnEnter={true}
              unmountOnExit={false}
            >
              <AmisStyleCodeEditor
                value={store.cssValue}
                onChange={onChange}
                $schema={store.jsonSchemaUri}
                $schemaUrl={manager.config.$schemaUrl}
                onPaste={this.handleCodePaste}
              />
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}
