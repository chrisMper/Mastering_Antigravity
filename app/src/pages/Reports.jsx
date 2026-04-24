import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Download, FileText, Calendar } from 'lucide-react';

export default function Reports() {
  const { transactions, metrics } = useFinance();

  const exportData = (format) => {
    const headers = ['ID', 'Type', 'Amount', 'Category', 'Recipient', 'Status', 'Date'];
    const rows = transactions.map(t => [
      t.id,
      t.type,
      t.amount,
      t.category,
      t.recipientName,
      t.status,
      new Date(t.date).toLocaleDateString()
    ]);

    const formatCSV = (h, r) => {
      const escape = (val) => `"${String(val).replace(/"/g, '""')}"`;
      return [
        h.map(escape).join(","),
        ...r.map(row => row.map(escape).join(","))
      ].join("\n");
    };

    let blob;
    let filename = `JM_Solutionss_Report_${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      const content = formatCSV(headers, rows);
      blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      filename += ".csv";
    } else if (format === 'json') {
      const content = JSON.stringify(transactions, null, 2);
      blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
      filename += ".json";
    }

    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-container">
      <div className="flex justify-between items-center mb-6 no-print">
        <div>
          <h1 className="mb-2">Financial Reports</h1>
          <p>Generate and export summaries of your financial data.</p>
        </div>
        <div className="flex gap-2">
          <button className="jm-btn jm-btn-secondary" onClick={() => exportData('json')}>
             Export JSON
          </button>
          <button className="jm-btn jm-btn-primary" onClick={() => exportData('csv')}>
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="jm-card">
          <div className="flex items-center gap-3 mb-6">
            <FileText size={24} color="var(--jm-dark-blue)" />
            <h3 className="font-semibold text-lg">Monthly Summary Report</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-secondary">Reporting Period</span>
              <span className="font-semibold">April 2026</span>
            </div>
            <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-secondary">Total Income</span>
              <span className="font-semibold text-success">${metrics.totalIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-secondary">Total Expenses</span>
              <span className="font-semibold text-danger">${metrics.totalExpense.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Net Savings</span>
              <span style={{ color: 'var(--jm-light-blue)' }}>${(metrics.totalIncome - metrics.totalExpense).toLocaleString()}</span>
            </div>
          </div>
          <button className="jm-btn jm-btn-secondary w-full mt-6 no-print" onClick={handlePrint}>View Detailed PDF (Print)</button>
        </div>

        <div className="jm-card">
          <div className="flex items-center gap-3 mb-6">
            <Calendar size={24} color="var(--jm-dark-blue)" />
            <h3 className="font-semibold text-lg">Report History</h3>
          </div>
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <div className="font-semibold">Financial Summary Q{i} 2026</div>
                  <div className="text-caption text-secondary">Generated on 2026-04-1{i}</div>
                </div>
                <button className="icon-btn" title="Download"><Download size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
