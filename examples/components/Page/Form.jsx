import React from 'react';
import ResultBox from '../../../src/components/ResultBox';

export default {
  type: 'page',
  title: '表单页面',
  body: {
    type: 'form',
    mode: 'horizontal',
    title: '',
    api: '/api/mock2/form/saveForm',
    controls: [
      {
        label: 'Name',
        type: 'text',
        name: 'name'
      },

      {
        label: 'Email',
        type: 'email',
        name: 'email'
      },

      {
        name: 'checkboxes',
        type: 'checkboxes',
        joinValues: false,
        options: [
          {
            label: '张学友',
            value: 'a'
          },
          {
            label: '刘德华',
            value: 'b'
          },
          {
            label: '黎明',
            value: 'c'
          },
          {
            label: '郭富城',
            value: 'd'
          }
        ]
      },

      {
        label: 'Result',
        name: 'checkboxes',
        component: ({value, onChange}) => {
          return <ResultBox value={value} onChange={onChange} allowInput />;
        }
      }
    ]
  }
};
