import React = require('react');
import NotFound from '../../../amis-ui/src/components/404';
import * as renderer from 'react-test-renderer';
import '../../src/themes/default';
import {render, fireEvent, cleanup} from '@testing-library/react';

afterEach(cleanup);

test('Components:404 default View', () => {
  const component = renderer.create(<NotFound />);
  let tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

test('Components:404 Custom code & messages', () => {
  const component = renderer.create(
    <NotFound code={500} description="Internal Error" />
  );
  let tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});
