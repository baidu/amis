import {evaluate} from '../src';

describe('lexer/parser optimizations', () => {
  describe('Exponent numbers', () => {
    test('parse integer exponent', () => {
      expect(evaluate('${1e3}', {})).toBe(1000);
      expect(evaluate('${2e+2}', {})).toBe(200);
      expect(evaluate('${3e-1}', {})).toBe(0.3);
    });

    test('parse decimal with exponent', () => {
      expect(evaluate('${2.5E-1}', {})).toBe(0.25);
      expect(evaluate('${1.2e3 + 1}', {})).toBe(1201);
    });
  });

  describe('Trailing commas', () => {
    test('array literal trailing comma', () => {
      const res = evaluate('${[1, 2, 3, ]}', {});
      expect(res).toEqual([1, 2, 3]);
    });

    test('object literal trailing comma', () => {
      const res = evaluate('${{a: 1, b: 2,}}', {});
      expect(res).toEqual({a: 1, b: 2});
    });

    test('nested trailing commas', () => {
      const res = evaluate('${{a: [1,2,3,], b: {x:1, y:2,},}}', {});
      expect(res).toEqual({a: [1, 2, 3], b: {x: 1, y: 2}});
    });
  });

  describe('Object spread stays intact', () => {
    test('spread with trailing comma still works', () => {
      const res = evaluate('${{...origin, a: 1,}}', {origin: {x: 1}});
      expect(res).toEqual({x: 1, a: 1});
    });
  });
});
