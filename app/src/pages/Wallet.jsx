import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { CreditCard, Plus, Edit2, Trash2 } from 'lucide-react';

export default function Wallet() {
  const { cards } = useFinance();

  return (
    <div className="wallet-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="mb-2">My Wallet</h1>
          <p>Manage your linked cards and payment methods.</p>
        </div>
        <button className="jm-btn jm-btn-primary">
          <Plus size={18} /> Add New Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => (
          <div key={card.id} className="jm-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--jm-navy), var(--jm-dark-blue))',
              padding: '2rem',
              color: 'white',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
              <div className="flex justify-between items-center mb-8">
                <span className="font-semibold tracking-wider blur-sm text-small">{card.cardType.toUpperCase()}</span>
                <CreditCard size={28} />
              </div>
              <div className="text-2xl tracking-[0.2em] mb-8 font-light">
                {card.cardNumber.replace(/.(?=.{4})/g, '• ')}
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-caption mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Card Holder</div>
                  <div className="font-semibold tracking-wide">{card.cardholderName.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-caption mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Expires</div>
                  <div className="font-semibold tracking-wide">{card.expiryDate}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-4" style={{ backgroundColor: 'var(--surface-color)' }}>
              <span className="font-semibold">{card.nickname || 'Linked Card'}</span>
              <div className="flex gap-2">
                <button className="icon-btn" title="Edit"><Edit2 size={16} /></button>
                <button className="icon-btn text-danger" title="Delete"><Trash2 size={16} color="var(--danger-color)" /></button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add Card Placeholder */}
        <div className="jm-card flex flex-col items-center justify-center gap-4" style={{ border: '2px dashed var(--border-color)', minHeight: '280px', cursor: 'pointer', backgroundColor: 'transparent' }}>
          <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'var(--bg-color)', color: 'var(--jm-light-blue)' }}>
            <Plus size={32} />
          </div>
          <h3 className="font-semibold text-lg">Add New Card</h3>
          <p className="text-center text-small">Link another card to track its expenses</p>
        </div>
      </div>
    </div>
  );
}
