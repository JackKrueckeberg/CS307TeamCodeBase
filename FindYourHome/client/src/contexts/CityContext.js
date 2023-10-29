import React, { createContext, useContext, useState } from 'react';

export const CityContext = createContext();

export const useCity = () => {
    const context = useContext(CityContext);
    if (!context) {
        throw new Error("cityContext must be used within cityProvider");
    }
    return context;
};

export const CityProvider = ({ children }) => {
    const [globalCity, setGlobalCity] = useState();

    return (
        <CityContext.Provider value={{ globalCity, setGlobalCity }}>
            {children}
        </CityContext.Provider>
    );
};
