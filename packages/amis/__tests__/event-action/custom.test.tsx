import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

test('EventAction:custom', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          age: 18
        }
      }
    })
  );
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        id: 'page_001',
        data: {
          age: '22'
        },
        body: [
          {
            type: 'button',
            label: '自定义动作1',
            level: 'primary',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'custom',
                    script:
                      "doAction({actionType: 'ajax', args: {api: 'api/xxx'}, outputVar: 'result'});"
                  },
                  {
                    actionType: 'setValue',
                    componentId: 'page_001',
                    args: {
                      value: '${event.data.result.data}'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'button',
            label: '自定义动作2',
            level: 'primary',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'custom',
                    script:
                      "doAction({actionType: 'ajax', args: {api: 'api/xxx'}, outputVar: 'result'});event.stopPropagation();"
                  },
                  {
                    actionType: 'setValue',
                    componentId: 'page_001',
                    args: {
                      value: '${event.data.result.data}'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'button',
            label: '自定义动作3',
            level: 'primary',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'custom',
                    script:
                      "doAction({actionType: 'setValue', componentId: 'page_001', args: {value: {age: 17}}});"
                  }
                ]
              }
            }
          },
          {
            type: 'tpl',
            tpl: '${age}岁的天空'
          }
        ]
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  fireEvent.click(getByText('自定义动作1'));
  await waitFor(() => {
    expect(getByText('18岁的天空')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('自定义动作2'));
  await waitFor(() => {
    expect(getByText('18岁的天空')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('自定义动作3'));
  await waitFor(() => {
    expect(getByText('17岁的天空')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});
