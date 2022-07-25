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

const setup = async (inputOptions: any = {}, formOptions: any = {}, formItems: any[] = [{}]) => {
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
      utils.container.querySelector('input[name="text"]')
    ).toBeInTheDocument();

    expect(
      utils.container.querySelector('button[type="submit"]')
    ).toBeInTheDocument();
  });

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
  const {container, input} = await setup();

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
  const {container, input, submitBtn} = await setup({
    type: 'input-url'
  });

  fireEvent.change(input, {target: {value: 'abcd'}});
  fireEvent.click(submitBtn);
  await wait(200); // 表单校验是异步的，所以必须要等一段时间 @todo 感觉可能需要寻找更靠谱的办法
  expect(container).toMatchSnapshot('validate fail');

  fireEvent.change(input, {target: {value: 'https://www.baidu.com'}});
  await wait(300);
  expect(container).toMatchSnapshot('validate success');
});

/**
 * type 为 email，主要测试校验
 */
test('Renderer:text type is email', async () => {
  const {container, input, submitBtn} = await setup({
    type: 'input-email'
  });

  fireEvent.change(input, {target: {value: 'abcd'}});
  fireEvent.click(submitBtn);
  await wait(200);
  expect(container).toMatchSnapshot('validate fail');

  fireEvent.change(input, {target: {value: 'test@baidu.com'}});
  await wait(300);
  expect(container).toMatchSnapshot('validate success');
});

/**
 * type 为 password
 */
test('Renderer:text type is password', async () => {
  const {container, input} = await setup({
    type: 'input-password'
  });

  fireEvent.change(input, {target: {value: 'abcd'}});
  await wait(300);
  expect(container).toMatchSnapshot('password invisible');

  const revealPasswordBtn = container.querySelector(
    '.cxd-TextControl-revealPassword'
  ) as HTMLElement;

  fireEvent.click(revealPasswordBtn);

  await wait(300);
  expect(container).toMatchSnapshot('password visible');
});

/**
 * type 为 password revealPassword
 */
test('Renderer:text type is password with revealPassword', async () => {
  const {container, input} = await setup({
    type: 'input-password',
    revealPassword: false
  });

  fireEvent.change(input, {target: {value: 'abcd'}});
  await wait(300);
  expect(container).toMatchSnapshot();
});

/**
 * 配置addOn
 */
test('Renderer:text with addOn', async () => {
  const {container, input} = await setup({
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
  const {container, input} = await setup({
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
  const {container, input} = await setup(
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
 * 选择器模式，多选、分隔符、提取值
 */
test('Renderer:text with options and multiple and delimiter', async () => {
  const {container, input} = await setup(
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
      ],
      delimiter: '-',
      joinValues: true,
      creatable: true
    },
    {
      debug: true
    },
    [
      {
        type: 'static',
        name: 'text'
      }
    ]
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

  // 分隔符
  expect(
    (container.querySelector('.cxd-PlainField') as Element).innerHTML
  ).toBe('a-b');

  expect(container).toMatchSnapshot('second option selected');

  // 可创建
  fireEvent.click(textControl);
  await wait(300);
  fireEvent.change(input, {target: {value: 'AbCd'}});
  await wait(500);
  fireEvent.keyDown(input, {key: 'Enter', code: 13});
  await wait(500);

  expect(
    (container.querySelector('.cxd-PlainField') as Element).innerHTML
  ).toBe('a-b-AbCd');

  expect(container).toMatchSnapshot('thrid option create');
});

/**
 * 前缀和后缀
 */
test('Renderer:text with prefix and suffix', async () => {
  const {container} = await setup({
    prefix: '￥',
    suffix: 'RMB'
  });

  expect(container).toMatchSnapshot();
});

/**
 * 显示计数器
 */
test('Renderer:text with counter', async () => {
  const {container, input} = await setup({
    showCounter: true
  });
  expect(container).toMatchSnapshot();

  fireEvent.change(input, {target: {value: 'abcd'}});
  await wait(300);
  expect(container).toMatchSnapshot();
});

/**
 * 显示计数器且配置最大值
 */
test('Renderer:text with counter and maxLength', async () => {
  const {container, input} = await setup({
    showCounter: true,
    maxLength: 10
  });
  expect(container).toMatchSnapshot();

  fireEvent.change(input, {target: {value: 'abcd'}});
  await waitFor(() => {
    expect(
      container.querySelector('[name="text"][value="abcd"]')
    ).toBeInTheDocument();
  });
  await wait(300);
  expect(container).toMatchSnapshot();
});

/**
 * 转小写
 */
test('Renderer:text with transform lowerCase', async () => {
  const {input} = await setup({transform: {lowerCase: true}});

  fireEvent.change(input, {target: {value: 'AbCd'}});
  await wait(300);
  expect(input.value).toBe('abcd');
});

/**
 * 转大写
 */
test('Renderer:text with transform upperCase', async () => {
  const {input} = await setup({transform: {upperCase: true}});

  fireEvent.change(input, {target: {value: 'AbCd'}});
  await wait(300);
  expect(input.value).toBe('ABCD');
});

/**
 * 配置 resetValue and trimContents
 */
test('Renderer:text with resetValue and trimContents', async () => {
  const {container, input, submitBtn} = await setup({
    resetValue: 'reset-value',
    value: 'text-value',
    trimContents: true
  }, {}, [
    {
      type: 'action',
      actionType: 'reset',
      target: 'text',
      className: 'reset-button'
    }
  ]);
  
  fireEvent.click(
    container.querySelector('.cxd-Button.reset-button')
  );

  await wait(500);

  expect(input.value).toBe('reset-value');

  // trimContents
  const textControl = container.querySelector(
    '.cxd-TextControl-input'
  ) as HTMLElement;

  fireEvent.click(textControl);
  await wait(300);
  fireEvent.change(input, {target: {value: '  abcde  '}});
  await wait(500);
  fireEvent.blur(input);
  await wait(500);

  expect(input.value).toBe('abcde');
});


/**
 * 配置 minLength、borderMode and className
 */
test('Renderer:text with minLength', async () => {
  const {container, input, submitBtn} = await setup({
    minLength: 5,
    maxLength: 8,
    borderMode: 'half',
    inputControlClassName: 'test-text-class-one',
    nativeInputClassName: 'test-text-class-two'
  }, {});
  
  const textControl = container.querySelector(
    '.cxd-TextControl-input'
  ) as HTMLElement;

  // 测试 minLength
  fireEvent.click(textControl);
  await wait(300);
  fireEvent.change(input, {target: {value: '1234'}});
  await wait(500);
  fireEvent.click(submitBtn);
  await wait(300);
  expect(
    container.querySelector('.cxd-TextControl.has-error--minLength') as Element
  ).toBeInTheDocument();

  // 测试 maxLength
  fireEvent.click(textControl);
  await wait(300);
  fireEvent.change(input, {target: {value: '123456789'}});
  await wait(500);
  expect(
    container.querySelector('.cxd-TextControl.has-error--maxLength') as Element
  ).toBeInTheDocument();

  expect(container).toMatchSnapshot();
});