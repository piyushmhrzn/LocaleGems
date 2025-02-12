// src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const baseURL = "http://localhost:3000/api"; // backend api
        axios.get(`${baseURL}/events`)
            .then(res => setEvents(res.data.data))
            .catch(err => console.error("Error fetching events:", err));
        axios.get(`${baseURL}/destinations`)
            .then(res => setDestinations(res.data.data))
            .catch(err => console.error("Error fetching destinations:", err));
        axios.get(`${baseURL}/blogs`)
            .then(res => setBlogs(res.data.data))
            .catch(err => console.error("Error fetching blogs:", err));
    }, []);

    return (
        <AppContext.Provider value={{ events, destinations, blogs }}>
            {children}
        </AppContext.Provider>
    );
};