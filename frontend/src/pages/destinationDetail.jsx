import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import Banner from "../components/Banner"; // Import Banner
import { Container, Row, Col, Badge, Form } from "react-bootstrap";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import CustomButton from "../components/Button";
import { FaCoffee, FaUtensils, FaShoppingBag } from "react-icons/fa"; // Icons for business types

const containerStyle = { width: "100%", height: "400px" };
const businessTypes = ["Cafes", "Restaurants", "Souvenir Shops"];

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
                setNearbyBusinesses(generateRandomBusinesses(response.data.data.coordinates?.coordinates || response.data.data.location.split(",")));
            } catch (error) {
                console.error("Error fetching destination:", error);
                setLoading(false);
            }
        };
        fetchDestination();
    }, [id]);

    const generateRandomBusinesses = (coords) => {
        const types = ["Cafes", "Restaurants", "Souvenir Shops"];
        const [lng, lat] = coords.map(Number); // Ensure numeric values
        return Array.from({ length: 5 }, (_, i) => ({
            id: i,
            name: `${types[Math.floor(Math.random() * types.length)]} ${i + 1}`,
            type: types[Math.floor(Math.random() * types.length)],
            distance: (Math.random() * 5).toFixed(1),
            lat: lat + (Math.random() - 0.5) * 0.05,
            lng: lng + (Math.random() - 0.5) * 0.05,
        }));
    };

    const filteredBusinesses = businessFilter === "All"
        ? nearbyBusinesses
        : nearbyBusinesses.filter(b => b.type === businessFilter);

    if (loading) return <div>Loading...</div>;
    if (!destination) return <div>Destination not found</div>;

    const center = {
        lat: destination.coordinates?.coordinates[1] || parseFloat(destination.location.split(",")[0]),
        lng: destination.coordinates?.coordinates[0] || parseFloat(destination.location.split(",")[1]),
    };

    // Business type icon mapping
    const getBusinessIcon = (type) => {
        switch (type) {
            case "Cafes": return <FaCoffee className="me-2" style={{ color: "#d4a373" }} />;
            case "Restaurants": return <FaUtensils className="me-2" style={{ color: "#e63946" }} />;
            case "Souvenir Shops": return <FaShoppingBag className="me-2" style={{ color: "#457b9d" }} />;
            default: return null;
        }
    };

    return (
        <>
            <NavBar />
            <Banner
                heading={destination.name}
                subheading={destination.short_description}
                backgroundImage={destination.image || "https://via.placeholder.com/1200x400"}
                height="50vh"
                overlayOpacity={0.3}
            />

            <Container className="py-5">
                <Row className="mb-5">
                    <Col md={6}>
                        <h2 className="mb-3 fw-bold" style={{ color: "#007bff" }}>Details</h2>
                        <p><strong>Location:</strong> {destination.location}</p>
                        <p><strong>City:</strong> {destination.city}</p>
                        <p><strong>Country:</strong> {destination.country}</p>
                        <p className="text-muted">{destination.long_description}</p>
                    </Col>
                    <Col md={6}>
                        <h2 className="mb-3 fw-bold" style={{ color: "#007bff" }}>Explore on Map</h2>
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
                <Row className="mb-5">
                    <Col>
                        <h2 className="mb-4 fw-bold" style={{ color: "#007bff" }}>Nearby Businesses</h2>
                        <Form.Group className="mb-4" style={{ maxWidth: "300px" }}>
                            <Form.Label>Filter by Type</Form.Label>
                            <Form.Select
                                value={businessFilter}
                                onChange={(e) => setBusinessFilter(e.target.value)}
                                className="shadow-sm"
                            >
                                <option value="All">All</option>
                                {businessTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Row>
                            {filteredBusinesses.map(business => (
                                <Col key={business.id} md={4} className="mb-4">
                                    <div
                                        className="p-3 rounded-3 shadow-lg bg-white"
                                        style={{
                                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                            cursor: "pointer",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-10px)";
                                            e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.15)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                                        }}
                                    >
                                        <h5 className="fw-bold d-flex align-items-center">
                                            {getBusinessIcon(business.type)}
                                            {business.name}
                                        </h5>
                                        <p className="mb-1">
                                            <Badge bg="info" className="me-2">{business.type}</Badge>
                                            <span className="text-muted">{business.distance} km away</span>
                                        </p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>

                <div className="text-center">
                    <CustomButton
                        label="Back to Destinations"
                        variant="primary"
                        size="md"
                        rounded="true"
                        onClick={() => navigate("/destinations")}
                    />
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default DestinationDetail;