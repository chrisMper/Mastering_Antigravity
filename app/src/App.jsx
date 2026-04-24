import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Wallet, Target, PieChart, FileText, Sun, Moon, Bell, Settings } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import WalletPage from './pages/Wallet';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';

const SidebarItem = ({ icon: Icon, label, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <Link to={path} className={`nav-item ${isActive ? 'active' : ''}`}>
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

const Layout = ({ children }) => {
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', !isDark ? 'dark' : 'light');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <div style={{width: 32, height: 32, borderRadius: 8, backgroundColor: 'var(--jm-light-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{color: 'white', fontSize: 18, fontWeight: 800}}>JM</span>
          </div>
          Solutionss
        </div>
        <nav className="nav-links">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/" />
          <SidebarItem icon={Receipt} label="Transactions" path="/transactions" />
          <SidebarItem icon={Wallet} label="Wallet" path="/wallet" />
          <SidebarItem icon={Target} label="Goals" path="/goals" />
          <SidebarItem icon={PieChart} label="Analytics" path="/analytics" />
          <SidebarItem icon={FileText} label="Reports" path="/reports" />
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="top-header">
          <div className="search-bar">
            {/* Search placeholder */}
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={toggleTheme}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="icon-btn">
              <Settings size={20} />
            </button>
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <div className="user-profile flex items-center gap-2 ml-4">
              <span className="font-semibold text-small">Alex</span>
              <img 
                src="https://ui-avatars.com/api/?name=Alex+Doe&background=2E3A8C&color=fff" 
                alt="User Avatar" 
                className="avatar" 
              />
            </div>
          </div>
        </header>
        
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
