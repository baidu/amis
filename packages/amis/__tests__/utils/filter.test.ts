import {registerFilter, resolveVariableAndFilter} from '../../src';

test('filter:customFilter', () => {
  registerFilter('customFilter', input => `233`);

  expect(resolveVariableAndFilter('${a | customFilter}', {a: 'abc'})).toEqual(
    '233'
  );
});
