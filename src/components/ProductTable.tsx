import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ProductRow } from '../types/calculation';

interface ProductTableProps {
  title: string;
  rows: ProductRow[];
  amounts: number[];
  totalQty: number;
  totalAmount: number;
  onUpdateRow?: (id: string, field: 'quality' | 'qty' | 'rate', value: any) => void;
  onAddRow?: () => void;
  onDeleteRow?: (id: string) => void;
  isEditable?: boolean;
  canAddDelete?: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  title,
  rows,
  amounts,
  totalQty,
  totalAmount,
  onUpdateRow,
  onAddRow,
  onDeleteRow,
  isEditable = true,
  canAddDelete = true,
}) => {
  return (
    <div className="table-container">
      <div className="sub-header">
        <span>{title}</span>
        {canAddDelete && onAddRow && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onAddRow}>
            <Plus size={14} /> Add Row
          </button>
        )}
      </div>

      <table className="calc-table">
        <thead>
          <tr>
            <th style={{ width: '22%' }}>Quality / Product</th>
            <th className="num" style={{ width: '28%' }}>QTY</th>
            <th className="num" style={{ width: '28%' }}>RATE</th>
            <th className="num" style={{ width: '22%' }}>AMOUNT</th>
            {canAddDelete && <th style={{ width: '32px' }}></th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const amount = amounts[idx] !== undefined ? amounts[idx] : 0;
            return (
              <tr key={row.id} className="animate-fade-in">
                <td>
                  {isEditable && onUpdateRow ? (
                    <input
                      type="text"
                      className="table-input quality-input"
                      value={row.quality}
                      placeholder="Product Name"
                      onChange={(e) => onUpdateRow(row.id, 'quality', e.target.value)}
                    />
                  ) : (
                    <span className="static-text" style={{ paddingLeft: '0.2rem', fontWeight: 500 }}>
                      {row.quality}
                    </span>
                  )}
                </td>
                <td className="num">
                  {isEditable && onUpdateRow ? (
                    <input
                      type="number"
                      step="any"
                      className="table-input num"
                      value={row.qty !== null ? row.qty : ''}
                      placeholder="0"
                      onChange={(e) =>
                        onUpdateRow(
                          row.id,
                          'qty',
                          e.target.value === '' ? null : parseFloat(e.target.value)
                        )
                      }
                    />
                  ) : (
                    <span className="static-text num" style={{ fontFamily: 'var(--font-mono)' }}>
                      {row.qty !== null ? row.qty : '-'}
                    </span>
                  )}
                </td>
                <td className="num">
                  {isEditable && onUpdateRow ? (
                    <input
                      type="number"
                      step="any"
                      className="table-input num"
                      value={row.rate !== null ? row.rate : ''}
                      placeholder="0"
                      onChange={(e) =>
                        onUpdateRow(
                          row.id,
                          'rate',
                          e.target.value === '' ? null : parseFloat(e.target.value)
                        )
                      }
                    />
                  ) : (
                    <span className="static-text num" style={{ fontFamily: 'var(--font-mono)' }}>
                      {row.rate !== null ? row.rate : '-'}
                    </span>
                  )}
                </td>
                <td className="num amount-cell">
                  {amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                {canAddDelete && (
                  <td>
                    {onDeleteRow && (
                      <button
                        type="button"
                        className="btn btn-danger-ghost"
                        title="Delete Row"
                        onClick={() => onDeleteRow(row.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}

          <tr className="total-row">
            <td>TOTAL</td>
            <td className="num">
              {totalQty.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 4 })}
            </td>
            <td className="num"></td>
            <td className="num amount-cell" style={{ color: '#fff' }}>
              {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            {canAddDelete && <td></td>}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
