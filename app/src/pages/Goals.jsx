import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Target, Plus } from 'lucide-react';
import Modal from '../components/Modal';

export default function Goals() {
  const { goals, addGoal, updateGoal } = useFinance();
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Form States
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [fundAmount, setFundAmount] = useState('');

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (!goalName || !targetAmount) return;
    addGoal({
      name: goalName,
      targetAmount: parseFloat(targetAmount),
      targetDate: new Date(targetDate).getTime()
    });
    setIsGoalModalOpen(false);
    setGoalName('');
    setTargetAmount('');
    setTargetDate('');
  };

  const handleFundSubmit = (e) => {
    e.preventDefault();
    if (!fundAmount || !selectedGoal) return;
    updateGoal(selectedGoal.id, parseFloat(fundAmount));
    setIsFundModalOpen(false);
    setFundAmount('');
    setSelectedGoal(null);
  };

  return (
    <div className="goals-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="mb-2">Savings Goals</h1>
          <p>Track your progress towards your financial targets.</p>
        </div>
        <button className="jm-btn jm-btn-primary" onClick={() => setIsGoalModalOpen(true)}>
          <Plus size={18} /> New Goal
        </button>
      </div>

      {/* New Goal Modal */}
      <Modal 
        isOpen={isGoalModalOpen} 
        onClose={() => setIsGoalModalOpen(false)} 
        title="Create New Savings Goal"
        footer={
          <>
            <button className="jm-btn jm-btn-secondary" onClick={() => setIsGoalModalOpen(false)}>Cancel</button>
            <button className="jm-btn jm-btn-primary" onClick={handleGoalSubmit}>Create Goal</button>
          </>
        }
      >
        <form onSubmit={handleGoalSubmit}>
          <div className="form-group">
            <label className="jm-label">Goal Name</label>
            <input 
              type="text" 
              className="jm-input" 
              placeholder="e.g. New Car, Vacation"
              value={goalName}
              onChange={e => setGoalName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="jm-label">Target Amount ($)</label>
            <input 
              type="number" 
              className="jm-input" 
              placeholder="0.00"
              value={targetAmount}
              onChange={e => setTargetAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="jm-label">Target Date</label>
            <input 
              type="date" 
              className="jm-input" 
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Add Funds Modal */}
      <Modal 
        isOpen={isFundModalOpen} 
        onClose={() => setIsFundModalOpen(false)} 
        title={`Add Funds to ${selectedGoal?.name}`}
        footer={
          <>
            <button className="jm-btn jm-btn-secondary" onClick={() => setIsFundModalOpen(false)}>Cancel</button>
            <button className="jm-btn jm-btn-primary" onClick={handleFundSubmit}>Add Amount</button>
          </>
        }
      >
        <form onSubmit={handleFundSubmit}>
          <div className="form-group">
            <label className="jm-label">Contribution Amount ($)</label>
            <input 
              type="number" 
              className="jm-input" 
              placeholder="0.00"
              value={fundAmount}
              onChange={e => setFundAmount(e.target.value)}
              required
              autoFocus
            />
          </div>
          <p className="text-small text-secondary">
            This will be added to your current progress of ${selectedGoal?.currentAmount.toLocaleString()}.
          </p>
        </form>
      </Modal>

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
                <button 
                  className="jm-btn jm-btn-secondary flex-1" 
                  style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                  onClick={() => {
                    setSelectedGoal(goal);
                    setIsFundModalOpen(true);
                  }}
                >
                  Add Funds
                </button>
                <button className="jm-btn jm-btn-secondary flex-1" style={{ fontSize: '0.875rem', padding: '0.5rem' }}>Edit Goal</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
