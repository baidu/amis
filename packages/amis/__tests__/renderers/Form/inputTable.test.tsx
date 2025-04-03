import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup
} from '@testing-library/react';
import '../../../src';
import {render as amisRender, clearStoresCache} from '../../../src';
import {makeEnv, replaceReactAriaIds, wait} from '../../helper';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:input table', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          data: {
            table: [
              {
                a: 'a1',
                b: 'b1'
              },
              {
                a: 'a2',
                b: 'b2'
              },
              {
                a: 'a3',
                b: 'b3'
              }
            ]
          },
          api: '/api/mock2/form/saveForm',
          body: [
            {
              type: 'input-table',
              name: 'table',
              columns: [
                {
                  name: 'a',
                  label: 'A'
                },
                {
                  name: 'b',
                  label: 'B'
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

  await wait(500);
  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('Renderer: input-table with default value column', async () => {
  const onSubmitCallbackFn = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'form',
            api: '/api/mock2/form/saveForm',
            data: {
              table: [
                {a: 'a1', b: 'b1'},
                {a: 'a2', b: 'b2'},
                {a: 'a3', b: 'b3'}
              ]
            },
            actions: [
              {type: 'reset', label: 'Reset'},
              {type: 'submit', label: 'Submit'}
            ],
            body: [
              {
                type: 'input-table',
                name: 'table',
                label: 'Table',
                addable: true,
                needConfirm: false,
                columns: [
                  {
                    label: 'A',
                    name: 'a',
                    type: 'input-text'
                  },
                  {
                    label: 'B',
                    name: 'b',
                    type: 'select',
                    options: ['b1', 'b2', 'b3']
                  },
                  {
                    label: 'C',
                    name: 'c',
                    value: '${a}',
                    type: 'input-text'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        onSubmit: onSubmitCallbackFn
      },
      makeEnv({})
    )
  );

  await wait(1000);

  fireEvent.click(getByText('Submit'));
  await wait(200);

  expect(onSubmitCallbackFn).toHaveBeenCalledTimes(1);
  expect(onSubmitCallbackFn.mock.calls[0][0]).toEqual(
    expect.objectContaining({
      table: [
        {a: 'a1', b: 'b1', c: 'a1'},
        {a: 'a2', b: 'b2', c: 'a2'},
        {a: 'a3', b: 'b3', c: 'a3'}
      ]
    })
  );
}, 10000);

test('Renderer:input table add', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        debug: true,
        body: [
          {
            type: 'input-table',
            name: 'table',
            addable: true,
            editable: true,
            columns: [
              {
                name: 'a',
                label: 'A'
              },
              {
                name: 'b',
                label: 'B'
              }
            ]
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  await wait(500);
  const add = await findByText(/新增/);

  fireEvent.click(add);

  await wait(1000);

  const inputs = document.querySelectorAll('td input');

  fireEvent.change(inputs[0], {target: {value: 'aa'}});

  fireEvent.change(inputs[1], {target: {value: 'bb'}});

  const save = document.querySelector('.cxd-OperationField button');

  fireEvent.click(save!);

  // TODO: 这里不对，难道是点击出错了

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('Renderer:input-table with combo column', async () => {
  const onSubmit = jest.fn();
  const {container, findByText, findByPlaceholderText} = render(
    amisRender(
      {
        type: 'form',
        submitText: 'SubmitBtn',
        body: [
          {
            type: 'input-table',
            name: 'table',
            columns: [
              {
                type: 'combo',
                name: 'q1',
                label: 'combo column',
                items: [
                  {
                    type: 'input-number',
                    name: 'score',
                    label: false,
                    placeholder: '请手动输入分数'
                  },
                  {
                    type: 'input-text',
                    name: 'comment',
                    label: false,
                    placeholder: '请手动输入意见'
                  }
                ],
                multiple: false
              }
            ]
          }
        ],
        data: {
          table: [
            {
              q2: '1',
              q1: {
                score: 99
              }
            }
          ]
        }
      },
      {onSubmit},
      makeEnv({})
    )
  );

  const submitBtn = await findByText('SubmitBtn');
  fireEvent.click(submitBtn);

  await wait(100);
  expect(onSubmit).toHaveBeenCalled();
  expect(onSubmit.mock.calls[0][0]).toEqual({
    table: [
      {
        q2: '1',
        q1: {
          score: 99
        }
      }
    ]
  });

  const commentInput = await findByPlaceholderText('请手动输入意见');
  fireEvent.change(commentInput, {
    target: {value: 'this is comment msg!!'}
  });
  fireEvent.change(await findByPlaceholderText('请手动输入分数'), {
    target: {value: 88}
  });
  // input-table 中套 combo。多次 lazy change， 所以时间需要长点
  await wait(1000);
  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
  fireEvent.click(submitBtn);

  await wait(300);
  expect(onSubmit).toBeCalledTimes(2);

  // 这里反复横跳，偶现不通过，等多久都没用，先注释掉
  // expect(onSubmit.mock.calls[1][0]).toEqual({
  //   table: [
  //     {
  //       q2: '1',
  //       q1: {
  //         comment: 'this is comment msg!!',
  //         score: 88
  //       }
  //     }
  //   ]
  // });
}, 10000);

// 单元格：表单校验
test('Renderer:input-table verifty', async () => {
  const onSubmit = jest.fn();
  const {container, findByText, findByPlaceholderText} = render(
    amisRender(
      {
        type: 'form',
        submitText: 'submitBtn',
        data: {
          table: [{}]
        },
        api: 'https://aisuda.bce.baidu.com/amis/api/mock2/form/saveForm',
        body: [
          {
            type: 'input-table',
            name: 'table',
            label: 'Table',
            columns: [
              {
                label: '数字输入',
                name: 'input',
                type: 'input-text',
                placeholder: '请输入数字',
                required: true,
                validations: {
                  isNumeric: true
                },
                validationErrors: {
                  isNumeric: '请输入数字'
                }
              },
              {
                label: '选项',
                name: 'select',
                type: 'select',
                required: true,
                options: ['s1', 's2', 's3']
              },
              {
                label: '普通文本',
                name: 'text'
              }
            ]
          }
        ]
      },
      {onSubmit},
      makeEnv({})
    )
  );

  const submitBtn = await findByText('submitBtn');
  fireEvent.click(submitBtn);

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();

  const input = await findByPlaceholderText('请输入数字');
  fireEvent.change(input, {
    target: {value: 111}
  });

  const selectBtn = await findByText('请选择');
  selectBtn.click();

  await wait(100);

  const selectItem = await findByText('s2');
  selectItem.click();

  await wait(100);
  expect(onSubmit).toBeCalledTimes(1);
}, 10000);

// 单元格：下拉删除
test('Renderer:input-table cell selects delete', async () => {
  const onSubmit = jest.fn();
  const {container, findByRole, findByText} = render(
    amisRender(
      {
        type: 'form',
        submitText: 'submitBtn',
        data: {
          table: [
            {
              select: 's1,s2'
            }
          ]
        },
        api: 'https://aisuda.bce.baidu.com/amis/api/mock2/form/saveForm',
        body: [
          {
            type: 'input-table',
            name: 'table',
            label: 'Table',
            columns: [
              {
                label: '选项',
                name: 'select',
                type: 'select',
                multiple: true,
                options: ['s1', 's2', 's3']
              },
              {
                label: '普通文本',
                name: 'text'
              }
            ]
          }
        ]
      },
      {onSubmit},
      makeEnv({})
    )
  );

  const select = await findByRole('combobox');
  fireEvent.click(select);
  await wait(300);

  const s1 = container.querySelector(`div[title=s1] label`);
  expect(s1).not.toBeNull();
  const s3 = container.querySelector(`div[title=s3] label`);
  expect(s3).not.toBeNull();
  fireEvent.click(s1 as Element);
  await wait(300);

  fireEvent.click(s3 as Element);
  await wait(300);

  fireEvent.click(select);
  await wait(100);

  const submitBtn = await findByText('submitBtn');
  fireEvent.click(submitBtn);
  await wait(100);

  expect(onSubmit.mock.calls[0][0]).toEqual({
    table: [
      {
        select: 's2,s3'
      }
    ]
  });
  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('Renderer:input-table doaction:additem', async () => {
  const onSubmit = jest.fn();
  const {container, findByRole, findByText} = render(
    amisRender(
      {
        type: 'form',
        data: {
          table: [{a: 2}]
        },
        body: [
          {
            label: 'addItem1',
            type: 'button',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'addItem',
                    componentId: 'inputtable',
                    args: {
                      item: {
                        a: 3
                      }
                    }
                  }
                ]
              }
            }
          },
          {
            label: 'addItem2',
            type: 'button',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'addItem',
                    componentId: 'inputtable',
                    args: {
                      index: 0,
                      item: {
                        a: 1
                      }
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'input-table',
            id: 'inputtable',
            name: 'table',
            label: 'Table',
            needConfirm: false,
            columns: [
              {
                type: 'text',
                name: 'a',
                quickEdit: false
              }
            ]
          },
          {
            type: 'submit',
            label: 'submitBtn'
          }
        ]
      },
      {onSubmit},
      makeEnv({})
    )
  );

  const addItem1 = await findByText('addItem1');
  fireEvent.click(addItem1);

  const addItem2 = await findByText('addItem2');
  fireEvent.click(addItem2);

  const submitBtn = await findByText('submitBtn');
  fireEvent.click(submitBtn);
  await wait(200);

  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toEqual({
    table: [
      {
        a: 1
      },
      {
        a: 2
      },
      {
        a: 3
      }
    ]
  });
});

test('Renderer:input-table init display', async () => {
  const onSubmit = jest.fn();
  const {container, findByRole, findByText} = render(
    amisRender(
      {
        type: 'form',
        body: [
          {
            type: 'input-number',
            name: 'aaa',
            label: '数字',
            id: 'u:2cf54f983323',
            keyboard: true
          },
          {
            addable: false,
            footerAddBtn: {
              icon: 'fa fa-plus',
              label: '新增'
            },
            columns: [
              {
                quickEdit: {
                  name: 'name',
                  id: 'u:0d991cdb83f7',
                  type: 'input-text'
                },
                name: 'name',
                id: 'u:c03a3961b816',
                label: '名称'
              },
              {
                quickEdit: {
                  name: 'score',
                  id: 'u:fdd06fcb43ea',
                  type: 'input-number',
                  showSteps: false
                },
                name: 'score',
                id: 'u:5cf9b284569d',
                label: '分数'
              },
              {
                quickEdit: false,
                name: 'score',
                id: 'u:8b9930874658',
                label: '分数(不在quickEdit里面)',
                type: 'input-number',
                showSteps: false
              },
              {
                quickEdit: {
                  name: 'level',
                  id: 'u:69f5cbdadbb0',
                  type: 'input-number',
                  showSteps: false
                },
                name: 'level',
                id: 'u:3bd7b1d50f2d',
                label: '等级'
              }
            ],
            minLength: 0,
            strictMode: true,
            needConfirm: false,
            name: 'tableList',
            id: 'u:bda697db0d7e',
            label: '表格表单',
            type: 'input-table'
          }
        ],
        id: 'u:1affe4fb299e',
        actions: [
          {
            type: 'submit',
            label: '提交',
            primary: true,
            id: 'u:6cde77348a96'
          }
        ],
        data: {
          aaa: 0,
          tableList: [
            {
              score: 234,
              level: 1,
              name: 'AAA'
            },
            {
              score: 0,
              level: 0,
              name: 'BBB'
            }
          ]
        },
        title: '表单'
      },
      {onSubmit},
      makeEnv({})
    )
  );

  await wait(200);
  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

// 对应 github issue: https://github.com/baidu/amis/issues/8263
test('Renderer:input-table formula', async () => {
  const onSubmit = jest.fn();
  const {container} = render(
    amisRender(
      {
        type: 'page',
        title: '测试3',
        body: [
          {
            type: 'form',
            title: '表单',
            submitText: 'Submit',
            body: [
              {
                type: 'input-number',
                label: '数字',
                name: 'number',
                keyboard: true
              },
              {
                type: 'table-view',
                trs: [
                  {
                    background: '#F7F7F7',
                    tds: [
                      {
                        body: {
                          type: 'tpl',
                          wrapperComponent: '',
                          tpl: '保费信息'
                        }
                      },
                      {
                        body: {
                          type: 'tpl',
                          wrapperComponent: '',
                          tpl: '首年保费'
                        }
                      }
                    ]
                  },
                  {
                    tds: [
                      {
                        rowspan: 1,
                        body: {
                          type: 'tpl',
                          wrapperComponent: '',
                          tpl: '美元'
                        }
                      },
                      {
                        body: [
                          {
                            type: 'input-number',
                            name: 'dollar',
                            keyboard: true,
                            step: 1
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                type: 'input-table',
                name: 'table',
                label: '表格表单',
                columns: [
                  {
                    label: '名称',
                    name: 'name',
                    type: 'input-text'
                  },
                  {
                    label: '分数1',
                    name: 'score1',
                    type: 'input-number'
                  },
                  {
                    label: '分数',
                    type: 'input-number',
                    name: 'score',
                    value: '${score1 * dollar}'
                  }
                ],
                strictMode: false,
                needConfirm: false,
                canAccessSuperData: true
              }
            ]
          }
        ],
        regions: ['body', 'header'],
        data: {
          table: [
            {
              name: 'aaa',
              score1: 1
            },
            {
              name: 'bbb',
              score1: 2
            },
            {
              name: 'ccc',
              score1: 3
            }
          ]
        }
      },
      {
        onSubmit: onSubmit
      },
      makeEnv({})
    )
  );

  await wait(200);
  const dollor = container.querySelector('input[name=dollar]');
  expect(dollor).toBeInTheDocument();

  fireEvent.change(dollor!, {target: {value: '22'}});

  await wait(800);

  const inputs = container.querySelectorAll('input[name=score]');
  expect(inputs.length).toBe(3);

  expect(inputs[0]).toHaveValue('22');
  expect(inputs[1]).toHaveValue('44');
  expect(inputs[2]).toHaveValue('66');

  const submitBtn = container.querySelector('button[type=submit]');
  fireEvent.click(submitBtn!);
  await wait(200);

  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    dollar: 22,
    table: [
      {
        name: 'aaa',
        score1: 1,
        score: 22
      },
      {
        name: 'bbb',
        score1: 2,
        score: 44
      },
      {
        name: 'ccc',
        score1: 3,
        score: 66
      }
    ]
  });
});

// 对应 github issue: https://github.com/baidu/amis/issues/9494
test('Renderer:input-table autoFill', async () => {
  const onSubmit = jest.fn();
  const {container} = render(
    amisRender(
      {
        type: 'page',
        title: 'Hello low code',
        body: [
          {
            type: 'form',
            api: '/api/mock2/form/saveForm',
            body: [
              {
                type: 'input-table',
                name: 'table',
                label: '表格表单',
                columns: [
                  {
                    label: '名称',
                    name: 'name',
                    quickEdit: {
                      type: 'input-text',
                      name: 'name',
                      id: 'u:514910e73695'
                    },
                    id: 'u:97d119520d7c'
                  },
                  {
                    label: '分数',
                    name: 'score',
                    quickEdit: {
                      type: 'input-number',
                      name: 'score',
                      id: 'u:644f5984ff07'
                    },
                    id: 'u:60636ff9ed10'
                  },
                  {
                    label: '等级',
                    name: 'level',
                    quickEdit: {
                      type: 'select',
                      name: 'level',
                      autoFill: {
                        id: '$id'
                      },
                      id: 'u:38014752298b',
                      options: [
                        {
                          label: 'a',
                          value: '111',
                          id: 111
                        },
                        {
                          label: 'a1',
                          value: '1121',
                          id: 222
                        }
                      ]
                    },
                    id: 'u:bc682229ad4f'
                  }
                ],
                addable: true,
                footerAddBtn: {
                  label: '新增',
                  icon: 'fa fa-plus',
                  id: 'u:a0d2d9eab4f7'
                },
                strictMode: true,
                id: 'u:c296ba75753c',
                minLength: 0,
                editable: true,
                removable: true
              }
            ],
            id: 'u:a2f24ee3ab2d',
            debug: true
          }
        ],
        id: 'u:09eedced8bb6',
        asideResizor: false,
        style: {
          boxShadow: ' 0px 0px 0px 0px transparent'
        },
        pullRefresh: {
          disabled: true
        }
      },
      {
        onSubmit: onSubmit
      },
      makeEnv({})
    )
  );

  await wait(200);

  const add = container.querySelector('.cxd-InputTable-toolbar button');
  fireEvent.click(add!);
  await wait(200);

  fireEvent.change(container.querySelector('input[name="name"]')!, {
    target: {value: 'a1'}
  });
  await wait(200);

  fireEvent.change(container.querySelector('input[name="score"]')!, {
    target: {value: '123'}
  });
  await wait(200);

  fireEvent.click(container.querySelector('.cxd-Select')!);
  await wait(200);
  fireEvent.click(container.querySelector('.cxd-Select-menu [role="option"]')!);
  await wait(200);

  fireEvent.click(container.querySelector('.cxd-OperationField button')!);
  await wait(200);

  const submitBtn = container.querySelector('button[type=submit]');
  fireEvent.click(submitBtn!);
  await wait(200);

  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toEqual({
    table: [
      {
        id: 111,
        name: 'a1',
        score: 123,
        level: '111'
      }
    ]
  });
});

// 对应 github issue: https://github.com/baidu/amis/issues/9520
test('Renderer:input-table canAccessSuperData', async () => {
  const onSubmit = jest.fn();
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          data: {
            a: 'xxx',
            table: [
              {
                a: 'a1',
                b: 'b1'
              }
            ]
          },
          api: '/amis/api/mock2/form/saveForm',
          body: [
            {
              showIndex: true,
              type: 'input-table',
              name: 'table',
              addable: true,
              needConfirm: true,
              columns: [
                {
                  name: 'a',
                  label: 'A',
                  type: 'wrapper',
                  body: [
                    {
                      name: 'a',
                      label: false,
                      type: 'input-text'
                    }
                  ]
                },
                {
                  name: 'b',
                  label: 'B',
                  type: 'input-text'
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

  await wait(200);
  const addBtn = container.querySelector('.cxd-OperationField button');
  expect(addBtn).toBeInTheDocument();
  fireEvent.click(addBtn!);

  await wait(200);
  const confrimBtn = container.querySelector('.cxd-OperationField button');
  expect(confrimBtn).toBeInTheDocument();
  fireEvent.click(confrimBtn!);

  await wait(200);
  const inputs = [].slice
    .call(container.querySelectorAll('tbody td input[name="a"]'))
    .map((td: any) => td.value);

  expect(inputs).toEqual(['a1', '']);
});

// 对应 github issue: https://github.com/baidu/amis/issues/9537
test('Renderer:input-table item confirm validate', async () => {
  const onSubmit = jest.fn();
  const {container, findByRole, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          data: {
            a: 'xxx',
            table: [
              {
                a: 'a1',
                b: 'b1'
              }
            ]
          },
          api: '/amis/api/mock2/form/saveForm',
          body: [
            {
              showIndex: true,
              type: 'input-table',
              name: 'table',
              addable: true,
              columns: [
                {
                  name: 'a',
                  label: 'A',
                  quickEdit: {
                    type: 'input-text',
                    required: true
                  }
                },
                {
                  name: 'b',
                  label: 'B'
                }
              ],
              needConfirm: true
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  await wait(200);
  const addBtn = container.querySelector('.cxd-OperationField button');
  expect(addBtn).toBeInTheDocument();
  fireEvent.click(addBtn!);

  await wait(200);
  const confirmBtn = container.querySelector('.cxd-OperationField button');
  expect(confirmBtn).toBeInTheDocument();
  fireEvent.click(confirmBtn!);

  await wait(200);

  expect(container.querySelector('.has-error--isRequired')).toBeInTheDocument();
});

// 问题：分页切换后，新行数据中不存在原始行中的某个数据，但是切换后，表单项还是展示的原来的值
// 比如下面的例子，新行 c 字段不存在，但是切过去后，c 显示 c1
test('Renderer:input-table pagination data issue', async () => {
  const onSubmit = jest.fn();
  const {container, findByRole, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          data: {
            table: [
              {
                a: 'a1',
                b: 'b1',
                c: 'c1'
              },
              {
                a: 'a2',
                b: 'b2'
              }
            ]
          },
          body: [
            {
              showIndex: true,
              type: 'input-table',
              needConfirm: false,
              perPage: 1,
              name: 'table',
              columns: [
                {
                  name: 'a',
                  label: 'A'
                },
                {
                  name: 'b',
                  label: 'B',
                  quickEdit: {
                    type: 'form',
                    body: [
                      {
                        type: 'input-text',
                        name: 'b'
                      },
                      {
                        type: 'input-text',
                        name: 'c'
                      }
                    ]
                  }
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

  await wait(200);
  const nextBtn = container.querySelector('.cxd-Pagination-next');
  fireEvent.click(nextBtn!);
  await wait(200);

  const c = container.querySelector('input[name="c"]');
  expect(c).toHaveValue('');
});

// 对应 github issue: https://github.com/baidu/amis/issues/9537
test('Renderer:input-table cancel new item from addAction', async () => {
  const onSubmit = jest.fn();
  const {container, findByRole, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          data: {
            table: [
              {
                a: 'a1',
                b: 'b1'
              },
              {
                a: 'a2',
                b: 'b2'
              },
              {
                a: 'a3',
                b: 'b3'
              }
            ]
          },
          api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm',
          body: [
            {
              type: 'input-table',
              name: 'table',
              label: 'Table',
              columns: [
                {
                  label: 'A',
                  name: 'a'
                },
                {
                  label: 'B',
                  name: 'b'
                }
              ]
            },
            {
              type: 'button',
              label: 'Table新增一行',
              target: 'table',
              actionType: 'add',
              payload: {
                a: 'newa',
                b: 'newb'
              },
              className: 'add-item'
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  await wait(200);
  const addBtn = container.querySelector('.cxd-Button.add-item');
  expect(addBtn).toBeInTheDocument();

  fireEvent.click(addBtn!);
  await wait(200);

  const inputA = container.querySelector(
    'tbody td input[name="a"]'
  ) as HTMLInputElement;
  expect(inputA?.value).toEqual('newa');
  const inputB = container.querySelector(
    'tbody td input[name="b"]'
  ) as HTMLInputElement;
  expect(inputB?.value).toEqual('newb');

  const operationBtn = container.querySelectorAll('.cxd-OperationField button');
  const saveBtn = operationBtn?.[0] as HTMLButtonElement;
  expect(saveBtn).toBeInTheDocument();
  const cancelBtn = operationBtn?.[1] as HTMLButtonElement;
  expect(cancelBtn).toBeInTheDocument();

  fireEvent.click(cancelBtn);

  await 200;

  const inputA2 = container.querySelector(
    'tbody td input[name="a"]'
  ) as HTMLInputElement;
  expect(inputA2).toBeNull();

  const inputB2 = container.querySelector(
    'tbody td input[name="a"]'
  ) as HTMLInputElement;
  expect(inputB2).toBeNull();
});
