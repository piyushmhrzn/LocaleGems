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

    // Use REACT_APP_API_URL or fallback to http://localhost:3000
    const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3000";

    const fetchData = async () => {
        setLoading(true);
        try {
            const [eventsRes, destinationsRes, blogsRes] = await Promise.all([
                axios.get(`${baseURL}/api/events`),
                axios.get(`${baseURL}/api/destinations`),
                axios.get(`${baseURL}/api/blogs`)
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
            const response = await axios.get(`${baseURL}/api/destinations?page=${page}&limit=6`);
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
            const res = await axios.get(`${baseURL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data.user);
        } catch (err) {
            console.error("Error fetching user:", err);
            localStorage.removeItem("authToken");
            setUser(null);
        }
    };

    const fetchEvents = async (filters = {}) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            console.log("Fetching events with filters:", queryParams);
            const response = await axios.get(`${baseURL}/api/events?${queryParams}`);
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
            const response = await axios.get(`${baseURL}/api/businesses?${queryParams}`);
            setBusinesses(response.data.data);
        } catch (error) {
            console.error("Error fetching filtered businesses:", error);
        } finally {
            setLoading(false);
        }
    };

    // New slug-based functions
    const fetchDestinationsBySlug = async (slug) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/api/destinations/slug/${slug}`);
            return response.data.data; // Return single destination
        } catch (err) {
            console.error("Error fetching destination by slug:", err);
            throw err; // Let the caller handle the error
        } finally {
            setLoading(false);
        }
    };

    const fetchEventsBySlug = async (slug) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/api/events/slug/${slug}`);
            return response.data.data; // Return single event
        } catch (err) {
            console.error("Error fetching event by slug:", err);
            throw err; // Let the caller handle the error
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setUser(null);
        window.location.href = "/login";
    };

    useEffect(() => {
        fetchData();
        const token = localStorage.getItem("authToken");
        if (token) fetchUser(token);
    }, []);

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
                fetchBusinesses,
                fetchDestinationsBySlug,
                fetchEventsBySlug,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};