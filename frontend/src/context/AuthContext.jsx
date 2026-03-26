import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { googleLogout } from '@react-oauth/google';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('https://student-mindfulness-tracker.onrender.com/api/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
    };

    const googleLogin = async (token) => {
        try {
            const { data } = await axios.post('https://student-mindfulness-tracker.onrender.com/api/auth/google', { token });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Google Login failed' };
        }
    };

    const register = async (username, email, password) => {
        try {
            const { data } = await axios.post('https://student-mindfulness-tracker.onrender.com/api/auth/register', { username, email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = async () => {
        try {
            if (user && user.token) {
                await axios.post('https://student-mindfulness-tracker.onrender.com/api/auth/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
            }
        } catch (error) {
            console.error("Logout API failed", error);
        } finally {
            googleLogout();
            setUser(null);
            localStorage.removeItem('userInfo');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, googleLogin, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
