import {dates} from "./dates"

test('yyyymmdd_to_date', () => {
  expect(dates.yyyyMmDdToDate(null)).toBe(null);
  expect(dates.yyyyMmDdToDate('')).toBe(null);
  expect(dates.yyyyMmDdToDate(123)).toBe(null);
  expect(dates.yyyyMmDdToDate(1.23)).toBe(null);
  expect(dates.yyyyMmDdToDate(.123)).toBe(null);
  expect(dates.yyyyMmDdToDate('20220704')).toStrictEqual(new Date('2022-07-03T22:00:00.000Z'));
});

test('ddmmyyyy_to_date', () => {
  expect(dates.ddMmYyyyToDate(null)).toBe(null);
  expect(dates.ddMmYyyyToDate('')).toBe(null);
  expect(dates.ddMmYyyyToDate(123)).toBe(null);
  expect(dates.ddMmYyyyToDate(1.23)).toBe(null);
  expect(dates.ddMmYyyyToDate(.123)).toBe(null);
  expect(dates.ddMmYyyyToDate('04072022')).toStrictEqual(new Date('2022-07-03T22:00:00.000Z'));
});

test('date_to_yyyymmdd', () => {
  expect(dates.dateToYyyyMmDd(null)).toBe(null);
  expect(dates.dateToYyyyMmDd('')).toBe(null);
  expect(dates.dateToYyyyMmDd(123)).toBe(null);
  expect(dates.dateToYyyyMmDd(1.23)).toBe(null);
  expect(dates.dateToYyyyMmDd(.123)).toBe(null);
  expect(dates.dateToYyyyMmDd(new Date('2022-07-03T22:00:00.000Z'))).toBe('2022-07-04');
  expect(dates.dateToYyyyMmDd(new Date('2022-07-03T22:00:00.000Z'), '')).toBe('20220704');
});

test('date_to_ddmmyyyy', () => {
  expect(dates.dateToDdMmYyyy(null)).toBe(null);
  expect(dates.dateToDdMmYyyy('')).toBe(null);
  expect(dates.dateToDdMmYyyy(123)).toBe(null);
  expect(dates.dateToDdMmYyyy(1.23)).toBe(null);
  expect(dates.dateToDdMmYyyy(.123)).toBe(null);
  expect(dates.dateToDdMmYyyy(new Date('2022-07-03T22:00:00.000Z'))).toBe('04-07-2022');
  expect(dates.dateToDdMmYyyy(new Date('2022-07-03T22:00:00.000Z'), '')).toBe('04072022');
});

