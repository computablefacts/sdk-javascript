import {helpers} from "./helpers"

test('good_fast_hash_of_null', () => {
  expect(helpers.goodFastHash(null)).toBe(3338908027751811);
});

test('good_fast_hash_of_empty_string', () => {
  expect(helpers.goodFastHash('')).toBe(3338908027751811);
});

test('good_fast_hash_of_string', () => {
  expect(helpers.goodFastHash('Hello world!')).toBe(2185302362606067);
});

test('good_fast_hash_of_number', () => {
  expect(helpers.goodFastHash(123456789)).toBe(4952337973757145);
});

test('good_fast_hash_of_object', () => {
  expect(helpers.goodFastHash({id: 1, msg: 'Hello world!'})).toBe(
      8256987331838298);
  expect(helpers.goodFastHash({msg: 'Hello world!', id: 1})).toBe(
      8256987331838298);
});