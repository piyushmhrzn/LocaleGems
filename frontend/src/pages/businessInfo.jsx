import React, { useContext, useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { Container, Row, Col, Alert, Card } from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const BusinessInfo = () => {
    const { user } = useContext(AppContext);
    const [businesses, setBusinesses] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBusinesses = async () => {
            if (!user || user.role !== "owner") {
                setErrorMessage("You must be logged in as an owner to view this page.");
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get("http://localhost:3000/api/businesses", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBusinesses(response.data.data);
                setErrorMessage("");
            } catch (error) {
                setErrorMessage(error.response?.data?.message || "Failed to fetch business information.");
                console.error("Error fetching businesses:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, [user]);

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <NavBar />
            <Banner
                heading="Your Business Information"
                subheading="View details of your registered business."
                backgroundImage="/images/about-banner.jpg"
                height="60vh"
            />
            <Container className="my-5">
                <Row className="justify-content-md-center">
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                    {!errorMessage && businesses.length === 0 && (
                        <Alert variant="info">No businesses found. Register one to get started!</Alert>
                    )}

                    {businesses.map(business => (
                        <Col key={business._id} md={8}>
                            <Card className="p-4 shadow-lg rounded-3">
                                <Card.Body>
                                    <h3 className="text-center mb-4 fw-bold" style={{ color: "#162F65" }}>
                                        {business.name}
                                    </h3>

                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <p><strong>Category:</strong> {business.category}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Status:</strong> {business.status}</p>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col>
                                            <p><strong>Description:</strong> {business.description}</p>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <p><strong>Location:</strong> {business.location}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>City:</strong> {business.city || "N/A"}</p>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <p><strong>Country:</strong> {business.country || "N/A"}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Contact Email:</strong> {business.contactEmail}</p>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <p><strong>Contact Phone:</strong> {business.contactPhone}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p>
                                                <strong>Nearby Destination:</strong>{" "}
                                                {business.destination_id?.name || "N/A"} (
                                                {business.proximity_to_destination} km)
                                            </p>
                                        </Col>
                                    </Row>

                                    {business.website && (
                                        <Row className="mb-3">
                                            <Col>
                                                <p><strong>Website:</strong> <a href={business.website} target="_blank" rel="noopener noreferrer">{business.website}</a></p>
                                            </Col>
                                        </Row>
                                    )}

                                    {business.businessHours && (
                                        <Row className="mb-3">
                                            <Col>
                                                <p><strong>Business Hours:</strong> {business.businessHours}</p>
                                            </Col>
                                        </Row>
                                    )}

                                    {business.image && (
                                        <Row className="mb-3">
                                            <Col>
                                                <img
                                                    src={business.image}
                                                    alt={business.name}
                                                    className="img-fluid rounded"
                                                    style={{ maxWidth: "100%", height: "auto" }}
                                                />
                                            </Col>
                                        </Row>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default BusinessInfo;