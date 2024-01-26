import {
  registerRenderer,
  unRegisterRenderer,
  RendererProps
} from '../src/factory';
import {render as amisRender, splitTarget} from '../src';
import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import {makeEnv} from './helper';

test('Scoped splitTarget', async () => {
  expect(splitTarget('abc')).toEqual(['abc']);
  expect(splitTarget('a,b,c')).toEqual(['a', 'b', 'c']);
  expect(splitTarget('a?x=1&y=2,b,c')).toEqual(['a?x=1&y=2', 'b', 'c']);
  expect(splitTarget('a?x=${[a, b]},b,c')).toEqual(['a?x=${[a, b]}', 'b', 'c']);
  expect(splitTarget('a?x=${[a, b]}')).toEqual(['a?x=${[a, b]}']);
});
