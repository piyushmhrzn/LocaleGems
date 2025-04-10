import React from "react";
import { Card } from "react-bootstrap";
import "../../public/css/style.css";

const BlogCard = ({ data }) => {
    return (
        <Card
            className="blog-card mb-3 shadow-sm"
            style={{
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "#fff",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
            }}
        >
            <div
                className="image-container"
                style={{ position: "relative", height: "250px", overflow: "hidden" }}
            >
                <Card.Img
                    variant="top"
                    src={data.image || "https://images.pexels.com/photos/8747768/pexels-photo-8747768.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"}
                    alt={data.title}
                    style={{
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                    }}
                />
                <div
                    className="overlay"
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        padding: "10px",
                        background: "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
                        color: "white",
                        transition: "opacity 0.3s ease",
                        opacity: 0,
                    }}
                >
                    <p className="mb-0">Read More</p>
                </div>
            </div>
            <Card.Body className="p-3">
                <Card.Title className="fw-bold" style={{ fontSize: "1.25rem", color: "#343a40" }}>
                    {data.title}
                </Card.Title>
                <Card.Text className="text-muted" style={{ fontSize: "0.9rem" }}>
                    {data.content.slice(0, 100)}...
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default BlogCard;