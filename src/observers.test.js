import {observers} from "./observers";

test('subject', () => {

  const subject = new observers.Subject();

  const sumMessage = 'sum';
  const sumCallback = (a, b) => {
    expect(a).toBe(1);
    expect(b).toBe(2);
  };
  subject.register(sumMessage, sumCallback);

  expect(subject.numberOfObservers(sumMessage)).toBe(1);
  expect(subject.numberOfObservers()).toBe(1);

  const mulMessage = 'mul';
  const mulCallback = (a, b) => {
    expect(a).toBe(1);
    expect(b).toBe(2);
  };
  subject.register(mulMessage, mulCallback);

  expect(subject.numberOfObservers(sumMessage)).toBe(1);
  expect(subject.numberOfObservers(mulMessage)).toBe(1);
  expect(subject.numberOfObservers()).toBe(2);

  subject.notify(sumMessage, 1, 2);
  subject.notify(mulMessage, 1, 2);

  subject.unregister(sumMessage, sumCallback);
  subject.unregister(mulMessage, mulCallback);

  expect(subject.numberOfObservers(sumMessage)).toBe(0);
  expect(subject.numberOfObservers(mulMessage)).toBe(0);
  expect(subject.numberOfObservers()).toBe(0);
});