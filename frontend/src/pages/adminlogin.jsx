import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet"; 

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000"; // Use env var or fallback to localhost

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api/auth/admin-login`, formData);
            localStorage.setItem("authToken", response.data.token); // Store JWT
            setErrorMessage("");
            navigate("/admin"); // Redirect to AdminPanel
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to login");
        }
    };

    return (
        <>
         <Helmet>
                <title>Admin Login | LocaleGems Dashboard</title>
                <meta name="description" content="Secure login page for LocaleGems administrators to access the admin dashboard and manage platform data." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

          <Container className="my-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <div className="p-4 shadow-lg rounded-3 bg-white">
                        <h2 className="text-center mb-4 fw-bold" style={{ color: "#007bff" }}>
                            Admin Login
                        </h2>
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="shadow-sm"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="shadow-sm"
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                className="w-100 mt-4 shadow"
                                style={{
                                    backgroundColor: "#007bff",
                                    borderColor: "#007bff",
                                    padding: "10px",
                                    fontSize: "1.1rem",
                                }}
                            >
                                Login
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
        </>
      
    );
};

export default AdminLogin;