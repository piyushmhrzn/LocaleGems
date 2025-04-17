import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import Banner from "../components/Banner";
import { Container, Row, Col, Badge, Card, Carousel, Form } from "react-bootstrap";
import { GoogleMap, Marker } from "@react-google-maps/api";
import CustomButton from "../components/Button";
import Countdown from "react-countdown";
import moment from "moment";
import { FaStar, FaShare } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from "react-share";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";
import { Helmet } from "react-helmet";

const containerStyle = { width: "100%", height: "400px" };
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 };

const EventDetail = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, fetchEventsBySlug } = useContext(AppContext);
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
        const eventData = await fetchEventsBySlug(slug);
        setEvent(eventData);

        const [ratingRes, commentRes, relatedRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/ratings/event/${eventData._id}`),
          axios.get(`${BASE_URL}/api/comments/event/${eventData._id}`),
          axios.get(`${BASE_URL}/api/events?destination_id=${eventData.destination_id._id || eventData.destination_id}`),
        ]);

        setRatings(ratingRes.data.data);
        setComments(commentRes.data.data);
        setRelatedEvents(relatedRes.data.data.filter((e) => e._id !== eventData._id));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, fetchEventsBySlug]);

  const handleRating = async () => {
    if (!user) return alert(t("Please log in to rate this event."));
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${BASE_URL}/api/ratings`,
        { event_id: event._id, rating: userRating },
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
        { event_id: event._id, comment: userComment },
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
  if (!event) return <div>{t("Event not found")}</div>;

  const eventDate = moment(event.date).format("MMMM Do YYYY, h:mm A");
  const destination = event.destination_id;

  let center = DEFAULT_CENTER;
  if (destination?.coordinates?.coordinates?.length === 2) {
    const [lng, lat] = destination.coordinates.coordinates.map(parseFloat);
    if (!isNaN(lat) && !isNaN(lng)) center = { lat, lng };
  }

  const averageRating = ratings.length
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : t("No ratings yet");

  const shareUrl = `${window.location.origin}/events/${event.slug}`;
  const shareTitle = `${event.name} - ${eventDate}`;
  const shareDescription = `Join me at ${event.name} on ${eventDate} at ${destination?.name || event.location}!`;

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

  return (
    <>
      <Helmet>
        <title>{event.name} | LocaleGems</title>
        <meta
          name="description"
          content={`Join ${event.name} on ${eventDate} at ${destination?.name || event.location}. Cultural experiences, community gatherings, and more.`}
        />
        <meta name="keywords" content={`event, ${event.name}, ${destination?.name}, local events, cultural events`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://localegems25.onrender.com/events/${event.slug}`} />
        <meta property="og:title" content={`${event.name} | LocaleGems`} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:image" content={event.image || "https://localegems25.onrender.com/preview.jpg"} />
      </Helmet>

      <NavBar />
      <Banner
        heading={event.name}
        subheading={destination?.name || event.location}
        backgroundImage={event.image || "https://images.pexels.com/photos/5475779/pexels-photo-5475779.jpeg"}
        height="60vh"
        overlayOpacity={0.3}
      />

      <Container className="py-5">
        <Row className="mb-5">
          <Col md={6}>
            <Carousel>
              <Carousel.Item>
                <img className="d-block w-100" src={event.image} alt={event.name} />
              </Carousel.Item>
            </Carousel>
          </Col>
          <Col md={6}>
            <h2 className="fw-bold">{event.name}</h2>
            <p><strong>{t("Date")}:</strong> {eventDate}</p>
            <p><strong>{t("Location")}:</strong> {destination?.name || event.location}</p>
            <p><strong>{t("Organizer")}:</strong> {event.user_id?.firstname} {event.user_id?.lastname}</p>
            <Badge bg="success">{t("Upcoming Event")}</Badge>
            <h5 className="mt-4">{t("Countdown to Event")}:</h5>
            <Countdown date={event.date} renderer={({ days, hours, minutes, seconds }) => (
              <h4 className="fw-bold text-danger">
                {days}d {hours}h {minutes}m {seconds}s
              </h4>
            )} />
            <div className="mt-5">
              <h5>{t("Share this Event")}</h5>
              <div className="d-flex gap-2">
                <FacebookShareButton url={shareUrl} quote={shareDescription} hashtag="#LocaleGems">
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={shareTitle} hashtags={["LocaleGems"]}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <CustomButton
                  label={<><FaShare className="me-2" /> {t("Share")}</>}
                  variant="info"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    alert(t("Link copied to clipboard!"));
                  }}
                />
              </div>
            </div>
            <div className="mt-4">
              <CustomButton label={t("Back to Events")} variant="warning" size="md" onClick={() => navigate("/events")} />
            </div>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col md={6}>
            {event.imageGallery?.length > 0 && (
              <Carousel>
                {event.imageGallery.map((img, i) => (
                  <Carousel.Item key={i}>
                    <img className="d-block w-100" src={img} alt={`Gallery ${i + 1}`} style={{ height: 300, objectFit: "cover" }} />
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
          </Col>
          <Col md={6}>
            <h3 className="fw-bold">{t("Explore on Map")}</h3>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
              <Marker position={center} />
            </GoogleMap>
          </Col>
        </Row>

        <Row>
          <Col>
            <h3 className="fw-bold">{t("Rate this Event")}</h3>
            {[1, 2, 3, 4, 5].map((s) => (
              <FaStar
                key={s}
                size={30}
                color={s <= userRating ? "#ffc107" : "#e4e5e9"}
                onClick={() => setUserRating(s)}
                style={{ cursor: "pointer" }}
              />
            ))}
            <CustomButton label={t("Submit Rating")} variant="info" className="mt-2" onClick={handleRating} />
            <p className="mt-2">{t("Average Rating")}: {averageRating}</p>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <h3 className="fw-bold">{t("Leave a Review")}</h3>
            <Form onSubmit={handleComment}>
              <Form.Group>
                <Form.Control as="textarea" rows={3} value={userComment} onChange={(e) => setUserComment(e.target.value)} required />
              </Form.Group>
              <CustomButton label={t("Submit Comment")} type="submit" variant="info" className="mt-2" />
            </Form>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <h3 className="fw-bold">{t("Rating & Reviews")}</h3>
            {reviews.length === 0 ? <p>{t("No reviews yet.")}</p> : reviews.map((review, idx) => (
              <div key={idx} className="mb-4">
                <p><strong>{review.user_id.firstname}:</strong> {review.comment}</p>
              </div>
            ))}
          </Col>
        </Row>

        {relatedEvents.length > 0 && (
          <Row className="mt-5">
            <h3 className="fw-bold text-center">{t("Related Events")}</h3>
            {relatedEvents.map((e) => (
              <Col key={e._id} md={4}>
                <Card>
                  <Card.Img variant="top" src={e.image} />
                  <Card.Body>
                    <Card.Title>{e.name}</Card.Title>
                    <Card.Text>{moment(e.date).format("MMMM Do YYYY, h:mm A")}</Card.Text>
                    <CustomButton label={t("View Details")} variant="dark" onClick={() => navigate(`/events/${e.slug}`)} />
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
