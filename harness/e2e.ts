import { InMemoryStore, Meal, Symptom } from '../packages/core/src/index';

let STEPS = 0;

function check(name: string, ok: boolean, detail = ''): boolean {
  STEPS += 1;
  if (ok) {
    console.log(`  ok    ${name}`);
    return true;
  }
  console.log(`  FAIL  ${name}  ${detail}`);
  return false;
}

async function main(): Promise<void> {
  const store = new InMemoryStore();

  const meal: Meal = {
    id: 'e2e-m1',
    date: '2026-08-16',
    type: 'dinner',
    name: 'grilled salmon plate',
    entries: [{ name: 'salmon', portion: '150g' }, { name: 'rice', portion: '1 cup' }],
  };
  const symptom: Symptom = { id: 'e2e-s1', date: '2026-08-16', type: 'bloating', severity: 3 };

  await store.saveMeal(meal);
  await store.saveSymptom(symptom);

  const day = await store.listDay('2026-08-16');

  if (!check('the logged meal appears in the day view',
    day.meals.length === 1 && day.meals[0].name === 'grilled salmon plate',
    `meals=${day.meals.length}`)) {
    process.exit(1);
  }
  if (!check('the logged symptom appears in the day view',
    day.symptoms.length === 1 && day.symptoms[0].type === 'bloating' && day.symptoms[0].severity === 3,
    `symptoms=${day.symptoms.length}`)) {
    process.exit(1);
  }
  if (!check('meal and symptom stay linked to the same day',
    day.meals.length === 1 && day.symptoms.length === 1,
    `meals=${day.meals.length} symptoms=${day.symptoms.length}`)) {
    process.exit(1);
  }

  const reused = await store.findMealByName('GRILLED SALMON PLATE');
  if (!check('a previously logged meal is reusable by name',
    reused !== undefined && reused.entries.length === 2,
    `reused=${reused?.entries.length ?? 'undefined'}`)) {
    process.exit(1);
  }

  console.log(`STEPS=${STEPS}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
