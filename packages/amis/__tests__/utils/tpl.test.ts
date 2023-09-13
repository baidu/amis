import {filter} from '../../src';

import '../../src';
import '../../src';
test('filter', () => {
  expect(
    filter('xxx_a=${a}&b=${b}', {
      a: 1,
      b: 2
    })
  ).toEqual('xxx_a=1&b=2');

  expect(
    filter('xxx_a=<%= data.a%>&b=<%= data.b%>', {
      a: 1,
      b: 2
    })
  ).toEqual('xxx_a=1&b=2');
});
