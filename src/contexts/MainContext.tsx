import React, {createContext, useContext, useState, ReactNode} from 'react';

interface MainContextType {
  menuVisible: boolean;
  showMenu: () => voide;
  hideMenu: () => voide;
  toggleMenu: () => void;
}

const MainContext = createContext<MainContextType | undefined>(undefined);

export const MainProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(toggle => !toggle);
  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  return (
    <MainContext.Provider value={{menuVisible, toggleMenu, showMenu, hideMenu}}>
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error('useMainContext must be used within a MainProvider');
  }
  return context;
};
