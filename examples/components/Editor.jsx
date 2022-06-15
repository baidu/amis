import React from 'react';
import {Editor} from 'amis-ui';
import {Switch} from 'amis-ui';
import {Button} from 'amis-ui';
import schema from './Form/Test';
import Portal from 'react-overlays/Portal';

export default class AMisSchemaEditor extends React.Component {
  state = {
    preview: localStorage.getItem('editting_preview') ? true : false,
    schema: localStorage.getItem('editting_schema')
      ? JSON.parse(localStorage.getItem('editting_schema'))
      : schema
  };

  handleChange = value => {
    localStorage.setItem('editting_schema', JSON.stringify(value));

    this.setState({
      schema: value
    });
  };
  handlePreviewChange = preview => {
    localStorage.setItem('editting_preview', preview ? 'true' : '');

    this.setState({
      preview: !!preview
    });
  };
  clearCache = () => {
    localStorage.removeItem('editting_schema');
    this.setState({
      schema: schema
    });
  };

  render() {
    return (
      <div className="h-full">
        <Portal container={() => document.querySelector('#headerBar')}>
          <div className="inline m-l">
            预览{' '}
            <Switch
              value={this.state.preview}
              onChange={this.handlePreviewChange}
              className="v-middle"
              inline
            />
            <Button size="sm" className="m-l" onClick={this.clearCache}>
              清除缓存
            </Button>
          </div>
        </Portal>

        <Editor
          preview={this.state.preview}
          value={this.state.schema}
          onChange={this.handleChange}
          className="fix-settings"
        />
      </div>
    );
  }
}
