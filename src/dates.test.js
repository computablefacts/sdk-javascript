import {dates} from "./dates"

test('convert_null_as_yyyymmdd_to_date', () => {
  expect(dates.yyyyMmDdToDate(null)).toBe(null);
});

test('convert_empty_string_as_yyyymmdd_to_date', () => {
  expect(dates.yyyyMmDdToDate('')).toBe(null);
});

test('convert_string_as_yyyymmdd_to_date', () => {
  expect(dates.yyyyMmDdToDate('20220704')).toStrictEqual(
      new Date('2022-07-03T22:00:00.000Z'));
});

test('convert_null_as_ddmmyyyy_to_date', () => {
  expect(dates.ddMmYyyyToDate(null)).toBe(null);
});

test('convert_empty_string_as_ddmmyyyy_to_date', () => {
  expect(dates.ddMmYyyyToDate('')).toBe(null);
});

test('convert_string_as_ddmmyyyy_to_date', () => {
  expect(dates.ddMmYyyyToDate('04072022')).toStrictEqual(
      new Date('2022-07-03T22:00:00.000Z'));
});

test('convert_null_as_date_to_yyyymmdd', () => {
  expect(dates.dateToYyyyMmDd(null)).toBe(null);
});

test('convert_empty_string_as_date_to_yyyymmdd', () => {
  expect(dates.dateToYyyyMmDd('')).toBe(null);
});

test('convert_date_to_yyyymmdd', () => {
  expect(dates.dateToYyyyMmDd(new Date('2022-07-03T22:00:00.000Z'))).toBe(
      '2022-07-04');
});

test('convert_date_to_yyyymmdd_with_user_defined_separator', () => {
  expect(dates.dateToYyyyMmDd(new Date('2022-07-03T22:00:00.000Z'), '')).toBe(
      '20220704');
});

test('convert_null_as_date_to_ddmmyyyy', () => {
  expect(dates.dateToDdMmYyyy(null)).toBe(null);
});

test('convert_empty_string_as_date_to_ddmmyyyy', () => {
  expect(dates.dateToDdMmYyyy('')).toBe(null);
});

test('convert_date_to_ddmmyyyy', () => {
  expect(dates.dateToDdMmYyyy(new Date('2022-07-03T22:00:00.000Z'))).toBe(
      '04-07-2022');
});

test('convert_date_to_ddmmyyyy_with_user_defined_separator', () => {
  expect(dates.dateToDdMmYyyy(new Date('2022-07-03T22:00:00.000Z'), '')).toBe(
      '04072022');
});
