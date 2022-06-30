import {dataMapping} from '../src';

test('datamapping', async () => {
  const context = {
    a: 1,
    b: 2,
    c: [
      {a: 1, b: 1},
      {a: 2, b: 2}
    ]
  };

  const result = dataMapping(
    {
      a: '${a}',
      b: '${c}',
      c: '${ARRAYMAP(c, item => {a: item.a, c: item.b})}'
    },
    context
  );

  expect(result).toMatchObject({
    a: 1,
    b: [
      {a: 1, b: 1},
      {a: 2, b: 2}
    ],
    c: [
      {a: 1, c: 1},
      {a: 2, c: 2}
    ]
  });
});
