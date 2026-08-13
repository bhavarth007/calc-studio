import { BASELINE_CALCULATION_DATA, CalculationData } from '../types/calculation';

const STORAGE_KEY = 'xlsx_calc_app_records_v1';
const CURRENT_ACTIVE_KEY = 'xlsx_calc_app_current_v1';

export function loadCurrentCalculation(): CalculationData {
  try {
    const raw = localStorage.getItem(CURRENT_ACTIVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.partA && parsed.partB) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load current calculation state:', err);
  }
  return BASELINE_CALCULATION_DATA;
}

export function saveCurrentCalculation(data: CalculationData): void {
  try {
    const updated = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CURRENT_ACTIVE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save current calculation:', err);
  }
}

export function listSavedCalculations(): CalculationData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to list saved calculations:', err);
  }
  return [];
}

export function saveCalculationRecord(data: CalculationData): CalculationData[] {
  const records = listSavedCalculations();
  const recordToSave: CalculationData = {
    ...data,
    id: data.id || `calc-${Date.now()}`,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const existingIdx = records.findIndex((r) => r.id === recordToSave.id);
  if (existingIdx >= 0) {
    records[existingIdx] = recordToSave;
  } else {
    records.unshift(recordToSave);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  saveCurrentCalculation(recordToSave);
  return records;
}

export function deleteCalculationRecord(id: string): CalculationData[] {
  let records = listSavedCalculations();
  records = records.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  return records;
}
