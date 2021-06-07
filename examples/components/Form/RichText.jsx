import React from 'react';

export default {
  title: '富文本编辑器',
  body: [
    {
      type: 'form',
      api: '/api/mock2/saveForm?waitSeconds=2',
      title: 'Form elements',
      body: [
        {
          name: 'html',
          type: 'input-rich-text',
          label: '富文本',
          value: '<p>Just do <code>IT</code></p>'
        }
      ]
    }
  ]
};
