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
    label: '出生日期',
    name: 'birthday',
    type: 'date'
  },

  {
    label: '起床时间',
    name: 'wakeupAt',
    type: 'time'
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
  // {
  //   label: '文本',
  //   children: [
  //     {
  //       type: 'LOWERCASE',
  //       label: '转小写',
  //       returnType: 'text',
  //       args: [
  //         {
  //           type: 'text',
  //           label: '文本'
  //         }
  //       ]
  //     }
  //   ]
  // }
];

export default {
  type: 'page',
  title: '表单页面',
  body: {
    type: 'form',
    mode: 'horizontal',
    title: '',
    data: {a: [{b: 1, c: [{d: 2}]}]},
    // debug: true,
    api: '/api/mock2/form/saveForm',
    controls: [
      // {
      //   label: 'Name',
      //   type: 'text',
      //   name: 'name'
      // },

      // {
      //   label: 'Email',
      //   type: 'email',
      //   name: 'email'
      // },

      // {
      //   name: 'a',
      //   type: 'static',
      //   tpl: '${a|json:2}'
      // },

      // {
      //   name: 'a.0.b',
      //   type: 'text',
      //   label: 'B'
      // },

      // {
      //   name: 'a.0.c.0.d',
      //   type: 'number',
      //   label: 'D'
      // },

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
