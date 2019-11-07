import React from 'react';

export default {
  $schema: 'https://houtai.baidu.com/v2/schemas/page.json#',
  title: '富文本编辑器',
  body: [
    {
      type: 'form',
      api: '/api/mock2/saveForm?waitSeconds=2',
      title: 'Form elements',
      controls: [
        {
          name: 'html',
          type: 'rich-text',
          label: '富文本',
          value: '<p>Just do <code>IT</code></p>'
        }
      ]
    }
  ]
};
