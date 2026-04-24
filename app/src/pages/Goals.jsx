import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Target, Plus } from 'lucide-react';

export default function Goals() {
  const { goals } = useFinance();

  return (
    <div className="goals-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="mb-2">Savings Goals</h1>
          <p>Track your progress towards your financial targets.</p>
        </div>
        <button className="jm-btn jm-btn-primary">
          <Plus size={18} /> New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          const isCompleted = progress >= 100;

          return (
            <div key={goal.id} className="jm-card jm-card-interactive">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div style={{ backgroundColor: 'var(--bg-color)', padding: '0.75rem', borderRadius: '12px' }}>
                    <Target size={24} color="var(--jm-light-blue)" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{goal.name}</h3>
                    <div className="text-small text-secondary">
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {isCompleted && (
                  <span className="jm-badge bg-completed">Achieved</span>
                )}
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-2xl">${goal.currentAmount.toLocaleString()}</span>
                  <span className="text-secondary text-small">of ${goal.targetAmount.toLocaleString()}</span>
                </div>
                <div style={{ width: '100%', height: 10, backgroundColor: 'var(--bg-color)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${progress}%`, 
                    height: '100%', 
                    backgroundColor: isCompleted ? 'var(--success-color)' : 'var(--jm-light-blue)', 
                    borderRadius: 5,
                    transition: 'width 1s ease-in-out'
                  }}></div>
                </div>
                <div className="text-right mt-1 font-semibold text-small" style={{ color: 'var(--jm-dark-blue)' }}>
                  {Math.round(progress)}%
                </div>
              </div>

              <div className="flex gap-4 border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                <button className="jm-btn jm-btn-secondary flex-1" style={{ fontSize: '0.875rem', padding: '0.5rem' }}>Add Funds</button>
                <button className="jm-btn jm-btn-secondary flex-1" style={{ fontSize: '0.875rem', padding: '0.5rem' }}>Edit Goal</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
