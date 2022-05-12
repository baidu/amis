import {fireEvent, render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

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
            hiddenOn: '${btnNotHidden}',
            id: 'ui:button_test_3'
          },
          {
            type: 'action',
            label: '按钮4',
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
            hidden: true,
            id: 'ui:button_test_5'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  fireEvent.click(getByText(/按钮2/));
  fireEvent.click(getByText(/按钮4/));

  expect(container).toMatchSnapshot();
});
