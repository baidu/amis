import React from 'react';
import makeSchemaRenderer from './SchemaRender';

const FormComponent = makeSchemaRenderer({
  type: 'form',
  mode: 'inline',
  wrapWithPanel: false,
  className: 'pull-right m-t-sm m-r',
  controls: [
    {
      type: 'input-group',
      size: 'sm',
      controls: [
        {
          type: 'icon',
          addOnclassName: 'no-bg',
          className: 'text-sm',
          icon: 'search',
          vendor: 'iconfont'
        },
        {
          type: 'text',
          placeholder: '搜索文档',
          inputClassName: 'b-l-none p-l-none',
          name: 'docsearch'
        }
      ]
    }
  ]
});

export default class DocSearch extends React.Component {
  componentDidMount() {
    const inputSelector = 'input[name="docsearch"]';
    docsearch({
      appId: '3W0NHYOWPE',
      apiKey: '469f5cf3d54f9b86127970f913dc0725',
      indexName: 'gh_pages',
      inputSelector,
      debug: false
    });
  }

  render() {
    return <FormComponent showCode={false} theme={this.props.theme} />;
  }
}
