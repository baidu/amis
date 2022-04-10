import React = require('react');
import {render, cleanup, fireEvent} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from '../../../src/factory';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

const setup = (inputOptions: any = {}, formOptions: any = {}) => {
  const utils = render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            name: 'text',
            label: 'text',
            type: 'input-text',
            changeImmediately: true,
            ...inputOptions
          }
        ],
        ...formOptions
      },
      {},
      makeEnv()
    )
  );

  const input = utils.container.querySelector(
    'input[name="text"]'
  ) as HTMLInputElement;

  const submitBtn = utils.container.querySelector(
    'button[type="submit"]'
  ) as HTMLElement;

  return {
    input,
    submitBtn,
    ...utils
  };
};

/**
 * 基本使用
 */
test('Renderer:text', async () => {
  const {container, input} = setup();

  expect(container).toMatchSnapshot();
  // 输入是否正常
  fireEvent.change(input, {target: {value: 'AbCd'}});
  // 事件机制导致hanleChange变为异步
  await wait(300);
  expect(input.value).toBe('AbCd');
});

/**
 * type 为 url，主要测试校验
 */
test('Renderer:text type is url', async () => {
  const {container, input, submitBtn} = setup({
    type: 'input-url'
  });

  fireEvent.change(input, {target: {value: 'abcd'}});
  fireEvent.click(submitBtn);
  await wait(200); // 表单校验是异步的，所以必须要等一段时间 @todo 感觉可能需要寻找更靠谱的办法
  expect(container).toMatchSnapshot('validate fail');

  fireEvent.change(input, {target: {value: 'https://www.baidu.com'}});
  await wait(200);
  expect(container).toMatchSnapshot('validate success');
});

/**
 * type 为 email，主要测试校验
 */
test('Renderer:text type is email', async () => {
  const {container, input, submitBtn} = setup({
    type: 'input-email'
  });

  fireEvent.change(input, {target: {value: 'abcd'}});
  fireEvent.click(submitBtn);
  await wait(200);
  expect(container).toMatchSnapshot('validate fail');

  fireEvent.change(input, {target: {value: 'test@baidu.com'}});
  await wait(200);
  expect(container).toMatchSnapshot('validate success');
});

/**
 * type 为 password
 */
test('Renderer:text type is password', () => {
  const {container, input} = setup({
    type: 'input-password'
  });

  fireEvent.change(input, {target: {value: 'abcd'}});
  expect(container).toMatchSnapshot();
});

/**
 * 配置addOn
 */
test('Renderer:text with addOn', () => {
  const {container, input} = setup({
    addOn: {
      type: 'button',
      label: '搜索'
    }
  });

  expect(container).toMatchSnapshot();
});

/**
 * 配置 clearable
 */
test('Renderer:text with clearable', async () => {
  const {container, input} = setup({
    clearable: true
  });
  fireEvent.change(input, {target: {value: 'abcd'}}); // 有值之后才会显示clear的icon
  await wait(300);
  expect(container).toMatchSnapshot();

  fireEvent.click(
    container.querySelector('a.cxd-TextControl-clear') as HTMLElement
  );
  await wait(300);
  expect(input.value).toBe('');
});

/**
 * 选择器模式
 */
test('Renderer:text with options', async () => {
  const {container, input} = setup(
    {
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
    },
    {debug: true}
  );
  expect(container).toMatchSnapshot();

  // 展开 options
  fireEvent.click(
    container.querySelector('.cxd-TextControl-input') as HTMLElement
  );
  await wait(300);
  expect(container).toMatchSnapshot('options is open');

  // 选中一项
  fireEvent.click(
    container.querySelector(
      '.cxd-TextControl-sugs .cxd-TextControl-sugItem'
    ) as HTMLElement
  );
  await wait(300);
  // expect(input.value).toBe('a');
  expect(container).toMatchSnapshot('select first option');
});

/**
 * 选择器模式,多选
 */
test('Renderer:text with options and multiple', async () => {
  const {container, input} = setup(
    {
      multiple: true,
      options: [
        {
          label: 'OptionA',
          value: 'a'
        },
        {
          label: 'OptionB',
          value: 'b'
        },
        {
          label: 'OptionC',
          value: 'c'
        },
        {
          label: 'OptionD',
          value: 'd'
        }
      ]
    },
    {debug: true}
  );

  const textControl = container.querySelector(
    '.cxd-TextControl-input'
  ) as HTMLElement;

  // 展开 options
  fireEvent.click(textControl);
  await wait(300);
  expect(container).toMatchSnapshot('options is opened');

  // 选中第一项
  fireEvent.click(
    container.querySelector(
      '.cxd-TextControl-sugs .cxd-TextControl-sugItem'
    ) as HTMLElement
  );
  await wait(300);
  // expect(input.value).toBe('a');
  expect(container).toMatchSnapshot('first option selected');

  // 再次打开 options
  fireEvent.click(textControl);
  await wait(300);
  expect(container).toMatchSnapshot(
    'options is opened again, and first option already selected'
  );

  // 选中 options 中的第一项
  fireEvent.click(
    container.querySelector(
      '.cxd-TextControl-sugs .cxd-TextControl-sugItem'
    ) as HTMLElement
  );
  await wait(300);
  // expect(input.value).toBe('a,b');
  expect(container).toMatchSnapshot('second option selected');
});

/**
 * 前缀和后缀
 */
test('Renderer:text with prefix and suffix', () => {
  const {container} = setup({
    prefix: '￥',
    suffix: 'RMB'
  });

  expect(container).toMatchSnapshot();
});

/**
 * 显示计数器
 */
test('Renderer:text with counter', () => {
  const {container, input} = setup({
    showCounter: true
  });
  expect(container).toMatchSnapshot();

  fireEvent.change(input, {target: {value: 'abcd'}});
  expect(container).toMatchSnapshot();
});

/**
 * 显示计数器且配置最大值
 */
test('Renderer:text with counter and maxLength', () => {
  const {container, input} = setup({
    showCounter: true,
    maxLength: 10
  });
  expect(container).toMatchSnapshot();

  fireEvent.change(input, {target: {value: 'abcd'}});
  expect(container).toMatchSnapshot();
});

/**
 * 转小写
 */
test('Renderer:text with transform lowerCase', async () => {
  const {input} = setup({transform: {lowerCase: true}});

  fireEvent.change(input, {target: {value: 'AbCd'}});
  await wait(300);
  expect(input.value).toBe('abcd');
});

/**
 * 转大写
 */
test('Renderer:text with transform upperCase', async () => {
  const {input} = setup({transform: {upperCase: true}});

  fireEvent.change(input, {target: {value: 'AbCd'}});
  await wait(300);
  expect(input.value).toBe('ABCD');
});
