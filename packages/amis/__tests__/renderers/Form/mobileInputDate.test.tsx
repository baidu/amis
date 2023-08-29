import {render, fireEvent} from '@testing-library/react';
import '../../../src';
import moment from 'moment';
import {render as amisRender} from '../../../src';
import {createMockMediaMatcher, makeEnv} from '../../helper';

let originalMatchMedia: any;

beforeAll(() => {
  originalMatchMedia = window.matchMedia;
  window.matchMedia = createMockMediaMatcher(true);
});

afterAll(() => {
  window.matchMedia = originalMatchMedia;
});

test('Renderer:mobile Input Date', async () => {
  const {container, findByPlaceholderText, findByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            type: 'input-date',
            name: 'date',
            label: '日期'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  const inputDate = await findByPlaceholderText('请选择日期');
  fireEvent.click(inputDate);
  // mobile判断有问题
  // const confirmButton = document.querySelector(
  //   '.cxd-PickerColumns-confirm'
  // ) as HTMLButtonElement;

  // fireEvent.click(confirmButton);

  // const value = document.querySelector(
  //   '.cxd-DatePicker-value'
  // ) as HTMLSpanElement;

  // TODO: 这里原组件的日错了，等修复
  // expect(value.innerHTML).toEqual(moment().format('YYYY-MM-DD'));
});
