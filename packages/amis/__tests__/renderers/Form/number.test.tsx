/**
 * 组件名称：InputNumber 数字输入框
 * 单测内容：
 * 1. 默认值，输入数字
 * 2. 最小值 & 最大值
 * 3. 前后缀 &千分分隔
 * 4. 单位
 * 5. 默认值的精度
 * 6. 加强版输入框
 * 7. 边框模式：无边框 & 半边框
 * 8. 大数模式
 */
import React = require('react');
import {render, fireEvent, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, replaceReactAriaIds, wait} from '../../helper';

const setup = async (
  inputOptions: any = {},
  formOptions: any = {},
  formItems: any[] = [{}]
) => {
  const utils = render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            name: 'number',
            label: 'number',
            type: 'input-number',
            changeImmediately: true,
            ...inputOptions
          },
          ...formItems
        ],
        ...formOptions
      },
      {},
      makeEnv()
    )
  );

  await waitFor(() => {
    expect(
      utils.container.querySelector('.cxd-Number-input-wrap input')
    ).toBeInTheDocument();

    expect(
      utils.container.querySelector('button[type="submit"]')
    ).toBeInTheDocument();
  });

  const input = utils.container.querySelector(
    '.cxd-Number-input-wrap input'
  ) as HTMLInputElement;

  const wrap = utils.container.querySelector(
    '.cxd-Number-input-wrap'
  ) as HTMLInputElement;

  const submitBtn = utils.container.querySelector(
    'button[type="submit"]'
  ) as HTMLElement;

  return {
    input,
    submitBtn,
    wrap,
    ...utils
  };
};

test('Renderer:number', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'number',
            name: 'a',
            label: 'number',
            value: '123'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const input = container.querySelector('input[step="1"]') as any;
  expect(input?.value).toEqual('123');
  fireEvent.change(input!, {
    target: {
      value: '456'
    }
  });
  await wait(300);
  expect(input?.value).toEqual('456');

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('Renderer:number with min & max', async () => {
  const {input, wrap, container} = await setup({
    min: 5,
    max: 10
  });

  fireEvent.click(wrap);
  await wait(300);
  fireEvent.change(input, {target: {value: 6}});
  fireEvent.blur(input);
  await wait(300);
  expect(input.value).toEqual('6');

  fireEvent.click(wrap);
  await wait(300);
  fireEvent.change(input, {target: {value: 2}});
  fireEvent.blur(input);
  await wait(300);
  expect(input.value).toEqual('5');

  fireEvent.click(wrap);
  await wait(300);
  fireEvent.change(input, {target: {value: 12}});
  fireEvent.blur(input);
  await wait(300);
  expect(input.value).toEqual('10');
});

test('Renderer:number with prefix & suffix & kilobitSeparator', async () => {
  const {input, container} = await setup({
    prefix: '$',
    suffix: '%',
    kilobitSeparator: true,
    value: '123456'
  });

  expect(input.value).toEqual('$123,456%');

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('Renderer:number with unitOptions', async () => {
  const {input, wrap, container, getByText} = await setup(
    {
      unitOptions: ['px', '%', 'em']
    },
    {},
    [
      {
        type: 'static',
        name: 'number'
      }
    ]
  );

  const staticDom = container.querySelector('.cxd-PlainField') as Element;

  expect(staticDom.innerHTML).toBe('<span class="text-muted">-</span>');

  fireEvent.click(wrap);
  await wait(300);
  fireEvent.change(input, {target: {value: 99}});
  fireEvent.blur(input);
  await wait(300);
  expect(staticDom.innerHTML).toBe('99px');

  fireEvent.click(container.querySelector('.cxd-Select') as Element);
  fireEvent.click(getByText(/em/));
  await wait(300);
  expect(staticDom.innerHTML).toBe('99em');

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('Renderer:number with precision and default value', async () => {
  const {input, wrap, container, getByText} = await setup({
    precision: 2,
    step: 0.01,
    value: 2.98786
  });

  expect(input.value).toBe('2.99');

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('Renderer:number with step & precision & displayMode & keyboard', async () => {
  const {input, wrap, container, getByText} = await setup({
    step: 3,
    precision: 3,
    displayMode: 'enhance'
  });

  const rightBtn = container.querySelector(
    '.cxd-Number--enhance-right-icon'
  ) as Element;

  fireEvent.click(wrap);
  await wait(300);
  fireEvent.change(input, {target: {value: 11.111111}});
  fireEvent.blur(input);
  await wait(300);
  expect(input.value).toBe('11.111');

  fireEvent.click(rightBtn);
  await wait(300);
  expect(input.value).toBe('14.111');

  // rc-input-number 中 keyDown 使用 which 判断 keyCode，当前环境此字段为空，无法响应
  // fireEvent.focus(input);
  // await wait(300);
  // fireEvent.keyDown(input, {key: 'ArrowUp', code: 38});
  // await wait(300);
  // expect(input.value).toBe('17.111');

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('Renderer:number with borderMode', async () => {
  const {container: noBorder} = await setup({
    borderMode: 'none'
  });
  const {container: halfBorder} = await setup({
    borderMode: 'half'
  });

  expect(
    noBorder.querySelector('.cxd-Number.cxd-Number--borderNone') as Element
  ).toBeInTheDocument();
  expect(
    halfBorder.querySelector('.cxd-Number.cxd-Number--borderHalf') as Element
  ).toBeInTheDocument();

  expect(noBorder).toMatchSnapshot();
  expect(halfBorder).toMatchSnapshot();
});

test('Renderer:number with big value', async () => {
  const {container, input} = await setup({
    big: true,
    max: '99999999999999999.99', // 整数部分 17 位
    min: '9999999999999999.99', // 整数部分 16 位
    precision: 2
  });

  fireEvent.change(input, {target: {value: 1}});
  fireEvent.blur(input);
  await wait(300);
  expect(input.value).toEqual('9999999999999999.99'); // 最小值

  fireEvent.change(input, {target: {value: '99999999999999990.99'}});
  fireEvent.blur(input);
  await wait(300);
  expect(input.value).toEqual('99999999999999990.99'); // 整数部分 17 位，最小值最大值之间

  fireEvent.change(input, {target: {value: '9999999999999999.999'}}); // 整数部分 17 位，会四舍五入
  fireEvent.blur(input);
  await wait(300);
  expect(input.value).toEqual('10000000000000000.00');

  fireEvent.change(input, {target: {value: '999999999999999999.99'}}); // 整数部分 18 大于最大值
  fireEvent.blur(input);
  await wait(300);
  expect(input.value).toEqual('99999999999999999.99'); // 最大值

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('Renderer:number with static', async () => {
  const {input: stringValInput} = await setup({
    value: '123'
  });
  const {input: numberValInput} = await setup({
    value: 123
  });

  expect(stringValInput.value).toEqual('123');
  expect(numberValInput.value).toEqual('123');
});
