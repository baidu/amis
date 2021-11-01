import React = require('react');
import {fireEvent, render} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender, setIconVendor} from '../../../src/index';
import {makeEnv} from '../../helper';

test('Renderer:icon-picker', async () => {
  const vendors = [
    {
      name: 'Font Awesome 4.7',
      prefix: 'fa fa-',
      icons: ['address-book', 'address-book-o', 'address-card']
    },
    {
      name: 'Glyphicons',
      prefix: 'glyphicon glyphicon-',
      icons: ['asterisk', 'plus', 'euro', 'eur', 'minus']
    }
  ];
  setIconVendor(vendors);

  const {container, getByText, getByTitle} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'icon-picker',
            name: 'a',
            label: 'icon-picker',
            value: 'address-card'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const faIcon = container.querySelector('.cxd-IconPickerControl-value');
  expect(faIcon?.innerHTML.replace(/<\s*i[^>]*><\s*\/\s*i>/g, '')).toEqual(
    'address-card'
  );

  const input = container.querySelector('input[name="a"]') as any;
  input?.focus();
  fireEvent.click(getByText(/Glyphicons/));

  fireEvent.change(input!, {
    target: {
      value: 'glyphicon glyphicon-plus'
    }
  });

  fireEvent.click(getByTitle('glyphicon glyphicon-plus'));

  expect(container).toMatchSnapshot();
});
