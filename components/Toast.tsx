import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XIcon } from './icons/XIcon';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 500); // Wait for animation to finish
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 500);
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-center gap-4 w-full p-4 rounded-lg shadow-lg text-white bg-brand-deep-purple ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}`}
    >
      <CheckCircleIcon className="w-6 h-6 text-brand-gold flex-shrink-0" />
      <p className="flex-grow text-sm font-semibold">{message}</p>
      <button onClick={handleClose} className="p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Dismiss">
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
