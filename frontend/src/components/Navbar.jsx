import React, { useState, useEffect, useContext } from "react";
import { Navbar, Nav, Container, Form, FormControl, Button, NavDropdown, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BiSearch, BiUser } from "react-icons/bi";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useTranslation } from "react-i18next";

const NavBar = () => {
  const { t, i18n } = useTranslation(); // Access translations and i18n instance
  const [scrolled, setScrolled] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ destinations: [], events: [], blogs: [] });
  const { user, setUser, logout } = useContext(AppContext);
  const [hasBusiness, setHasBusiness] = useState(false);
  const navigate = useNavigate();

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
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
        setHasBusiness(false);
      }
    };
    checkBusinessOwnership();
  }, [user]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults({ destinations: [], events: [], blogs: [] });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [destResponse, eventResponse, blogResponse] = await Promise.all([
        axios.get(`http://localhost:3000/api/destinations/search?query=${encodeURIComponent(searchQuery)}`, { headers }),
        axios.get(`http://localhost:3000/api/events/search?query=${encodeURIComponent(searchQuery)}`, { headers }),
        axios.get(`http://localhost:3000/api/blogs/search?query=${encodeURIComponent(searchQuery)}`, { headers }).catch(() => ({ data: { data: [] } })),
      ]);

      setSearchResults({
        destinations: destResponse.data.data || [],
        events: eventResponse.data.data || [],
        blogs: blogResponse.data.data || [],
      });
    } catch (error) {
      console.error("Search error:", error.response?.data || error.message);
      setSearchResults({ destinations: [], events: [], blogs: [] });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchVisible && searchQuery.trim()) handleSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchVisible]);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    if (searchVisible) {
      setSearchQuery("");
      setSearchResults({ destinations: [], events: [], blogs: [] });
    }
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("authToken");
      setUser(null);
      navigate("/login");
    }
  };

  const handleResultClick = (type, id) => {
    setSearchVisible(false);
    setSearchQuery("");
    setSearchResults({ destinations: [], events: [], blogs: [] });
    navigate(`/${type}/${id}`);
  };

  return (
    <Navbar
      expand="lg"
      className={`fixed-top ${scrolled ? "bg-nav shadow-lg" : ""}`}
      style={{
        transition: "0.3s",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        height: "70px",
      }}
    >
      <Container>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} style={{ display: "inline-block" }}>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-white">{t("LocaleGems")}</Navbar.Brand>
        </motion.div>

        <Navbar.Toggle aria-controls="navbar-nav" className="border-0" style={{ backgroundColor: "white" }} />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} style={{ display: "inline-block" }}>
              <Nav.Link as={Link} to="/events" className="text-white ms-3">{t("Events")}</Nav.Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} style={{ display: "inline-block" }}>
              <Nav.Link as={Link} to="/destinations" className="text-white ms-3">{t("Destinations")}</Nav.Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} style={{ display: "inline-block" }}>
              <Nav.Link as={Link} to="/blogs" className="text-white ms-3">{t("Blogs")}</Nav.Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} style={{ display: "inline-block" }}>
              <Nav.Link as={Link} to="/about" className="text-white ms-3">{t("About Us")}</Nav.Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} style={{ display: "inline-block" }}>
              <Nav.Link as={Link} to="/contact" className="text-white ms-3">{t("Contact")}</Nav.Link>
            </motion.div>
            {(!user || (user.role === "owner" && !hasBusiness)) && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} style={{ display: "inline-block" }}>
                <Nav.Link as={Link} to="/BusinessRegistrationForm" className="text-white ms-3">{t("Register Business")}</Nav.Link>
              </motion.div>
            )}
            {user && user.role === "owner" && hasBusiness && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} style={{ display: "inline-block" }}>
                <Nav.Link as={Link} to="/BusinessInfo" className="text-white ms-3">{t("Business Info")}</Nav.Link>
              </motion.div>
            )}
          </Nav>

          {/* Search Input Toggle */}
          <div className="d-flex ms-3 align-items-center position-relative">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} style={{ display: "inline-block" }}>
              <Button variant="outline-none" size="lg" style={{ color: "white" }} onClick={toggleSearch}>
                <BiSearch />
              </Button>
            </motion.div>

            {searchVisible && (
              <>
                <Form className="d-flex ms-3" onSubmit={handleSearchSubmit}>
                  <FormControl
                    type="search"
                    placeholder={t("Search destinations, events, blogs...")}
                    className="me-2"
                    aria-label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Form>

                {(searchResults.destinations.length > 0 || searchResults.events.length > 0 || searchResults.blogs.length > 0) && (
                  <div
                    className="position-absolute bg-white shadow rounded p-3"
                    style={{ top: "100%", right: 0, zIndex: 1000, minWidth: "300px" }}
                  >
                    {searchResults.destinations.length > 0 && (
                      <>
                        <h6 className="text-light bg-dark p-2 mb-2">{t("Destinations")}</h6>
                        {searchResults.destinations.map(dest => (
                          <Dropdown.Item
                            key={dest._id}
                            onClick={() => handleResultClick("destinations", dest._id)}
                            className="py-1"
                          >
                            {dest.name}
                          </Dropdown.Item>
                        ))}
                      </>
                    )}
                    {searchResults.events.length > 0 && (
                      <>
                        <h6 className="text-light bg-dark p-2 mb-2 mt-3">{t("Events")}</h6>
                        {searchResults.events.map(event => (
                          <Dropdown.Item
                            key={event._id}
                            onClick={() => handleResultClick("events", event._id)}
                            className="py-1"
                          >
                            {event.name}
                          </Dropdown.Item>
                        ))}
                      </>
                    )}
                    {searchResults.blogs.length > 0 && (
                      <>
                        <h6 className="text-light bg-dark p-2 mb-2 mt-3">{t("Blogs")}</h6>
                        {searchResults.blogs.map(blog => (
                          <Dropdown.Item
                            key={blog._id}
                            onClick={() => handleResultClick("blogs", blog._id)}
                            className="py-1"
                          >
                            {blog.title || t("Untitled Blog")}
                          </Dropdown.Item>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* User Dropdown */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} style={{ display: "inline-block" }}>
            {user ? (
              <NavDropdown
                title={`${user.firstname} ${user.lastname}`}
                id="user-dropdown"
                className="ms-3 text-white"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">{t("Profile")}</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>{t("Logout")}</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login" className="ms-3 text-white">
                <BiUser size={22} />
              </Nav.Link>
            )}
          </motion.div>

          {/* Language Switcher */}
          <NavDropdown
            title={i18n.language.toUpperCase()}
            id="language-dropdown"
            className="ms-3 text-white"
            align="end"
          >
            <NavDropdown.Item onClick={() => changeLanguage("en")}>{t("English")}</NavDropdown.Item>
            <NavDropdown.Item onClick={() => changeLanguage("es")}>{t("Spanish")}</NavDropdown.Item>
            <NavDropdown.Item onClick={() => changeLanguage("fr")}>{t("French")}</NavDropdown.Item>
            <NavDropdown.Item onClick={() => changeLanguage("hi")}>{t("Hindi")}</NavDropdown.Item>
            <NavDropdown.Item onClick={() => changeLanguage("ne")}>{t("Nepali")}</NavDropdown.Item>
            {/* Add more languages as needed */}
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;