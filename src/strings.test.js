import {strings} from "./strings"

test('escape_characters_with_special_meaning_in_regexp', () => {
  expect(strings.escapeCharactersWithSpecialMeaningInRegExp(null)).toBe('');
  expect(strings.escapeCharactersWithSpecialMeaningInRegExp('')).toBe('');
  expect(strings.escapeCharactersWithSpecialMeaningInRegExp(123)).toBe('123');
  expect(strings.escapeCharactersWithSpecialMeaningInRegExp(1.23)).toBe(
      '1\\.23');
  expect(strings.escapeCharactersWithSpecialMeaningInRegExp(.123)).toBe(
      '0\\.123');
  expect(strings.escapeCharactersWithSpecialMeaningInRegExp(
      'Hello world! (i.e. "Bonjour monde!" en français)')).toBe(
      'Hello world! \\(i\\.e\\. "Bonjour monde!" en français\\)');
});

test('to_regexp', () => {
  expect(strings.toRegExp(null)).toStrictEqual(/(?:)/im);
  expect(strings.toRegExp('')).toStrictEqual(/(?:)/im);
  expect(strings.toRegExp(123)).toStrictEqual(/123/im);
  expect(strings.toRegExp(1.23)).toStrictEqual(/1\.23/im);
  expect(strings.toRegExp(.123)).toStrictEqual(/0\.123/im);
  expect(strings.toRegExp(
      'Hello world! (i.e. "Bonjour monde!" en français)')).toStrictEqual(
      /Hello(\s| )*world!(\s| )*\(i\.e\.(\s| )*"Bonjour(\s| )*monde!"(\s| )*en(\s| )*français\)/im);
});

test('remove_diacritics', () => {
  expect(strings.removeDiacritics(null)).toBe('');
  expect(strings.removeDiacritics('')).toBe('');
  expect(strings.removeDiacritics(123)).toBe('123');
  expect(strings.removeDiacritics(1.23)).toBe('1.23');
  expect(strings.removeDiacritics(.123)).toBe('0.123');
  expect(strings.removeDiacritics(
      'Dès lors les voyelles et consonne accompagnées d’un signe diacritique connues de la langue française sont : à - â - ä - é - è - ê - ë - î - ï - ô - ö - ù - û - ü - ÿ - ç.')).toBe(
      'Des lors les voyelles et consonne accompagnees d’un signe diacritique connues de la langue francaise sont : a - a - a - e - e - e - e - i - i - o - o - u - u - u - y - c.');
});

test('pad', () => {
  expect(strings.pad(null, 5)).toBe('00000');
  expect(strings.pad('', 5)).toBe('00000');
  expect(strings.pad('123', 5)).toBe('00123');
  expect(strings.pad(123, 5)).toBe('00123');
  expect(strings.pad(1.23, 5)).toBe('01.23');
  expect(strings.pad(.123, 5)).toBe('0.123');

});

test('unpad', () => {
  expect(strings.unpad('00123')).toBe('123');
});

test('is_numeric', () => {
  expect(strings.isNumeric(null)).toBe(false);
  expect(strings.isNumeric('')).toBe(false);
  expect(strings.isNumeric('00123')).toBe(true);
  expect(strings.isNumeric('123')).toBe(true);
  expect(strings.isNumeric('1.23')).toBe(true);
  expect(strings.isNumeric('.123')).toBe(true);
  expect(strings.isNumeric(123)).toBe(false);
  expect(strings.isNumeric(1.23)).toBe(false);
});