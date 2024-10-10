import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../../../src';
import {render as amisRender} from '../../../../src';
import {makeEnv, wait} from '../../../helper';

test('EventAction:switch', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          id: 1
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'button',
            label: '修改开关的值',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    componentId: 'u:6613bfa3a18e',
                    actionType: 'setValue',
                    args: {
                      value: true
                    }
                  }
                ]
              }
            },
            id: 'u:9d7d695145bb'
          },
          {
            type: 'form',
            title: '表单',
            debug: true,
            body: [
              {
                label: '开启',
                type: 'switch',
                name: 'switch',
                id: 'u:6613bfa3a18e',
                value: false,
                mode: 'inline',
                onEvent: {
                  change: {
                    actions: [
                      {
                        actionType: 'ajax',
                        api: '/api/mock2/form/saveForm?switch=${switch}'
                      }
                    ]
                  }
                }
              }
            ],
            id: 'u:82d44e407eb0',
            actions: [
              {
                type: 'submit',
                label: '提交',
                primary: true
              }
            ]
          }
        ]
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(getByText('修改开关的值')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/修改开关的值/));

  await waitFor(() => {
    expect(container.querySelector('.is-checked')).toBeInTheDocument();
  });

  fireEvent.click(container.querySelector('.is-checked')!);

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalled();
    expect(fetcher.mock.calls[0][0].url).toEqual(
      '/api/mock2/form/saveForm?switch=false'
    );
  });
});
