import React, { createContext, useContext } from 'react';
import { useAppEngine } from '../hooks/useAppEngine';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const engine = useAppEngine();

  return (
    <AppContext.Provider value={engine}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
