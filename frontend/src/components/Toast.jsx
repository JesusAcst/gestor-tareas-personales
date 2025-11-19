import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = type === 'error' ? '#ef4444' : '#22c55e';
  const icon = type === 'error' ? '✕' : '✓';

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className="toast-container"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: bgColor,
        color: '#ffffff',
        padding: '12px 20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 10000,
        minWidth: '280px',
        maxWidth: '90vw',
        animation: 'toastSlideIn 0.3s ease-out',
      }}
    >
      <span style={{ fontSize: '18px', fontWeight: 'bold' }} aria-hidden="true">{icon}</span>
      <span style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>{message}</span>
      <button
        onClick={onClose}
        aria-label="Cerrar notificación"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          padding: '4px 8px',
          fontSize: '18px',
          lineHeight: 1,
          opacity: 0.9,
          borderRadius: '4px',
          transition: 'opacity 0.2s, background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = '1';
          e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = '0.9';
          e.target.style.backgroundColor = 'transparent';
        }}
        onFocus={(e) => {
          e.target.style.outline = '2px solid rgba(255,255,255,0.5)';
          e.target.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.target.style.outline = 'none';
        }}
      >
        ×
      </button>
    </div>
  );
}

