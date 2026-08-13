import { describe, it, expect } from 'vitest';
import { calculateAll, calculatePart, calculateRowAmount } from './calculator';
import { BASELINE_CALCULATION_DATA, CalculationData } from '../types/calculation';

describe('Calculator Engine', () => {
  it('calculates row amounts correctly', () => {
    expect(calculateRowAmount(100, 50)).toBe(5000);
    expect(calculateRowAmount(1000, null)).toBe(0);
    expect(calculateRowAmount(null, 50)).toBe(0);
    expect(calculateRowAmount(0, 50)).toBe(0);
  });

  it('matches original source.xlsx baseline calculations exactly', () => {
    const result = calculateAll(BASELINE_CALCULATION_DATA);

    // Part A
    expect(result.partA.totalQty).toBeCloseTo(3233.5, 4);
    expect(result.partA.totalAmount).toBeCloseTo(276385, 4);
    expect(result.partA.recoverTotalQty).toBeCloseTo(1729.5, 4);
    expect(result.partA.recoverTotalAmount).toBeCloseTo(37891.8, 4);
    expect(result.partA.outputQty).toBeCloseTo(1504, 4);
    expect(result.partA.outputAmount).toBeCloseTo(238493.2, 4);
    expect(result.partA.realOutput).toBeCloseTo(1426, 4);
    expect(result.partA.loss).toBeCloseTo(78, 4);
    expect(result.partA.rate).toBeCloseTo(167.24628330995793, 4);

    // Part B
    expect(result.partB.totalQty).toBeCloseTo(2205.5, 4);
    expect(result.partB.totalAmount).toBeCloseTo(278266.5, 4);
    expect(result.partB.recoverTotalQty).toBeCloseTo(458.6, 4);
    expect(result.partB.recoverTotalAmount).toBeCloseTo(58875, 4);
    expect(result.partB.outputQty).toBeCloseTo(1746.9, 4);
    expect(result.partB.outputAmount).toBeCloseTo(219391.5, 4);
    expect(result.partB.realOutput).toBeCloseTo(1714.5, 4);
    expect(result.partB.loss).toBeCloseTo(32.4, 4);
    expect(result.partB.rate).toBeCloseTo(127.96237970253718, 4);

    // Final Net Rate formula: (D25 + I25) / 2
    expect(result.netRate).toBeCloseTo(147.60433150624755, 4);
  });

  it('automatically updates calculations when new dynamic product row is added', () => {
    const updatedData: CalculationData = JSON.parse(JSON.stringify(BASELINE_CALCULATION_DATA));
    
    // Add a new dynamic product to Part A
    updatedData.partA.products.push({
      id: 'pa-new',
      quality: 'NEW PRODUCT X',
      qty: 100,
      rate: 200,
    }); // amount = 20000

    const result = calculateAll(updatedData);

    expect(result.partA.totalQty).toBeCloseTo(3333.5, 4);
    expect(result.partA.totalAmount).toBeCloseTo(296385, 4);
    expect(result.partA.outputQty).toBeCloseTo(1604, 4);
    expect(result.partA.outputAmount).toBeCloseTo(258493.2, 4);
    expect(result.partA.loss).toBeCloseTo(178, 4);
    expect(result.partA.rate).toBeCloseTo(258493.2 / 1426, 4);
  });

  it('automatically updates calculations when row is deleted', () => {
    const updatedData: CalculationData = JSON.parse(JSON.stringify(BASELINE_CALCULATION_DATA));
    
    // Remove CAUSTIC SODA (150, 53 => 7950) from Part A
    updatedData.partA.products = updatedData.partA.products.filter(p => p.quality !== 'CAUSTIC SODA');

    const result = calculateAll(updatedData);

    expect(result.partA.totalQty).toBeCloseTo(3083.5, 4);
    expect(result.partA.totalAmount).toBeCloseTo(268435, 4);
  });

  it('safely handles zero Real Output without crashing', () => {
    const updatedData: CalculationData = JSON.parse(JSON.stringify(BASELINE_CALCULATION_DATA));
    updatedData.partA.realOutput = 0;

    const result = calculateAll(updatedData);
    expect(result.partA.rate).toBe(0);
    expect(result.netRate).toBeCloseTo(result.partB.rate / 2, 4);
  });
});
