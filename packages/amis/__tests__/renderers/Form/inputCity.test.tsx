/**
 * 组件名称：InputCity 城市选择器
 * 单测内容：
 * 1. 基础使用
 * 2. searchable
 * 3. allowDistrict & allowCity
 */

import {
  render,
  fireEvent,
  cleanup,
  getByText,
  within,
  waitFor
} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

const setup = async (items: any[] = []) => {
  const onSubmit = jest.fn();
  const utils = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          submitText: 'Submit',
          api: '/api/mock/saveForm?waitSeconds=1',
          mode: 'horizontal',
          body: items
        }
      },
      {onSubmit},
      makeEnv()
    )
  );

  const submitBtn = utils.container.querySelector(
    'button[type="submit"]'
  ) as HTMLElement;

  return {
    onSubmit,
    submitBtn,
    ...utils,
    rerender: (items: any[]) =>
      utils.rerender(
        amisRender(
          {
            type: 'page',
            body: {
              type: 'form',
              submitText: 'Submit',
              api: '/api/mock/saveForm?waitSeconds=1',
              mode: 'horizontal',
              body: items
            }
          },
          {onSubmit},
          makeEnv()
        )
      )
  };
};

// 1. 基础使用
test('Renderer:inputCity', async () => {
  const {container, getByText, onSubmit, submitBtn} = await setup([
    {
      name: 'city',
      type: 'input-city',
      label: '城市'
    }
  ]);
  await wait(100);

  const select = container.querySelector('.cxd-CityPicker > .cxd-Select')!;
  expect(select).toBeInTheDocument();
  fireEvent.click(select);
  expect(getByText('北京市')).toBeInTheDocument();
  fireEvent.click(getByText('北京市'));
  await wait(100);
  fireEvent.click(submitBtn);
  await waitFor(() => {
    expect(onSubmit).toBeCalled();
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      city: '110000'
    });
  });

  const select2 = container.querySelector(
    '.cxd-CityPicker > .cxd-Select:nth-child(2)'
  )!;
  expect(select2).toBeInTheDocument();
  fireEvent.click(select2);
  expect(getByText('北京市市辖区')).toBeInTheDocument();
  fireEvent.click(getByText('北京市市辖区'));
  await wait(100);
  fireEvent.click(submitBtn);
  await waitFor(() => {
    expect(onSubmit).toBeCalledTimes(2);
    expect(onSubmit.mock.calls[1][0]).toMatchObject({
      city: '110100'
    });
  });

  const select3 = container.querySelector(
    '.cxd-CityPicker > .cxd-Select:nth-child(3)'
  )!;
  expect(select3).toBeInTheDocument();
  fireEvent.click(select3);
  expect(getByText('海淀区')).toBeInTheDocument();
  fireEvent.click(getByText('海淀区'));
  await wait(500);
  fireEvent.click(submitBtn);
  await waitFor(() => {
    expect(onSubmit).toBeCalledTimes(3);
    expect(onSubmit.mock.calls[2][0]).toMatchObject({
      city: '110108'
    });
  });
  await wait(200);
  expect(container).toMatchSnapshot();
});

// 2. searchable
test('Renderer:inputCity with searchable', async () => {
  const {container, getByText, onSubmit, submitBtn, getByTitle} = await setup([
    {
      name: 'city',
      type: 'input-city',
      label: '城市',
      searchable: true
    }
  ]);
  await wait(100);

  const select = container.querySelector('.cxd-CityPicker > .cxd-Select')!;
  expect(select).toBeInTheDocument();
  fireEvent.click(select);

  await wait(100);
  expect(container).toMatchSnapshot('open select');

  const input = select.querySelector('.cxd-Select-input input')!;
  expect(input).toBeInTheDocument();

  fireEvent.change(input, {target: {value: '山'}});
  await wait(100);

  expect(
    select.querySelectorAll('.cxd-Select-menu > .cxd-Select-option')!.length
  ).toBe(2);
  expect(
    await within(select as HTMLElement).getByTitle('山东省')
  ).toBeInTheDocument();
  expect(
    await within(select as HTMLElement).getByTitle('山西省')
  ).toBeInTheDocument();
});

// 3. allowDistrict & allowCity
test('Renderer:inputCity with allowDistrict & allowCity', async () => {
  const {container, getByText, onSubmit, submitBtn, getByTitle, rerender} =
    await setup([
      {
        name: 'city',
        type: 'input-city',
        label: '城市',
        allowDistrict: false,
        allowCity: false
      }
    ]);
  await wait(100);

  const select = container.querySelector('.cxd-CityPicker > .cxd-Select')!;
  expect(select).toBeInTheDocument();
  fireEvent.click(select);
  expect(getByText('北京市')).toBeInTheDocument();
  fireEvent.click(getByText('北京市'));

  await wait(100);
  expect(
    container.querySelector('.cxd-CityPicker > .cxd-Select:nth-child(2)')!
  ).not.toBeInTheDocument();

  rerender([
    {
      name: 'city',
      type: 'input-city',
      label: '城市',
      allowDistrict: false,
      allowCity: true
    }
  ]);

  fireEvent.click(select);
  expect(getByText('山西省')).toBeInTheDocument();
  fireEvent.click(getByText('山西省'));

  await wait(100);
  const select2 = container.querySelector(
    '.cxd-CityPicker > .cxd-Select:nth-child(2)'
  )!;
  expect(select2).toBeInTheDocument();
  fireEvent.click(select2);
  expect(getByText('太原市')).toBeInTheDocument();
  fireEvent.click(getByText('太原市'));

  await wait(100);
  expect(
    container.querySelector('.cxd-CityPicker > .cxd-Select:nth-child(3)')!
  ).not.toBeInTheDocument();

  rerender([
    {
      name: 'city',
      type: 'input-city',
      label: '城市',
      allowDistrict: true,
      allowCity: true
    }
  ]);

  fireEvent.click(select2);
  expect(getByText('忻州市')).toBeInTheDocument();
  fireEvent.click(getByText('忻州市'));

  await wait(100);
  expect(
    container.querySelector('.cxd-CityPicker > .cxd-Select:nth-child(3)')!
  ).toBeInTheDocument();
});
