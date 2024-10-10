import React = require('react');
import {render, cleanup, fireEvent, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from '../../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:checkbox', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            name: 'checkbox',
            type: 'checkbox',
            label: 'Checkbox',
            option: '选项说明',
            trueValue: true,
            falseValue: false
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();
});

test('Renderer:checkbox with optionType', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            name: 'checkbox',
            type: 'checkbox',
            label: 'Checkbox',
            option: '去吃饭',
            trueValue: '吃了',
            falseValue: '没吃呢',
            optionType: 'button',
            value: '没吃呢'
          },
          {
            type: 'static',
            label: '您吃了吗',
            name: 'checkbox'
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );

  await wait(300);

  expect(
    container.querySelector('.cxd-Checkbox.cxd-Checkbox--button') as Element
  ).toBeInTheDocument();


  fireEvent.click(getByText(/去吃饭/));

  await waitFor(() => {
    expect(
      (container.querySelector('.cxd-PlainField') as Element).innerHTML
    ).toBe('吃了');

    expect(
      container.querySelector('.cxd-Checkbox.cxd-Checkbox--button.cxd-Checkbox--button--checked') as Element
    ).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});


test('Renderer:checkbox with checked', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            name: 'checkbox',
            type: 'checkbox',
            label: 'Checkbox',
            option: '选项说明',
            checked: true
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );

  await wait(300);

  expect(
    container.querySelector('.cxd-Checkbox input[checked]') as Element
  ).toBeInTheDocument();

  expect(container).toMatchSnapshot();
});
