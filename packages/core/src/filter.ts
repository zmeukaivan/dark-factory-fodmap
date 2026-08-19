import { FodmapCategory, FodmapRating, Food } from './types';

export function filterFoods(
  foods: Food[],
  criteria: { rating?: FodmapRating; category?: FodmapCategory },
): Food[] {
  return foods.filter(
    (food) =>
      (criteria.rating === undefined || food.fodmapRating === criteria.rating) &&
      (criteria.category === undefined || food.category === criteria.category),
  );
}