import React, { useState, useEffect } from 'react';
import { FileText, Save, RotateCcw, Calculator } from 'lucide-react';
import { BASELINE_CALCULATION_DATA, CalculationData, ProductRow } from '../types/calculation';
import { calculateAll } from '../engine/calculator';
import { ProductTable } from './ProductTable';
import { exportToPDF } from '../services/pdfService';
import { loadCurrentCalculation, saveCalculationRecord, saveCurrentCalculation } from '../services/storageService';

export const CalculationForm: React.FC = () => {
  const [data, setData] = useState<CalculationData>(loadCurrentCalculation);

  // Synchronously compute all results using calculator engine
  const result = calculateAll(data);

  // Auto-save current working state to storage
  useEffect(() => {
    saveCurrentCalculation(data);
  }, [data]);

  const handleUpdateTitle = (newTitle: string) => {
    setData((prev) => ({ ...prev, title: newTitle }));
  };

  // Generic Row Update Handler for Products
  const handleUpdateRow = (
    partKey: 'partA' | 'partB',
    sectionKey: 'products' | 'recovery',
    id: string,
    field: 'quality' | 'qty' | 'rate',
    value: any
  ) => {
    setData((prev) => {
      const partState = prev[partKey];
      const rows = partState[sectionKey].map((row) => {
        if (row.id === id) {
          return { ...row, [field]: value };
        }
        return row;
      });
      return {
        ...prev,
        [partKey]: {
          ...partState,
          [sectionKey]: rows,
        },
      };
    });
  };

  // Add Dynamic Product Row Handler
  const handleAddRow = (partKey: 'partA' | 'partB', sectionKey: 'products' | 'recovery') => {
    setData((prev) => {
      const partState = prev[partKey];
      const newRow: ProductRow = {
        id: `${partKey}-${sectionKey}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        quality: 'NEW PRODUCT',
        qty: 0,
        rate: 0,
      };
      return {
        ...prev,
        [partKey]: {
          ...partState,
          [sectionKey]: [...partState[sectionKey], newRow],
        },
      };
    });
  };

  // Delete Product Row Handler
  const handleDeleteRow = (partKey: 'partA' | 'partB', sectionKey: 'products' | 'recovery', id: string) => {
    setData((prev) => {
      const partState = prev[partKey];
      return {
        ...prev,
        [partKey]: {
          ...partState,
          [sectionKey]: partState[sectionKey].filter((r) => r.id !== id),
        },
      };
    });
  };

  // Real Output Input Handler
  const handleUpdateRealOutput = (partKey: 'partA' | 'partB', value: number | null) => {
    setData((prev) => ({
      ...prev,
      [partKey]: {
        ...prev[partKey],
        realOutput: value,
      },
    }));
  };

  // Actions
  const handleResetBaseline = () => {
    if (window.confirm('Reset all values to original baseline source.xlsx?')) {
      setData(JSON.parse(JSON.stringify(BASELINE_CALCULATION_DATA)));
    }
  };

  const handleSaveRecord = () => {
    saveCalculationRecord(data);
    alert('Calculation record saved successfully to local storage!');
  };

  const handleExportPDF = () => {
    exportToPDF(data, result);
  };

  return (
    <div className="container">
      {/* Header Bar */}
      <header className="app-header">
        <div className="header-brand">
          <div className="header-icon">
            <Calculator size={20} />
          </div>
          <input
            type="text"
            className="header-title-input"
            value={data.title}
            onChange={(e) => handleUpdateTitle(e.target.value)}
            title="Edit Title"
          />
        </div>

        <div className="header-actions">
          <button type="button" className="btn btn-secondary" onClick={handleExportPDF}>
            <FileText size={15} /> Download PDF
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSaveRecord}>
            <Save size={15} /> Save State
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleResetBaseline} title="Reset Baseline">
            <RotateCcw size={15} /> Baseline
          </button>
        </div>
      </header>

      {/* Main Single-Page Calculation Form Grid (Preserves PC Side-by-Side Layout Proportions) */}
      <main className="form-grid-wrapper">
        <div className="form-grid">
          {/* PART A COLUMN */}
          <section className="part-card part-a">
            <div className="part-header">
              <h2 className="part-title">PART A</h2>
            </div>

            {/* Part A Main Products Table (Editable, Add/Delete Enabled) */}
            <ProductTable
              title="Part A Products"
              rows={data.partA.products}
              amounts={result.partA.productAmounts}
              totalQty={result.partA.totalQty}
              totalAmount={result.partA.totalAmount}
              onUpdateRow={(id, field, val) => handleUpdateRow('partA', 'products', id, field, val)}
              onAddRow={() => handleAddRow('partA', 'products')}
              onDeleteRow={(id) => handleDeleteRow('partA', 'products', id)}
              isEditable={true}
              canAddDelete={true}
            />

            {/* Part A Recover Table (Fixed / Non-editable / No Add & Delete) */}
            <ProductTable
              title="Part A Recover (Fixed)"
              rows={data.partA.recovery}
              amounts={result.partA.recoveryAmounts}
              totalQty={result.partA.recoverTotalQty}
              totalAmount={result.partA.recoverTotalAmount}
              isEditable={false}
              canAddDelete={false}
            />
          </section>

          {/* PART B COLUMN */}
          <section className="part-card part-b">
            <div className="part-header">
              <h2 className="part-title">PART B</h2>
            </div>

            {/* Part B Main Products Table (Editable, Add/Delete Enabled) */}
            <ProductTable
              title="Part B Products"
              rows={data.partB.products}
              amounts={result.partB.productAmounts}
              totalQty={result.partB.totalQty}
              totalAmount={result.partB.totalAmount}
              onUpdateRow={(id, field, val) => handleUpdateRow('partB', 'products', id, field, val)}
              onAddRow={() => handleAddRow('partB', 'products')}
              onDeleteRow={(id) => handleDeleteRow('partB', 'products', id)}
              isEditable={true}
              canAddDelete={true}
            />

            {/* Part B Recover Table (Fixed / Non-editable / No Add & Delete) */}
            <ProductTable
              title="Part B Recover (Fixed)"
              rows={data.partB.recovery}
              amounts={result.partB.recoveryAmounts}
              totalQty={result.partB.recoverTotalQty}
              totalAmount={result.partB.recoverTotalAmount}
              isEditable={false}
              canAddDelete={false}
            />
          </section>
        </div>
      </main>

      {/* SUMMARY OUTPUTS, LOSS & RATES SECTION */}
      <section className="summary-panel">
        <div className="summary-grid">
          {/* Part A Summary Card */}
          <div className="summary-card">
            <div className="summary-card-title part-a-title">PART A SUMMARY</div>
            
            <div className="metric-row">
              <span className="metric-label">OUT PUT QTY (Total - Recover):</span>
              <span className="metric-val">{result.partA.outputQty.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">OUT PUT AMOUNT (Total - Recover):</span>
              <span className="metric-val">{result.partA.outputAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">REAL OUT PUT (User Input):</span>
              <input
                type="number"
                step="any"
                className="real-output-input"
                value={data.partA.realOutput !== null ? data.partA.realOutput : ''}
                placeholder="0"
                onChange={(e) =>
                  handleUpdateRealOutput('partA', e.target.value === '' ? null : parseFloat(e.target.value))
                }
              />
            </div>
            <div className="metric-row">
              <span className="metric-label">LOSS (Output QTY - Real Output):</span>
              <span className="metric-val" style={{ color: result.partA.loss >= 0 ? '#10b981' : '#ef4444' }}>
                {result.partA.loss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">PART A RATE (Output Amount / Real Output):</span>
              <span className="metric-val highlight">{result.partA.rate.toFixed(2)}</span>
            </div>
          </div>

          {/* Part B Summary Card */}
          <div className="summary-card">
            <div className="summary-card-title part-b-title">PART B SUMMARY</div>

            <div className="metric-row">
              <span className="metric-label">OUT PUT QTY (Total - Recover):</span>
              <span className="metric-val">{result.partB.outputQty.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">OUT PUT AMOUNT (Total - Recover):</span>
              <span className="metric-val">{result.partB.outputAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">REAL OUT PUT (User Input):</span>
              <input
                type="number"
                step="any"
                className="real-output-input"
                value={data.partB.realOutput !== null ? data.partB.realOutput : ''}
                placeholder="0"
                onChange={(e) =>
                  handleUpdateRealOutput('partB', e.target.value === '' ? null : parseFloat(e.target.value))
                }
              />
            </div>
            <div className="metric-row">
              <span className="metric-label">LOSS (Output QTY - Real Output):</span>
              <span className="metric-val" style={{ color: result.partB.loss >= 0 ? '#10b981' : '#ef4444' }}>
                {result.partB.loss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">PART B RATE (Output Amount / Real Output):</span>
              <span className="metric-val highlight">{result.partB.rate.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* FINAL NET RATE BANNER */}
        <div className="net-rate-banner">
          <div className="net-rate-info">
            <div className="net-rate-title">
              <Calculator size={20} /> FINAL NET RATE
            </div>
            <div className="net-rate-formula">
              Formula: (PART A RATE [{result.partA.rate.toFixed(2)}] + PART B RATE [{result.partB.rate.toFixed(2)}]) / 2
            </div>
          </div>
          <div className="net-rate-value-box">
            {result.netRate.toFixed(2)}
          </div>
        </div>
      </section>
    </div>
  );
};
