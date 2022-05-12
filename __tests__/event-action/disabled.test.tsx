import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';
import rows from '../mockData/rows';

test('EventAction:disabled', async () => {
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        data: {
          btnDisabled: true,
          btnNotDisabled: false
        },
        body: [
          {
            type: 'action',
            label: '测试1',
            disabledOn: '${btnDisabled}'
          },
          {
            type: 'action',
            label: '测试2',
            disabledOn: '${btnNotDisabled}',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'disabled',
                    componentId: 'ui:button_test_3'
                  }
                ]
              }
            }
          },
          {
            type: 'action',
            label: '测试3',
            disabledOn: '${btnNotDisabled}',
            id: 'ui:button_test_3'
          },
          {
            type: 'action',
            label: '测试4',
            disabledOn: '${btnNotDisabled}',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'enabled',
                    componentId: 'ui:button_test_5'
                  }
                ]
              }
            }
          },
          {
            type: 'action',
            label: '测试5',
            disabledOn: '${btnDisabled}',
            id: 'ui:button_test_5'
          },
          {
            type: 'crud',
            api: '/api/mock2/sample',
            syncLocation: false,
            columns: [
              {
                name: 'id',
                label: 'ID'
              },
              {
                name: 'engine',
                label: 'Rendering engine'
              },
              {
                name: 'browser',
                label: 'Browser'
              },
              {
                name: 'platform',
                label: 'Platform(s)'
              },
              {
                name: 'version',
                label: 'Engine version'
              },
              {
                name: 'grade',
                label: 'CSS grade'
              },
              {
                type: 'operation',
                label: '操作',
                buttons: [
                  {
                    label: '详情',
                    type: 'button',
                    level: 'link',
                    actionType: 'dialog',
                    dialog: {
                      title: '查看详情',
                      body: {
                        type: 'form',
                        body: [
                          {
                            type: 'input-text',
                            name: 'engine',
                            label: 'Engine'
                          },
                          {
                            type: 'input-text',
                            name: 'browser',
                            label: 'Browser'
                          },
                          {
                            type: 'input-text',
                            name: 'platform',
                            label: 'platform'
                          },
                          {
                            type: 'input-text',
                            name: 'version',
                            label: 'version'
                          },
                          {
                            type: 'control',
                            label: 'grade',
                            body: {
                              type: 'tag',
                              label: '${grade}',
                              displayMode: 'normal',
                              color: 'active'
                            }
                          }
                        ]
                      }
                    }
                  },
                  {
                    label: '删除',
                    type: 'button',
                    level: 'link',
                    className: 'text-danger',
                    disabledOn: "this.grade === 'A'"
                  }
                ]
              }
            ]
          }
        ]
      },
      {},
      makeEnv({
        fetcher: async (config: any) => {
          return {
            status: 200,
            headers: {},
            data: {
              status: 0,
              msg: '',
              data: {
                count: 1,
                rows
              }
            }
          };
        }
      })
    )
  );

  fireEvent.click(getByText(/测试2/));
  fireEvent.click(getByText(/测试4/));

  await waitFor(() => {
    expect(getByText('Internet Explorer 4.0')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});
