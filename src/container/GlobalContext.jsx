'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const GlobalContext = createContext();

const useLocalState = (key, defaultValue) => {
    const [state, setState] = useState(defaultValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load the state from local storage
    useEffect(() => {
        try {
            const storedState = localStorage.getItem(key);
            if (storedState) setState(JSON.parse(storedState));
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [key]);

    // Save the state to local storage
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (err) {
            setError(err);
        }
    }, [key, state]);

    return { state, setState, loading, error };
};

export const GlobalContextProvider = ({ children }) => {
    // Global States
    const data = useLocalState('data', {
        name: 'John Doe',
        age: 25,
        email: '',
    });

    // Return the global variables in this wrapper
    return (
        <GlobalContext.Provider value={{ data }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error(
            'useGlobalContext must be used within a GlobalContextProvider'
        );
    }
    return context;
};
