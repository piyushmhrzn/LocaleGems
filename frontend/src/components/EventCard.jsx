import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import "../../public/css/style.css"; // Ensure this exists or adjust path

const EventCard = ({ data }) => {
    return (
        <motion.div
            className="event-card-container"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{ width: "100%", marginBottom: "20px" }}
        >
            <Card
                className="event-card"
                style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    border: "none",
                }}
            >
                <Row className="g-0">
                    {/* Image on Left */}
                    <Col md={6} style={{ padding: 0 }}>
                        <div
                            className="image-container"
                            style={{
                                position: "relative",
                                height: "100%",
                                minHeight: "300px", // Ensure visibility
                                overflow: "hidden",
                            }}
                        >
                            <Card.Img
                                src={data.image || "https://via.placeholder.com/600x300"}
                                alt={data.name}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.3s ease",
                                }}
                            />
                            <div
                                className="overlay"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    background: "linear-gradient(to right, rgba(0, 0, 0, 0.5), transparent)",
                                    opacity: 0,
                                    transition: "opacity 0.3s ease",
                                }}
                            />
                        </div>
                    </Col>

                    {/* Content on Right */}
                    <Col md={6} className="d-flex align-items-center">
                        <Card.Body
                            className="p-4"
                            style={{
                                background: "#f8f8f8", // Subtle gradient
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <Card.Title
                                className="fw-bold mb-3"
                                style={{ fontSize: "1.7rem", color: "#333333" }}
                            >
                                {data.name}
                            </Card.Title>
                            <Card.Text
                                className="mb-3"
                                style={{ fontSize: "1.1rem", color: "#343a40" }}
                            >
                                {data.location}
                            </Card.Text>
                            <Card.Text
                                className="text-muted"
                                style={{ fontSize: "0.8rem", lineHeight: "1.5" }}
                            >
                                {data.description?.slice(0, 150) || "Join us for an unforgettable experience!"}...
                            </Card.Text>
                            <div className="mt-3">
                                <button  className="badge btn learnmore text-white px-4 py-2"  style={{ fontSize: "1rem", cursor: "pointer" }}>
                                Learn More
                                </button>
                            
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </motion.div>
    );
};

export default EventCard;