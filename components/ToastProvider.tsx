
import React, { createContext, useContext, useState } from 'react';

// Updated interface to accept optional toast type
interface ToastContextType { showToast: (msg: string, type?: 'success' | 'error' | 'info') => void; }
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  // showToast now handles custom message types with a default of 'info'
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full font-bold shadow-2xl z-[100] animate-bounce ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 
          toast.type === 'success' ? 'bg-green-600 text-white' :
          'bg-white text-black'
        }`}>
          {toast.msg}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within provider");
  return context;
};