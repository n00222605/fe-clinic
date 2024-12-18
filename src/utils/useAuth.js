import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {

        if (localStorage.getItem('token')) {
            return localStorage.getItem('token');
        }
        else {
            return null;
        }
    });

    const login = (email, password) => {
        axios
            .post(`https://fed-medical-clinic-api.vercel.app/login`, {
                email,
                password,
            })
            .then((res) => {
                setToken(res.data.token);
                localStorage.setItem("token", res.data.token);
            })
            .catch((err) => {
                console.error(err);
                alert('Login failed')
            });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const value = {
        token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
