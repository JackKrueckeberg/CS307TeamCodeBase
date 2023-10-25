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
    const [city, setGlobalCity] = useState(null);

    return (
        <CityContext.Provider value={{ city, setGlobalCity }}>
            {children}
        </CityContext.Provider>
    );
};
