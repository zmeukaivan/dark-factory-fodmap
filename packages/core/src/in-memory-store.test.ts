import { describe, expect, it } from 'vitest';
import { InMemoryStore } from './in-memory-store';
import { COMMON_SYMPTOMS, isValidSeverity } from './symptom-catalog';
import { Meal, Symptom } from './types';

function meal(overrides: Partial<Meal> = {}): Meal {
  return {
    id: 'm1',
    date: '2026-08-16',
    type: 'lunch',
    name: 'salad',
    entries: [{ name: 'lettuce', portion: '1 cup' }],
    ...overrides,
  };
}

function symptom(overrides: Partial<Symptom> = {}): Symptom {
  return { id: 's1', date: '2026-08-16', type: 'bloating', severity: 3, ...overrides };
}

describe('InMemoryStore', () => {
  it('returns a saved meal and symptom for the same day', async () => {
    const store = new InMemoryStore();
    await store.saveMeal(meal());
    await store.saveSymptom(symptom());

    const day = await store.listDay('2026-08-16');

    expect(day.meals).toHaveLength(1);
    expect(day.meals[0].name).toBe('salad');
    expect(day.symptoms).toHaveLength(1);
    expect(day.symptoms[0].type).toBe('bloating');
  });

  it('keeps days separate', async () => {
    const store = new InMemoryStore();
    await store.saveMeal(meal({ date: '2026-08-16' }));
    await store.saveMeal(meal({ id: 'm2', date: '2026-08-17' }));

    expect((await store.listDay('2026-08-16')).meals).toHaveLength(1);
    expect((await store.listDay('2026-08-17')).meals).toHaveLength(1);
  });

  it('finds a previously logged meal by name (case-insensitive)', async () => {
    const store = new InMemoryStore();
    await store.saveMeal(meal({ name: 'Smoothie', entries: [{ name: 'banana' }] }));

    const found = await store.findMealByName('smoothie');

    expect(found).toBeDefined();
    expect(found?.entries).toHaveLength(1);
    expect(found?.entries[0].name).toBe('banana');
  });

  it('returns undefined when no meal matches the name', async () => {
    const store = new InMemoryStore();
    await store.saveMeal(meal({ name: 'salad' }));

    expect(await store.findMealByName('nonexistent')).toBeUndefined();
  });
});

describe('symptom catalog', () => {
  it('has common IBS symptoms', () => {
    expect(COMMON_SYMPTOMS).toContain('bloating');
    expect(COMMON_SYMPTOMS.length).toBeGreaterThanOrEqual(5);
  });

  it('validates severity in the 1-5 integer range', () => {
    expect(isValidSeverity(1)).toBe(true);
    expect(isValidSeverity(5)).toBe(true);
    expect(isValidSeverity(0)).toBe(false);
    expect(isValidSeverity(6)).toBe(false);
    expect(isValidSeverity(2.5)).toBe(false);
  });
});
