import { CalculationData, CalculationResult, PartState, ProductRow, SinglePartResult } from '../types/calculation';

/**
 * Calculates row AMOUNT = QTY * RATE.
 * Safely handles null, undefined, or NaN by returning 0.
 */
export function calculateRowAmount(qty: number | null | undefined, rate: number | null | undefined): number {
  if (qty === null || qty === undefined || isNaN(qty)) return 0;
  if (rate === null || rate === undefined || isNaN(rate)) return 0;
  return qty * rate;
}

/**
 * Evaluates calculations for a single part (Part A or Part B).
 */
export function calculatePart(partState: PartState): SinglePartResult {
  const products = partState.products || [];
  const recovery = partState.recovery || [];

  const productAmounts = products.map((p) => calculateRowAmount(p.qty, p.rate));
  const totalQty = products.reduce((sum, p) => sum + (Number(p.qty) || 0), 0);
  const totalAmount = productAmounts.reduce((sum, amt) => sum + amt, 0);

  const recoveryAmounts = recovery.map((r) => calculateRowAmount(r.qty, r.rate));
  const recoverTotalQty = recovery.reduce((sum, r) => sum + (Number(r.qty) || 0), 0);
  const recoverTotalAmount = recoveryAmounts.reduce((sum, amt) => sum + amt, 0);

  const outputQty = totalQty - recoverTotalQty;
  const outputAmount = totalAmount - recoverTotalAmount;

  const realOutput = Number(partState.realOutput) || 0;
  const loss = outputQty - realOutput;

  // Safely avoid division by zero
  const rate = realOutput !== 0 ? outputAmount / realOutput : 0;

  return {
    productAmounts,
    totalQty,
    totalAmount,
    recoveryAmounts,
    recoverTotalQty,
    recoverTotalAmount,
    outputQty,
    outputAmount,
    realOutput,
    loss,
    rate,
  };
}

/**
 * Calculates complete results for Part A, Part B, and Final Net Rate.
 */
export function calculateAll(data: CalculationData): CalculationResult {
  const partA = calculatePart(data.partA);
  const partB = calculatePart(data.partB);
  const netRate = (partA.rate + partB.rate) / 2;

  return {
    partA,
    partB,
    netRate,
  };
}
