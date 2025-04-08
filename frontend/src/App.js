import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Events from "./pages/event";
import Destinations from "./pages/destination";
import Blogs from "./pages/blog";
import About from "./pages/about";
import Contact from "./pages/contact";
import Login from "./pages/login";
import Profile from "./pages/profile";
import EventDetail from "./pages/eventDetail.jsx";
import DestinationDetail from "./pages/destinationDetail.jsx";
import BusinessRegistrationForm from "./pages/BusinessRegistrationForm.jsx";
import BusinessInfo from "./pages/businessInfo.jsx";
import AdminPanel from "./pages/adminpanel.jsx";
import AdminLogin from "./pages/adminlogin.jsx";
import NotFound from "./pages/NotFound.jsx";
import { AppProvider } from "./context/AppContext";
import { jwtDecode } from "jwt-decode";

const ProtectedAdminRoute = ({ element }) => {
  const token = localStorage.getItem("authToken");
  if (!token) return <Navigate to="/adminLogin" />;

  try {
    const decoded = jwtDecode(token);
    return decoded.role === "admin" ? element : <Navigate to="/adminLogin" />;
  } catch (error) {
    return <Navigate to="/adminLogin" />;
  }
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:slug" element={<DestinationDetail />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/BusinessRegistrationForm" element={<BusinessRegistrationForm />} />
          <Route path="/BusinessInfo" element={<BusinessInfo />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedAdminRoute element={<AdminPanel />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;