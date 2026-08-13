export interface ProductRow {
  id: string;
  quality: string;
  qty: number | null;
  rate: number | null;
}

export interface PartState {
  products: ProductRow[];
  recovery: ProductRow[];
  realOutput: number | null;
}

export interface CalculationData {
  id?: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  partA: PartState;
  partB: PartState;
}

export interface SinglePartResult {
  productAmounts: number[];
  totalQty: number;
  totalAmount: number;
  recoveryAmounts: number[];
  recoverTotalQty: number;
  recoverTotalAmount: number;
  outputQty: number;
  outputAmount: number;
  realOutput: number;
  loss: number;
  rate: number;
}

export interface CalculationResult {
  partA: SinglePartResult;
  partB: SinglePartResult;
  netRate: number;
}

export const BASELINE_CALCULATION_DATA: CalculationData = {
  title: 'Calc Studio',
  partA: {
    products: [
      { id: 'pa-1', quality: 'WATER', qty: 1000, rate: null },
      { id: 'pa-2', quality: 'CAUSTIC SODA', qty: 150, rate: 53 },
      { id: 'pa-3', quality: 'BISPHINOL A', qty: 600, rate: 160 },
      { id: 'pa-4', quality: 'TOLLUNE', qty: 520, rate: 108 },
      { id: 'pa-5', quality: 'ECH', qty: 360, rate: 195 },
      { id: 'pa-6', quality: 'ACITIC ACIDE', qty: 15, rate: 75 },
      { id: 'pa-7', quality: 'PAINT PASS', qty: 500, rate: 62 },
      { id: 'pa-8', quality: 'OPA', qty: 22.5, rate: 180 },
      { id: 'pa-9', quality: 'NBA', qty: 66, rate: 150 },
    ],
    recovery: [
      { id: 'par-1', quality: 'WATER', qty: 1378.65, rate: null },
      { id: 'par-2', quality: 'TOLLUNE', qty: 350.85, rate: 108 },
    ],
    realOutput: 1426,
  },
  partB: {
    products: [
      { id: 'pb-1', quality: 'NBA', qty: 1000, rate: 150 },
      { id: 'pb-2', quality: 'PARAFORMATE', qty: 400, rate: 110 },
      { id: 'pb-3', quality: 'MELAMINE', qty: 230, rate: 200 },
      { id: 'pb-4', quality: 'URIYA', qty: 120, rate: 65 },
      { id: 'pb-5', quality: 'ACITIC ACIDE', qty: 2, rate: 75 },
      { id: 'pb-6', quality: 'CAUSTIC SODA', qty: 1, rate: 53 },
      { id: 'pb-7', quality: 'PATHELIC', qty: 1.5, rate: 185 },
      { id: 'pb-8', quality: 'MIX XYLENE', qty: 44, rate: 108 },
      { id: 'pb-9', quality: 'PAINT PASS', qty: 407, rate: 62 },
    ],
    recovery: [
      { id: 'pbr-1', quality: 'WATER', qty: 66.1, rate: null },
      { id: 'pbr-2', quality: 'NBA', qty: 392.5, rate: 150 },
    ],
    realOutput: 1714.5,
  },
};
