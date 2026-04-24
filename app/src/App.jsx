import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useFinance } from './context/FinanceContext';
import { 
  LayoutDashboard, ArrowLeftRight, Wallet, Target, 
  PieChart, FileText, Sun, Moon, Bell, Settings 
} from 'lucide-react';

import Modal from './components/Modal';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import WalletPage from './pages/Wallet';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';

const SidebarItem = ({ icon: Icon, label, path, onClick }) => {
  const location = useLocation();
  const isActive = path ? location.pathname === path : false;
  
  const content = (
    <div className={`nav-item ${isActive ? 'active' : ''}`}>
      <Icon size={20} />
      <span>{label}</span>
    </div>
  );

  return path ? (
    <Link to={path} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</Link>
  ) : (
    <button onClick={onClick} className="w-full text-left" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit' }}>
      {content}
    </button>
  );
};

export default function App() {
  const { user, metrics } = useFinance();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Handle case where user is still loading or undefined
  if (!user) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <Router>
      <div className="layout-container">
        {/* Sidebar */}
        <aside className="sidebar no-print">
          <div className="sidebar-header">
            <div className="flex items-center gap-2">
              <div style={{ width: 32, height: 32, backgroundColor: 'var(--jm-light-blue)', borderRadius: 8 }}></div>
              <span className="font-bold text-xl tracking-tight">JM <span className="font-light">Solutionss</span></span>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/" />
            <SidebarItem icon={ArrowLeftRight} label="Transactions" path="/transactions" />
            <SidebarItem icon={Wallet} label="Wallet" path="/wallet" />
            <SidebarItem icon={Target} label="Goals" path="/goals" />
            <SidebarItem icon={PieChart} label="Analytics" path="/analytics" />
            <SidebarItem icon={FileText} label="Reports" path="/reports" />
          </nav>

          <div className="sidebar-footer">
            <SidebarItem icon={Settings} label="Settings" onClick={() => setIsSettingsOpen(true)} />
            <SidebarItem icon={Bell} label="Notifications" onClick={() => setIsNotificationsOpen(true)} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <header className="main-header no-print">
            <div className="flex items-center gap-4">
              <div className="jm-card" style={{ padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.875rem' }}>
                <span className="text-secondary">Balance: </span>
                <span className="font-bold text-success">${metrics?.totalBalance?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                className="icon-btn" 
                onClick={() => setIsDarkMode(!isDarkMode)}
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="flex items-center gap-3 pl-4 border-l" style={{ borderColor: 'var(--border-color)' }}>
                <div className="text-right">
                  <div className="font-semibold text-small">{user.name}</div>
                  <div className="text-caption text-secondary">Premium User</div>
                </div>
                <img src={user.avatar} alt="User" className="avatar" />
              </div>
            </div>
          </header>

          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      <Modal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        title="Settings & Preferences"
        footer={<button className="jm-btn jm-btn-primary w-full" onClick={() => setIsSettingsOpen(false)}>Save Preferences</button>}
      >
        <div className="flex flex-col gap-6">
          <div className="p-4 rounded-xl bg-slate-50 flex items-center gap-4 border" style={{ borderColor: 'var(--border-color)' }}>
            <img src={user.avatar} className="avatar" style={{ width: 50, height: 50 }} alt="User" />
            <div>
              <div className="font-bold">{user.name}</div>
              <div className="text-small text-secondary">{user.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="jm-label">Currency</label>
              <select className="jm-select"><option>USD ($)</option><option>EUR (€)</option></select>
            </div>
            <div className="form-group mb-0">
              <label className="jm-label">Language</label>
              <select className="jm-select"><option>English (US)</option></select>
            </div>
          </div>

          <div className="form-group">
            <label className="jm-label">Monthly Spending Limit</label>
            <input type="number" className="jm-input" defaultValue={user.monthlySpendingLimit} />
          </div>

          <div className="flex items-center justify-between p-3 border-t">
            <span className="font-medium">Dark Mode Appearance</span>
            <button 
              className={`jm-btn ${isDarkMode ? 'jm-btn-primary' : 'jm-btn-secondary'}`}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Notifications Modal */}
      <Modal 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
        title="Recent Activity"
        footer={<button className="jm-btn jm-btn-secondary w-full" onClick={() => setIsNotificationsOpen(false)}>Dismiss All</button>}
      >
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-xl border-l-4 border-l-blue-500 bg-blue-50/30 flex gap-3">
            <div className="p-2 bg-blue-500 text-white rounded-lg h-fit"><Bell size={18} /></div>
            <div>
              <div className="font-bold text-small">System Update</div>
              <div className="text-small text-secondary">Your dashboard has been upgraded to v1.2. New analytics views available.</div>
              <div className="text-caption mt-1 opacity-60">2 hours ago</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border-l-4 border-l-green-500 bg-green-50/30 flex gap-3">
            <div className="p-2 bg-green-500 text-white rounded-lg h-fit"><Target size={18} /></div>
            <div>
              <div className="font-bold text-small">Goal Milestone</div>
              <div className="text-small text-secondary">You've reached 50% of your "Vacation" goal. Keep it up!</div>
              <div className="text-caption mt-1 opacity-60">Yesterday</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border-l-4 border-l-amber-500 bg-amber-50/30 flex gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-lg h-fit"><Bell size={18} /></div>
            <div>
              <div className="font-bold text-small">Spending Warning</div>
              <div className="text-small text-secondary">You have spent 90% of your Entertainment budget for April.</div>
              <div className="text-caption mt-1 opacity-60">3 days ago</div>
            </div>
          </div>
        </div>
      </Modal>
    </Router>
  );
}
