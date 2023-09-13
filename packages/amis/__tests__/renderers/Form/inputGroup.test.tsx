/**
 * 组件名称: InputGroup 输入组合
 * 单测内容:
 * 1. 基础使用
 * 2. 校验配置
 *
 */

import {
  render,
  cleanup,
  fireEvent,
  screen,
  waitFor
} from '@testing-library/react';
import '../../../src';
import {render as amisRender, clearStoresCache} from '../../../src';
import {makeEnv, wait} from '../../helper';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:InputGroup', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'input-group',
            name: 'a',
            label: 'input-group',
            mode: 'horizontal',
            className: 'no-border',
            horizontal: {
              leftFixed: 1,
              left: 4,
              right: 7
            },
            controls: [
              {
                name: 'text',
                type: 'text',
                validation: 'isUrl',
                addOn: {
                  label: '按钮',
                  type: 'submit'
                }
              },
              {
                name: 'text1',
                type: 'text',
                hidden: true
              }
            ]
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

const setup = (schema = {}, props = {}, env = {}) => {
  const onSubmit = jest.fn();
  const submitBtnText = 'Submit';
  return render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        submitText: submitBtnText,
        body: [
          {
            type: 'input-group',
            name: 'input-group',
            label: '输入组合校验',
            body: [
              {
                type: 'input-text',
                name: 'child1',
                label: 'child1',
                validations: {
                  isNumeric: true,
                  maxLength: 3
                }
              },
              {
                type: 'input-text',
                name: 'child2',
                validations: {
                  minLength: 5
                }
              }
            ],
            ...schema
          }
        ]
      },
      {onSubmit, ...props},
      makeEnv({...env})
    )
  );
};

describe('InputGroup with validationConfig', () => {
  test('InputGroup with validationConfig: errorMode', async () => {
    const {container} = setup({validationConfig: {errorMode: 'partial'}});
    const child1 = container.querySelector(
      'input[name=child1]'
    ) as HTMLInputElement;
    const child2 = container.querySelector(
      'input[name=child2]'
    ) as HTMLInputElement;
    fireEvent.change(child1, {target: {value: 'amis'}});
    await wait(300);

    const submitBtn = screen.getByRole('button', {name: 'Submit'});
    fireEvent.click(submitBtn);
    await wait(500);

    expect(
      container.querySelector('*[class*="InputGroup-validation--partial"]')
    ).toBeInTheDocument();

    const errorDom = container.querySelector('*[class*="Form-feedback"]');
    expect(errorDom?.childElementCount).toStrictEqual(1);

    fireEvent.change(child2, {target: {value: 'amis'}});
    await wait(300);

    fireEvent.click(submitBtn);
    await wait(500);

    expect(errorDom?.childElementCount).toStrictEqual(2);
  });

  // v2.9.1 改为顺序校验后，不会同时输出多条校验错误消息，所以也不会用到分隔符
  // test('InputGroup with validationConfig: delimiter', async () => {
  //   const delimiter = '@@';
  //   const {container} = setup({validationConfig: {delimiter}});
  //   const child1 = container.querySelector(
  //     'input[name=child1]'
  //   ) as HTMLInputElement;
  //   const child2 = container.querySelector(
  //     'input[name=child2]'
  //   ) as HTMLInputElement;
  //   fireEvent.change(child1, {target: {value: 'amis'}});
  //   await wait(500);

  //   const submitBtn = screen.getByRole('button', {name: 'Submit'});
  //   fireEvent.click(submitBtn);
  //   await wait(500);

  //   screen.debug(container);

  //   expect(
  //     container.querySelector('*[class*="InputGroup-validation--full"]')
  //   ).toBeInTheDocument();

  //   const errorDom = container.querySelector('*[class*="Form-feedback"]');
  //   expect(errorDom?.childElementCount).toStrictEqual(1);

  //   const child1ErrorText = errorDom?.childNodes[0]
  //     ? errorDom.childNodes[0].textContent
  //     : '';

  //   expect(child1ErrorText).toEqual(expect.stringMatching(delimiter));
  // });
});
