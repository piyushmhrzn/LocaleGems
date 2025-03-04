import React, { useContext } from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { Container, Row, Col } from "react-bootstrap";
import Card from "../components/Card";
import { useNavigate, Link } from "react-router-dom";

const Events = () => {
    const { events } = useContext(AppContext);

    return (
        <>
            <NavBar />

            <Banner
                heading="See whats the Latest Events going on around the World"
                subheading="Find the latest events for destinations near you."
                backgroundImage="/images/event-banner.jpg"
            />

            <Container>
                <h2 className="mt-4">Events</h2>
                <Row className="mb-5">
                    {events.map(event => (
                        <Col key={event._id} md={4}>
                            <Link to={`/events/${event._id}`} style={{ textDecoration: "none" }}>
                                <Card data={event} type="event" />
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default Events;