import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

test('EventAction:url & link', async () => {
  const jumpTo = jest.fn();
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        data: {
          myname: 'lvxj',
          myjon: 'player'
        },
        body: [
          {
            type: 'button',
            label: '跳转',
            level: 'primary',
            className: 'ml-2',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'url',
                    args: {
                      url: 'http://www.baidu.com',
                      blank: true,
                      params: {
                        name: 'jack',
                        jon: '${myjon}'
                      },
                      name: '${myname}',
                      age: 18
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
        jumpTo
      })
    )
  );

  fireEvent.click(getByText('跳转'));
  await waitFor(() => {
    expect(jumpTo).toHaveBeenCalled();
  });
  expect(jumpTo.mock.calls[0][0]).toEqual(
    'http://www.baidu.com?name=lvxj&jon=player&age=18'
  );
  expect(jumpTo.mock.calls[0][1]).toEqual({
    actionType: 'url',
    type: 'button',
    url: 'http://www.baidu.com',
    blank: true,
    params: {
      name: 'jack',
      jon: 'player'
    },
    name: 'lvxj',
    age: 18
  });
  expect(jumpTo.mock.calls[0][2]).toEqual({
    url: 'http://www.baidu.com',
    blank: true,
    params: {
      name: 'jack',
      jon: 'player'
    },
    name: 'lvxj',
    age: 18
  });
});
