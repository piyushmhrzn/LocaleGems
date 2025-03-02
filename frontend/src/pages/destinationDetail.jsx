import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Row, Col, Card, Badge, Form, Button } from "react-bootstrap";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"; // Google Maps
import CustomButton from "../components/Button";

const containerStyle = { width: "100%", height: "400px" };
const businessTypes = ["Cafes", "Restaurants", "Souvenir Shops"]; // Filter options

const DestinationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [businessFilter, setBusinessFilter] = useState("All");
    const [nearbyBusinesses, setNearbyBusinesses] = useState([]);

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/destinations/${id}`);
                setDestination(response.data.data);
                setLoading(false);
                // Simulate nearby businesses (random for now)
                setNearbyBusinesses(generateRandomBusinesses(response.data.data.location));
            } catch (error) {
                console.error("Error fetching destination:", error);
                setLoading(false);
            }
        };
        fetchDestination();
    }, [id]);

    // Simulate random businesses (replace with real API later)
    const generateRandomBusinesses = (location) => {
        const types = ["Cafes", "Restaurants", "Souvenir Shops"];
        return Array.from({ length: 5 }, (_, i) => ({
            id: i,
            name: `${types[Math.floor(Math.random() * types.length)]} ${i + 1}`,
            type: types[Math.floor(Math.random() * types.length)],
            distance: (Math.random() * 5).toFixed(1), // Random distance in km
            lat: parseFloat(location.split(",")[0]) + (Math.random() - 0.5) * 0.05, // Random offset
            lng: parseFloat(location.split(",")[1]) + (Math.random() - 0.5) * 0.05,
        }));
    };

    const filteredBusinesses = businessFilter === "All"
        ? nearbyBusinesses
        : nearbyBusinesses.filter(b => b.type === businessFilter);

    if (loading) return <div>Loading...</div>;
    if (!destination) return <div>Destination not found</div>;

    const center = {
        lat: parseFloat(destination.location.split(",")[0]),
        lng: parseFloat(destination.location.split(",")[1]),
    };

    return (
        <>
            <NavBar />
            <Container fluid className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
                <Row className="justify-content-center">
                    <Col md={10}>
                        <Card className="shadow-lg border-0 rounded-3 overflow-hidden">
                            {/* Header Image */}
                            <div
                                style={{
                                    height: "400px",
                                    backgroundImage: `url(${destination.image || "https://via.placeholder.com/1200x400"})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div
                                    className="text-center text-white d-flex align-items-center justify-content-center h-100"
                                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                                >
                                    <h1 className="display-4 fw-bold">{destination.name}</h1>
                                </div>
                            </div>

                            <Card.Body className="p-5">
                                <Row>
                                    <Col md={6}>
                                        <h2 className="mb-3" style={{ color: "#007bff" }}>Details</h2>
                                        <p><strong>Location:</strong> {destination.location}</p>
                                        <p><strong>City:</strong> {destination.city}</p>
                                        <p><strong>Country:</strong> {destination.country}</p>
                                        <p>{destination.short_description}</p>
                                        <p className="text-muted">{destination.long_description}</p>
                                    </Col>
                                    <Col md={6}>
                                        <h2 className="mb-3" style={{ color: "#007bff" }}>Explore on Map</h2>
                                        <LoadScript googleMapsApiKey="AIzaSyBjtFtbiQ2Nheh0VBWQAq5LSqs6QrACWBE">
                                            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
                                                <Marker position={center} label={destination.name} />
                                                {filteredBusinesses.map(b => (
                                                    <Marker key={b.id} position={{ lat: b.lat, lng: b.lng }} label={b.name} />
                                                ))}
                                            </GoogleMap>
                                        </LoadScript>
                                    </Col>
                                </Row>

                                {/* Nearby Businesses */}
                                <Row className="mt-5">
                                    <Col>
                                        <h2 className="mb-3" style={{ color: "#007bff" }}>Nearby Businesses</h2>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Filter by Type</Form.Label>
                                            <Form.Select
                                                value={businessFilter}
                                                onChange={(e) => setBusinessFilter(e.target.value)}
                                            >
                                                <option value="All">All</option>
                                                {businessTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                        <Row>
                                            {filteredBusinesses.map(business => (
                                                <Col key={business.id} md={4} className="mb-3">
                                                    <Card className="shadow-sm">
                                                        <Card.Body>
                                                            <Card.Title>{business.name}</Card.Title>
                                                            <p><strong>Type:</strong> <Badge bg="info">{business.type}</Badge></p>
                                                            <p><strong>Distance:</strong> {business.distance} km</p>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Col>
                                </Row>

                                <div className="text-center mt-4">
                                    <CustomButton
                                        label="Back to Destinations"
                                        variant="primary"
                                        size="md"
                                        rounded="true"
                                        onClick={() => navigate("/destinations")}
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default DestinationDetail;