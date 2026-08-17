import { DayView, Meal, Store, Symptom } from './types';

export class InMemoryStore implements Store {
  private meals = new Map<string, Meal[]>();
  private symptoms = new Map<string, Symptom[]>();

  public async saveMeal(meal: Meal): Promise<void> {
    const list = this.meals.get(meal.date) ?? [];
    this.meals.set(meal.date, [...list, meal]);
  }

  public async saveSymptom(symptom: Symptom): Promise<void> {
    const list = this.symptoms.get(symptom.date) ?? [];
    this.symptoms.set(symptom.date, [...list, symptom]);
  }

  public async listDay(date: string): Promise<DayView> {
    return {
      date,
      meals: this.meals.get(date) ?? [],
      symptoms: this.symptoms.get(date) ?? [],
    };
  }

  public async findMealByName(name: string): Promise<Meal | undefined> {
    const all = [...this.meals.values()].flat();
    const normalized = name.trim().toLowerCase();
    const matches = all.filter((m) => m.name.trim().toLowerCase() === normalized);
    return matches[matches.length - 1];
  }
}
