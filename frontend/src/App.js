import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Events from "./pages/event";
import Destinations from "./pages/destination";
import Blogs from "./pages/blog";
import About from "./pages/about";
import Contact from "./pages/contact";
import Login from "./pages/login";
import Profile from "./pages/Profile";
import DestinationDetail from "./pages/destinationDetail.jsx";
import BusinessRegistrationForm from "./pages/BusinessRegistrationForm.jsx";
import AdminPanel from "./pages/adminpanel.jsx";
import AdminLogin from "./pages/adminlogin.jsx";
import { AppProvider } from "./context/AppContext";
import { jwtDecode } from "jwt-decode"; // Add jwt-decode

const ProtectedAdminRoute = ({ element }) => {
  const token = localStorage.getItem("authToken");
  if (!token) return <Navigate to="/admin-login" />;

  try {
    const decoded = jwtDecode(token);
    return decoded.role === "admin" ? element : <Navigate to="/admin-login" />;
  } catch (error) {
    return <Navigate to="/admin-login" />;
  }
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/BusinessRegistrationForm" element={<BusinessRegistrationForm />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedAdminRoute element={<AdminPanel />} />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;