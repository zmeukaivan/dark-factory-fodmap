import { InMemoryStore } from '../../packages/core/src/index';

let scenarios = 0;
let assertions = 0;
let failures = 0;

function expect(name: string, ok: boolean, detail = ''): void {
  assertions += 1;
  if (!ok) {
    failures += 1;
    console.log(`  HOLDOUT_FAIL  ${name}: ${detail}`);
  }
}

async function scenario_interleaved_days_stay_linked(): Promise<void> {
  scenarios += 1;
  const store = new InMemoryStore();

  await store.saveMeal({
    id: 'holdout-a-m1', date: '2026-08-11', type: 'dinner',
    name: 'holdout-zephyr-dinner', entries: [{ name: 'quinoa', portion: 'half cup' }],
  });
  await store.saveSymptom({ id: 'holdout-a-s1', date: '2026-08-11', type: 'abdominal pain', severity: 4 });

  await store.saveMeal({
    id: 'holdout-b-m1', date: '2026-08-12', type: 'lunch',
    name: 'holdout-yarrow-lunch', entries: [{ name: 'tofu', portion: '100g' }],
  });
  await store.saveSymptom({ id: 'holdout-b-s1', date: '2026-08-12', type: 'gas', severity: 2 });

  const dayA = await store.listDay('2026-08-11');
  const dayB = await store.listDay('2026-08-12');

  expect('day A has exactly its own meal', dayA.meals.length === 1 && dayA.meals[0].name === 'holdout-zephyr-dinner', `got ${dayA.meals.length}`);
  expect('day A has exactly its own symptom', dayA.symptoms.length === 1 && dayA.symptoms[0].type === 'abdominal pain', `got ${dayA.symptoms.length}`);
  expect('day B stays separate', dayB.meals.length === 1 && dayB.symptoms.length === 1 && dayB.meals[0].name === 'holdout-yarrow-lunch', `meals=${dayB.meals.length} symptoms=${dayB.symptoms.length}`);
  expect('the day-A meal and symptom remain linked after interleaving', dayA.meals.length === 1 && dayA.symptoms.length === 1, 'link broken');
}

async function scenario_reuse_returns_most_recent(): Promise<void> {
  scenarios += 1;
  const store = new InMemoryStore();

  await store.saveMeal({
    id: 'holdout-r1', date: '2026-08-13', type: 'breakfast',
    name: 'holdout-recurring-bowl', entries: [{ name: 'oats' }],
  });
  await store.saveMeal({
    id: 'holdout-r2', date: '2026-08-14', type: 'breakfast',
    name: 'holdout-recurring-bowl', entries: [{ name: 'oats' }, { name: 'blueberries' }],
  });

  const reused = await store.findMealByName('holdout-recurring-bowl');

  expect('reuse returns the most recently logged ingredients', reused !== undefined && reused.entries.length === 2, `entries=${reused?.entries.length ?? 'undefined'}`);
}

async function main(): Promise<void> {
  await scenario_interleaved_days_stay_linked();
  await scenario_reuse_returns_most_recent();

  if (failures > 0) {
    console.log(`HOLDOUT_FAILED scenarios=${scenarios} assertions=${assertions} failures=${failures}`);
    process.exit(1);
  }
  console.log(`HOLDOUT_PASSED scenarios=${scenarios} assertions=${assertions}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
