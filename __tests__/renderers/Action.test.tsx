import React = require('react');
import Action from '../../src/renderers/Action';
import * as renderer from 'react-test-renderer';
import {render, fireEvent, cleanup} from '@testing-library/react';
import '../../src/themes/default';

afterEach(cleanup);

test('Renderers:Action MenuItem changes class when actived & disabled', () => {
  const component = renderer.create(
    <Action isMenuItem className="a" label="123" />
  );
  let tree = component.toJSON();

  expect(tree).toMatchSnapshot();

  component.update(<Action isMenuItem className="a" label="233" active />);

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component.update(
    <Action isMenuItem className="a" label="233" active disabled />
  );

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Renderers:Action MenuItem display icon', () => {
  const component = renderer.create(
    <Action isMenuItem className="a" label="123" />
  );
  let tree = component.toJSON();

  expect(tree).toMatchSnapshot();

  component.update(
    <Action isMenuItem className="a" label="123" icon="fa fa-cloud" />
  );

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Renderers:Action [actionType = "link"] show active class', () => {
  const isCurrentUrl = (link: string) => link === 'b';
  const component = renderer.create(
    <Action
      actionType="link"
      link="a"
      className="a"
      label="123"
      isCurrentUrl={isCurrentUrl}
    />
  );
  let tree = component.toJSON();

  expect(tree).toMatchSnapshot();

  component.update(
    <Action
      actionType="link"
      link="b"
      className="a"
      label="123"
      isCurrentUrl={isCurrentUrl}
    />
  );

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Renderers:Action custom activeClass', () => {
  const component = renderer.create(
    <Action className="a" label="123" activeClassName="custom-active" />
  );
  let tree = component.toJSON();

  expect(tree).toMatchSnapshot();

  component.update(
    <Action className="a" label="123" activeClassName="custom-active" active />
  );

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Renderers:Action onAction called?', () => {
  const onAction = jest.fn();
  const {getByText} = render(
    <Action className="a" label="123" onAction={onAction}></Action>
  );

  fireEvent.click(getByText(/123/));
  expect(onAction).toHaveBeenCalled();
});

test('Renderers:Action disabled onAction called?', () => {
  const onAction = jest.fn();
  const {getByText} = render(
    <Action disabled className="a" label="123" onAction={onAction}></Action>
  );

  fireEvent.click(getByText(/123/));
  expect(onAction).not.toHaveBeenCalled();
});

test('Renderers:Action onClick cancel onAction?', () => {
  const onAction = jest.fn();
  const onClick = jest.fn(e => e.preventDefault());
  const {getByText} = render(
    <Action
      isMenuItem
      className="a"
      label="123"
      onClick={onClick}
      onAction={onAction}
    ></Action>
  );

  fireEvent.click(getByText(/123/));

  expect(onClick).toHaveBeenCalled();
  expect(onAction).not.toHaveBeenCalled();
});
