import {arrays} from "./arrays"

test('distinct', () => {
  expect(arrays.distinct(null)).toStrictEqual([]);
  expect(arrays.distinct([])).toStrictEqual([]);
  expect(arrays.distinct([1, 2, 3, 4, 3, 2, 1]).sort()).toStrictEqual(
      [1, 2, 3, 4]);
  expect(arrays.distinct(
      ['1', '2', '3', '4', '3', '2', '1']).sort()).toStrictEqual(
      ['1', '2', '3', '4']);
  expect(
      arrays.distinct(['1', '1', '2', '3', 3, 2, 1, 1]).sort()).toStrictEqual(
      ['1', 1, '2', 2, '3', 3]);
});

test('distinct_objects', () => {
  expect(arrays.distinctObjects(null)).toStrictEqual([]);
  expect(arrays.distinctObjects([])).toStrictEqual([]);
  expect(arrays.distinctObjects(
      [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 3}, {id: 2}, {id: 1}]).sort(
      (x, y) => x.id === y.id ? 0 : x.id < y.id ? -1 : 1)).toStrictEqual(
      [{id: 1}, {id: 2}, {id: 3}, {id: 4}]);
  expect(arrays.distinctObjects(
      [{id: 1}, {id: 1}, {id: 2}, {id: 3}, {id: '3'}, {id: '2'}, {id: '1'},
        {id: '1'}]).sort(
      (x, y) => x.id === y.id ? 0 : x.id < y.id ? -1 : 1)).toStrictEqual(
      [{id: 1}, {id: '1'}, {id: 2}, {id: '2'}, {id: 3}, {id: '3'}]);
});

test('intersect', () => {
  expect(arrays.intersect(null, [3, 4, 5, 6]).sort()).toStrictEqual([]);
  expect(arrays.intersect([], [3, 4, 5, 6]).sort()).toStrictEqual([]);
  expect(arrays.intersect([1, 2, 3, 4], [3, 4, 5, 6]).sort()).toStrictEqual(
      [3, 4]);
  expect(arrays.intersect(['1', '2', '3', '4'],
      ['3', '4', '5', '6']).sort()).toStrictEqual(['3', '4']);
});
