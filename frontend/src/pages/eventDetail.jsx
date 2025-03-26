import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import Banner from "../components/Banner";
import { Container, Row, Col, Badge, Card, Carousel, Form } from "react-bootstrap";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import CustomButton from "../components/Button";
import Countdown from "react-countdown";
import moment from "moment";
import { FaStar } from "react-icons/fa";
import { AppContext } from "../context/AppContext";

const containerStyle = { width: "100%", height: "400px" };
const BASE_URL = "http://localhost:3000";

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AppContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedEvents, setRelatedEvents] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [comments, setComments] = useState([]);
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventRes, ratingRes, commentRes] = await Promise.all([
                    axios.get(`http://localhost:3000/api/events/${id}`),
                    axios.get(`http://localhost:3000/api/ratings/event/${id}`),
                    axios.get(`http://localhost:3000/api/comments/event/${id}`),
                ]);

                setEvent(eventRes.data.data);
                setRatings(ratingRes.data.data);
                setComments(commentRes.data.data);

                const destinationId = eventRes.data.data.destination_id;
                const relatedRes = await axios.get(`http://localhost:3000/api/events?destination_id=${destinationId}`);
                setRelatedEvents(relatedRes.data.data.filter(e => e._id !== id));

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleRating = async () => {
        if (!user) return alert("Please log in to rate this event.");
        try {
            const token = localStorage.getItem("authToken");
            await axios.post(
                "http://localhost:3000/api/ratings",
                { event_id: id, rating: userRating },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRatings([...ratings, { user_id: user, rating: userRating }]);
            setUserRating(0);
        } catch (error) {
            console.error("Error submitting rating:", error);
            alert("Failed to submit rating.");
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user) return alert("Please log in to comment.");
        try {
            const token = localStorage.getItem("authToken");
            await axios.post(
                "http://localhost:3000/api/comments",
                { event_id: id, comment: userComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments([...comments, { user_id: user, comment: userComment }]);
            setUserComment("");
        } catch (error) {
            console.error("Error submitting comment:", error);
            alert("Failed to submit comment.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!event) return <div>Event not found</div>;

    const eventDate = moment(event.date).format("MMMM Do YYYY, h:mm A");
    const locationParts = event.location.split(",");
    const lat = parseFloat(locationParts[0]);
    const lng = parseFloat(locationParts[1]);
    const center = { lat: isNaN(lat) ? 0 : lat, lng: isNaN(lng) ? 0 : lng };

    const averageRating = ratings.length ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : "No ratings yet";

    // Combine ratings and comments by user
    const reviews = ratings.map(r => {
        const comment = comments.find(c => c.user_id._id === r.user_id._id);
        return { ...r, comment: comment?.comment };
    }).concat(
        comments.filter(c => !ratings.some(r => r.user_id._id === c.user_id._id)).map(c => ({ user_id: c.user_id, comment: c.comment }))
    );

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
                                <img
                                    className="d-block w-100"
                                    src={event.image || "https://via.placeholder.com/600x300"}
                                    alt={event.name}
                                />
                            </Carousel.Item>
                        </Carousel>
                    </Col>
                    <Col md={6}>
                        <h2 className="fw-bold" style={{ color: "#333333" }}>{event.name}</h2>
                        <p><strong>Date:</strong> {eventDate}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Organizer:</strong> {event.user_id?.firstname} {event.user_id?.lastname}</p>
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
                                onClick={() => navigate("/events")}
                            />
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
                </Row>

                {/* Rating Section */}
                <Row className="mb-5">
                    <Col>
                        <h3 className="mb-2 fw-bold text-primary">Rate this Event</h3>
                        <div>
                            {[1, 2, 3, 4, 5].map(star => (
                                <FaStar
                                    key={star}
                                    size={30}
                                    color={star <= userRating ? "#ffc107" : "#e4e5e9"}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setUserRating(star)}
                                />
                            ))}
                        </div>
                        <CustomButton
                            label="Submit Rating"
                            variant="info"
                            rounded="true"
                            className="mt-2 text-white"
                            onClick={handleRating}
                        />
                        <p className="mt-2">Average Rating: {averageRating}</p>
                    </Col>
                </Row>

                {/* Comment Section */}
                <Row className="mb-5">
                    <Col>
                        <h3 className="mb-2 fw-bold text-primary">Leave a Review</h3>
                        <Form onSubmit={handleComment}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={userComment}
                                    onChange={(e) => setUserComment(e.target.value)}
                                    placeholder="Leave a comment..."
                                    required
                                />
                            </Form.Group>
                            <CustomButton
                                label="Submit Comment"
                                variant="info"
                                rounded="true"
                                className="mt-2 text-white"
                                type="submit"
                            />
                        </Form>
                    </Col>
                </Row>

                {/* Rating & Reviews Section */}
                <Row className="mb-5">
                    <Col>
                        <h3 className="mb-2 fw-bold text-primary">Rating & Reviews</h3>
                        {reviews.length === 0 ? (
                            <p>No reviews yet.</p>
                        ) : (
                            reviews.map((review, index) => (
                                <div key={index} className="mb-4">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={review.user_id.image ? `${BASE_URL}${review.user_id.image}` : "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png"}
                                            alt={`${review.user_id.firstname} ${review.user_id.lastname}`}
                                            className="rounded-circle me-2"
                                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                        />
                                        <span>{review.user_id.firstname} {review.user_id.lastname}</span>
                                    </div>
                                    {review.rating && (
                                        <div className="mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    size={20}
                                                    color={i < review.rating ? "#ffc107" : "#e4e5e9"}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {review.comment && (
                                        <p className="mt-1" style={{ color: "#444", fontStyle: "italic" }}>
                                            "{review.comment}"
                                        </p>
                                    )}
                                    <hr />
                                </div>
                            ))
                        )}
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
                                        <CustomButton
                                            label="View Details"
                                            variant="dark"
                                            size="md"
                                            onClick={() => navigate(`/events/${related._id}`)}
                                        />
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