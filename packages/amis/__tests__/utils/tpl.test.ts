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

test('filter:formatDate echoes unparseable input instead of rendering "Invalid date"', () => {
  // Before the fix this rendered the literal string "Invalid date" into the page.
  // After the fix the bad input is echoed back so the upstream caller can
  // decide how to display it (or it's empty for null/undefined).
  expect(
    filter('<%= formatDate(data.d, "YYYY-MM-DD") %>', {d: 'not-a-real-date'})
  ).toEqual('not-a-real-date');

  expect(filter('<%= formatDate(data.d, "YYYY-MM-DD") %>', {d: null})).toEqual(
    ''
  );

  expect(
    filter('<%= formatDate(data.d, "YYYY-MM-DD") %>', {d: undefined})
  ).toEqual('');

  // Critical: must NOT render the silent "Invalid date" string anywhere.
  expect(
    filter('<%= formatDate(data.d, "YYYY-MM-DD") %>', {d: 'not-a-real-date'})
  ).not.toMatch(/Invalid date/);
});

test('filter:formatDate still formats valid input correctly', () => {
  // Round-trip a known ISO date through the inputFormat overload.
  expect(
    filter('<%= formatDate(data.d, "YYYY-MM-DD", "YYYY-MM-DD") %>', {
      d: '2024-01-15'
    })
  ).toEqual('2024-01-15');

  // Default (no inputFormat) path still works on standard ISO timestamps.
  expect(
    filter('<%= formatDate(data.d, "YYYY-MM-DD") %>', {
      d: '2024-01-15T00:00:00Z'
    })
  ).toEqual('2024-01-15');
});

// `date` filter (from amis-core/src/utils/filter.ts) — also exposed in lodash
// templates as `formatTimeStamp: filters.date` (see tpl-lodash.ts:50). Same
// one-liner shape as `formatDate` before the guards landed; same failure mode.
test('filter:date guards against null/undefined/empty input', () => {
  // formatTimeStamp is filters.date with inputFormat defaulting to "X" (Unix s).
  expect(
    filter('<%= formatTimeStamp(data.d, "YYYY-MM-DD") %>', {d: null})
  ).toEqual('');
  expect(
    filter('<%= formatTimeStamp(data.d, "YYYY-MM-DD") %>', {d: undefined})
  ).toEqual('');
  expect(filter('<%= formatTimeStamp(data.d, "YYYY-MM-DD") %>', {d: ''})).toEqual(
    ''
  );

  // Unparseable input echoes back the original — must NOT surface "Invalid date".
  expect(
    filter('<%= formatTimeStamp(data.d, "YYYY-MM-DD") %>', {d: 'not-a-real-date'})
  ).toEqual('not-a-real-date');
  expect(
    filter('<%= formatTimeStamp(data.d, "YYYY-MM-DD") %>', {d: 'not-a-real-date'})
  ).not.toMatch(/Invalid date/);

  // Valid Unix-timestamp-seconds input still formats correctly.
  expect(
    filter('<%= formatTimeStamp(data.d, "YYYY-MM-DD") %>', {d: '1705276800'})
  ).toEqual('2024-01-15');
});
