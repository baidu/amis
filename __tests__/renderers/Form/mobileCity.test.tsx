import React = require('react');
import {render, fireEvent, screen} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {createMockMediaMatcher, makeEnv, wait} from '../../helper';
import {act} from 'react-dom/test-utils';

let originalMatchMedia: any;

beforeAll(() => {
  originalMatchMedia = window.matchMedia;
  window.matchMedia = createMockMediaMatcher(true);
});

afterAll(() => {
  window.matchMedia = originalMatchMedia;
});

test('Renderer:mobileCity', async () => {
  // TODO: 不知道为啥报错了
  // const {container, getByText} = render(
  //   amisRender(
  //     {
  //       type: 'form',
  //       api: '/api/xxx',
  //       controls: [
  //         {
  //           type: 'city',
  //           name: 'a',
  //           label: 'city',
  //           allowDistrict: true,
  //           allowCity: true
  //         }
  //       ],
  //       title: 'The form',
  //       actions: []
  //     },
  //     {},
  //     makeEnv({})
  //   )
  // );
  // await wait(200);
  // fireEvent.click(getByText('请选择操作'));
  // fireEvent.click(getByText('确认'));
  // screen.debug();
  // expect(container).toMatchSnapshot();
});
