import React = require('react');
import {fireEvent, render, screen} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';

test('Renderer:input-formula', async () => {
  const {container, findByText, findByDisplayValue} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          debug: true,
          body: [
            {
              type: 'input-formula',
              name: 'formula',
              label: '公式',
              evalMode: false,
              value: 'SUM(1 + 2)',
              variables: [
                {
                  label: '表单字段',
                  children: [
                    {
                      label: '文章名',
                      value: 'name',
                      tag: '文本'
                    },
                    {
                      label: '作者',
                      value: 'author',
                      tag: '文本'
                    },
                    {
                      label: '售价',
                      value: 'price',
                      tag: '数字'
                    },
                    {
                      label: '出版时间',
                      value: 'time',
                      tag: '时间'
                    },
                    {
                      label: '版本号',
                      value: 'version',
                      tag: '数字'
                    },
                    {
                      label: '出版社',
                      value: 'publisher',
                      tag: '文本'
                    }
                  ]
                },
                {
                  label: '流程字段',
                  children: [
                    {
                      label: '联系电话',
                      value: 'telphone'
                    },
                    {
                      label: '地址',
                      value: 'addr'
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();

  await findByDisplayValue('SUM(1 + 2)');
  // TODO: 貌似 jsdom 不支持 codemirror，进行不下去了

  // const action = document.querySelector('button.cxd-FormulaPicker-action');

  // fireEvent.click(action!);

  // await findByText('变量');

  // const name = await findByText('文章名');
  // fireEvent.click(name);

  // const confirm = await findByText('确认');
  // fireEvent.click(confirm);

  // screen.debug();
  // const formDebug = JSON.parse(document.querySelector('pre code')!.innerHTML);

  // expect(formDebug).toEqual({
  //   formula: 'nameSUM(1 + 2)'
  // });
});

test('Renderer:input-formula button', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          debug: true,
          body: [
            {
              type: 'input-formula',
              name: 'formula',
              label: '公式',
              variableMode: 'tree',
              evalMode: false,
              value: 'SUM(1 + 2)',
              inputMode: 'button',
              variables: [
                {
                  label: '表单字段',
                  children: [
                    {
                      label: '文章名',
                      value: 'name',
                      tag: '文本'
                    },
                    {
                      label: '作者',
                      value: 'author',
                      tag: '文本'
                    },
                    {
                      label: '售价',
                      value: 'price',
                      tag: '数字'
                    },
                    {
                      label: '出版时间',
                      value: 'time',
                      tag: '时间'
                    },
                    {
                      label: '版本号',
                      value: 'version',
                      tag: '数字'
                    },
                    {
                      label: '出版社',
                      value: 'publisher',
                      tag: '文本'
                    }
                  ]
                },
                {
                  label: '流程字段',
                  children: [
                    {
                      label: '联系电话',
                      value: 'telphone'
                    },
                    {
                      label: '地址',
                      value: 'addr'
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:input-formula input-group', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          debug: true,
          body: [
            {
              type: 'input-formula',
              name: 'formula',
              label: '公式',
              variableMode: 'tree',
              evalMode: false,
              value: 'SUM(1 + 2)',
              inputMode: 'input-group',
              variables: [
                {
                  label: '表单字段',
                  children: [
                    {
                      label: '文章名',
                      value: 'name',
                      tag: '文本'
                    },
                    {
                      label: '作者',
                      value: 'author',
                      tag: '文本'
                    },
                    {
                      label: '售价',
                      value: 'price',
                      tag: '数字'
                    },
                    {
                      label: '出版时间',
                      value: 'time',
                      tag: '时间'
                    },
                    {
                      label: '版本号',
                      value: 'version',
                      tag: '数字'
                    },
                    {
                      label: '出版社',
                      value: 'publisher',
                      tag: '文本'
                    }
                  ]
                },
                {
                  label: '流程字段',
                  children: [
                    {
                      label: '联系电话',
                      value: 'telphone'
                    },
                    {
                      label: '地址',
                      value: 'addr'
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
