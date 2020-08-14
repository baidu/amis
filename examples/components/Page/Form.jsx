import React from 'react';
import ConditionBuilder from '../../../src/components/condition-builder';

const fields = [
  {
    label: '姓名',
    name: 'name',
    type: 'text'
  },

  {
    label: '年龄',
    name: 'age',
    type: 'number'
  },

  {
    label: '入职时间',
    name: 'ruzhi',
    type: 'datetime'
  },

  {
    label: '关系字段',
    children: [
      {
        label: '姓名',
        name: 'name2',
        type: 'text'
      },

      {
        label: '年龄',
        name: 'age2',
        type: 'number'
      }
    ]
  }
];

const funcs = [
  {
    label: '文本',
    children: [
      {
        type: 'LOWERCASE',
        label: '转小写',
        returnType: 'text',
        args: [
          {
            type: 'text',
            label: '文本'
          }
        ]
      }
    ]
  }
];

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
        name: 'a',
        type: 'static',
        tpl: '${a|json:2}'
      },

      {
        name: 'a',
        component: ({value, onChange}) => (
          <ConditionBuilder
            value={value}
            onChange={onChange}
            fields={fields}
            funcs={funcs}
          />
        )
      }
    ]
  }
};
