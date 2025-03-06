import React, { useState, useEffect, useContext } from "react";
import { Navbar, Nav, Container, Form, FormControl, Button, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BiSearch, BiUser } from "react-icons/bi";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false); // To toggle search input visibility
  const { user, setUser, logout } = useContext(AppContext); // Access user from AppContext
  const [hasBusiness, setHasBusiness] = useState(false); // Check if user has a business

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    const checkBusinessOwnership = async () => {
      if (user && user.role === "owner") {
        try {
          const token = localStorage.getItem("authToken");
          const response = await axios.get("http://localhost:3000/api/businesses", {
            headers: { Authorization: `Bearer ${token}` },
            params: { user_id: user._id },
          });
          setHasBusiness(response.data.data.length > 0);
        } catch (error) {
          console.error("Error checking business ownership:", error);
          setHasBusiness(false);
        }
      } else {
        setHasBusiness(false); // Reset if not an owner
      }
    };
    checkBusinessOwnership();
  }, [user]);


  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const handleLogout = () => {
    if (logout) {
      logout(); // Use context logout if available
    } else {
      localStorage.removeItem("authToken");
      setUser(null);
      window.location.href = "/login"; // Redirect to login page
    }
  };

  return (
    <Navbar
      expand="lg"
      className={`fixed-top ${scrolled ? "bg-nav shadow-lg" : ""}`} // Remove transparent bg on scroll
      style={{
        transition: "0.3s",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        height: "70px", // Increased navbar height for better appearance
      }}
    >
      <Container>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          style={{ display: "inline-block" }} // Important for motion to work on inline elements
        >
          <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
            LocaleGems
          </Navbar.Brand>
        </motion.div>

        <Navbar.Toggle
          aria-controls="navbar-nav"
          className="border-0" // No border for the hamburger
          style={{ backgroundColor: "white" }} // White hamburger icon
        />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {/* EVENTS */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              style={{ display: "inline-block" }}
            >
              <Nav.Link as={Link} to="/events" className="text-white ms-3">
                Events
              </Nav.Link>
            </motion.div>

            {/* DESTINATIONS */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              style={{ display: "inline-block" }}
            >
              <Nav.Link as={Link} to="/destinations" className="text-white ms-3">
                Destinations
              </Nav.Link>
            </motion.div>

            {/* BLOGS */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              style={{ display: "inline-block" }}
            >
              <Nav.Link as={Link} to="/blogs" className="text-white ms-3">
                Blogs
              </Nav.Link>
            </motion.div>

            {/* ABOUT US */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              style={{ display: "inline-block" }}
            >
              <Nav.Link as={Link} to="/about" className="text-white ms-3">
                About Us
              </Nav.Link>
            </motion.div>

            {/* CONTACT */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              style={{ display: "inline-block" }}
            >
              <Nav.Link as={Link} to="/contact" className="text-white ms-3">
                Contact
              </Nav.Link>
            </motion.div>

            {/* Conditional Business Link */}
            {(!user || (user.role === "owner" && !hasBusiness)) && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                style={{ display: "inline-block" }}
              >
                <Nav.Link as={Link} to="/BusinessRegistrationForm" className="text-white ms-3">
                  Register Business
                </Nav.Link>
              </motion.div>
            )}
            {user && user.role === "owner" && hasBusiness && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                style={{ display: "inline-block" }}
              >
                <Nav.Link as={Link} to="/BusinessInfo" className="text-white ms-3">
                  Business Info
                </Nav.Link>
              </motion.div>
            )}
          </Nav>


          {/* Search Input Toggle */}
          <div className="d-flex ms-3 align-items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              style={{ display: "inline-block" }}
            >
              <Button variant="outline-none" size="lg" style={{ color: "white" }} onClick={toggleSearch}>
                <BiSearch />
              </Button>
            </motion.div>

            {searchVisible && (
              <Form className="d-flex ms-3">
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
              </Form>
            )}
          </div>

          {/* Login Icon */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            style={{ display: "inline-block" }}
          >
            {user ? (
              <NavDropdown
                title={`${user.firstname} ${user.lastname}`}
                id="user-dropdown"
                className="ms-3 text-white"
                align="end" // Dropdown aligns to the right
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login" className="ms-3 text-white">
                <BiUser size={22} />
              </Nav.Link>
            )}

          </motion.div>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;