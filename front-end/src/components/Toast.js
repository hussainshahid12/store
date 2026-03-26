import React, { useEffect } from 'react';

const Toast = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '32px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#222',
      color: '#fff',
      padding: '14px 28px',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      zIndex: 9999,
      fontSize: '1rem',
      minWidth: '220px',
      maxWidth: '90vw',
      textAlign: 'center',
      fontWeight: '500',
      letterSpacing: '0.02em',
      border: '1px solid #444',
      opacity: 0.95,
      transition: 'top 0.3s',
    }}>
      {message}
    </div>
  );
};

export default Toast;
