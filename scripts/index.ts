type Add = (a: number, b: number) => number;
export const add: Add = (a, b) => a + b;

type CallWith = <T>(
  value1: T
) => <R, U>(value2: R, fn: (val1: T, val2: R) => U) => U;

export const callWith: CallWith = (value1) => (value2, fn) =>
  fn(value1, value2);

type Constant = <T>(a: T) => () => T;
export const constant: Constant = (a) => () => a;

export const filter = <T>(array: T[], predicate: (arg: T) => boolean) => {
  const result: T[] = [];

  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (predicate(element)) {
      result.push(element);
    }
  }

  return result;
};

export const find = <T>(array: T[], predicate: (arg: T) => boolean) => {
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (predicate(element)) {
      return element;
    }
  }

  return null;
};

