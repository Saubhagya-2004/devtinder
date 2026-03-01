import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFromStorage();
    }, []);

    const loadFromStorage = async () => {
        try {
            const storedToken = await AsyncStorage.getItem("token");
            const storedUser = await AsyncStorage.getItem("user");
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.log("Error loading from storage:", e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axiosInstance.post("/login", { email, password });
        // Backend returns { data: user, token, message }
        const { data: userData, token: authToken } = res.data;
        if (!authToken) {
            throw new Error("Authentication failed. Please try again.");
        }
        await AsyncStorage.setItem("token", authToken);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        setToken(authToken);
        setUser(userData);
        return userData;
    };

    const logout = async () => {
        try {
            await axiosInstance.post("/logout");
        } catch (e) { }
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const updateUser = async (updatedUser) => {
        setUser(updatedUser);
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider
            value={{ user, token, loading, login, logout, updateUser, setUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
