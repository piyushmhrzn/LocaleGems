import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import CustomButton from "./Button.jsx";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState(""); // State for email input
    const [isSubmitting, setIsSubmitting] = useState(false); // Optional: Disable button during submission

    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000"; // Use env var or fallback to localhost

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post(`${apiUrl}/api/newsletter/subscribe`, { email });
            toast.success("Thank you for subscribing to LocaleGems! Stay tuned for the latest updates on destinations, events, and travel tips straight to your inbox.");
            setEmail("");
        } catch (error) {
            toast.error("Oops! Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="text-dark">
            {/* Newsletter Section */}
            <div className="py-5" style={{ backgroundColor: "#f8f8f8" }}>
                <ToastContainer position="top-right" autoClose={3000} />
                <Container>
                    <Row className="text-center">
                        <Col>
                            <h5>{t("Subscribe to Our Newsletter")}</h5>
                            <p>{t("Get the latest updates")}</p>
                            <Form className="d-flex justify-content-center" onSubmit={handleSubmit}>
                                <Form.Control
                                    type="email"
                                    placeholder={t("Enter your email")}
                                    className="w-50 me-2"
                                    style={{
                                        borderRadius: "30px",
                                        padding: "0.5rem 1rem",
                                        border: "none",
                                        outline: "none",
                                    }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required // Ensure email is entered
                                />
                                <CustomButton
                                    label={t("Subscribe")}
                                    variant="warning"
                                    rounded
                                    className="text-white"
                                    type="submit"
                                    disabled={isSubmitting} // Disable during submission
                                />
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Main Footer Content */}
            <div className="py-5" style={{ backgroundColor: "#f8f8f8" }}>
                <Container>
                    <Row className="text-center text-md-start">
                        {/* Brand Info */}
                        <Col md={4} className="mb-4">
                            <h4 className="fw-bold mb-3">LocaleGems</h4>
                            <p>Discover hidden gems and local experiences around the world.</p>
                            <div className="d-flex justify-content-center justify-content-md-start gap-3 mt-3">
                                <a href="#" className="text-dark fs-5"><FaFacebookF /></a>
                                <a href="#" className="text-dark fs-5"><FaTwitter /></a>
                                <a href="#" className="text-dark fs-5"><FaInstagram /></a>
                                <a href="#" className="text-dark fs-5"><FaLinkedinIn /></a>
                            </div>
                        </Col>

                        {/* Useful Links */}
                        <Col md={4} className="mb-4">
                            <h5 className="mb-3">Quick Links</h5>
                            <ul className="list-unstyled">
                                <li><a href="/events" className="text-dark text-decoration-none">{t("Events")}</a></li>
                                <li><a href="/destinations" className="text-dark text-decoration-none">{t("Destinations")}</a></li>
                                <li><a href="/blogs" className="text-dark text-decoration-none">{t("Blogs")}</a></li>
                                <li><a href="/about" className="text-dark text-decoration-none">{t("About Us")}</a></li>
                                <li><a href="/contact" className="text-dark text-decoration-none">{t("Contact")}</a></li>
                            </ul>
                        </Col>

                        {/* Contact Info */}
                        <Col md={4} className="mb-4">
                            <h5 className="mb-3">Contact Us</h5>
                            <p>Email: support@localegems.com</p>
                            <p>Phone: +1 234 567 890</p>
                            <p>Location: Brantford, ON, Canada</p>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Copyright Section */}
            <div className="py-3 text-center" style={{ backgroundColor: "#162F65" }}>
                <Container>
                    <p className="text-white mb-0 fw-light">© {new Date().getFullYear()} LocaleGems. All Rights Reserved.</p>
                </Container>
            </div>
        </footer>
    );
};

export default Footer;