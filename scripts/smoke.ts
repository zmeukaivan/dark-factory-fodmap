import { Food, searchFoods } from '../packages/core/src/index';

const foods: Food[] = [
  {
    id: 'banana',
    name: 'Banana',
    category: 'fruit',
    fodmapRating: 'low',
    highInFodmaps: [],
    source: 'monash',
  },
  {
    id: 'apple',
    name: 'Apple',
    category: 'fruit',
    fodmapRating: 'high',
    highInFodmaps: ['fructose', 'polyols'],
    source: 'monash',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    category: 'fruit',
    fodmapRating: 'low',
    highInFodmaps: [],
    source: 'nhs',
  },
];

const hits = searchFoods(foods, 'APPLE');
if (hits.length !== 1 || hits[0].id !== 'apple') {
  console.error(`SMOKE_FAIL: expected 1 case-insensitive 'apple' hit, got ${hits.length}`);
  process.exit(1);
}

console.log(`SMOKE_OK results=${hits.length}`);
