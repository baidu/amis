import React = require('react');
import Action from '../../src/renderers/Action';
import * as renderer from 'react-test-renderer';
import {render, fireEvent, cleanup, screen} from '@testing-library/react';
import {render as amisRender} from '../../src/index';
import {makeEnv, wait} from '../helper';
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

test('Renderers:Action download shortcut', () => {
  const component = renderer.create(
    <Action actionType="download" link="a" label="123" />
  );
  let tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

test('Renderers:Action countDown', async () => {
  const {container} = render(
    amisRender(
      {
        label: '发送验证码',
        type: 'button',
        className: 'countDown',
        countDown: 1
      },
      {},
      makeEnv({})
    )
  );

  let button = container.querySelector('button');
  fireEvent.click(button as HTMLButtonElement);

  button = container.querySelector('button');
  expect(button).toBeNull();

  await wait(2000);

  button = container.querySelector('button');
  expect(button).not.toBeNull();
});

test('Renderers:Action tooltip', async () => {
  const {container, getByText, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            label: 'top',
            type: 'action',
            tooltip: 'topTooltip',
            tooltipPlacement: 'top'
          },
          {
            label: 'bottom',
            type: 'action',
            tooltip: 'bottomTooltip',
            tooltipPlacement: 'bottom'
          },
          {
            label: 'left',
            type: 'action',
            tooltip: 'leftTooltip',
            tooltipPlacement: 'left'
          },
          {
            label: 'right',
            type: 'action',
            tooltip: 'rightTooltip',
            tooltipPlacement: 'right'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  fireEvent.mouseOver(getByText(/top/));

  await findByText('topTooltip');

  expect(container).toMatchSnapshot();
});
