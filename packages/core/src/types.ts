export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealEntry {
  name: string;
  ingredients?: string[];
  portion?: string;
}

export interface Meal {
  id: string;
  date: string;
  type: MealType;
  name: string;
  entries: MealEntry[];
}

export interface Symptom {
  id: string;
  date: string;
  type: string;
  severity: number;
  note?: string;
}

export interface DayView {
  date: string;
  meals: Meal[];
  symptoms: Symptom[];
}

export interface Store {
  saveMeal(meal: Meal): Promise<void>;
  saveSymptom(symptom: Symptom): Promise<void>;
  listDay(date: string): Promise<DayView>;
  findMealByName(name: string): Promise<Meal | undefined>;
}

export type FodmapRating = 'low' | 'high';

export type FodmapCategory =
  | 'fruit'
  | 'vegetable'
  | 'grains-cereals'
  | 'legumes-pulses'
  | 'dairy'
  | 'meat-poultry-fish'
  | 'nuts-seeds'
  | 'sugars-sweeteners'
  | 'condiments-sauces'
  | 'drinks';

export type FodmapType = 'fructans' | 'gos' | 'lactose' | 'fructose' | 'polyols';

export type DataSource = 'monash' | 'nhs';

export interface Portion {
  amount?: number;
  unit?: string;
  description: string;
}

export interface Food {
  id: string;
  name: string;
  category: FodmapCategory;
  fodmapRating: FodmapRating;
  safePortion?: Portion;
  highInFodmaps: FodmapType[];
  source: DataSource;
  notes?: string;
}
