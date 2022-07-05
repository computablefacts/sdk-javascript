import {promises} from "./promises";

test('memoize', () => {

  const memoizedSum = new promises.Memoize(5, (a, b) => Promise.resolve(a + b));

  // Misses
  expect(memoizedSum.promise(1, 1)).resolves.toBe(2);
  expect(memoizedSum.hits()).toBe(0);
  expect(memoizedSum.misses()).toBe(1);
  expect(memoizedSum.hitRate()).toBe(0);
  expect(memoizedSum.missRate()).toBe(1);

  expect(memoizedSum.promise(1, 2)).resolves.toBe(3);
  expect(memoizedSum.hits()).toBe(0);
  expect(memoizedSum.misses()).toBe(2);
  expect(memoizedSum.hitRate()).toBe(0);
  expect(memoizedSum.missRate()).toBe(1);

  // Hits
  expect(memoizedSum.promise(1, 1)).resolves.toBe(2);
  expect(memoizedSum.hits()).toBe(1);
  expect(memoizedSum.misses()).toBe(2);
  expect(memoizedSum.hitRate()).toBe(1 / 3);
  expect(memoizedSum.missRate()).toBe(2 / 3);

  expect(memoizedSum.promise(1, 2)).resolves.toBe(3);
  expect(memoizedSum.hits()).toBe(2);
  expect(memoizedSum.misses()).toBe(2);
  expect(memoizedSum.hitRate()).toBe(0.5);
  expect(memoizedSum.missRate()).toBe(0.5);
});