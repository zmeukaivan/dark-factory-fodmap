import { FodmapCategory, Food } from './types';

export function countFoodsByCategory(foods: Food[]): Record<FodmapCategory, number> {
  const counts = {} as Record<FodmapCategory, number>;
  for (const food of foods) {
    counts[food.category] = (counts[food.category] ?? 0) + 1;
  }
  return counts;
}
