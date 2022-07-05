import {caches} from "./caches";

test('cache', () => {

  const cache = new caches.Cache(5);

  for (let i = 0; i < 10; i++) {
    cache.put(i.toString(10), i);
  }

  expect(cache.size()).toBe(5);

  expect(cache.contains('0')).toBe(false);
  expect(cache.contains('1')).toBe(false);
  expect(cache.contains('2')).toBe(false);
  expect(cache.contains('3')).toBe(false);
  expect(cache.contains('4')).toBe(false);
  expect(cache.contains('5')).toBe(true);
  expect(cache.contains('6')).toBe(true);
  expect(cache.contains('7')).toBe(true);
  expect(cache.contains('8')).toBe(true);
  expect(cache.contains('9')).toBe(true);

  expect(cache.get('0')).toBe(null);
  expect(cache.get('1')).toBe(null);
  expect(cache.get('2')).toBe(null);
  expect(cache.get('3')).toBe(null);
  expect(cache.get('4')).toBe(null);
  expect(cache.get('5')).toBe(5);
  expect(cache.get('6')).toBe(6);
  expect(cache.get('7')).toBe(7);
  expect(cache.get('8')).toBe(8);
  expect(cache.get('9')).toBe(9);

  expect(cache.getOrDefault('0', 'nil')).toBe('nil');
  expect(cache.getOrDefault('1', 'nil')).toBe('nil');
  expect(cache.getOrDefault('2', 'nil')).toBe('nil');
  expect(cache.getOrDefault('3', 'nil')).toBe('nil');
  expect(cache.getOrDefault('4', 'nil')).toBe('nil');
  expect(cache.getOrDefault('5', 'nil')).toBe(5);
  expect(cache.getOrDefault('6', 'nil')).toBe(6);
  expect(cache.getOrDefault('7', 'nil')).toBe(7);
  expect(cache.getOrDefault('8', 'nil')).toBe(8);
  expect(cache.getOrDefault('9', 'nil')).toBe(9);

  expect(cache.getOrPut('0', 0)).toBe(0);
  expect(cache.getOrPut('1', 1)).toBe(1);
  expect(cache.getOrPut('2', 2)).toBe(2);
  expect(cache.getOrPut('3', 3)).toBe(3);
  expect(cache.getOrPut('4', 4)).toBe(4);
  expect(cache.getOrPut('5', 5)).toBe(5); // evicts 0
  expect(cache.getOrPut('6', 6)).toBe(6); // evicts 1
  expect(cache.getOrPut('7', 7)).toBe(7); // evicts 2
  expect(cache.getOrPut('8', 8)).toBe(8); // evicts 3
  expect(cache.getOrPut('9', 9)).toBe(9); // evicts 4

  expect(cache.remove('0')).toBe(null);
  expect(cache.remove('1')).toBe(null);
  expect(cache.remove('2')).toBe(null);
  expect(cache.remove('3')).toBe(null);
  expect(cache.remove('4')).toBe(null);
  expect(cache.remove('5')).toBe(5);
  expect(cache.remove('6')).toBe(6);
  expect(cache.remove('7')).toBe(7);
  expect(cache.remove('8')).toBe(8);
  expect(cache.remove('9')).toBe(9);

  cache.invalidate();

  expect(cache.size()).toBe(0);
});