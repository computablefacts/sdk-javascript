import {helpers} from "./helpers"

test('good_fast_hash', () => {
  expect(helpers.goodFastHash(null)).toBe(3338908027751811);
  expect(helpers.goodFastHash('')).toBe(3338908027751811);
  expect(helpers.goodFastHash(123)).toBe(2502665170145887);
  expect(helpers.goodFastHash(1.23)).toBe(9495949569514);
  expect(helpers.goodFastHash(.123)).toBe(5215321755165702);
  expect(helpers.goodFastHash('Hello world!')).toBe(2185302362606067);
  expect(helpers.goodFastHash({id: 1, msg: 'Hello world!'})).toBe(
      8256987331838298);
  expect(helpers.goodFastHash({msg: 'Hello world!', id: 1})).toBe(
      8256987331838298);
});

test('stringify', () => {
  expect(helpers.stringify(null)).toBe('null');
  expect(helpers.stringify('')).toBe('""');
  expect(helpers.stringify(123)).toBe('123');
  expect(helpers.stringify(1.23)).toBe('1.23');
  expect(helpers.stringify(.123)).toBe('0.123');
  expect(helpers.stringify('Hello world!')).toBe('"Hello world!"');
  expect(helpers.stringify({id: 1, msg: 'Hello world!'})).toBe(
      '{"id":1,"msg":"Hello world!"}');
  expect(helpers.stringify({msg: 'Hello world!', id: 1})).toBe(
      '{"id":1,"msg":"Hello world!"}');
});

test('for-each', () => {

  const array = [1, 2, 3, 4, 5];
  const actual = [];

  helpers.forEach(array);

  expect(actual).toStrictEqual([]);

  helpers.forEach(array, i => actual.push(2 * i));

  expect(actual).toStrictEqual([2, 4, 6, 8, 10]);
});