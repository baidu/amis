import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

test('EventAction:email', async () => {
  window.open = jest.fn();
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'button',
            label: '发送邮件',
            level: 'primary',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'email',
                    args: {
                      to: 'amis@baidu.com',
                      cc: 'baidu@baidu.com',
                      subject: '这是邮件主题',
                      body: '这是邮件正文'
                    }
                  }
                ]
              }
            }
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  fireEvent.click(getByText('发送邮件'));
  await waitFor(() => {
    expect(window.open).toHaveBeenCalledWith(
      'mailto:amis@baidu.com?cc=baidu%40baidu.com&subject=%E8%BF%99%E6%98%AF%E9%82%AE%E4%BB%B6%E4%B8%BB%E9%A2%98&body=%E8%BF%99%E6%98%AF%E9%82%AE%E4%BB%B6%E6%AD%A3%E6%96%87'
    );
  });
});
