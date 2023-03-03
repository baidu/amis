import React from 'react';
import {render, cleanup, fireEvent, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from '../../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:listSelect with multiple & clearable', async () => {
  const onSubmit = jest.fn();

  const schema = (args?: any) => ({
    type: 'form',
    submitText: 'Submit',
    onSubmit,
    body: {
      type: 'list-select',
      name: 'select',
      label: '单选',
      // "clearable": true,
      // multiple: true,
      ...args,
      options: [
        {
          label: 'Option A',
          value: 'a'
        },
        {
          label: 'Option B',
          value: 'b'
        }
      ]
    }
  });

  const {container, rerender, getByText} = render(amisRender(schema()));

  const options = container.querySelectorAll('.cxd-ListControl-item');
  expect(options!.length).toBe(2);

  async function checkRes(times: number, res: any) {
    fireEvent.click(getByText('Submit'));
    await wait(300);
    expect(onSubmit).toBeCalledTimes(times);
    expect(onSubmit.mock.calls[times - 1][0]).toEqual(res);
  }

  fireEvent.click(options[0]!);
  await wait(200);

  await checkRes(1, {
    select: 'a'
  });

  fireEvent.click(getByText('Option B'));
  await wait(200);

  await checkRes(2, {
    select: 'b'
  });

  fireEvent.click(getByText('Option B'));
  await wait(200);
  await checkRes(3, {
    select: 'b'
  });

  rerender(
    amisRender(
      schema({
        clearable: true,
        multiple: true
      })
    )
  );

  fireEvent.click(getByText('Option B'));
  await wait(200);
  await checkRes(4, {
    select: ''
  });

  fireEvent.click(getByText('Option B'));
  await wait(200);
  fireEvent.click(getByText('Option A'));
  await wait(200);

  await checkRes(5, {
    select: 'b,a'
  });

  expect(container).toMatchSnapshot();
}, 10000);

test('Renderer:listSelect with image option & listClassName', async () => {
  const {container, getByText} = render(
    amisRender({
      type: 'form',
      body: {
        type: 'list-select',
        name: 'select',
        label: '单选',
        listClassName: 'items-wrapper',
        options: [
          {
            label: 'OptionA',
            value: 'a',
            image:
              'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
          },
          {
            label: 'OptionB',
            value: 'b',
            image:
              'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
          }
        ]
      }
    })
  );

  expect(container).toMatchSnapshot();

  const item = container.querySelector('.cxd-ListControl-item');
  expect(item).toHaveTextContent('OptionA');
  expect(item!.querySelector('.cxd-ListControl-itemImage img')).toHaveAttribute(
    'src',
    'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
  );

  expect(container.querySelector('.cxd-ListControl-items')).toHaveClass(
    'items-wrapper'
  );
});
