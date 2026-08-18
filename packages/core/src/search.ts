import { Food } from './types';

export function searchFoods(foods: Food[], query: string): Food[] {
  const q = query.trim().toLowerCase();
  const prefix: Food[] = [];
  const substring: Food[] = [];
  for (const food of foods) {
    const name = food.name.trim().toLowerCase();
    if (name.startsWith(q)) {
      prefix.push(food);
    } else if (name.includes(q)) {
      substring.push(food);
    }
  }
  return [...prefix, ...substring];
}