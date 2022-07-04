import {arrays} from "./arrays"

test('distinct_on_null_array', () => {
  expect(arrays.distinct(null)).toStrictEqual([]);
});

test('distinct_on_array_of_duplicate_numbers', () => {
  const array = arrays.distinct([1, 2, 3, 4, 3, 2, 1]).sort();
  expect(array).toStrictEqual([1, 2, 3, 4]);
});

test('distinct_on_array_of_duplicate_strings', () => {
  const array = arrays.distinct(['1', '2', '3', '4', '3', '2', '1']).sort();
  expect(array).toStrictEqual(['1', '2', '3', '4']);
});

test('distinct_on_array_of_numbers_and_strings', () => {
  const array = arrays.distinct(['1', '1', '2', '3', 3, 2, 1, 1]).sort();
  expect(array).toStrictEqual(['1', 1, '2', 2, '3', 3]);
});

test('distinct_on_null_array_of_objects', () => {
  expect(arrays.distinctObjects(null)).toStrictEqual([]);
});

test('distinct_on_array_of_duplicate_objects_of_same_type', () => {
  const array = arrays.distinctObjects(
      [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 3}, {id: 2}, {id: 1}]).sort(
      (x, y) => x.id === y.id ? 0 : x.id < y.id ? -1 : 1);
  expect(array).toStrictEqual([{id: 1}, {id: 2}, {id: 3}, {id: 4}]);
});

test('distinct_on_array_of_duplicate_objects_of_different_types', () => {
  const array = arrays.distinctObjects(
      [{id: 1}, {id: 1}, {id: 2}, {id: 3}, {id: '3'}, {id: '2'}, {id: '1'},
        {id: '1'}]).sort((x, y) => x.id === y.id ? 0 : x.id < y.id ? -1 : 1);
  expect(array).toStrictEqual(
      [{id: 1}, {id: '1'}, {id: 2}, {id: '2'}, {id: 3}, {id: '3'}]);
});

test('intersect_null_arrays', () => {
  const array = arrays.intersect(null, [3, 4, 5, 6]).sort();
  expect(array).toStrictEqual([]);
});

test('intersect_arrays_of_numbers', () => {
  const array = arrays.intersect([1, 2, 3, 4], [3, 4, 5, 6]).sort();
  expect(array).toStrictEqual([3, 4]);
});

test('intersect_arrays_of_strings', () => {
  const array = arrays.intersect(['1', '2', '3', '4'],
      ['3', '4', '5', '6']).sort();
  expect(array).toStrictEqual(['3', '4']);
});