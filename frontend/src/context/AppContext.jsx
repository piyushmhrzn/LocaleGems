import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [totalDestinationPages, setTotalDestinationPages] = useState(1);
    const [currentDestinationPage, setCurrentDestinationPage] = useState(1);
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

    const fetchDestinations = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/destinations?page=${page}&limit=3`);
            setDestinations(response.data.data);
            setTotalDestinationPages(response.data.totalPages);
            setCurrentDestinationPage(page);
        } catch (err) {
            console.error("Error fetching destinations:", err);
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

    const fetchBusinesses = async (filters = {}) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await axios.get(`${baseURL}/businesses?${queryParams}`);
            setBusinesses(response.data.data);
        } catch (error) {
            console.error("Error fetching filtered businesses:", error);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AppContext.Provider
            value={{
                events,
                businesses,
                destinations,
                totalDestinationPages,
                currentDestinationPage,
                fetchDestinations,
                blogs,
                user,
                setUser,
                logout,
                loading,
                fetchEvents,
                fetchBusinesses
            }}>
            {children}
        </AppContext.Provider>
    );
};