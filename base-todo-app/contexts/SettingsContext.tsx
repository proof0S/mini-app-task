'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type CheckInMethod = 'swipe' | 'tap';

interface SettingsContextType {
  checkInMethod: CheckInMethod;
  setCheckInMethod: (method: CheckInMethod) => void;
  showMethodModal: boolean;
  setShowMethodModal: (show: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [checkInMethod, setCheckInMethod] = useState<CheckInMethod>('tap');
  const [showMethodModal, setShowMethodModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('checkInMethod');
    if (saved) {
      setCheckInMethod(saved as CheckInMethod);
    } else {
      setShowMethodModal(true);
    }
  }, []);

  const handleSetMethod = (method: CheckInMethod) => {
    setCheckInMethod(method);
    localStorage.setItem('checkInMethod', method);
  };

  return (
    <SettingsContext.Provider value={{ 
      checkInMethod, 
      setCheckInMethod: handleSetMethod,
      showMethodModal,
      setShowMethodModal
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
