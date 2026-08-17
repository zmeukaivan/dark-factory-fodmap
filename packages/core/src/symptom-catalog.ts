export const COMMON_SYMPTOMS: string[] = [
  'abdominal pain',
  'bloating',
  'constipation',
  'diarrhea',
  'gas',
  'nausea',
  'urgency',
  'incomplete evacuation',
];

export function isValidSeverity(severity: number): boolean {
  return Number.isInteger(severity) && severity >= 1 && severity <= 5;
}
