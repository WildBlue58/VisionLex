import { useEffect } from 'react';
import './style.css';

/**
 * Toast 提示组件
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast--${type} animate-slide-in-down`} role="alert">
      <div className="toast__icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'warning' && '⚠'}
        {type === 'info' && 'ℹ'}
      </div>
      <div className="toast__message">{message}</div>
      <button className="toast__close" onClick={onClose} aria-label="关闭">
        ×
      </button>
    </div>
  );
};

export default Toast;

/**
 * Toast 容器组件
 */
export const ToastContainer = ({ toasts = [], onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onClose?.(toast.id)}
        />
      ))}
    </div>
  );
};

