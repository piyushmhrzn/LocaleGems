import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { AppContext } from "../context/AppContext";
import { useTranslation } from "react-i18next";

const Events = () => {
    const { t } = useTranslation();
    const { events, fetchEvents, loading } = useContext(AppContext);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");

    const navigate = useNavigate();
    const currentLocation = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(currentLocation.search);
        const searchQuery = params.get("search") || "";
        const locationQuery = params.get("location") || "";

        setSearch(searchQuery);
        setLocation(locationQuery);

        fetchEvents({ search: searchQuery, location: locationQuery });
    }, [currentLocation.search]);

    const handleSearch = () => {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set("search", search);
        if (location) queryParams.set("location", location);

        navigate(`/events?${queryParams.toString()}`);
        fetchEvents({ search, location });
    };

    return (
        <>
            <NavBar />
            <Banner
                heading={t("See what's the Latest Events")}
                subheading={t("Find events happening near you")}
                backgroundImage="/images/event-banner.jpg"
            />
            <Container>
                <h2 className="mt-4">Events</h2>

                <Form className="mb-4">
                    <Row>
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                placeholder="Search events..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                placeholder="Enter city/country"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </Col>
                        <Col md={4}>
                            <Button variant="primary" onClick={handleSearch}>
                                Apply Filters
                            </Button>
                        </Col>
                    </Row>
                </Form>

                {loading ? (
                    <p>Loading events...</p>
                ) : (
                    <Row>
                        {events.length > 0 ? (
                            events.map((event) => (
                                <Col key={event._id} md={4}>
                                    <Link to={`/events/${event.slug}`} style={{ textDecoration: "none" }}>
                                        <Card data={event} type="event" />
                                    </Link>
                                </Col>
                            ))
                        ) : (
                            <p>No events found.</p>
                        )}
                    </Row>
                )}
            </Container>
            <Footer />
        </>
    );
};

export default Events;