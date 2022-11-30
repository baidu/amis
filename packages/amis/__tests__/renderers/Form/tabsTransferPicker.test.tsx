/**
 * 组件名称：TabsTransferPicker 穿梭选择器
 * 
 * 单测内容：
 1. 点击选择
 */

import {render, fireEvent, cleanup, screen} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

test('Renderer:TabsTransferPicker', async () => {
  const {container, findByText, baseElement} = render(
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
  await wait(500);
  expect(baseElement.querySelector('.cxd-Modal')!).toBeInTheDocument();

  const option = await findByText('诸葛亮');

  expect(option).toBeInTheDocument();
  fireEvent.click(option);

  await wait(200);
  expect(baseElement).toMatchSnapshot('dialog open');

  const confirm = await findByText('确认');

  expect(confirm).toBeInTheDocument();
  fireEvent.click(confirm);

  await wait(1000);
  expect(baseElement.querySelector('.cxd-Modal')!).not.toBeInTheDocument();

  const valueWrap = container.querySelector('.cxd-ResultBox-value-wrap')!;
  expect(valueWrap).not.toHaveTextContent('请选择');
  expect(valueWrap).toHaveTextContent('诸葛亮');

  expect(baseElement).toMatchSnapshot();
});
