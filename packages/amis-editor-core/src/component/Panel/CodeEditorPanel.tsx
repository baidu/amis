import React from 'react';
import {PanelProps} from '../../plugin';
import {autobind} from '../../util';
import AMisCodeEditor from './AMisCodeEditor';

export default class CodeEditorPanel extends React.Component<PanelProps> {
  @autobind
  handleCodePaste(e: any) {
    setTimeout(() => {
      this.props.manager.patchSchema(true);

      // 检测是否整体粘贴组件，如果是的话强制替换ID避免样式bug
      if (
        e?.languageId === 'json' &&
        e.range?.startColumn === 1 &&
        e.range?.startLineNumber === 1 &&
        e.range?.endColumn === 2 &&
        e.range?.endLineNumber > 1
      ) {
        this.props.manager.reGenerateCurrentNodeID();
      }
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
