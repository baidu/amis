import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

test('EventAction:hidden', async () => {
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        data: {
          btnHidden: true,
          btnNotHidden: false
        },
        body: [
          {
            type: 'action',
            label: '按钮1',
            hiddenOn: '${btnHidden}'
          },
          {
            type: 'action',
            label: '按钮2',
            className: 'btn_2',
            hiddenOn: '${btnNotHidden}',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'hidden',
                    componentId: 'ui:button_test_3'
                  }
                ]
              }
            }
          },
          {
            type: 'action',
            label: '按钮3',
            className: 'btn_3',
            hiddenOn: '${btnNotHidden}',
            id: 'ui:button_test_3'
          },
          {
            type: 'action',
            label: '按钮4',
            className: 'btn_4',
            hiddenOn: '${btnNotHidden}',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'show',
                    componentId: 'ui:button_test_5'
                  }
                ]
              }
            }
          },
          {
            type: 'action',
            label: '按钮5',
            className: 'btn_5',
            hidden: true,
            id: 'ui:button_test_5'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  await waitFor(() => {
    expect(container.querySelector('.btn_2')).toBeInTheDocument();
    expect(container.querySelector('.btn_3')).toBeInTheDocument();
    expect(container.querySelector('.btn_4')).toBeInTheDocument();
    expect(container.querySelector('.btn_5')).not.toBeInTheDocument();
  });

  fireEvent.click(getByText(/按钮2/));
  await wait(300);
  expect(container.querySelector('.btn_3')).not.toBeInTheDocument();

  fireEvent.click(getByText(/按钮4/));
  await wait(300);
  expect(container.querySelector('.btn_5')).toBeInTheDocument();
});
