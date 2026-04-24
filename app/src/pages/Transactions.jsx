import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Search, Filter, Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction, updateTransaction } = useFinance();
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

  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.recipientName || !formData.amount) return;
    
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
    } else {
      addTransaction({
        ...formData,
        amount: parseFloat(formData.amount)
      });
    }
    
    closeModal();
  };

  const openEditModal = (tx) => {
    setEditingTransaction(tx);
    setFormData({
      recipientName: tx.recipientName,
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
      status: tx.status,
      notes: tx.notes || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
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

      {/* Add/Edit Transaction Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingTransaction ? "Edit Transaction" : "Add New Transaction"}
        footer={
          <>
            <button className="jm-btn jm-btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="jm-btn jm-btn-primary" onClick={handleAddSubmit}>
              {editingTransaction ? "Update Transaction" : "Save Transaction"}
            </button>
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
            <label className="jm-label">Status</label>
            <select 
              className="jm-select"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or category..." 
              className="jm-input pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select 
              className="jm-select" 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button className="jm-btn jm-btn-secondary">
              <Filter size={18} /> Filters
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="jm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Recipient / Source</th>
                <th>Category</th>
                <th>Status</th>
                <th>Amount</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem' }}>
                        {tx.recipientName.charAt(0)}
                      </div>
                      <div className="font-semibold">{tx.recipientName}</div>
                    </div>
                  </td>
                  <td>
                    <span className="jm-badge">{tx.category}</span>
                  </td>
                  <td>
                    <span className={`jm-badge bg-${tx.status}`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                  <td className={tx.type === 'income' ? 'text-success' : 'text-danger'} style={{ fontWeight: 600 }}>
                    {formatAmount(tx.amount, tx.type)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex justify-end gap-1">
                      <button className="icon-btn" title="Edit" onClick={() => openEditModal(tx)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn text-danger" title="Delete" onClick={() => {
                        if (window.confirm(`Delete transaction from ${tx.recipientName}?`)) deleteTransaction(tx.id);
                      }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
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
