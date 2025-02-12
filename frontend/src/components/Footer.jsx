import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import CustomButton from "./Button.jsx";

const Footer = () => {
    return (
        <footer className="text-white">
            {/* Newsletter Section */}
            <div className="py-5" style={{ backgroundColor: "#1a1a1a" }}>
                <Container>
                    <Row className="text-center">
                        <Col>
                            <h5>Subscribe to Our Newsletter</h5>
                            <p>Get the latest updates on destinations, events, and travel tips.</p>
                            <Form className="d-flex justify-content-center">
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-50 me-2"
                                    style={{
                                        borderRadius: "30px",
                                        padding: "0.5rem 1rem",
                                        border: "none",
                                        outline: "none",
                                    }}
                                />
                                <CustomButton label="Subscribe" variant="warning" rounded className="text-white" />
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Main Footer Content */}
            <div className="py-5" style={{ backgroundColor: "#111" }}>
                <Container>
                    <Row className="text-center text-md-start">

                        {/* Brand Info */}
                        <Col md={4} className="mb-4">
                            <h4 className="fw-bold mb-3">LocaleGems</h4>
                            <p>Discover hidden gems and local experiences around the world.</p>

                            {/* Social Media Icons */}
                            <div className="d-flex justify-content-center justify-content-md-start gap-3 mt-3">
                                <a href="#" className="text-white fs-5"><FaFacebookF /></a>
                                <a href="#" className="text-white fs-5"><FaTwitter /></a>
                                <a href="#" className="text-white fs-5"><FaInstagram /></a>
                                <a href="#" className="text-white fs-5"><FaLinkedinIn /></a>
                            </div>
                        </Col>

                        {/* Useful Links */}
                        <Col md={4} className="mb-4">
                            <h5 className=" mb-3">Quick Links</h5>
                            <ul className="list-unstyled">
                                <li><a href="/events" className="text-white text-decoration-none">Events</a></li>
                                <li><a href="/destinations" className="text-white text-decoration-none">Destinations</a></li>
                                <li><a href="/blogs" className="text-white text-decoration-none">Blogs</a></li>
                                <li><a href="/about" className="text-white text-decoration-none">About Us</a></li>
                                <li><a href="/contact" className="text-white text-decoration-none">Contact</a></li>
                            </ul>
                        </Col>

                        {/* Contact Info */}
                        <Col md={4} className="mb-4">
                            <h5 className=" mb-3">Contact Us</h5>
                            <p>Email: support@localegems.com</p>
                            <p>Phone: +1 234 567 890</p>
                            <p>Location: Brantford, ON, Canada</p>
                        </Col>

                    </Row>
                </Container>
            </div>

            {/* Copyright Section */}
            <div className="py-3 text-center" style={{ backgroundColor: "#000" }}>
                <Container>
                    <p className="mb-0 fw-light">&copy; {new Date().getFullYear()} LocaleGems. All Rights Reserved.</p>
                </Container>
            </div>
        </footer>
    );
};

export default Footer;