import {
  registerRenderer,
  unRegisterRenderer,
  RendererProps
} from '../src/factory';
import '../src/themes/default';
import {render as amisRender} from '../src/index';
import React = require('react');
import {render, fireEvent, cleanup} from '@testing-library/react';
import {wait, makeEnv} from './helper';

test('factory unregistered Renderer', async () => {
  const {container} = render(
    amisRender({
      type: 'my-renderer',
      a: 23
    })
  );
  await wait(300);
  expect(container).toMatchSnapshot(); // not found
});

test('factory custom not found!', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'my-renderer',
        a: 23
      },
      {},
      makeEnv({
        loadRenderer: () => Promise.resolve(() => <div>Not Found</div>)
      })
    )
  );
  await wait(300);
  expect(container).toMatchSnapshot(); // not found
});

test('factory custom not found 2!', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'my-renderer',
        a: 23
      },
      {},
      makeEnv({
        loadRenderer: () => () => <div>Not Found</div>
      })
    )
  );
  await wait(300);
  expect(container).toMatchSnapshot(); // not found
});

test('factory custom not found 3!', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'my-renderer',
        a: 23
      },
      {},
      makeEnv({
        loadRenderer: () => <div>Not Found</div>
      })
    )
  );
  await wait(300);
  expect(container).toMatchSnapshot(); // not found
});

test('factory load Renderer on need', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'my-renderer2',
        a: 23
      },
      {},
      makeEnv({
        session: 'loadRenderer',
        loadRenderer: schema => {
          interface MyProps extends RendererProps {
            a?: number;
          }

          class MyComponent extends React.Component<MyProps> {
            render() {
              return <div>This is Custom Renderer2, a is {this.props.a}</div>;
            }
          }

          registerRenderer({
            component: MyComponent,
            test: /\bmy-renderer2$/
          });
        }
      })
    )
  );
  await wait(300);
  expect(container).toMatchSnapshot(); // not found
});

test('factory:registerRenderer', () => {
  interface MyProps extends RendererProps {
    a?: number;
  }

  class MyComponent extends React.Component<MyProps> {
    render() {
      return <div>This is Custom Renderer, a is {this.props.a}</div>;
    }
  }

  const renderer = registerRenderer({
    component: MyComponent,
    test: /\bmy-renderer$/
  });

  const {container} = render(
    amisRender({
      type: 'my-renderer',
      a: 23
    })
  );

  expect(container).toMatchSnapshot();
  unRegisterRenderer(renderer);
});

test('factory:definitions', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        definitions: {
          aa: {
            type: 'text',
            name: 'jack',
            value: 'ref value',
            remark: '通过<code>\\$ref</code>引入的组件'
          },
          bb: {
            type: 'combo',
            multiple: true,
            multiLine: true,
            remark: '<code>combo</code>中的子项引入自身，实现嵌套的效果',
            controls: [
              {
                label: 'combo 1',
                type: 'text',
                name: 'key'
              },
              {
                label: 'combo 2',
                name: 'value',
                $ref: 'aa'
              },
              {
                name: 'children',
                label: 'children',
                $ref: 'bb'
              }
            ]
          }
        },
        type: 'page',
        title: '引用',
        body: [
          {
            type: 'form',
            api: 'api/xxx',
            actions: [],
            controls: [
              {
                label: 'text2',
                $ref: 'aa',
                name: 'ref1'
              },
              {
                label: 'combo',
                $ref: 'bb',
                name: 'ref2'
              }
            ]
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  await wait(300);
  fireEvent.click(getByText('新增'));
  expect(container).toMatchSnapshot();
});

test('factory:definitions override', () => {
  const {container} = render(
    amisRender(
      {
        definitions: {
          aa: {
            type: 'text',
            name: 'jack',
            remark: '通过<code>\\$ref</code>引入的组件'
          },
          bb: {
            type: 'combo',
            multiple: true,
            multiLine: true,
            remark: '<code>combo</code>中的子项引入自身，实现嵌套的效果',
            controls: [
              {
                label: 'combo 1',
                type: 'text',
                name: 'key'
              },
              {
                label: 'combo 2',
                name: 'value',
                $ref: 'aa'
              },
              {
                name: 'children',
                label: 'children',
                $ref: 'bb'
              }
            ]
          }
        },
        type: 'page',
        title: '引用',
        body: [
          {
            type: 'form',
            api: 'api/xxx',
            actions: [],
            controls: [
              {
                label: 'text2',
                $ref: 'aa',
                name: 'ref1'
              },
              {
                label: 'combo',
                $ref: 'bb',
                name: 'ref2',
                type: 'checkboxes',
                value: 1,
                options: [
                  {
                    label: 'Option A',
                    value: 1
                  },
                  {
                    label: 'Option B',
                    value: 2
                  }
                ]
              }
            ]
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
