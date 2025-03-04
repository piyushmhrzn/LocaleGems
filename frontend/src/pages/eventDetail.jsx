import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import Banner from "../components/Banner"; // Import Banner
import { Container, Row, Col, Badge, Card, Carousel, ListGroup } from "react-bootstrap";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import CustomButton from "../components/Button";
import Countdown from "react-countdown";
import moment from "moment";

const containerStyle = { width: "100%", height: "400px" };

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attendees, setAttendees] = useState([]);
    const [relatedEvents, setRelatedEvents] = useState([]);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/events/${id}`);
                setEvent(response.data.data);
                setLoading(false);
                fetchRelatedEvents(response.data.data.destination_id);
                fetchAttendees(id);
            } catch (error) {
                console.error("Error fetching event:", error);
                setLoading(false);
            }
        };

        const fetchRelatedEvents = async (destination_id) => {
            try {
                const response = await axios.get(`http://localhost:3000/api/events?destination_id=${destination_id}`);
                setRelatedEvents(response.data.data);
            } catch (error) {
                console.error("Error fetching related events:", error);
            }
        };

        const fetchAttendees = async (eventId) => {
            try {
                const response = await axios.get(`http://localhost:3000/api/events/${eventId}/attendees`);
                setAttendees(response.data.data);
            } catch (error) {
                console.error("Error fetching attendees:", error);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!event) return <div>Event not found</div>;

    const eventDate = moment(event.date).format("MMMM Do YYYY, h:mm A");

    const center = {
        lat: parseFloat(event.location.split(",")[0]),
        lng: parseFloat(event.location.split(",")[1]),
    };

    return (
        <>
            <NavBar />
            <Banner
                heading={event.name}
                subheading={event.location}
                backgroundImage={event.image || "https://via.placeholder.com/1200x400"}
                height="60vh"
                overlayOpacity={0.3}
            />

            <Container className="py-5">
                <Row className="mb-5">
                    <Col md={6}>
                        <Carousel>
                            <Carousel.Item>
                                <img className="d-block w-100" src={event.image || "https://via.placeholder.com/600x300"} alt={event.name} />
                            </Carousel.Item>
                        </Carousel>
                    </Col>
                    <Col md={6}>
                        <h2 className="fw-bold" style={{ color: "#333333" }}>{event.name}</h2>
                        <p><strong>Date:</strong> {eventDate}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <Badge bg="success" className="mb-3">Upcoming Event</Badge>
                        <h5 className="mt-4">Countdown to Event:</h5>
                        <Countdown
                            date={event.date}
                            renderer={({ days, hours, minutes, seconds }) => (
                                <h4 className="fw-bold text-danger">
                                    {days} <span className="text-dark">days</span> {hours} <span className="text-dark">hrs </span>
                                    {minutes} <span className="text-dark">min</span> {seconds} <span className="text-dark">sec</span>
                                </h4>
                            )}
                        />

                        <div className="mt-4">
                            <CustomButton
                                label="Back to Events"
                                variant="warning"
                                size="md"
                                rounded="true"
                                className="text-white"
                                onClick={() => navigate("/events")} />
                        </div>
                    </Col>
                </Row>

                <Row className="mb-5">
                    <Col md={6}>
                        <h3 className="fw-bold text-primary">Explore on Map</h3>
                        <LoadScript googleMapsApiKey="AIzaSyBjtFtbiQ2Nheh0VBWQAq5LSqs6QrACWBE">
                            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
                                <Marker position={center} label={event.name} />
                            </GoogleMap>
                        </LoadScript>
                    </Col>
                    <Col md={6}>
                        <h3 className="fw-bold text-primary">Attendees</h3>
                        <ListGroup>
                            {attendees.length > 0 ? attendees.map((attendee) => (
                                <ListGroup.Item key={attendee._id}>{attendee.name}</ListGroup.Item>
                            )) : <p>No attendees yet.</p>}
                        </ListGroup>
                    </Col>
                </Row>

                {relatedEvents.length > 0 && (
                    <Row>
                        <h3 className="fw-bold text-primary text-center">Related Events</h3>
                        {relatedEvents.map((related) => (
                            <Col key={related._id} md={4} className="mb-4">
                                <Card>
                                    <Card.Img variant="top" src={related.image || "https://via.placeholder.com/400x200"} />
                                    <Card.Body>
                                        <Card.Title>{related.name}</Card.Title>
                                        <Card.Text>
                                            <strong>Date:</strong> {moment(related.date).format("MMMM Do YYYY, h:mm A")}
                                        </Card.Text>
                                        <CustomButton label="View Details" variant="dark" size="md" onClick={() => navigate(`/events/${related._id}`)} />
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
            <Footer />
        </>
    );
};

export default EventDetail;
