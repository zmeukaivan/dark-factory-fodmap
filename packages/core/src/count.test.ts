import { describe, expect, it } from 'vitest';
import { countFoodsByCategory } from './count';
import { Food } from './types';

function food(overrides: Partial<Food> = {}): Food {
  return {
    id: 'apple',
    name: 'Apple',
    category: 'fruit',
    fodmapRating: 'low',
    safePortion: { amount: 1, unit: 'medium', description: '1 medium apple' },
    highInFodmaps: [],
    source: 'monash',
    ...overrides,
  };
}

describe('countFoodsByCategory', () => {
  it('counts foods across mixed categories', () => {
    const foods = [
      food({ id: 'apple' }),
      food({ id: 'pear', name: 'Pear' }),
      food({ id: 'milk', name: 'Milk', category: 'dairy', fodmapRating: 'high' }),
      food({ id: 'carrot', name: 'Carrot', category: 'vegetable', fodmapRating: 'high' }),
    ];
    expect(countFoodsByCategory(foods)).toEqual({ fruit: 2, dairy: 1, vegetable: 1 });
  });

  it('returns a single category with its count', () => {
    const foods = [
      food({ id: 'apple' }),
      food({ id: 'pear', name: 'Pear' }),
    ];
    expect(countFoodsByCategory(foods)).toEqual({ fruit: 2 });
  });

  it('counts duplicate foods in one category individually', () => {
    const same = food({ id: 'apple' });
    expect(countFoodsByCategory([same, same, same])).toEqual({ fruit: 3 });
  });

  it('returns an empty record for empty input', () => {
    expect(countFoodsByCategory([])).toEqual({});
  });

  it('does not mutate the input array', () => {
    const foods = [
      food({ id: 'apple' }),
      food({ id: 'milk', name: 'Milk', category: 'dairy', fodmapRating: 'high' }),
    ];
    const snapshot = [...foods];
    countFoodsByCategory(foods);
    expect(foods).toEqual(snapshot);
  });
});
