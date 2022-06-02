import React = require('react');
import {render, cleanup} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';
import {clearStoresCache} from 'amis';

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
