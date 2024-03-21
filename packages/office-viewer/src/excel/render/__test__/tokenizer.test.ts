import {tokenizer} from '../cell/tokenizer';

test('wordspace', () => {
  expect(tokenizer('hello world')).toEqual([
    {t: 'hello', type: 'w'},
    {t: ' ', type: 's'},
    {t: 'world', type: 'w'}
  ]);
});

test('chinese', () => {
  expect(tokenizer('hello中文world')).toEqual([
    {t: 'hello', type: 'w'},
    {t: '中', type: 'w'},
    {t: '文', type: 'w'},
    {t: 'world', type: 'w'}
  ]);
});

test('chinesenumber', () => {
  expect(tokenizer('hello 123中文world')).toEqual([
    {t: 'hello', type: 'w'},
    {t: ' ', type: 's'},
    {t: '123', type: 'w'},
    {t: '中', type: 'w'},
    {t: '文', type: 'w'},
    {t: 'world', type: 'w'}
  ]);
});

test('linebreak', () => {
  expect(tokenizer('he\nllo中文')).toEqual([
    {t: 'he', type: 'w'},
    {t: '\n', type: 'br'},
    {t: 'llo', type: 'w'},
    {t: '中', type: 'w'},
    {t: '文', type: 'w'}
  ]);
});

test('plural', () => {
  expect(tokenizer("let's try")).toEqual([
    {t: "let's", type: 'w'},
    {t: ' ', type: 's'},
    {t: 'try', type: 'w'}
  ]);
});

test('dash', () => {
  expect(tokenizer('hello-world')).toEqual([
    {t: 'hello', type: 'w'},
    {t: '-', type: 'h'},
    {t: 'world', type: 'w'}
  ]);
});
