import React = require('react');
import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

test('Renderer:inputArray', async () => {
  const onSubmit = jest.fn();
  const submitBtnText = 'Submit';
  const {container, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          submitText: submitBtnText,
          api: '/api/mock/saveForm?waitSeconds=1',
          mode: 'horizontal',
          body: [
            {
              name: 'array',
              label: '颜色集合',
              type: 'input-array',
              inline: true,
              items: {
                type: 'input-text',
                clearable: false
              }
            }
          ]
        }
      },
      {onSubmit},
      makeEnv({})
    )
  );

  const addButton = await findByText('新增');
  fireEvent.click(addButton);

  await wait(500);
  const input = container.querySelector('.cxd-TextControl-input input')!;
  fireEvent.change(input, {target: {value: 'amis'}});

  await wait(500);
  const submitBtn = screen.getByRole('button', {name: submitBtnText});
  await waitFor(() => {
    expect(submitBtn).toBeInTheDocument();
  });
  fireEvent.click(submitBtn);

  await wait(500);
  const formData = onSubmit.mock.calls[0][0];
  expect(onSubmit).toHaveBeenCalled();
  expect(formData).toEqual({
    array: ['amis']
  });

  expect(container).toMatchSnapshot();
});
