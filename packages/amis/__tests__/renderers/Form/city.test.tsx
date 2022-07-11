import React = require('react');
import {render, fireEvent, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

test('Renderer:input-city base', async () => {
  const {container, getByText, debug} = render(
    amisRender(
      {
        type: 'input-city',
        label: 'city',
        allowDistrict: true,
        allowCity: true,
        placeholder: '请选择'
      },
      {},
      makeEnv({})
    )
  );

  await waitFor(() => {
    expect(getByText('请选择')).toBeInTheDocument();
  });

  fireEvent.click(getByText('请选择'));
  fireEvent.mouseEnter(getByText('河北省'));
  fireEvent.mouseEnter(getByText('石家庄市'));
  fireEvent.click(getByText('长安区'));

  await wait(50);
  expect(container).toMatchSnapshot();
});

test('Renderer:input-city multiple', async () => {
  const {container, getByText, debug} = render(
    amisRender(
      {
        type: 'input-city',
        label: 'city',
        allowDistrict: true,
        allowCity: true,
        placeholder: '请选择',
        multiple: true
      },
      {},
      makeEnv({})
    )
  );

  await waitFor(() => {
    expect(getByText('请选择')).toBeInTheDocument();
  });

  fireEvent.click(getByText('请选择'));
  fireEvent.mouseEnter(getByText('河北省'));
  fireEvent.click(getByText('石家庄市'));

  await wait(50);
  expect(container.querySelectorAll('.cxd-ResultBox-value').length).toBe(24);
});

test('Renderer:input-city multiple [allowDistrict=false]', async () => {
  const {container, getByText, debug} = render(
    amisRender(
      {
        type: 'input-city',
        label: 'city',
        allowDistrict: false,
        allowCity: true,
        placeholder: '请选择',
        multiple: true
      },
      {},
      makeEnv({})
    )
  );

  await waitFor(() => {
    expect(getByText('请选择')).toBeInTheDocument();
  });

  fireEvent.click(getByText('请选择'));
  fireEvent.mouseEnter(getByText('河北省'));
  fireEvent.click(getByText('石家庄市'));

  await wait(50);
  expect(container.querySelectorAll('.cxd-ResultBox-value').length).toBe(1);
});

test('Renderer:input-city multiple&allowStreet', async () => {
  const schema = {
    type: 'input-city',
    label: 'city',
    allowDistrict: false,
    allowCity: true,
    placeholder: '请选择',
    multiple: true,
    allowStreet: true
  };
  const {container, getByText, rerender, debug} = render(
    amisRender(schema, {}, makeEnv({}))
  );

  await waitFor(() => {
    expect(getByText('请选择')).toBeInTheDocument();
  });
  expect(
    container.querySelector('.cxd-CityPicker-input')
  ).not.toBeInTheDocument();

  schema.multiple = false;
  rerender(amisRender(schema, {}, makeEnv({})));
  expect(container.querySelector('.cxd-CityPicker-input')).toBeInTheDocument();
});
