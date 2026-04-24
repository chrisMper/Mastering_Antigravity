import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Search, Filter, Plus } from 'lucide-react';
import Modal from '../components/Modal';

export default function Transactions() {
  const { transactions, addTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    recipientName: '',
    amount: '',
    type: 'expense',
    category: 'Food & Grocery',
    status: 'completed',
    notes: ''
  });

  const categories = [
    "Salary", "Freelance", "Investments", "Food & Grocery", "Transportation", 
    "Entertainment", "Healthcare", "Shopping", "Travel", "Subscriptions", "Other"
  ];

  const formatAmount = (amount, type) => {
    return `${type === 'income' ? '+' : '-'}$${parseFloat(amount).toFixed(2)}`;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.recipientName || !formData.amount) return;
    
    addTransaction({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    
    setIsModalOpen(false);
    setFormData({
      recipientName: '',
      amount: '',
      type: 'expense',
      category: 'Food & Grocery',
      status: 'completed',
      notes: ''
    });
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' ? true : tx.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="transactions-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="mb-2">Transactions</h1>
          <p>Track and manage your income and expenses.</p>
        </div>
        <button className="jm-btn jm-btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add New
        </button>
      </div>

      {/* Add Transaction Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Transaction"
        footer={
          <>
            <button className="jm-btn jm-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="jm-btn jm-btn-primary" onClick={handleAddSubmit}>Save Transaction</button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label className="jm-label">Recipient / Source</label>
            <input 
              type="text" 
              className="jm-input" 
              required 
              value={formData.recipientName}
              onChange={e => setFormData({...formData, recipientName: e.target.value})}
              placeholder="e.g. Starbucks, Salary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="form-group mb-0">
              <label className="jm-label">Amount ($)</label>
              <input 
                type="number" 
                step="0.01"
                className="jm-input" 
                required 
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div className="form-group mb-0">
              <label className="jm-label">Type</label>
              <select 
                className="jm-select"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="jm-label">Category</label>
            <select 
              className="jm-select"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="jm-label">Notes (Optional)</label>
            <textarea 
              className="jm-input" 
              style={{ minHeight: '80px', resize: 'vertical' }}
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>
        </form>
      </Modal>

      <div className="jm-card mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2" style={{ transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
            <input 
              type="text" 
              className="jm-input" 
              placeholder="Search by name, ID, or notes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <div className="flex gap-4">
            <select className="jm-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button className="jm-btn jm-btn-secondary">
              <Filter size={18} /> Filters
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <div className="flex items-center gap-3">
                      <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {tx.recipientName.charAt(0)}
                      </div>
                      <div className="font-semibold">{tx.recipientName}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }} className="text-small">{tx.id.toUpperCase()}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{tx.category}</td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{new Date(tx.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className={`jm-badge bg-${tx.status}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right', fontWeight: 600 }} className={tx.type === 'income' ? 'text-success' : ''}>
                    {formatAmount(tx.amount, tx.type)}
                  </td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                    <button className="icon-btn" style={{ display: 'inline-flex' }}>•••</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
