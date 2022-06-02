import React = require('react');
import {render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

test('Renderer:portlet', () => {
  const {container} = render(
    amisRender(
      {
        type: 'portlet',
        toolbar: [
          {
            label: '固定操作',
            type: 'button',
            actionType: 'ajax',
            api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm'
          }
        ],
        tabs: [
          {
            title: 'Tab 1',
            tab: 'Content 1',
            toolbar: [
              {
                label: 'ajax请求',
                type: 'button',
                actionType: 'ajax',
                api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm'
              },
              {
                type: 'dropdown-button',
                level: 'link',
                icon: 'fa fa-ellipsis-h',
                hideCaret: true,
                buttons: [
                  {
                    type: 'button',
                    label: '编辑',
                    actionType: 'dialog',
                    dialog: {
                      title: '编辑',
                      body: '你正在编辑该卡片'
                    }
                  },
                  {
                    type: 'button',
                    label: '删除',
                    actionType: 'dialog',
                    dialog: {
                      title: '提示',
                      body: '你删掉了该卡片'
                    }
                  }
                ]
              }
            ]
          },
          {
            title: 'Tab 2',
            tab: 'Content 2',
            toolbar: [
              {
                type: 'button',
                level: 'link',
                url: 'https://www.baidu.com',
                actionType: 'url',
                size: 'sm',
                label: '跳转2'
              }
            ]
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
