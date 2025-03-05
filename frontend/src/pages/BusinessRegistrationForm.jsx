import React, { useContext, useState } from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import {Form, Button, Container, Row, Col } from "react-bootstrap";

const BusinessRegistrationForm  = () => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        image: "",
        type: "",
        location: "",
        website: "",
        contactEmail: "",
        contactPhone: "",
        businessHours: "",
        city: "",
        country: "",
        logo: "",
        proximity_to_destination: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        alert("Business registered successfully (this is just frontend)");
    };


  return (
    <>
      <NavBar />

      <Banner
        heading="Register Your Business Today!"
        subheading="We are here to help you ."
        backgroundImage="/images/about-banner.jpg"
      />

      <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2 className="text-center mb-4">Register Your Business</h2>
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
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contact Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="contactEmail"
                                placeholder="Enter contact email"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contact Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="contactPhone"
                                placeholder="Enter contact phone"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Proximity to Destination (km)</Form.Label>
                            <Form.Control
                                type="number"
                                name="proximity_to_destination"
                                placeholder="Enter proximity"
                                value={formData.proximity_to_destination}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button  type="submit" className="btn-main mb-5 w-100">
                            Register Business
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
      <Footer />
    </>
  );
};

export default BusinessRegistrationForm;