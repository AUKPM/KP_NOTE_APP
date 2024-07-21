import React, { createContext, useContext, useState, ReactNode } from 'react';

type BackgroundContextType = {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const BackgroundProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [backgroundColor, setBackgroundColor] = useState('transparent');

  return (
    <BackgroundContext.Provider value={{ backgroundColor, setBackgroundColor }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};
