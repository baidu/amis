import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:custom', () => {
  const {container} = render(
    amisRender(
      {
        type: 'custom',
        name: 'myName',
        label: '自定义组件',
        onMount: (dom: HTMLElement, value: any, onChange: any, props: any) => {
          const button = document.createElement('button');
          button.innerText = '点击修改';
          button.onclick = event => {
            onChange('new'); // 这个 onChange 方法只有放在表单项中才能调用
            event.preventDefault();
          };
          dom.appendChild(button);
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
