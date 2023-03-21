import React from 'react';
import {PanelProps} from '../../plugin';
import {autobind} from '../../util';
import AMisCodeEditor from './AMisCodeEditor';

export default class CodeEditorPanel extends React.Component<PanelProps> {
  @autobind
  handleCodePaste() {
    setTimeout(() => {
      this.props.manager.patchSchema(true);
    }, 500);
  }

  render() {
    const {onChange, manager, store} = this.props;

    return (
      <div className="ae-CodePanel">
        <div className="panel-header">源码</div>
        <div className="ae-CodePanel-content">
          <AMisCodeEditor
            value={store.valueWithoutHiddenProps}
            onChange={onChange}
            $schema={store.jsonSchemaUri}
            $schemaUrl={manager.config.$schemaUrl}
            onPaste={this.handleCodePaste}
          />
        </div>
      </div>
    );
  }
}
