import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Create this file for styling

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">Festora</div>
      <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>
      <ul className={isOpen ? "nav-links open" : "nav-links"}>
        <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
        <li><Link to="/explore" onClick={() => setIsOpen(false)}>Explore</Link></li>
        <li><Link to="/blogs" onClick={() => setIsOpen(false)}>Blogs</Link></li>
        <li><Link to="/about" onClick={() => setIsOpen(false)}>About Us</Link></li>
        <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
