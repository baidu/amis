import React = require('react');
import {render, cleanup} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from '../../../src/factory';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:service', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          controls: [
            {type: 'text', label: '动态字段1', name: 'dy_1', required: true},
            {type: 'text', label: '动态字段2', name: 'dy_2'}
          ]
        }
      }
    })
  );

  const {container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            name: 'tpl',
            type: 'select',
            label: '模板',
            inline: true,
            required: true,
            value: 'tpl1',
            options: [
              {
                label: '模板1',
                value: 'tpl1'
              },
              {
                label: '模板2',
                value: 'tpl2'
              },
              {
                label: '模板3',
                value: 'tpl3'
              }
            ]
          },
          {
            type: 'service',
            className: 'm-t',
            initFetchSchemaOn: 'data.tpl',
            schemaApi:
              'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/service/form?tpl=$tpl'
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  await wait(100);
  expect(fetcher).toHaveBeenCalled();
  expect(container).toMatchSnapshot();
});
