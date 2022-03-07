import React = require('react');
import {render, fireEvent, cleanup, screen} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv, wait} from '../../helper';

test('Renderer:TabsTransferPicker', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '选人',
              type: 'tabs-transfer-picker',
              name: 'a',
              sortable: true,
              selectMode: 'tree',
              searchable: true,
              pickerSize: 'md',
              menuTpl:
                "<div class='flex justify-between'><span>${label}</span>${email ? `<div class='text-muted m-r-xs text-sm text-right'>${email}<br />${phone}</div>`: ''}</div>",
              valueTpl: '${label}(${value})',
              options: [
                {
                  label: '成员',
                  selectMode: 'tree',
                  children: [
                    {
                      label: '法师',
                      children: [
                        {
                          label: '诸葛亮',
                          value: 'zhugeliang',
                          email: 'zhugeliang@timi.com',
                          phone: 13111111111
                        }
                      ]
                    },
                    {
                      label: '战士',
                      children: [
                        {
                          label: '曹操',
                          value: 'caocao',
                          email: 'caocao@timi.com',
                          phone: 13111111111
                        },
                        {
                          label: '钟无艳',
                          value: 'zhongwuyan',
                          email: 'zhongwuyan@timi.com',
                          phone: 13111111111
                        }
                      ]
                    },
                    {
                      label: '打野',
                      children: [
                        {
                          label: '李白',
                          value: 'libai',
                          email: 'libai@timi.com',
                          phone: 13111111111
                        },
                        {
                          label: '韩信',
                          value: 'hanxin',
                          email: 'hanxin@timi.com',
                          phone: 13111111111
                        },
                        {
                          label: '云中君',
                          value: 'yunzhongjun',
                          email: 'yunzhongjun@timi.com',
                          phone: 13111111111
                        }
                      ]
                    }
                  ]
                },
                {
                  label: '角色',
                  selectMode: 'list',
                  children: [
                    {
                      label: '角色 1',
                      value: 'role1'
                    },
                    {
                      label: '角色 2',
                      value: 'role2'
                    },
                    {
                      label: '角色 3',
                      value: 'role3'
                    },
                    {
                      label: '角色 4',
                      value: 'role4'
                    }
                  ]
                },
                {
                  label: '部门',
                  selectMode: 'tree',
                  children: [
                    {
                      label: '总部',
                      value: 'dep0',
                      children: [
                        {
                          label: '部门 1',
                          value: 'dep1',
                          children: [
                            {
                              label: '部门 4',
                              value: 'dep4'
                            },
                            {
                              label: '部门 5',
                              value: 'dep5'
                            }
                          ]
                        },
                        {
                          label: '部门 2',
                          value: 'dep2'
                        },
                        {
                          label: '部门 3',
                          value: 'dep3'
                        }
                      ]
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

  const picker = await findByText('请选择');

  fireEvent.click(picker);

  const option = await findByText('诸葛亮');

  const checkbox = document.querySelector('.cxd-Checkbox input')!;

  fireEvent.click(checkbox);

  await wait(500);

  const confirm = await findByText('确认');

  fireEvent.click(confirm);

  await wait(500);

  // TODO: 应该是点了但不知为何没反应
  //  screen.debug();
  // const dialog = document.querySelector('.cxd-Selections-item')!;

  // console.log('...dialog', dialog.innerHTML);

  // screen.debug();

  // expect(container).toMatchSnapshot();
});
