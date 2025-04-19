import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import Banner from "../components/Banner";
import { Container, Row, Col, Form, Carousel } from "react-bootstrap";
import { GoogleMap, Marker } from "@react-google-maps/api";
import CustomButton from "../components/Button";
import { FaCoffee, FaUtensils, FaShoppingBag, FaCalendarAlt, FaStar, FaShare } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from "react-share";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";
import DestinationDetailBanner from "../../public/images/destination-detail-banner.jpg";
import { Helmet } from "react-helmet"; // ✅ SEO Helmet

const containerStyle = { width: "100%", height: "400px" };
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const DestinationDetail = () => {
    const { t } = useTranslation();
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user, fetchDestinationsBySlug } = useContext(AppContext);
    const [destination, setDestination] = useState(null);
    const [businesses, setBusinesses] = useState([]);
    const [events, setEvents] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [comments, setComments] = useState([]);
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const destinationData = await fetchDestinationsBySlug(slug);
                setDestination(destinationData);

                const [businessRes, eventRes, ratingRes, commentRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/businesses/all`),
                    axios.get(`${BASE_URL}/api/events`),
                    axios.get(`${BASE_URL}/api/ratings/destination/${destinationData._id}`),
                    axios.get(`${BASE_URL}/api/comments/destination/${destinationData._id}`),
                ]);

                let allBusinesses = businessRes.data.data;
                allBusinesses = allBusinesses.filter(biz => biz.status !== "rejected");
                const allEvents = eventRes.data.data;
                setRatings(ratingRes.data.data);
                setComments(commentRes.data.data);

                const relatedBusinesses = allBusinesses.filter((business) => {
                    const destId = business.destination_id?._id || business.destination_id;
                    return destId?.toString() === destinationData._id;
                });

                const relatedEvents = allEvents.filter((event) => {
                    const destId = event.destination_id?._id || event.destination_id;
                    return destId?.toString() === destinationData._id;
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
    }, [slug, fetchDestinationsBySlug]);

    const handleRating = async () => {
        if (!user) return alert(t("Please log in to rate this destination."));
        try {
            const token = localStorage.getItem("authToken");
            await axios.post(
                `${BASE_URL}/api/ratings`,
                { destination_id: destination._id, rating: userRating },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRatings([...ratings, { user_id: user, rating: userRating }]);
            setUserRating(0);
        } catch (error) {
            console.error("Error submitting rating:", error);
            alert(t("Failed to submit rating."));
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user) return alert(t("Please log in to comment."));
        try {
            const token = localStorage.getItem("authToken");
            await axios.post(
                `${BASE_URL}/api/comments`,
                { destination_id: destination._id, comment: userComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments([...comments, { user_id: user, comment: userComment }]);
            setUserComment("");
        } catch (error) {
            console.error("Error submitting comment:", error);
            alert(t("Failed to submit comment."));
        }
    };

    if (loading) return <Loader />;
    if (!destination) return <div>{t("Destination not found")}</div>;

    const center = {
        lat: destination.coordinates?.coordinates[1] || parseFloat(destination.location.split(",")[0]),
        lng: destination.coordinates?.coordinates[0] || parseFloat(destination.location.split(",")[1]),
    };

    const averageRating = ratings.length
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : t("No ratings yet");

    const shareUrl = `${window.location.origin}/destinations/${destination.slug}`;
    const shareTitle = `${destination.name} - ${destination.city}, ${destination.country}`;
    const shareDescription = destination.short_description;

    const reviews = ratings
        .map((r) => {
            const comment = comments.find((c) => c.user_id._id === r.user_id._id);
            return { ...r, comment: comment?.comment };
        })
        .concat(
            comments
                .filter((c) => !ratings.some((r) => r.user_id._id === c.user_id._id))
                .map((c) => ({ user_id: c.user_id, comment: c.comment }))
        );

    const getBusinessIcon = (type) => {
        switch (type) {
            case "Cafes":
                return <FaCoffee className="me-2" style={{ color: "#d4a373" }} />;
            case "Restaurants":
                return <FaUtensils className="me-2" style={{ color: "#e63946" }} />;
            case "Souvenir Shops":
                return <FaShoppingBag className="me-2" style={{ color: "#457b9d" }} />;
            default:
                return null;
        }
    };

    return (
        <>
            {/* ✅ SEO Helmet Block */}
            <Helmet>
                <title>{destination.name} | LocaleGems</title>
                <meta
                    name="description"
                    content={destination.short_description || "Explore hidden cultural destinations and authentic local experiences with LocaleGems."}
                />
                <meta name="keywords" content={`LocaleGems, ${destination.name}, ${destination.city}, travel, cultural tourism`} />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://localegems25.onrender.com/destinations/${destination.slug}`} />
                <meta property="og:title" content={`${destination.name} | LocaleGems`} />
                <meta property="og:description" content={shareDescription} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:image" content={destination.image || "https://localegems25.onrender.com/preview.jpg"} />
            </Helmet>

            <NavBar />
            <Banner
                heading={destination.name}
                subheading={destination.short_description}
                backgroundImage={destination.image || DestinationDetailBanner}
                height="50vh"
                overlayOpacity={0.3}
            />
            
           <Container className="py-5">
                <Row className="mb-5">
                    <Col md={6}>
                        <h2 className="mb-3 fw-bold text-primary">{t("Details")}</h2>
                        <p><strong>{t("Location")}:</strong> {destination.location}</p>
                        <p><strong>{t("City")}:</strong> {destination.city}</p>
                        <p><strong>{t("Country")}:</strong> {destination.country}</p>
                        <p className="text-muted">{destination.long_description}</p>
                        <div className="mt-5">
                            <h5 className="text-primary">{t("Share this Destination")}</h5>
                            <div className="d-flex gap-2">
                                <FacebookShareButton url={shareUrl} quote={shareDescription} hashtag="#LocaleGems">
                                    <FacebookIcon size={32} round />
                                </FacebookShareButton>
                                <TwitterShareButton url={shareUrl} title={shareTitle} hashtags={["LocaleGems", "Travel"]}>
                                    <TwitterIcon size={32} round />
                                </TwitterShareButton>
                                <CustomButton
                                    label={
                                        <span className="d-flex align-items-center">
                                            <FaShare className="me-2" /> {t("Share")}
                                        </span>
                                    }
                                    variant="info"
                                    size="sm"
                                    rounded="true"
                                    className="text-white"
                                    onClick={() => {
                                        navigator.clipboard.writeText(shareUrl);
                                        alert(t("Link copied to clipboard! Paste it into your social media platform."));
                                    }}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <h2 className="mb-3 fw-bold text-primary">{t("Explore on Map")}</h2>

                        {/* GOOGLE MAPS */}
                        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
                            <Marker position={center} label={destination.name} />
                            {businesses.map((b) =>
                                b.coordinates ? (
                                    <Marker
                                        key={b._id}
                                        position={{ lat: b.coordinates.coordinates[1], lng: b.coordinates.coordinates[0] }}
                                        label={b.name}
                                    />
                                ) : null
                            )}
                        </GoogleMap>

                    </Col>
                </Row>

                {/* Image Gallery */}
                {destination.imageGallery?.length > 0 && (
                    <Row className="mb-5">
                        <Col>
                            <h3 className="mb-3 fw-bold text-primary">{t("Gallery")}</h3>
                            <Carousel>
                                {destination.imageGallery.map((img, index) => (
                                    <Carousel.Item key={index}>
                                        <img
                                            className="d-block w-100"
                                            src={img || "https://via.placeholder.com/600x400"}
                                            alt={`${destination.name} - Image ${index + 1}`}
                                            style={{ height: "400px", objectFit: "cover" }}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </Col>
                    </Row>
                )}

                <Row className="mb-5">
                    <Col>
                        <h3 className="mb-2 fw-bold text-primary">{t("Rate this Destination")}</h3>
                        <div>
                            {[1, 2, 3, 4, 5].map((star) => (
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
                            label={t("Submit Rating")}
                            variant="info"
                            rounded="true"
                            className="mt-2 text-white"
                            onClick={handleRating}
                        />
                        <p className="mt-2">{t("Average Rating")}: {averageRating}</p>
                    </Col>
                </Row>

                <Row className="mb-5">
                    <Col>
                        <h3 className="mb-2 fw-bold text-primary">{t("Leave a Review")}</h3>
                        <Form onSubmit={handleComment}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={userComment}
                                    onChange={(e) => setUserComment(e.target.value)}
                                    placeholder={t("Leave a comment...")}
                                    required
                                />
                            </Form.Group>
                            <CustomButton
                                label={t("Submit Comment")}
                                variant="info"
                                rounded="true"
                                className="mt-2 text-white"
                                type="submit"
                            />
                        </Form>
                    </Col>
                </Row>

                <Row className="mb-5">
                    <Col>
                        <h3 className="mb-2 fw-bold text-primary">{t("Rating & Reviews")}</h3>
                        {reviews.length === 0 ? (
                            <p>{t("No reviews yet.")}</p>
                        ) : (
                            reviews.map((review, index) => (
                                <div key={index} className="mb-4">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={
                                                review.user_id.image
                                                    ? `${BASE_URL}${review.user_id.image}`
                                                    : "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png"
                                            }
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

                <Row className="mb-5">
                    <Col>
                        <h2 className="mb-4 fw-bold" style={{ color: "#007bff" }}>{t("Nearby Businesses")}</h2>
                        {businesses.length === 0 ? (
                            <p>{t("No businesses found for this destination.")}</p>
                        ) : (
                            <Row className="nearby">
                                {businesses.map((business) => (
                                    <Col key={business._id} md={4} className="mb-4">
                                        <img
                                            src={
                                                business.image ||
                                                "https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                                            }
                                            alt={business.name}
                                            className="img-fluid rounded nearby-business"
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                        <h5 className="mt-2">{getBusinessIcon(business.type)}{business.name}</h5>
                                        <p className="text-muted">{business.proximity_to_destination} km away</p>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Col>
                </Row>

                <Row className="mb-5">
                    <Col>
                        <h2 className="mb-4 fw-bold" style={{ color: "#007bff" }}>{t("Upcoming Events")}</h2>
                        {events.length === 0 ? (
                            <p>{t("No events found for this destination.")}</p>
                        ) : (
                            <Row>
                                {events.map((event) => (
                                    <Col key={event._id} md={4} className="mb-4">
                                        <img
                                            src={event.image || "https://via.placeholder.com/150"}
                                            alt={event.name}
                                            className="img-fluid rounded upcoming-events"
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
                        label={t("Back to Destinations")}
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
