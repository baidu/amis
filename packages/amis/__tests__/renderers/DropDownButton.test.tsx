/**
 * 组件名称：DropDownButton 下拉按钮
 * 单测内容：
 * 1. 基础使用
 * 2. 分组显示
 * 3. 点击关闭 closeOnClick & closeOnOutside
 * 4. 触发方式 trigger
 * 5. 图标 icon & rightIcon
 * 6. hideCaret
 * 7. 默认展开 defaultIsOpened
 * 8. 对齐方式 align
 * 9. block & size
 * 10. buttons level & className
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

test('Renderer:dropdown-button', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'dropdown-button',
        level: 'primary',
        buttons: [
          {
            type: 'button',
            label: '按钮',
            actionType: 'dialog',
            dialog: {
              title: '系统提示',
              body: '对你点击了'
            }
          },
          {
            type: 'button',
            label: '按钮',
            actionType: 'dialog',
            dialog: {
              title: '系统提示',
              body: '对你点击了'
            }
          },
          {
            type: 'button',
            label: '按钮',
            visible: false
          }
        ],
        className: 'show'
      },
      {},
      makeEnv({})
    )
  );

  const dropdowmButton = document.querySelector('button.cxd-Button');
  fireEvent.click(dropdowmButton as HTMLDivElement);
  expect(container).toMatchSnapshot();
  fireEvent.click(dropdowmButton as HTMLDivElement);
  expect(container).toMatchSnapshot();
});

test('Renderer:dropdown-button with buttons group', async () => {
  const {container} = render(
    amisRender({
      type: 'dropdown-button',
      label: '下拉菜单',
      buttons: [
        {
          label: 'RD',
          icon: 'fa fa-user',
          children: [
            {
              type: 'button',
              label: '前端FE'
            },
            {
              type: 'button',
              label: '后端RD'
            }
          ]
        },
        {
          label: 'QA',
          icon: 'fa fa-user',
          children: [
            {
              type: 'button',
              label: '测试QA'
            },
            {
              type: 'button',
              label: '交付测试DQA',
              disabled: true
            },
            {
              type: 'divider'
            }
          ]
        },
        {
          label: 'Manager',
          icon: 'fa fa-user',
          children: [
            {
              type: 'button',
              label: '项目经理PM'
            },
            {
              type: 'button',
              label: '项目管理中心PMO',
              visible: false
            }
          ]
        }
      ]
    })
  );

  const dropdowmButton = document.querySelector('button.cxd-Button');
  fireEvent.click(dropdowmButton as HTMLDivElement);

  const menus = container.querySelectorAll(
    '.cxd-DropDown-menu-root > .cxd-DropDown-menu'
  );
  expect(container).toMatchSnapshot();
  expect(menus.length).toBe(3);

  expect(
    container.querySelectorAll('.cxd-DropDown-menu-root .cxd-DropDown-button')!
      .length
  ).toBe(5);
});

test('Renderer:dropdown-button with closeOnClick & closeOnOutside', async () => {
  const schema = (options: any) => ({
    type: 'page',
    body: [
      {
        type: 'dropdown-button',
        label: '下拉菜单',
        ...options,
        buttons: [
          {
            type: 'button',
            label: '按钮1'
          },
          {
            type: 'button',
            label: '按钮2'
          }
        ]
      },
      {
        type: 'button',
        label: 'outside'
      }
    ]
  });
  const {container, getByText, rerender} = render(
    amisRender(
      schema({
        // closeOnClick: true,
        // closeOnOutside: true,
      })
    )
  );

  fireEvent.click(document.querySelector('button.cxd-Button')!);

  const isMenuExist = (exist: boolean) => {
    exist
      ? expect(
          container.querySelector('.cxd-DropDown-menu-root')!
        ).toBeInTheDocument()
      : expect(container.querySelector('.cxd-DropDown-menu-root')!).toBeNull();
  };

  isMenuExist(true);

  fireEvent.click(getByText('按钮1'));
  await wait(500);
  isMenuExist(true);

  rerender(
    amisRender(
      schema({
        closeOnClick: true
      })
    )
  );

  expect(container).toMatchSnapshot();
  fireEvent.click(getByText('按钮1'));
  await wait(500);
  isMenuExist(false);

  fireEvent.click(document.querySelector('button.cxd-Button')!);
  isMenuExist(true);

  fireEvent.click(getByText('outside'));
  await wait(500);
  isMenuExist(false);

  rerender(
    amisRender(
      schema({
        closeOnClick: true,
        closeOnOutside: false
      })
    )
  );

  fireEvent.click(document.querySelector('button.cxd-Button')!);
  isMenuExist(true);

  fireEvent.click(getByText('outside'));
  await wait(500);
  isMenuExist(true);
});

test('Renderer:dropdown-button with trigger', async () => {
  const {container} = render(
    amisRender({
      type: 'dropdown-button',
      label: '下拉菜单',
      trigger: 'hover',
      buttons: [
        {
          type: 'button',
          label: '按钮1'
        },
        {
          type: 'button',
          label: '按钮2'
        }
      ]
    })
  );
  fireEvent.mouseEnter(document.querySelector('button.cxd-Button')!);
  await wait(200);
  expect(
    container.querySelector('.cxd-DropDown-menu-root')!
  ).toBeInTheDocument();
});

test('Renderer:dropdown-button with icon & rightIcon', async () => {
  const {container} = render(
    amisRender({
      type: 'dropdown-button',
      label: '下拉菜单',
      icon: 'fa fa-home',
      rightIcon: 'fa fa-ellipsis-v',
      buttons: [
        {
          type: 'button',
          label: '按钮1'
        },
        {
          type: 'button',
          label: '按钮2'
        }
      ]
    })
  );

  expect(container.querySelector('.fa-home')).toBeInTheDocument();
  expect(container.querySelector('.fa-ellipsis-v')).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test('Renderer:dropdown-button with hideCaret', async () => {
  const {container} = render(
    amisRender({
      type: 'dropdown-button',
      label: '下拉菜单',
      level: 'link',
      icon: 'fa fa-ellipsis-h',
      hideCaret: true,
      buttons: [
        {
          type: 'button',
          label: '按钮1'
        },
        {
          type: 'button',
          label: '按钮2'
        }
      ]
    })
  );

  expect(container.querySelector('.cxd-DropDown-caret')!).toBeNull();
  expect(container).toMatchSnapshot();
});

test('Renderer:dropdown-button with defaultIsOpened', async () => {
  const {container} = render(
    amisRender({
      type: 'dropdown-button',
      label: '下拉菜单',
      defaultIsOpened: true,
      buttons: [
        {
          type: 'button',
          label: '按钮1'
        },
        {
          type: 'button',
          label: '按钮2'
        }
      ]
    })
  );

  expect(
    container.querySelector('.cxd-DropDown-menu-root')!
  ).toBeInTheDocument();
});

test('Renderer:dropdown-button with align', async () => {
  const {container} = render(
    amisRender({
      type: 'dropdown-button',
      label: '下拉菜单',
      defaultIsOpened: true,
      align: 'right',
      buttons: [
        {
          type: 'button',
          label: '按钮1'
        },
        {
          type: 'button',
          label: '按钮2'
        }
      ]
    })
  );

  expect(
    container.querySelector('.cxd-DropDown-menu-root')!
  ).toBeInTheDocument();
  expect(container.querySelector('.cxd-DropDown')!).toHaveClass(
    'cxd-DropDown--alignRight'
  );
});

test('Renderer:dropdown-button with block & size', async () => {
  const {container, rerender} = render(
    amisRender({
      type: 'dropdown-button',
      label: '下拉菜单',
      block: true,
      buttons: [
        {
          type: 'button',
          label: '按钮1'
        },
        {
          type: 'button',
          label: '按钮2'
        }
      ]
    })
  );

  expect(container.querySelector('.cxd-DropDown')!).toHaveClass(
    'cxd-DropDown--block'
  );
  expect(container).toMatchSnapshot();

  rerender(
    amisRender({
      type: 'dropdown-button',
      label: '下拉菜单',
      size: 'lg',
      buttons: [
        {
          type: 'button',
          label: '按钮1'
        },
        {
          type: 'button',
          label: '按钮2'
        }
      ]
    })
  );

  expect(container.querySelector('.cxd-DropDown .cxd-Button')!).toHaveClass(
    'cxd-Button--size-lg'
  );
  expect(container).toMatchSnapshot();
});

test('Renderer:dropdown-button buttons with className & level', async () => {
  const {container} = render(
    amisRender({
      type: "dropdown-button",
      level: "success",
      label: "下拉菜单",
      buttons: [
        {
          type: "button",
          label: "按钮1",
          level: "success",
          className: "custom-button-class"
        },
        {
          type: "button",
          label: "按钮2"
        }
      ]
    })
  );

  const dropdownButton = document.querySelector('button.cxd-Button');
  fireEvent.click(dropdownButton as HTMLDivElement);

  expect(container.querySelectorAll('.cxd-DropDown-menu-root .cxd-DropDown-button')[0]!).toHaveClass(
    'cxd-Button--success'
  );

  expect(container.querySelectorAll('.cxd-DropDown-menu-root .cxd-DropDown-button')[0]!).toHaveClass(
    'custom-button-class'
  );
});
