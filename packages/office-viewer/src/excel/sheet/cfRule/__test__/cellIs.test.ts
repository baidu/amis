import {notBetween} from '../cellIs';

test('notBetween - text is not between the given values', () => {
  const text = '5';
  const formula = ['1', '10'];
  expect(notBetween(text, formula)).toBe(false);
});

test('notBetween - text is equal to the first value', () => {
  const text = '1';
  const formula = ['1', '10'];
  expect(notBetween(text, formula)).toBe(false);
});

test('notBetween - text is equal to the second value', () => {
  const text = '10';
  const formula = ['1', '10'];
  expect(notBetween(text, formula)).toBe(false);
});

test('notBetween - text is larger the given values', () => {
  const text = '11';
  const formula = ['1', '10'];
  expect(notBetween(text, formula)).toBe(true);
});

test('notBetween - text is smaller the given values', () => {
  const text = '0';
  const formula = ['1', '10'];
  expect(notBetween(text, formula)).toBe(true);
});

test('notBetween - text is not a number', () => {
  const text = 'abc';
  const formula = ['1', '10'];
  expect(notBetween(text, formula)).toBe(false);
});
