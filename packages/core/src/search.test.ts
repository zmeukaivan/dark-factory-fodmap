import { describe, expect, it } from 'vitest';
import { searchFoods } from './search';
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

describe('searchFoods', () => {
  it('matches names case-insensitively', () => {
    expect(searchFoods([food()], 'APPLE')).toHaveLength(1);
    expect(searchFoods([food({ name: 'apple' })], 'Apple')).toHaveLength(1);
  });

  it('ranks prefix matches before substring matches', () => {
    const result = searchFoods([food({ id: 'pineapple', name: 'Pineapple' }), food()], 'apple');
    expect(result.map((f) => f.id)).toEqual(['apple', 'pineapple']);
  });

  it('preserves input order within the prefix rank', () => {
    const result = searchFoods(
      [food({ id: 'apple2', name: 'Apple Pie' }), food()],
      'apple',
    );
    expect(result.map((f) => f.id)).toEqual(['apple2', 'apple']);
  });

  it('matches substrings that are not prefixes', () => {
    const result = searchFoods(
      [
        food({ id: 'strawberry', name: 'Strawberry' }),
        food({ id: 'blueberry', name: 'Blueberry' }),
        food(),
      ],
      'berry',
    );
    expect(result.map((f) => f.id)).toEqual(['strawberry', 'blueberry']);
  });

  it('trims whitespace from the query and the name', () => {
    expect(searchFoods([food({ name: '  Apple  ' })], '  apple  ')).toHaveLength(1);
  });

  it('returns an empty array when nothing matches', () => {
    expect(searchFoods([food()], 'zzz')).toEqual([]);
  });

  it('returns all foods in original order for an empty query', () => {
    const foods = [food({ id: 'b', name: 'Banana' }), food()];
    expect(searchFoods(foods, '')).toEqual(foods);
  });

  it('treats a whitespace-only query as empty', () => {
    const foods = [food({ id: 'b', name: 'Banana' }), food()];
    expect(searchFoods(foods, '   ')).toEqual(foods);
  });
});