import React from 'react';
import makeSchemaRenderer from './SchemaRender';

const FormComponent = makeSchemaRenderer({
  type: 'form',
  mode: 'inline',
  wrapWithPanel: false,
  className: ':Doc-search',
  controls: [
    {
      type: 'input-group',
      size: 'sm',
      controls: [
        {
          type: 'icon',
          addOnclassName: 'no-bg no-border p-r-none p-l',
          className: 'text-sm',
          icon: 'search',
          vendor: 'iconfont'
        },
        {
          type: 'text',
          placeholder: '搜索...',
          inputClassName: 'no-border',
          name: 'docsearch'
        }
      ]
    }
  ]
});

export default class DocSearch extends React.Component {
  componentDidMount() {
    // const inputSelector = 'input[name="docsearch"]';
    // docsearch({
    //   appId: 'S08MJHBHFJ',
    //   apiKey: '5fba814bb773d08b5d2a3f6074f926a5',
    //   indexName: 'gh_pages',
    //   inputSelector,
    //   debug: false
    // });
  }

  render() {
    return <FormComponent showCode={false} theme={this.props.theme} />;
  }
}
