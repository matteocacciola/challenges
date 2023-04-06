import {describe, expect, it} from 'vitest';
import {pizzaRewards, PizzaRewardsInput} from '../pizza-rewards';

const setsEqual = <T>(s1: Set<T>, s2: Set<T>): boolean => {
  return arraysEqual(Array.from(s1.keys()).sort(), Array.from(s2.keys()).sort());
};

const arraysEqual = <T>(a1: T[], a2: T[]): boolean => {
  return a1.length == a2.length && !a1.find((v1, index) => v1 !== a2[index]);
};

const cases = [
  [{
    minOrders: 5,
    minPrice: 20,
    customers: {
      'John Doe': [22, 30, 11, 17, 15, 52, 27, 12],
      'Jane Doe': [5, 17, 30, 33, 40, 22, 26, 10, 11, 45],
    }
  } as PizzaRewardsInput, new Set<string>(['Jane Doe'])],
  [{
    minOrders: 2,
    minPrice: 50,
    customers: {
      'Joey Bonzo': [22, 67, 53, 29],
      'Jennifer Bonzo': [51, 19],
    },
  } as PizzaRewardsInput, new Set<string>(['Joey Bonzo'])],
  [{
    minOrders: 3,
    minPrice: 15,
    customers: {
      'Natsumi Sakamoto': [15, 15, 14],
      'Gorou Hironaka': [15, 15, 15],
      'Shinju Tanabe': [120, 240],
    },
  } as PizzaRewardsInput, new Set<string>(['Gorou Hironaka'])],
  [{
    minOrders: 0,
    minPrice: 1000,
    customers: {
      Bob: [15, 15, 14],
      Sally: [15, 15, 15],
      George: [120, 240],
    },
  }, new Set(['Bob', 'Sally', 'George'])],
  [{
    minOrders: 1,
    minPrice: 1000,
    customers: {
      Bob: [15, 15, 14],
      Sally: [15, 15, 15],
      George: [120, 240],
    },
  }, new Set<string>()]
];

describe('pizza rewards', () => {
  it.each(cases)('test with %p produces %p', (input, rewarded) => {
    const result = setsEqual(pizzaRewards(input as PizzaRewardsInput), rewarded as Set<string>);
    expect(result).toBeTruthy();
  });
});
