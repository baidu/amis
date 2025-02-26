import React = require('react');
import {render, cleanup, fireEvent} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from '../../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:static', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'static',
            name: 'static',
            label: 'label',
            value: 'static',
            description: 'static description',
            placeholder: '-',
            inline: true,
            className: 'bg-white'
          },
          {
            type: 'static',
            name: 'static 1',
            visible: true
          },
          {
            type: 'static',
            name: 'static 2',
            visibleOn: 'this.static'
          },
          {
            type: 'static',
            name: 'static 3',
            hidden: true
          },
          {
            type: 'static',
            name: 'static 4',
            hiddenOn: 'this.static'
          },
          {
            type: 'static',
            name: 'static 5',
            hiddenOn: 'this.static',
            inputClassName: 'padder-xs',
            labelClassName: 'font-bold',
            tpl: '<%= static tpl %>'
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();
});

test('Renderer:static2', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        static: true,
        data: {
          a: 1,
          b: 2,
          c: 3,
          d: 4
        },
        body: [
          {
            type: 'input-text',
            name: 'a',
            label: 'a'
          },
          {
            type: 'input-text',
            name: 'b',
            static: false,
            label: 'b'
          },
          {
            type: 'input-text',
            name: 'c',
            static: true,
            label: 'c'
          },
          {
            type: 'group',
            body: [
              {
                type: 'input-text',
                name: 'a',
                label: 'a'
              },
              {
                type: 'input-text',
                name: 'b',
                static: false,
                label: 'b'
              },
              {
                type: 'input-text',
                name: 'c',
                static: true,
                label: 'c'
              }
            ]
          },
          {
            type: 'group',
            static: false,
            body: [
              {
                type: 'input-text',
                name: 'a',
                label: 'a'
              },
              {
                type: 'input-text',
                name: 'b',
                static: false,
                label: 'b'
              },
              {
                type: 'input-text',
                name: 'c',
                static: true,
                label: 'c'
              }
            ]
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();
});

test('Renderer:staticOn', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        body: [
          {
            type: 'switch',
            name: 'a',
            label: 'a'
          },
          {
            type: 'input-text',
            name: 'b',
            value: '123',
            label: 'b',
            staticOn: '${a}'
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );

  expect(container.querySelector('input[name="b"]')).toBeInTheDocument();
  expect(container.querySelector('label.cxd-Switch')).toBeInTheDocument();
  fireEvent.click(container.querySelector('label.cxd-Switch')!);
  await wait(200);

  const text = getByText('123');
  expect(text).toBeInTheDocument();
});

// test('Renderer:staticInColumn', async () => {
//   const {container, getByText} = render(
//     amisRender(
//       {
//         type: 'crud',
//         source: '${items}',
//         columns: [
//           {
//             type: 'input-text',
//             name: 'a',
//             label: 'a',
//             static: true,
//             quickEdit: {
//               type: 'input-text',
//               mode: 'inline'
//             }
//           }
//         ],
//         submitText: null,
//         actions: []
//       },
//       {
//         data: {
//           items: [{a: '1'}]
//         }
//       },
//       makeEnv()
//     )
//   );

//   await wait(200);

//   expect(container.querySelector('input[name="a"]')).toBeInTheDocument();
//   expect((container.querySelector('input[name="a"]') as any).value).toBe('1');
// });

test('Renderer:static-quickEdit-icon', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'static',
        name: 'static',
        label: 'label',
        quickEdit: {
          icon: 'fa fa-search'
        },
        value: 'static'
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();
});
