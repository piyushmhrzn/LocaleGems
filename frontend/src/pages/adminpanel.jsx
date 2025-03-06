import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Alert } from "react-bootstrap";
import axios from "axios";

const AdminPanel = () => {
    const [businesses, setBusinesses] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/businesses");
            setBusinesses(response.data.data);
        } catch (error) {
            setMessage("Failed to fetch businesses: " + (error.response?.data?.message || error.message));
        }
    };

    const verifyBusiness = async (id, status) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.put(
                `http://localhost:3000/api/businesses/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(`Business ${status} successfully`);
            fetchBusinesses();
        } catch (error) {
            setMessage("Failed to update business: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <>
            <Container className="my-5">
                <h2 className="text-center mb-4 fw-bold" style={{ color: "#007bff" }}>
                    Admin Panel - Business Verification
                </h2>
                {message && <Alert variant={message.includes("Failed") ? "danger" : "success"}>{message}</Alert>}
                <Row>
                    <Col>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Contact Email</th>
                                    <th>Destination</th>
                                    <th>Proximity (km)</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {businesses.map(business => (
                                    <tr key={business._id}>
                                        <td>{business.name}</td>
                                        <td>{business.contactEmail}</td>
                                        <td>{business.destination_id?.name || "N/A"}</td>
                                        <td>{business.proximity_to_destination}</td>
                                        <td>{business.status}</td>
                                        <td>
                                            {business.status === "pending" && (
                                                <>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => verifyBusiness(business._id, "approved")}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => verifyBusiness(business._id, "rejected")}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminPanel;