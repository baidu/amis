import React = require('react');
import {render, cleanup, fireEvent} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';
import {clearStoresCache} from '../../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:checkbox', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            name: 'checkbox',
            type: 'checkbox',
            label: 'Checkbox',
            option: '选项说明',
            trueValue: true,
            falseValue: false
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
