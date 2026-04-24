import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="jm-modal-overlay" onClick={onClose}>
      <div className="jm-modal-container" onClick={e => e.stopPropagation()}>
        <div className="jm-modal-header">
          <h3 className="font-semibold">{title}</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="jm-modal-body">
          {children}
        </div>
        {footer && (
          <div className="jm-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
