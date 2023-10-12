import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const setLoggedInUser = (userData) => {
        // Logic to set logged-in user
        setUser(userData);
    };

    return (
        <UserContext.Provider value={{ user, setLoggedInUser }}>
            {children}
        </UserContext.Provider>
    );
};
