import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, CreditCard, ArrowRight, Wallet, LayoutGrid, Plus } from 'lucide-react';
import { format } from 'date-fns';
import Modal from '../components/Modal';

const MetricCard = ({ title, amount, percentageChange, icon: Icon, isCurrency = true }) => {
  const isPositive = percentageChange >= 0;
  return (
    <div className="jm-card jm-card-interactive">
      <div className="flex justify-between items-center mb-4">
        <h3 className="jm-label mb-0" style={{ marginBottom: 0 }}>{title}</h3>
        <div style={{ backgroundColor: 'var(--bg-color)', padding: '0.5rem', borderRadius: '50%' }}>
          {Icon && <Icon size={20} color="var(--jm-dark-blue)" />}
        </div>
      </div>
      <div className="text-2xl font-bold mb-2">
        {isCurrency ? '$' : ''}{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className={`flex items-center gap-2 text-small ${isPositive ? 'text-success' : 'text-danger'}`}>
        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span>{Math.abs(percentageChange)}% from last month</span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { metrics, transactions, budgets, cards, user, addTransaction } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: '',
    amount: '',
    type: 'expense',
    category: 'Food & Grocery',
    status: 'completed',
    notes: ''
  });

  const categories = ["Salary", "Food & Grocery", "Transportation", "Entertainment", "Healthcare", "Travel", "Subscriptions", "Other"];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.recipientName || !formData.amount) return;
    addTransaction({ ...formData, amount: parseFloat(formData.amount) });
    setIsModalOpen(false);
    setFormData({ recipientName: '', amount: '', type: 'expense', category: 'Food & Grocery', status: 'completed', notes: '' });
  };
  
  // Mock percentage changes
  const incomeChange = 5.2;
  const expenseChange = -2.1;
  const savingsChange = 12.5;

  const barData = [
    { name: 'Jan', fixed: 4000, variable: 2400 },
    { name: 'Feb', fixed: 3000, variable: 1398 },
    { name: 'Mar', fixed: 2000, variable: 9800 },
    { name: 'Apr', fixed: 2780, variable: 3908 },
    { name: 'May', fixed: 1890, variable: 4800 },
    { name: 'Jun', fixed: 2390, variable: 3800 },
  ];

  const COLORS = ['#2E3A8C', '#4A5FD9', '#10B981', '#F59E0B', '#EF4444'];

  const recentTransactions = transactions
    .slice()
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);

  const formatAmount = (amount, type) => {
    return `${type === 'income' ? '+' : '-'}$${parseFloat(amount).toFixed(2)}`;
  };

  const currentSpent = budgets.reduce((acc, b) => acc + b.spentAmount, 0);

  return (
    <div className="dashboard-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="mb-2">Dashboard Overview</h1>
          <p>Welcome back, {user?.name.split(' ')[0]}. Here is your financial summary.</p>
        </div>
        <button className="jm-btn jm-btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Transaction
        </button>
      </div>

      {/* Add Transaction Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Quick Add Transaction"
        footer={
          <>
            <button className="jm-btn jm-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="jm-btn jm-btn-primary" onClick={handleAddSubmit}>Save</button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <div className="form-group"><label className="jm-label">Name</label><input type="text" className="jm-input" required value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group"><label className="jm-label">Amount</label><input type="number" step="0.01" className="jm-input" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} /></div>
            <div className="form-group"><label className="jm-label">Type</label><select className="jm-select" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}><option value="expense">Expense</option><option value="income">Income</option></select></div>
          </div>
          <div className="form-group"><label className="jm-label">Category</label><select className="jm-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        </form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard 
          title="Total Balance" 
          amount={metrics.totalBalance} 
          percentageChange={savingsChange} 
          icon={Wallet} 
        />
        <MetricCard 
          title="Total Income" 
          amount={metrics.totalIncome} 
          percentageChange={incomeChange} 
          icon={TrendingUp} 
        />
        <MetricCard 
          title="Total Expense" 
          amount={metrics.totalExpense} 
          percentageChange={expenseChange} 
          icon={TrendingDown} 
        />
        <MetricCard 
          title="Total Savings" 
          amount={metrics.totalIncome - metrics.totalExpense} 
          percentageChange={savingsChange} 
          icon={LayoutGrid} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Income Chart */}
        <div className="jm-card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Total Income</h3>
            <select className="jm-select" style={{ width: '150px' }}>
              <option>Last 6 months</option>
              <option>This year</option>
            </select>
          </div>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
                <Tooltip cursor={{fill: 'var(--bg-color)'}} />
                <Legend iconType="circle" />
                <Bar dataKey="fixed" name="Fixed Income" stackId="a" fill="var(--jm-dark-blue)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="variable" name="Variable Income" stackId="a" fill="var(--jm-light-blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Chart */}
        <div className="jm-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Budget Breakdown</h3>
          </div>
          <div style={{ height: 250, width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgets}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="spentAmount"
                  nameKey="category"
                  stroke="none"
                >
                  {budgets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div className="text-small text-secondary">Total Spent</div>
              <div className="font-bold text-xl">${currentSpent}</div>
            </div>
          </div>
          <div className="mt-4">
            {budgets.map((b, i) => (
              <div key={b.id} className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-small">{b.category}</span>
                </div>
                <span className="font-semibold">${b.spentAmount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table */}
        <div className="jm-card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Recent Transactions</h3>
            <button className="jm-btn jm-btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
              See all <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {tx.recipientName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold">{tx.recipientName}</div>
                          <div className="text-small text-secondary" style={{ color: 'var(--text-secondary)' }}>{tx.id.toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Widgets Column */}
        <div className="flex flex-col gap-6">
          {/* Spending Limit Widget */}
          <div className="jm-card">
            <h3 className="font-semibold text-lg mb-4">Monthly Spending Limit</h3>
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="font-bold text-2xl">${currentSpent}</span>
                <span className="text-secondary text-small ml-1">/ ${user.monthlySpendingLimit}</span>
              </div>
              <span className="font-semibold" style={{ color: 'var(--jm-light-blue)' }}>
                {Math.round((currentSpent / user.monthlySpendingLimit) * 100)}%
              </span>
            </div>
            <div style={{ width: '100%', height: 8, backgroundColor: 'var(--bg-color)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${(currentSpent / user.monthlySpendingLimit) * 100}%`, height: '100%', backgroundColor: 'var(--jm-light-blue)', borderRadius: 4 }}></div>
            </div>
          </div>

          {/* My Cards Widget */}
          <div className="jm-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">My Cards</h3>
              <button className="icon-btn" style={{ border: '1px solid var(--border-color)', borderRadius: 8 }}>+ Add</button>
            </div>
            {cards.slice(0,1).map(card => (
              <div key={card.id} style={{ 
                background: 'linear-gradient(135deg, var(--jm-navy), var(--jm-dark-blue))',
                borderRadius: 16,
                padding: '1.5rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                <div className="flex justify-between items-center mb-8">
                  <span className="font-semibold tracking-wider text-small blur-sm">{card.cardType.toUpperCase()}</span>
                  <CreditCard size={24} />
                </div>
                <div className="text-xl tracking-[0.25em] mb-6">
                  {card.cardNumber.replace(/.(?=.{4})/g, '• ')}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-caption" style={{ color: 'rgba(255,255,255,0.7)' }}>Card Holder</div>
                    <div className="font-semibold tracking-wide">{card.cardholderName}</div>
                  </div>
                  <div>
                    <div className="text-caption" style={{ color: 'rgba(255,255,255,0.7)' }}>Expires</div>
                    <div className="font-semibold tracking-wide">{card.expiryDate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
