import React = require('react');
import PageRenderer from '../../../../amis-core/src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {
  render,
  fireEvent,
  waitFor,
  getByText,
  prettyDOM
} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

test('Renderer:input-image autoFill', async () => {
  const fetcher = jest.fn().mockImplementation(() => {
    return Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          value: 'img.png',
          filename: 'filename.png',
          myUrl: 'http://amis.com/image.png'
        }
      }
    });
  });
  global.URL.createObjectURL = jest.fn();

  const {
    debug,
    container,
    findByText,
    getByLabelText,
    findByPlaceholderText,
    findByDisplayValue
  } = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        body: [
          {
            type: 'input-image',
            name: 'img',
            label: 'img',
            receiver: '/api/upload/file',
            autoFill: {
              // 不知道为啥这里不能用 ${url}，可能是有什么地方和真实浏览器不一致
              myUrl: '${myUrl}'
            }
          },
          {
            type: 'input-text',
            name: 'myUrl'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({fetcher})
    )
  );

  const fileInput = container.querySelector(
    'input[type=file]'
  )! as HTMLInputElement;

  const file = new File(['file'], 'ping.png', {
    type: 'image/png'
  });

  fireEvent.change(fileInput, {
    target: {files: [file]}
  });

  await wait(500);

  const textInput = container.querySelector(
    'input[name=myUrl]'
  )! as HTMLInputElement;

  expect(textInput.value).toBe('http://amis.com/image.png');
});
