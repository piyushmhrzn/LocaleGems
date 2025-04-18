
import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import Banner from "../components/Banner";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CustomButton from "../components/Button";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useTranslation } from "react-i18next";
import LoginBanner from "../../public/images/login-banner.jpg";
import { Helmet } from "react-helmet"; // ✅ SEO Helmet

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

const AuthPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { setUser } = useContext(AppContext);
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [signupData, setSignupData] = useState({
        firstname: "", lastname: "", email: "", password: "", role: "user"
    });
    const [message, setMessage] = useState("");

    const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api/auth/login`, loginData);
            localStorage.setItem("authToken", response.data.token);
            setUser(response.data.data);
            navigate("/");
        } catch (error) {
            const errMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Login failed. Please try again.";
                setMessage(errMessage);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api/auth/register`, signupData);
            setMessage("Signup successful! Please log in.");
            setSignupData({ firstname: "", lastname: "", email: "", password: "", role: "user" });
            navigate("/login");
        } catch (error) {
            const errMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Signup failed. Please try again.";
                setMessage(errMessage);
        }
    };

    return (
        <>
            <Helmet>
                <title>Login or Register | LocaleGems</title>
                <meta name="description" content="Login to your LocaleGems account or sign up to discover cultural events, destinations, and local businesses." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <NavBar />
            <Banner
                heading={t("Login or Sign Up")}
                subheading={t("Join us to discover the best cultural experiences")}
                backgroundImage={LoginBanner}
                height="50vh"
            />

            <Row className="mt-5 mb-5 d-flex justify-content-center">
                <Col md={6}>
                    <div className="text-center mb-3">
                        {message && <div className="alert alert-warning">{message}</div>}
                    </div>
                </Col>
            </Row>

            <Container className="mt-5 mb-5 d-flex justify-content-center">
                <Row className="w-100">
                    <Col md={6} className="mb-4">
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Card className="p-4 shadow-lg border-0 rounded-4">
                                <Card.Body>
                                    <h2 className="text-center fw-bold mb-3">Login</h2>
                                    <Form onSubmit={handleLoginSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" name="email" onChange={handleLoginChange} required className="p-2 rounded-3 shadow-sm" />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" name="password" onChange={handleLoginChange} required className="p-2 rounded-3 shadow-sm" />
                                        </Form.Group>
                                        <div className="text-center">
                                            <CustomButton label="Login" variant="primary" size="md" rounded="true" type="submit" />
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>

                    <Col md={6}>
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <Card className="p-4 shadow-lg border-0 rounded-4">
                                <Card.Body>
                                    <h2 className="text-center fw-bold mb-3">Sign Up</h2>
                                    <Form onSubmit={handleSignupSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>First Name</Form.Label>
                                                    <Form.Control type="text" name="firstname" onChange={handleSignupChange} required className="p-2 rounded-3 shadow-sm" />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Last Name</Form.Label>
                                                    <Form.Control type="text" name="lastname" onChange={handleSignupChange} required className="p-2 rounded-3 shadow-sm" />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" name="email" onChange={handleSignupChange} required className="p-2 rounded-3 shadow-sm" />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" name="password" onChange={handleSignupChange} required className="p-2 rounded-3 shadow-sm" />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Role</Form.Label>
                                            <Form.Control as="select" name="role" onChange={handleSignupChange} value={signupData.role} required className="p-2 rounded-3 shadow-sm">
                                                <option value="user">User</option>
                                                <option value="owner">Owner</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <div className="text-center">
                                            <CustomButton label="Sign Up" variant="success" size="md" rounded="true" type="submit" />
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </Container>

            <Footer />
        </>
    );
};

export default AuthPage;
