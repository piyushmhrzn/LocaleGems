import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import Banner from "../components/Banner";
import { Container, Row, Col } from "react-bootstrap";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import CustomButton from "../components/Button";
import { FaCoffee, FaUtensils, FaShoppingBag, FaCalendarAlt } from "react-icons/fa";

const containerStyle = { width: "100%", height: "400px" };

const DestinationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [destination, setDestination] = useState(null);
    const [businesses, setBusinesses] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Destination
                const destinationRes = await axios.get(`http://localhost:3000/api/destinations/${id}`);
                setDestination(destinationRes.data.data);

                // Fetch All Businesses
                const businessRes = await axios.get(`http://localhost:3000/api/businesses/all`);
                const allBusinesses = businessRes.data.data;

                // Fetch All Events
                const eventRes = await axios.get(`http://localhost:3000/api/events`);
                const allEvents = eventRes.data.data;

                // Filter businesses and events related to this destination
                const relatedBusinesses = allBusinesses.filter(business => {
                    const destId = business.destination_id?._id ? business.destination_id._id.toString() : business.destination_id?.toString();
                    const match = destId === id;
                    return match;
                });
                const relatedEvents = allEvents.filter(event => {
                    const destId = event.destination_id?._id ? event.destination_id._id.toString() : event.destination_id?.toString();
                    const match = destId === id;
                    return match;
                });

                setBusinesses(relatedBusinesses);
                setEvents(relatedEvents);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

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
                        <h2 className="mb-3 fw-bold text-primary">Details</h2>
                        <p><strong>Location:</strong> {destination.location}</p>
                        <p><strong>City:</strong> {destination.city}</p>
                        <p><strong>Country:</strong> {destination.country}</p>
                        <p className="text-muted">{destination.long_description}</p>
                    </Col>
                    <Col md={6}>
                        <h2 className="mb-3 fw-bold text-primary">Explore on Map</h2>
                        <LoadScript googleMapsApiKey="AIzaSyBjtFtbiQ2Nheh0VBWQAq5LSqs6QrACWBE">
                            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
                                <Marker position={center} label={destination.name} />
                                {businesses.map(b => (
                                    b.coordinates && (
                                        <Marker
                                            key={b._id}
                                            position={{ lat: b.coordinates.coordinates[1], lng: b.coordinates.coordinates[0] }}
                                            label={b.name}
                                        />
                                    )
                                ))}
                            </GoogleMap>
                        </LoadScript>
                    </Col>
                </Row>

                {/* Nearby Businesses */}
                <Row className="mb-5">
                    <Col>
                        <h2 className="mb-4 fw-bold" style={{ color: "#007bff" }}>Nearby Businesses</h2>
                        {businesses.length === 0 ? (
                            <p>No businesses found for this destination.</p>
                        ) : (
                            <Row>
                                {businesses.map(business => (
                                    <Col key={business._id} md={4} className="mb-4">
                                        <img
                                            src={business.image || "https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"}
                                            alt={business.name}
                                            className="img-fluid rounded"
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                        <h5 className="mt-2">
                                            {getBusinessIcon(business.type)}{business.name}
                                        </h5>
                                        <p className="text-muted">{business.proximity_to_destination} km away</p>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Col>
                </Row>

                {/* Related Events */}
                <Row className="mb-5">
                    <Col>
                        <h2 className="mb-4 fw-bold" style={{ color: "#007bff" }}>Upcoming Events</h2>
                        {events.length === 0 ? (
                            <p>No events found for this destination.</p>
                        ) : (
                            <Row>
                                {events.map(event => (
                                    <Col key={event._id} md={4} className="mb-4">
                                        <img
                                            src={event.image || "https://via.placeholder.com/150"}
                                            alt={event.name}
                                            className="img-fluid rounded"
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                        <h5 className="mt-2">
                                            <FaCalendarAlt className="me-2" style={{ color: "#f4a261" }} />
                                            {event.name}
                                        </h5>
                                        <p className="text-muted">Date: {new Date(event.date).toLocaleDateString()}</p>
                                    </Col>
                                ))}
                            </Row>
                        )}
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