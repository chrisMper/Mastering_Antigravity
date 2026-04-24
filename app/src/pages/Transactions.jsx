import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Search, Filter, Plus, Edit2, Trash2, X, Check,
  Briefcase, Utensils, Car, Gamepad2, 
  Stethoscope, Plane, CreditCard, MoreHorizontal,
  ChevronRight, Calendar
} from 'lucide-react';
import Modal from '../components/Modal';

const CATEGORY_ICONS = {
  "Salary": { icon: Briefcase, color: '#E0E7FF', iconColor: '#4338CA' },
  "Freelance": { icon: Briefcase, color: '#E0E7FF', iconColor: '#4338CA' },
  "Investments": { icon: CreditCard, color: '#FEF3C7', iconColor: '#B45309' },
  "Food & Grocery": { icon: Utensils, color: '#DCFCE7', iconColor: '#15803D' },
  "Transportation": { icon: Car, color: '#F1F5F9', iconColor: '#475569' },
  "Entertainment": { icon: Gamepad2, color: '#F3E8FF', iconColor: '#7E22CE' },
  "Healthcare": { icon: Stethoscope, color: '#FFE4E6', iconColor: '#BE123C' },
  "Shopping": { icon: CreditCard, color: '#F8FAFC', iconColor: '#1E293B' },
  "Travel": { icon: Plane, color: '#E0F2FE', iconColor: '#0369A1' },
  "Subscriptions": { icon: CreditCard, color: '#FEF2F2', iconColor: '#991B1B' },
  "Other": { icon: MoreHorizontal, color: '#F1F5F9', iconColor: '#64748B' }
};

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction, updateTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    recipientName: '',
    amount: '',
    type: 'expense',
    category: 'Food & Grocery',
    status: 'completed',
    notes: ''
  });

  const categories = Object.keys(CATEGORY_ICONS);

  const formatAmount = (amount, type) => {
    return `${type === 'income' ? '+' : '-'}$${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.recipientName || !formData.amount) return;
    
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, payload);
    } else {
      addTransaction(payload);
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

  const handleDelete = (id) => {
    deleteTransaction(id);
    setConfirmDeleteId(null);
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' ? true : tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const groupedTransactions = filteredTransactions.reduce((groups, tx) => {
    const date = new Date(tx.date).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(tx);
    return groups;
  }, {});

  const CategoryIcon = ({ category }) => {
    const config = CATEGORY_ICONS[category] || CATEGORY_ICONS["Other"];
    const Icon = config.icon;
    return (
      <div className="category-icon-wrapper" style={{ backgroundColor: config.color }}>
        <Icon size={20} color={config.iconColor} />
      </div>
    );
  };

  return (
    <div className="transactions-container">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">Transactions History</h1>
          <p className="text-secondary">Keep track of every cent in your financial universe.</p>
        </div>
        <button className="jm-btn jm-btn-primary shadow-lg" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Transaction
        </button>
      </div>

      <div className="glass-search-bar p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, category, or amount..." 
            className="jm-input pl-12 border-none bg-transparent" 
            style={{ boxShadow: 'none' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            className="jm-select border-none bg-white shadow-sm" 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
          <button className="jm-btn jm-btn-secondary px-6">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="transaction-list-area">
        {Object.entries(groupedTransactions).sort((a,b) => new Date(b[0]) - new Date(a[0])).map(([date, items]) => (
          <div key={date} className="transaction-group">
            <div className="transaction-group-header">
              <Calendar size={14} />
              {date}
            </div>
            <div className="flex flex-col gap-1">
              {items.map((tx) => (
                <div key={tx.id} className="relative">
                  <div 
                    className={`premium-card group cursor-pointer ${confirmDeleteId === tx.id ? 'opacity-40 pointer-events-none scale-95' : ''}`} 
                    onClick={() => openEditModal(tx)}
                  >
                    <div className="flex items-center flex-1">
                      <CategoryIcon category={tx.category} />
                      <div className="transaction-main">
                        <div className="transaction-title">{tx.recipientName}</div>
                        <div className="transaction-subtitle">{tx.category} • {tx.status}</div>
                      </div>
                    </div>
                    
                    <div className="transaction-amount-area flex items-center gap-6">
                      <div className="text-right">
                        <div className={`transaction-amount ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                          {formatAmount(tx.amount, tx.type)}
                        </div>
                        <div className="text-caption text-secondary">USD</div>
                      </div>
                      
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ zIndex: 10 }}>
                        <button 
                          className="icon-btn hover:bg-white hover:shadow-md" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            openEditModal(tx); 
                          }}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="icon-btn text-danger hover:bg-red-50 hover:shadow-md" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setConfirmDeleteId(tx.id);
                          }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <ChevronRight className="text-secondary group-hover:translate-x-1 transition-transform" size={18} />
                    </div>
                  </div>

                  {/* Inline Premium Confirmation UI */}
                  {confirmDeleteId === tx.id && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center animate-fade-in">
                      <div className="bg-white dark:bg-slate-800 shadow-xl border rounded-2xl px-6 py-3 flex items-center gap-4 border-red-200">
                        <span className="font-bold text-danger text-small">Delete this?</span>
                        <div className="flex gap-2">
                          <button 
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm"
                            onClick={() => handleDelete(tx.id)}
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No Transactions Found</h3>
            <p className="text-secondary">Try adjusting your search filters or add a new entry.</p>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingTransaction ? "Edit Transaction" : "Add New Transaction"}
        footer={
          <div className="flex gap-3 w-full">
            <button className="jm-btn jm-btn-secondary flex-1" onClick={closeModal}>Cancel</button>
            <button className="jm-btn jm-btn-primary flex-1" onClick={handleAddSubmit}>
              {editingTransaction ? "Verify & Save" : "Complete Transaction"}
            </button>
          </div>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label className="jm-label">Transaction Reference</label>
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
              <label className="jm-label">Amount</label>
              <input 
                type="number" 
                step="0.01"
                className="jm-input bg-slate-50 font-bold" 
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
                <option value="expense">Expense (-)</option>
                <option value="income">Income (+)</option>
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
            <label className="jm-label">Processing Status</label>
            <select 
              className="jm-select"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="completed">Success / Completed</option>
              <option value="pending">In Progress / Pending</option>
              <option value="failed">Declined / Failed</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
