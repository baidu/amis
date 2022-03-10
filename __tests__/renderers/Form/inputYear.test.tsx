import React = require('react');
import PageRenderer from '../../../src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {render, fireEvent, cleanup, getByText} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';
import moment from 'moment';

test('Renderer:inputYear click', async () => {
  const {container, findByPlaceholderText, findByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        body: [
          {
            type: 'input-year',
            name: 'year',
            label: '年'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const inputDate = await findByPlaceholderText('请选择年');

  fireEvent.click(inputDate);

  const thisYearText = moment().format('YYYY');

  const thisYear = await findByText(thisYearText);

  fireEvent.click(thisYear);

  const value = document.querySelector(
    '.cxd-DatePicker input'
  ) as HTMLInputElement;

  expect(value.value).toEqual(thisYearText);
});
