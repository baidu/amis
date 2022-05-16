import React = require('react');
import {render, fireEvent, cleanup, getByText, waitFor} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv, wait} from '../../helper';

/**
 * 组件默认值 支持 公式运算
 * 测试用例：
 * 1. 普通文字带一个$，不应该启用公式，带转义的 \${abc} 也不启用 渲染器后值就是当前原始值；
 * 2. '文本 ${abc}' 这个默认值需要启动公式，且验证新值初始是否在上下文中，关联 abc 修改后，新值是否在上下文中；
 */
test('Renderer:inputDate', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        data: {
          test: '123',
        },
        body: [
          {
            type: 'input-text',
            name: 'test1',
            label: 'test1',
            value: '1'
          },
          {
            type: 'input-text',
            name: 'test',
            label: 'test2(test)',
          },
          {
            type: 'input-email',
            name: 'test1',
            label: 'test3(test1)',
          },
          {
            type: 'input-text',
            name: 'test4',
            label: 'test4',
            value: '$'
          },
          {
            type: 'input-text',
            name: 'test5',
            label: 'test5',
            value: '\\${test}'
          },
          {
            type: "switch",
            option: "开关",
            name: "switch",
            falseValue: false,
            trueValue: true,
            value: true
          },
          {
            type: 'input-text',
            name: 'test6',
            label: 'test6',
            value: 'test: ${test}, test1: ${test1}'
          },
          {
            type: 'input-text',
            name: 'test7',
            label: 'test7(test6)',
            value: '${test6}'
          },
          {
            type: 'input-text',
            name: 'test8',
            label: 'test8',
            value: 'test1: ${test1}, switch: ${switch}'
          },
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  await waitFor(() => {
    const test2 = container.querySelector('input[name="test"]') as HTMLInputElement;
    expect(test2.value).toEqual('123');
  
    const test3 = container.querySelector('input[type="email"][name="test1"]') as HTMLInputElement;
    expect(test3.value).toEqual('1');
  
    const test4 = container.querySelector('input[type="text"][name="test4"]') as HTMLInputElement;
    expect(test4.value).toEqual('$');
  
    const test5 = container.querySelector('input[type="text"][name="test5"]') as HTMLInputElement;
    expect(test5.value).toEqual('${test}');
  
    const test6 = container.querySelector('input[type="text"][name="test6"]') as HTMLInputElement;
    expect(test6.value).toEqual('test: 123, test1: 1');
  
    const test7 = container.querySelector('input[type="text"][name="test7"]') as HTMLInputElement;
    expect(test7.value).toEqual('test: 123, test1: 1');

  });

  const Switch = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
  fireEvent.click(Switch);

  await waitFor(() => {
    const test8 = container.querySelector('input[type="text"][name="test8"]') as HTMLInputElement;
    expect(test8.value).toEqual('test1: 1, switch: false');
  });

  expect(container).toMatchSnapshot();
});