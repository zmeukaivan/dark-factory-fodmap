import { describe, expect, it } from 'vitest';
import { filterFoods, isLowFodmap, isHighFodmap } from './filter';
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

describe('filterFoods', () => {
  it('filters by rating only', () => {
    const foods = [
      food({ id: 'apple' }),
      food({ id: 'milk', name: 'Milk', category: 'dairy', fodmapRating: 'high' }),
    ];
    expect(filterFoods(foods, { rating: 'low' }).map((f) => f.id)).toEqual(['apple']);
  });

  it('filters by category only', () => {
    const foods = [
      food({ id: 'apple' }),
      food({ id: 'carrot', name: 'Carrot', category: 'vegetable', fodmapRating: 'high' }),
    ];
    expect(filterFoods(foods, { category: 'fruit' }).map((f) => f.id)).toEqual(['apple']);
  });

  it('filters by rating and category together', () => {
    const foods = [
      food({ id: 'apple' }),
      food({ id: 'grape', name: 'Grape', fodmapRating: 'high' }),
      food({ id: 'carrot', name: 'Carrot', category: 'vegetable' }),
    ];
    expect(filterFoods(foods, { rating: 'low', category: 'fruit' }).map((f) => f.id)).toEqual(['apple']);
  });

  it('returns the full list when no criteria are provided', () => {
    const foods = [
      food({ id: 'apple' }),
      food({ id: 'milk', name: 'Milk', category: 'dairy', fodmapRating: 'high' }),
    ];
    expect(filterFoods(foods, {})).toEqual(foods);
  });

  it('preserves input order', () => {
    const foods = [
      food({ id: 'apple' }),
      food({ id: 'pear', name: 'Pear' }),
      food({ id: 'grape', name: 'Grape', fodmapRating: 'high' }),
    ];
    expect(filterFoods(foods, { category: 'fruit' }).map((f) => f.id)).toEqual(['apple', 'pear', 'grape']);
  });

  it('does not mutate the input array', () => {
    const foods = [
      food({ id: 'apple' }),
      food({ id: 'milk', name: 'Milk', category: 'dairy', fodmapRating: 'high' }),
    ];
    const snapshot = [...foods];
    filterFoods(foods, { rating: 'low' });
    expect(foods).toEqual(snapshot);
  });
});

describe('isLowFodmap', () => {
  it('returns true for a low-FODMAP food', () => {
    expect(isLowFodmap(food())).toBe(true);
  });

  it('returns false for a high-FODMAP food', () => {
    expect(isLowFodmap(food({ fodmapRating: 'high' }))).toBe(false);
  });
});

describe('isHighFodmap', () => {
  it('returns true for a high-FODMAP food', () => {
    expect(isHighFodmap(food({ fodmapRating: 'high' }))).toBe(true);
  });

  it('returns false for a low-FODMAP food', () => {
    expect(isHighFodmap(food())).toBe(false);
  });
});