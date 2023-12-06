import React, { createContext, useContext, useState, useEffect } from 'react';

// Original City Context
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

// New Compare Cities Context
export const CompareCitiesContext = createContext();

export const useCompareCities = () => {
    const context = useContext(CompareCitiesContext);
    if (!context) {
        throw new Error("useCompareCities must be used within CompareCitiesProvider");
    }
    return context;
};

export const CompareCitiesProvider = ({ children, value }) => {
    return (
        <CompareCitiesContext.Provider value={value}>
            {children}
        </CompareCitiesContext.Provider>
    );
};




export const AllCitiesContext = createContext();

export const useAllCities = () => {
    const context = useContext(AllCitiesContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export const AllCitiesProvider = ({ children }) => {
    const [allCities, setAllCities] = useState([]);


    return (
        <AllCitiesContext.Provider value={{ allCities, setAllCities }}>
            {children}
        </AllCitiesContext.Provider>
    );
};
