import * as XLSX from 'xlsx';
import { BASELINE_CALCULATION_DATA, CalculationData, ProductRow } from '../types/calculation';

/**
 * Export current application state to XLSX workbook.
 */
export function exportToXLSX(data: CalculationData, filename = 'calculation_export.xlsx') {
  const wb = XLSX.utils.book_new();

  // Construct sheet cells
  const rows: any[][] = [];

  // Title / Empty Header
  rows[0] = [];
  rows[1] = ['', 'PART A', '', '', '', '', 'PART B', '', '', ''];
  rows[2] = ['', 'QUALITY', 'QTY', 'RATE', 'AMOUNT', '', 'QUALITY', 'QTY', 'RATE', 'AMOUNT'];

  // Data rows
  const maxProducts = Math.max(data.partA.products.length, data.partB.products.length);
  let currentRow = 3;

  for (let i = 0; i < maxProducts; i++) {
    const pa = data.partA.products[i];
    const pb = data.partB.products[i];
    
    // Rows 4..
    const excelRow = currentRow + 1; // 1-indexed Excel row

    const paQuality = pa ? pa.quality : '';
    const paQty = pa && pa.qty !== null ? pa.qty : '';
    const paRate = pa && pa.rate !== null ? pa.rate : '';
    const paAmountFormula = pa ? { f: `C${excelRow}*D${excelRow}` } : '';

    const pbQuality = pb ? pb.quality : '';
    const pbQty = pb && pb.qty !== null ? pb.qty : '';
    const pbRate = pb && pb.rate !== null ? pb.rate : '';
    const pbAmountFormula = pb ? { f: `H${excelRow}*I${excelRow}` } : '';

    rows[currentRow] = [
      '',
      paQuality,
      paQty,
      paRate,
      paAmountFormula,
      '',
      pbQuality,
      pbQty,
      pbRate,
      pbAmountFormula
    ];
    currentRow++;
  }

  // Part A & B Product TOTAL
  const productStartRow = 4;
  const productEndRow = currentRow; // last product excel row
  const totalExcelRow = currentRow + 1;

  rows[currentRow] = [
    '',
    'TOTAL',
    { f: `SUM(C${productStartRow}:C${productEndRow})` },
    '',
    { f: `SUM(E${productStartRow}:E${productEndRow})` },
    '',
    'TOTAL',
    { f: `SUM(H${productStartRow}:H${productEndRow})` },
    '',
    { f: `SUM(J${productStartRow}:J${productEndRow})` }
  ];
  const paTotalRow = totalExcelRow;
  const pbTotalRow = totalExcelRow;
  currentRow++;

  // Empty separator row
  rows[currentRow] = [];
  currentRow++;

  // RECOVER section headers
  rows[currentRow] = ['', 'PART A RECOVER', '', '', '', '', 'PART B RECOVER', '', '', ''];
  currentRow++;
  rows[currentRow] = ['', 'QUALITY', 'QTY', 'RATE', 'AMOUNT', '', 'QUALITY', 'QTY', 'RATE', 'AMOUNT'];
  currentRow++;

  const recoverStartRow = currentRow + 1;
  const maxRecover = Math.max(data.partA.recovery.length, data.partB.recovery.length);

  for (let i = 0; i < maxRecover; i++) {
    const par = data.partA.recovery[i];
    const pbr = data.partB.recovery[i];
    const excelRow = currentRow + 1;

    const parQuality = par ? par.quality : '';
    const parQty = par && par.qty !== null ? par.qty : '';
    const parRate = par && par.rate !== null ? par.rate : '';
    const parAmountFormula = par ? { f: `C${excelRow}*D${excelRow}` } : '';

    const pbrQuality = pbr ? pbr.quality : '';
    const pbrQty = pbr && pbr.qty !== null ? pbr.qty : '';
    const pbrRate = pbr && pbr.rate !== null ? pbr.rate : '';
    const pbrAmountFormula = pbr ? { f: `H${excelRow}*I${excelRow}` } : '';

    rows[currentRow] = [
      '',
      parQuality,
      parQty,
      parRate,
      parAmountFormula,
      '',
      pbrQuality,
      pbrQty,
      pbrRate,
      pbrAmountFormula
    ];
    currentRow++;
  }

  const recoverEndRow = currentRow;
  const recoverTotalExcelRow = currentRow + 1;

  rows[currentRow] = [
    '',
    'TOTAL',
    { f: `SUM(C${recoverStartRow}:C${recoverEndRow})` },
    '',
    { f: `SUM(E${recoverStartRow}:E${recoverEndRow})` },
    '',
    'TOTAL',
    { f: `SUM(H${recoverStartRow}:H${recoverEndRow})` },
    '',
    { f: `SUM(J${recoverStartRow}:J${recoverEndRow})` }
  ];
  const paRecoverTotalRow = recoverTotalExcelRow;
  const pbRecoverTotalRow = recoverTotalExcelRow;
  currentRow++;

  // Empty row
  rows[currentRow] = [];
  currentRow++;

  // Column Headers for summary
  rows[currentRow] = ['', '', 'QTY.', 'RATE', '', '', '', 'QTY.', 'RATE', ''];
  currentRow++;

  // OUTPUT ROW
  const outputExcelRow = currentRow + 1;
  rows[currentRow] = [
    '',
    'OUT PUT',
    { f: `C${paTotalRow}-C${paRecoverTotalRow}` },
    { f: `E${paTotalRow}-E${paRecoverTotalRow}` },
    '',
    '',
    'OUT PUT',
    { f: `H${pbTotalRow}-H${pbRecoverTotalRow}` },
    { f: `J${pbTotalRow}-J${pbRecoverTotalRow}` },
    ''
  ];
  const paOutputRow = outputExcelRow;
  const pbOutputRow = outputExcelRow;
  currentRow++;

  // REAL OUTPUT ROW
  const realOutputExcelRow = currentRow + 1;
  rows[currentRow] = [
    '',
    'REAL OUT PUT',
    data.partA.realOutput !== null ? data.partA.realOutput : '',
    '',
    '',
    '',
    'REAL OUT PUT',
    data.partB.realOutput !== null ? data.partB.realOutput : '',
    '',
    ''
  ];
  const paRealOutputRow = realOutputExcelRow;
  const pbRealOutputRow = realOutputExcelRow;
  currentRow++;

  // LOSS ROW & NET RATE label
  const lossExcelRow = currentRow + 1;
  rows[currentRow] = [
    '',
    'LOSS',
    { f: `C${paOutputRow}-C${paRealOutputRow}` },
    '',
    'NET RATE',
    '',
    'LOSS',
    { f: `H${pbOutputRow}-H${pbRealOutputRow}` },
    '',
    ''
  ];
  currentRow++;

  // RATES & NET RATE FORMULA ROW
  const rateExcelRow = currentRow + 1;
  rows[currentRow] = [
    '',
    '',
    '',
    { f: `D${paOutputRow}/C${paRealOutputRow}` },
    { f: `(D${rateExcelRow}+I${rateExcelRow})/2` },
    '',
    '',
    '',
    { f: `I${pbOutputRow}/H${pbRealOutputRow}` },
    ''
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, filename);
}

/**
 * Parses uploaded XLSX file into CalculationData structure.
 */
export async function parseXLSX(file: File): Promise<CalculationData> {
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data);
  const wsName = wb.SheetNames[0];
  const ws = wb.Sheets[wsName];
  const json: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

  const partAProducts: ProductRow[] = [];
  const partBProducts: ProductRow[] = [];
  const partARecovery: ProductRow[] = [];
  const partBRecovery: ProductRow[] = [];
  let partARealOutput: number | null = 1426;
  let partBRealOutput: number | null = 1714.5;

  let mode: 'products' | 'recover' | 'summary' = 'products';

  for (let r = 3; r < json.length; r++) {
    const row = json[r] || [];
    const labelA = String(row[1] || '').trim().toUpperCase();
    const labelB = String(row[6] || '').trim().toUpperCase();

    if (labelA.includes('RECOVER') || labelB.includes('RECOVER')) {
      mode = 'recover';
      continue;
    }

    if (labelA === 'OUT PUT' || labelA === 'REAL OUT PUT' || labelA === 'LOSS') {
      mode = 'summary';
    }

    if (labelA === 'REAL OUT PUT') {
      if (row[2] !== undefined && row[2] !== '') partARealOutput = Number(row[2]);
    }
    if (labelB === 'REAL OUT PUT') {
      if (row[7] !== undefined && row[7] !== '') partBRealOutput = Number(row[7]);
    }

    if (labelA === 'QUALITY' || labelB === 'QUALITY' || labelA === 'TOTAL' || labelB === 'TOTAL') {
      continue;
    }

    if (mode === 'products') {
      if (row[1] !== undefined && row[1] !== '' && labelA !== 'TOTAL') {
        partAProducts.push({
          id: `pa-imp-${r}`,
          quality: String(row[1]).trim(),
          qty: row[2] !== undefined && row[2] !== '' ? Number(row[2]) : null,
          rate: row[3] !== undefined && row[3] !== '' ? Number(row[3]) : null,
        });
      }
      if (row[6] !== undefined && row[6] !== '' && labelB !== 'TOTAL') {
        partBProducts.push({
          id: `pb-imp-${r}`,
          quality: String(row[6]).trim(),
          qty: row[7] !== undefined && row[7] !== '' ? Number(row[7]) : null,
          rate: row[8] !== undefined && row[8] !== '' ? Number(row[8]) : null,
        });
      }
    } else if (mode === 'recover') {
      if (row[1] !== undefined && row[1] !== '' && labelA !== 'TOTAL') {
        partARecovery.push({
          id: `par-imp-${r}`,
          quality: String(row[1]).trim(),
          qty: row[2] !== undefined && row[2] !== '' ? Number(row[2]) : null,
          rate: row[3] !== undefined && row[3] !== '' ? Number(row[3]) : null,
        });
      }
      if (row[6] !== undefined && row[6] !== '' && labelB !== 'TOTAL') {
        partBRecovery.push({
          id: `pbr-imp-${r}`,
          quality: String(row[6]).trim(),
          qty: row[7] !== undefined && row[7] !== '' ? Number(row[7]) : null,
          rate: row[8] !== undefined && row[8] !== '' ? Number(row[8]) : null,
        });
      }
    }
  }

  return {
    title: file.name.replace(/\.[^/.]+$/, ''),
    partA: {
      products: partAProducts.length ? partAProducts : BASELINE_CALCULATION_DATA.partA.products,
      recovery: partARecovery.length ? partARecovery : BASELINE_CALCULATION_DATA.partA.recovery,
      realOutput: partARealOutput,
    },
    partB: {
      products: partBProducts.length ? partBProducts : BASELINE_CALCULATION_DATA.partB.products,
      recovery: partBRecovery.length ? partBRecovery : BASELINE_CALCULATION_DATA.partB.recovery,
      realOutput: partBRealOutput,
    },
  };
}
