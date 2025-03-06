import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const baseURL = "http://localhost:3000/api";

    const fetchData = async () => {
        setLoading(true);
        try {
            const [eventsRes, destinationsRes, blogsRes] = await Promise.all([
                axios.get(`${baseURL}/events`),
                axios.get(`${baseURL}/destinations`),
                axios.get(`${baseURL}/blogs`)
            ]);
            setEvents(eventsRes.data.data);
            setDestinations(destinationsRes.data.data);
            setBlogs(blogsRes.data.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async (token) => {
        try {
            const res = await axios.get(`${baseURL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data.user);
        } catch (err) {
            console.error("Error fetching user:", err);
            localStorage.removeItem("authToken");
            setUser(null);
        }
    };

    useEffect(() => {
        fetchData();
        const token = localStorage.getItem("authToken");
        if (token) fetchUser(token);
    }, []);

    const fetchEvents = async (filters = {}) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            console.log("Fetching events with filters:", queryParams); // Debugging line
            const response = await axios.get(`${baseURL}/events?${queryParams}`);
            setEvents(response.data.data);
        } catch (error) {
            console.error("Error fetching filtered events:", error);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setUser(null);
    };

    return (
        <AppContext.Provider value={{ events, destinations, blogs, user, setUser, logout, loading, fetchEvents }}>
            {children}
        </AppContext.Provider>
    );
};