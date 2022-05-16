import React = require('react');
import {render, fireEvent} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';

test('Renderer:color', async () => {
  // TODO: 改成 lazy 暂时不知如何处理
  //   const {container} = render(
  //     amisRender(
  //       {
  //         type: 'form',
  //         api: '/api/xxx',
  //         controls: [
  //           {
  //             type: 'color',
  //             name: 'a',
  //             label: 'color',
  //             value: '#51458f'
  //           }
  //         ],
  //         title: 'The form',
  //         actions: []
  //       },
  //       {},
  //       makeEnv({})
  //     )
  //   );
  //   const input = container.querySelector('input');
  //   expect(input?.value).toEqual('#51458f');
  //   fireEvent.change(input!, {
  //     target: {
  //       value: '#1a1438'
  //     }
  //   });
  //   expect(input?.value).toEqual('#1a1438');
  //   expect(container).toMatchSnapshot();
});
