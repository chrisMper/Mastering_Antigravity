import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

export default function Analytics() {
  const { metrics, transactions, budgets } = useFinance();

  // Mock data for spending trends (Line Chart)
  const lineData = [
    { name: 'Week 1', spent: 400, prev: 300 },
    { name: 'Week 2', spent: 600, prev: 450 },
    { name: 'Week 3', spent: 300, prev: 500 },
    { name: 'Week 4', spent: 800, prev: 600 },
  ];

  // Spending by category (Pie Chart)
  const COLORS = ['#2E3A8C', '#4A5FD9', '#10B981', '#F59E0B', '#EF4444', '#1A2254'];

  const categoryData = budgets.map(b => ({
    name: b.category,
    value: b.spentAmount
  }));

  return (
    <div className="analytics-container">
      <h1 className="mb-2">Financial Analytics</h1>
      <p className="mb-6">Visualize your spending patterns and income trends.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Spending Trends */}
        <div className="jm-card">
          <h3 className="font-semibold mb-6">Spending Trends (Weekly)</h3>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="spent" name="Current Month" stroke="var(--jm-dark-blue)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="prev" name="Previous Month" stroke="var(--border-color)" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="jm-card">
          <h3 className="font-semibold mb-6">Spending by Category</h3>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="jm-card">
          <h3 className="font-semibold mb-6">Income vs Expenses (Monthly Prediction)</h3>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Income', amount: metrics.totalIncome },
                { name: 'Expenses', amount: metrics.totalExpense },
                { name: 'Net Savings', amount: metrics.totalIncome - metrics.totalExpense }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  <Cell fill="var(--success-color)" />
                  <Cell fill="var(--danger-color)" />
                  <Cell fill="var(--jm-light-blue)" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
