import React from "react";
import { Card } from "react-bootstrap";
import "../../public/css/style.css";

const CustomCard = ({ data, type }) => {
    return (

        <Card className="custom-card mb-3">
            <div className="image-container">
                <Card.Img variant="top" src={data.image} alt={data.title || data.name} className="card-img" />
                <div className="overlay"></div>
            </div>

            <Card.Body className="text-center">
                <Card.Title className="card-title">{data.title || data.name}</Card.Title>
                {type === "event" && <Card.Text>{data.location} • {data.date}</Card.Text>}
                {type === "destination" && <Card.Text>{data.city}, {data.country}</Card.Text>}
                {type === "blog" && <Card.Text>{data.content}</Card.Text>}
            </Card.Body>
        </Card>

    );
};

export default CustomCard;