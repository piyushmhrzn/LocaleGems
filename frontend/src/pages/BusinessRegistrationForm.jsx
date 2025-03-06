import React, { useContext, useState } from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const BusinessRegistrationForm = () => {
    const { destinations } = useContext(AppContext);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        location: "",
        contactEmail: "",
        contactPhone: "",
        destination: "",
        proximity_to_destination: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/businesses", formData, {
                headers: { "Content-Type": "application/json" },
            });
            setSuccessMessage(response.data.message); // "Business registered successfully. Waiting for verification"
            setErrorMessage("");
            // Clear form
            setFormData({
                name: "",
                category: "",
                description: "",
                location: "",
                contactEmail: "",
                contactPhone: "",
                destination: "",
                proximity_to_destination: "",
            });
        } catch (error) {
            setSuccessMessage("");
            setErrorMessage(error.response?.data?.message || "Failed to register business");
            console.error("Submission error:", error.response?.data || error.message);
        }
    };

    return (
        <>
            <NavBar />
            <Banner
                heading="Register Your Business Today!"
                subheading="We are here to help you."
                backgroundImage="/images/about-banner.jpg"
                height="60vh"
            />
            <Container className="my-5">
                <Row className="justify-content-md-center">
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                    <Col md={8}>
                        <div className="p-4 shadow-lg rounded-3 bg-white">
                            <h3 className="text-center mb-4 fw-bold" style={{ color: "#162F65" }}>
                                Register Your Business
                            </h3>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Business Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder="Enter business name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="category"
                                        placeholder="e.g., Restaurant, Handicraft"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        placeholder="Enter business description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        required
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location"
                                        placeholder="Enter location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Contact Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="contactEmail"
                                                placeholder="Enter contact email"
                                                value={formData.contactEmail}
                                                onChange={handleChange}
                                                required
                                                className="shadow-sm"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Contact Phone</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="contactPhone"
                                                placeholder="Enter contact phone"
                                                value={formData.contactPhone}
                                                onChange={handleChange}
                                                required
                                                className="shadow-sm"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Nearby Destination</Form.Label>
                                            <Form.Select
                                                name="destination"
                                                value={formData.destination}
                                                onChange={handleChange}
                                                required
                                                className="shadow-sm"
                                            >
                                                <option value="">Select a destination</option>
                                                {destinations.map(destination => (
                                                    <option key={destination._id} value={destination._id}>
                                                        {destination.name} ({destination.city}, {destination.country})
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Proximity to Destination (km)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="proximity_to_destination"
                                                placeholder="Enter proximity"
                                                value={formData.proximity_to_destination}
                                                onChange={handleChange}
                                                required
                                                className="shadow-sm"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button
                                    type="submit"
                                    className="btn-main w-100 mt-4 shadow"
                                    style={{
                                        backgroundColor: "#162F65",
                                        borderColor: "#162F65",
                                        padding: "10px",
                                        fontSize: "1.1rem",
                                        borderRadius: "50px",
                                    }}
                                >
                                    Register Business
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default BusinessRegistrationForm;