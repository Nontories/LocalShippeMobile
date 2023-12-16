import React, { createContext, useState } from 'react';

// Create the UserContext
export const UserContext = createContext();

// Create the UserProvider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Define a function to update the user information
    const updateUser = (userData) => {
        setUser(userData);
    };

    const updateToken = (token) => {
        setToken(token);
    };

    return (
        <UserContext.Provider value={{ user, token, updateUser, updateToken }}>
            {children}
        </UserContext.Provider>
    );
};