import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculationData, CalculationResult } from '../types/calculation';

export function exportToPDF(data: CalculationData, result: CalculationResult) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor: [number, number, number] = [15, 23, 42]; // Slate 900
  const accentColor: [number, number, number] = [37, 99, 235]; // Royal Blue
  const tableHeaderBg: [number, number, number] = [241, 245, 249]; // Slate 100

  // Title & Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 20, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(data.title || 'PRODUCTION CALCULATION REPORT', 14, 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 130, 13);

  let currentY = 26;

  // Function to build side-by-side or stacked product tables
  const buildProductRows = (products: typeof data.partA.products, amounts: number[]) => {
    return products.map((p, i) => [
      p.quality || '-',
      p.qty !== null ? p.qty.toString() : '-',
      p.rate !== null ? p.rate.toString() : '-',
      amounts[i] ? amounts[i].toFixed(2) : '0.00',
    ]);
  };

  // Section 1: PART A
  doc.setTextColor(...accentColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PART A PRODUCTS', 14, currentY);

  doc.text('PART B PRODUCTS', 110, currentY);

  currentY += 3;

  const partARows = buildProductRows(data.partA.products, result.partA.productAmounts);
  partARows.push(['TOTAL', result.partA.totalQty.toString(), '', result.partA.totalAmount.toFixed(2)]);

  const partBRows = buildProductRows(data.partB.products, result.partB.productAmounts);
  partBRows.push(['TOTAL', result.partB.totalQty.toString(), '', result.partB.totalAmount.toFixed(2)]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: 14, right: 108 },
    head: [['QUALITY', 'QTY', 'RATE', 'AMOUNT']],
    body: partARows,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 1.5 },
    columnStyles: { 0: { cellWidth: 35 }, 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
  });

  const partAFinalY = (doc as any).lastAutoTable.finalY;

  autoTable(doc, {
    startY: currentY,
    margin: { left: 110, right: 14 },
    head: [['QUALITY', 'QTY', 'RATE', 'AMOUNT']],
    body: partBRows,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 1.5 },
    columnStyles: { 0: { cellWidth: 35 }, 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
  });

  const partBFinalY = (doc as any).lastAutoTable.finalY;
  currentY = Math.max(partAFinalY, partBFinalY) + 6;

  // Section 2: RECOVER SECTIONS
  doc.setTextColor(...accentColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PART A RECOVER', 14, currentY);
  doc.text('PART B RECOVER', 110, currentY);

  currentY += 3;

  const partARecoverRows = buildProductRows(data.partA.recovery, result.partA.recoveryAmounts);
  partARecoverRows.push(['TOTAL', result.partA.recoverTotalQty.toString(), '', result.partA.recoverTotalAmount.toFixed(2)]);

  const partBRecoverRows = buildProductRows(data.partB.recovery, result.partB.recoveryAmounts);
  partBRecoverRows.push(['TOTAL', result.partB.recoverTotalQty.toString(), '', result.partB.recoverTotalAmount.toFixed(2)]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: 14, right: 108 },
    head: [['QUALITY', 'QTY', 'RATE', 'AMOUNT']],
    body: partARecoverRows,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 1.5 },
    columnStyles: { 0: { cellWidth: 35 }, 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
  });

  const recoverAFinalY = (doc as any).lastAutoTable.finalY;

  autoTable(doc, {
    startY: currentY,
    margin: { left: 110, right: 14 },
    head: [['QUALITY', 'QTY', 'RATE', 'AMOUNT']],
    body: partBRecoverRows,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 1.5 },
    columnStyles: { 0: { cellWidth: 35 }, 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
  });

  const recoverBFinalY = (doc as any).lastAutoTable.finalY;
  currentY = Math.max(recoverAFinalY, recoverBFinalY) + 8;

  // Section 3: SUMMARY & RATES TABLE
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CALCULATION SUMMARY & RATES', 14, currentY);

  currentY += 4;

  const summaryBody = [
    ['OUT PUT QTY', result.partA.outputQty.toFixed(2), result.partB.outputQty.toFixed(2)],
    ['OUT PUT AMOUNT', result.partA.outputAmount.toFixed(2), result.partB.outputAmount.toFixed(2)],
    ['REAL OUT PUT', result.partA.realOutput.toFixed(2), result.partB.realOutput.toFixed(2)],
    ['LOSS', result.partA.loss.toFixed(2), result.partB.loss.toFixed(2)],
    ['CALCULATED RATE', result.partA.rate.toFixed(4), result.partB.rate.toFixed(4)],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: 14, right: 14 },
    head: [['METRIC', 'PART A', 'PART B']],
    body: summaryBody,
    theme: 'striped',
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold' }, 1: { halign: 'right' }, 2: { halign: 'right' } },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // FINAL NET RATE BANNER
  doc.setFillColor(37, 99, 235);
  doc.rect(14, currentY, 182, 16, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('FINAL NET RATE:', 20, currentY + 10.5);

  doc.setFontSize(16);
  doc.text(result.netRate.toFixed(4), 180, currentY + 10.5, { align: 'right' });

  doc.save(`${data.title || 'calculation_report'}.pdf`);
}
