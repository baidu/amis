import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

test('EventAction:copy', async () => {
  const copy = jest.fn();
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        data: {
          content: 'http://www.baidu.com'
        },
        body: [
          {
            type: 'action',
            label: '复制',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'copy',
                    args: {
                      content: 'the content is ${content}'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'button',
            label: '复制富文本',
            level: 'primary',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'copy',
                    args: {
                      format: 'text/html',
                      content:
                        'the content is <a href="http://www.baidu.com">link</a> <b>bold</b>'
                    }
                  }
                ]
              }
            }
          }
        ]
      },
      {},
      makeEnv({
        copy
      })
    )
  );

  fireEvent.click(getByText('复制'));
  await waitFor(() => {
    expect(copy).toHaveBeenCalled();
  });
  expect(copy.mock.calls[0][0]).toEqual('the content is http://www.baidu.com');

  fireEvent.click(getByText('复制富文本'));
  await waitFor(() => {
    expect(copy).toHaveBeenCalled();
  });
  expect(copy.mock.calls[1][0]).toEqual(
    'the content is <a href="http://www.baidu.com">link</a> <b>bold</b>'
  );
  expect(copy.mock.calls[1][1]).toEqual({format: 'text/html'});
});
