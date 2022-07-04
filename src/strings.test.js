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
  expect(strings.pad('123', 2)).toBe('123');
  expect(strings.pad(123, 5)).toBe('00123');
  expect(strings.pad(1.23, 5)).toBe('01.23');
  expect(strings.pad(.123, 5)).toBe('0.123');
});

test('unpad', () => {
  expect(strings.unpad('00123')).toBe('123');
  expect(strings.unpad('123')).toBe('123');
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

test('is_null_or_blank', () => {
  expect(strings.isNullOrBlank(null)).toBe(true);
  expect(strings.isNullOrBlank('')).toBe(true);
  expect(strings.isNullOrBlank('     ')).toBe(true);
  expect(strings.isNullOrBlank('\u00a0\u00a0\u00a0\u00a0\u00a0')).toBe(true);
  expect(strings.isNullOrBlank('Hello world!')).toBe(false);
  expect(strings.isNullOrBlank(123)).toBe(true);
  expect(strings.isNullOrBlank(1.23)).toBe(true);
  expect(strings.isNullOrBlank(.123)).toBe(true);
});

test('format_null_or_blank', () => {
  expect(strings.formatNullOrBlank(null, '-')).toBe('-');
  expect(strings.formatNullOrBlank('', '-')).toBe('-');
  expect(strings.formatNullOrBlank('     ', '-')).toBe('-');
  expect(strings.formatNullOrBlank('\u00a0\u00a0\u00a0\u00a0\u00a0', '-')).toBe(
      '-');
  expect(strings.formatNullOrBlank('Hello world!', '-')).toBe('Hello world!');
  expect(strings.formatNullOrBlank(123, '-')).toBe('123');
  expect(strings.formatNullOrBlank(1.23, '-')).toBe('1.23');
  expect(strings.formatNullOrBlank(.123, '-')).toBe('0.123');
});

test('is_masked', () => {
  expect(strings.isMasked(null)).toBe(false);
  expect(strings.isMasked('')).toBe(false);
  expect(strings.isMasked('MASKED_0123456789')).toBe(true);
  expect(strings.isMasked('masked_0123456789')).toBe(true);
  expect(strings.isMasked(123)).toBe(false);
  expect(strings.isMasked(1.23)).toBe(false);
  expect(strings.isMasked(.123)).toBe(false);
});

test('highlight', () => {

  expect(
      strings.highlight(null, [{pattern: "gmail", color: "#fffec8"}])).toEqual(
      {snippets: [], text: ""});
  expect(strings.highlight('', [{pattern: "gmail", color: "#fffec8"}])).toEqual(
      {snippets: [], text: ""});

  const text = 'Welcome to Yahoo!, the world’s most visited home page. Quickly find what you’re searching for, get in touch with friends and stay in-the-know with the latest news and information. CloudSponge provides an interface to easily enable your users to import contacts from a variety of the most popular webmail services including Yahoo, Gmail and Hotmail/MSN as well as popular desktop address books such as Mac Address Book and Outlook.';
  const textHighlighted = 'Welcome to Yahoo!, the world’s most visited home page. Quickly find what you’re searching for, get in touch with friends and stay in-the-know with the latest news and information. CloudSponge provides an interface to easily enable your users to import contacts from a variety of the most popular webmail services including Yahoo, <mark style="border-radius:3px;background:#fffec8">Gmail</mark> and Hotmail/MSN as well as popular desktop address books such as Mac Address Book and Outlook.';
  const snippet = {
    highlighted: '<mark style="border-radius:3px;background:#fffec8">Gmail</mark> and Hotmail/MSN as well as popular desktop address books such as Mac Address Book and Outlook.',
    match: "Gmail",
    page: 1,
    raw: "he most popular webmail services including Yahoo, Gmail and Hotmail/MSN as well as popular desktop address books such as Mac Address Book and Outlook."
  };

  expect(
      strings.highlight(text, [{pattern: "gmail", color: "#fffec8"}])).toEqual({
    snippets: [snippet], text: textHighlighted
  });
})