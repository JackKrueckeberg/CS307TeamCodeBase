import React, { createContext, useState, useContext } from 'react';

const NavigationContext = createContext();

export const useNavigationContext = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
  const [isNavigated, setIsNavigated] = useState(false);

  return (
    <NavigationContext.Provider value={{ isNavigated, setIsNavigated }}>
      {children}
    </NavigationContext.Provider>
  );
};
