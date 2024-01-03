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
                      }
                    },
                    data: {
                      name: '${myname}',
                      age: 18
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'button',
            label: '内容区打开',
            level: 'primary',
            className: 'ml-2',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'link',
                    args: {
                      link: './expression',
                      linkType: 'page',
                      params: {
                        name: 'jack',
                        jon: '${myjon}'
                      }
                    },
                    data: {
                      name: '${myname}',
                      age: 18
                    }
                  }
                ]
              }
            }
          },

          {
            type: 'button',
            label: '新开页打开',
            level: 'primary',
            className: 'ml-2',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'link',
                    args: {
                      link: './expression',
                      linkType: 'blank',
                      params: {
                        name: 'jack',
                        jon: '${myjon}'
                      }
                    },
                    data: {
                      name: '${myname}',
                      age: 18
                    }
                  }
                ]
              }
            }
          },

          {
            type: 'button',
            label: '当前页打开',
            level: 'primary',
            className: 'ml-2',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'link',
                    args: {
                      link: './expression',
                      linkType: 'self',
                      params: {
                        name: 'jack',
                        jon: '${myjon}'
                      }
                    },
                    data: {
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
  fireEvent.click(getByText('内容区打开'));
  fireEvent.click(getByText('新开页打开'));
  fireEvent.click(getByText('当前页打开'));
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
    }
  });
  expect(jumpTo.mock.calls[0][2]).toEqual({
    age: 18,
    name: 'lvxj'
  });
  expect(jumpTo.mock.calls[1][0]).toEqual(
    './expression?name=lvxj&jon=player&age=18'
  );
  expect(jumpTo.mock.calls[2][0]).toEqual(
    './expression?name=lvxj&jon=player&age=18'
  );
  expect(jumpTo.mock.calls[3][0]).toEqual(
    './expression?name=lvxj&jon=player&age=18'
  );
});
