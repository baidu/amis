/**
 * 组件名称：FieldSet 表单项集合
 *
 * 单测内容：
 * 1. 基本使用
 * 2. mode
 * 3. 可折叠 collapsable 和 默认是否折叠 collapsed
 * 4. 标题位置 titlePosition、 收起标题 collapseTitle、展开标题 title
 * 5. size
 */

import {render, fireEvent} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

// 1. 基本使用
test('Renderer:fieldSet', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'fieldSet',
            name: 'a',
            label: 'fieldSet',
            mode: 'horizontal',
            collapsable: true,
            collapsed: false,
            className: 'no-border',
            headingClassName: 'bg-dark',
            bodyClassName: 'bg-white',
            horizontal: {
              leftFixed: 1,
              left: 4,
              right: 7
            },
            controls: [
              {
                name: 'text',
                type: 'text'
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

// 2. mode
test('Renderer:fieldSet with mode', async () => {
  const schema = (mode: any) => ({
    type: 'form',
    api: '/api/xxx',
    body: [
      {
        type: 'fieldSet',
        name: 'a',
        label: 'fieldSet',
        mode,
        body: [
          {
            name: 'text1',
            type: 'input-text',
            label: '文本1'
          },
          {
            name: 'text2',
            type: 'input-text',
            label: '文本2'
          }
        ]
      }
    ],
    title: 'The form',
    actions: []
  });
  const {container, rerender} = render(
    amisRender(schema('horizontal'), {}, makeEnv({}))
  );
  expect(container.querySelector('.cxd-Form--horizontal')!).toBeInTheDocument();
  expect(container).toMatchSnapshot();

  rerender(amisRender(schema('inline'), {}, makeEnv({})));
  expect(container.querySelector('.cxd-Form--inline')!).toBeInTheDocument();
  expect(container).toMatchSnapshot();

  rerender(amisRender(schema('justify'), {}, makeEnv({})));
  expect(container.querySelector('.cxd-Form--justify')!).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

// 3. 可折叠 collapsable 和 默认是否折叠 collapsed
test('Renderer:fieldSet with collapsable & collapsed', async () => {
  const {container, rerender} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        body: [
          {
            type: 'fieldSet',
            name: 'a',
            label: 'fieldSet',
            collapsable: true,
            body: [
              {
                name: 'text1',
                type: 'input-text',
                label: '文本1'
              },
              {
                name: 'text2',
                type: 'input-text',
                label: '文本2'
              }
            ]
          },
          {
            type: 'fieldSet',
            name: 'b',
            label: 'fieldSet2',
            collapsable: true,
            collapsed: true,
            body: [
              {
                name: 'text1',
                type: 'input-text',
                label: '文本1'
              },
              {
                name: 'text2',
                type: 'input-text',
                label: '文本2'
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

  const header = container.querySelector('.cxd-Collapse-header')!;
  expect(container.querySelector('.cxd-Collapse')!).toHaveClass('is-active');
  expect(
    container.querySelector('.cxd-Collapse:last-of-type')!
  ).not.toHaveClass('is-active');

  fireEvent.click(header);
  await wait(300);
  expect(container.querySelector('.cxd-Collapse')!).not.toHaveClass(
    'is-active'
  );
});

// 4. 标题位置 titlePosition、 收起标题 collapseTitle、展开标题 title
test('Renderer:fieldSet with titlePosition & collapseTitle & title', async () => {
  const {container, rerender} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        body: [
          {
            type: 'fieldSet',
            name: 'a',
            label: 'fieldSet',
            collapsable: true,
            title: '展开更多设置',
            collapseTitle: '收起设置',
            titlePosition: 'bottom',
            body: [
              {
                name: 'text1',
                type: 'input-text',
                label: '文本1'
              },
              {
                name: 'text2',
                type: 'input-text',
                label: '文本2'
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

  const item = container.querySelector('.cxd-Collapse.is-active')!;

  expect(item).toHaveClass('cxd-Collapse--title-bottom');
  expect(item.firstElementChild).toHaveClass('cxd-Collapse-contentWrapper');
  expect(item.lastElementChild).toHaveTextContent('收起设置');
  expect(container).toMatchSnapshot();

  fireEvent.click(item.lastElementChild!);
  await wait(400);

  expect(item.lastElementChild).toHaveTextContent('展开更多设置');
});

// 5. size
test('Renderer:fieldSet with titlePosition & collapseTitle & title', async () => {
  const schema = (size: any) => ({
    type: 'form',
    api: '/api/xxx',
    body: [
      {
        type: 'fieldSet',
        name: 'a',
        label: 'fieldSet',
        collapsable: true,
        title: '展开更多设置',
        size,
        body: [
          {
            name: 'text1',
            type: 'input-text',
            label: '文本1'
          },
          {
            name: 'text2',
            type: 'input-text',
            label: '文本2'
          }
        ]
      }
    ],
    title: 'The form',
    actions: []
  });
  const {container, rerender} = render(
    amisRender(schema('xs'), {}, makeEnv({}))
  );
  expect(
    container.querySelector('.cxd-Collapse.cxd-Collapse--xs')!
  ).toBeInTheDocument();

  rerender(amisRender(schema('sm'), {}, makeEnv({})));
  expect(
    container.querySelector('.cxd-Collapse.cxd-Collapse--sm')!
  ).toBeInTheDocument();

  rerender(amisRender(schema('base'), {}, makeEnv({})));
  expect(
    container.querySelector('.cxd-Collapse.cxd-Collapse--base')!
  ).toBeInTheDocument();

  rerender(amisRender(schema('lg'), {}, makeEnv({})));
  expect(
    container.querySelector('.cxd-Collapse.cxd-Collapse--lg')!
  ).toBeInTheDocument();

  rerender(amisRender(schema('xl'), {}, makeEnv({})));
  expect(
    container.querySelector('.cxd-Collapse.cxd-Collapse--xl')!
  ).toBeInTheDocument();
});
