import {arrays} from "./arrays"

test('distinct_numbers', () => {
  const array = arrays.distinct([1, 2, 3, 4, 3, 2, 1]).sort();
  expect(array).toStrictEqual([1, 2, 3, 4]);
});

test('distinct_strings', () => {
  const array = arrays.distinct(['1', '2', '3', '4', '3', '2', '1']).sort();
  expect(array).toStrictEqual(['1', '2', '3', '4']);
});

test('distinct_mix_of_numbers_and_strings', () => {
  const array = arrays.distinct(['1', '2', '3', '4', 3, 2, 1]).sort();
  expect(array).toStrictEqual(['1', 1, '2', 2, '3', 3, '4']);
});

test('distinct_objects', () => {
  const array = arrays.distinctObjects(
      [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 3}, {id: 2}, {id: 1}]).sort(
      (x, y) => x.id === y.id ? 0 : x.id < y.id ? -1 : 1);
  expect(array).toStrictEqual([{id: 1}, {id: 2}, {id: 3}, {id: 4}]);
});

test('distinct_mix_of_objects', () => {
  const array = arrays.distinctObjects(
      [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: '3'}, {id: '2'},
        {id: '1'}]).sort((x, y) => x.id === y.id ? 0 : x.id < y.id ? -1 : 1);
  expect(array).toStrictEqual(
      [{id: 1}, {id: '1'}, {id: 2}, {id: '2'}, {id: 3}, {id: '3'}, {id: 4}]);
});