import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Alert, Offcanvas, Nav, Card, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTachometerAlt, FaMapMarkerAlt, FaStore, FaSignOutAlt } from "react-icons/fa"; // Icons for sidebar

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [businesses, setBusinesses] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [message, setMessage] = useState("");
    const [messageVariant, setMessageVariant] = useState(""); // To control success/danger
    const [showSidebar, setShowSidebar] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        city: "",
        country: "",
        location: "",
        short_description: "",
        long_description: "",
        image: "", // Added image field
        coordinates: { coordinates: ["", ""] },
    });
    const navigate = useNavigate();

    // Transient message handling
    const showMessage = (msg, variant) => {
        setMessage(msg);
        setMessageVariant(variant);
        setTimeout(() => {
            setMessage("");
            setMessageVariant("");
        }, 3000); // Disappears after 3 seconds
    };

    useEffect(() => {
        fetchBusinesses();
        fetchDestinations();
    }, []);

    const fetchBusinesses = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get("http://localhost:3000/api/businesses/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBusinesses(response.data.data || []);
        } catch (error) {
            showMessage("Failed to fetch businesses: " + (error.response?.data?.message || error.message), "danger");
        }
    };

    const fetchDestinations = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get("http://localhost:3000/api/destinations/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDestinations(response.data.data || []);
        } catch (error) {
            showMessage("Failed to fetch destinations: " + (error.response?.data?.message || error.message), "danger");
        }
    };

    const updateBusinessStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.put(
                `http://localhost:3000/api/businesses/${id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showMessage(`Business ${status} successfully`, "success");
            fetchBusinesses();
        } catch (error) {
            showMessage("Failed to update business status: " + (error.response?.data?.message || error.message), "danger");
        }
    };

    const deleteDestination = async (id) => {
        if (window.confirm("Are you sure you want to delete this destination?")) {
            try {
                const token = localStorage.getItem("authToken");
                await axios.delete(`http://localhost:3000/api/destinations/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                showMessage("Destination deleted successfully", "success");
                fetchDestinations();
            } catch (error) {
                showMessage("Failed to delete destination: " + (error.response?.data?.message || error.message), "danger");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === "longitude" || name === "latitude") {
            const coords = [...formData.coordinates.coordinates];
            coords[name === "longitude" ? 0 : 1] = value;
            setFormData({ ...formData, coordinates: { coordinates: coords } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            city: "",
            country: "",
            location: "",
            short_description: "",
            long_description: "",
            image: "",
            coordinates: { coordinates: ["", ""] },
        });
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post(
                "http://localhost:3000/api/destinations",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showMessage("Destination created successfully", "success");
            setShowCreateModal(false);
            resetForm();
            fetchDestinations();
        } catch (error) {
            showMessage("Failed to create destination: " + (error.response?.data?.message || error.message), "danger");
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.put(
                `http://localhost:3000/api/destinations/${selectedDestination._id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showMessage("Destination updated successfully", "success");
            setShowEditModal(false);
            resetForm(); // Reset form after edit
            fetchDestinations();
        } catch (error) {
            showMessage("Failed to update destination: " + (error.response?.data?.message || error.message), "danger");
        }
    };

    const openEditModal = (destination) => {
        setSelectedDestination(destination);
        setFormData({
            name: destination.name,
            city: destination.city,
            country: destination.country,
            location: destination.location,
            short_description: destination.short_description,
            long_description: destination.long_description,
            image: destination.image || "", // Include image
            coordinates: { coordinates: [destination.coordinates.coordinates[0], destination.coordinates.coordinates[1]] },
        });
        setShowEditModal(true);
    };

    const renderDashboard = () => (
        <Card className="p-4 shadow-lg">
            <h3 className="mb-4 fw-bold" style={{ color: "#007bff" }}>Dashboard</h3>
            <Row>
                <Col md={6}>
                    <Card className="text-center p-3">
                        <Card.Title>Total Businesses</Card.Title>
                        <Card.Text className="display-4">{businesses.length}</Card.Text>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="text-center p-3">
                        <Card.Title>Total Destinations</Card.Title>
                        <Card.Text className="display-4">{destinations.length}</Card.Text>
                    </Card>
                </Col>
            </Row>
        </Card>
    );

    const renderDestinations = () => (
        <>
            <Button variant="primary" className="mb-3" onClick={() => { resetForm(); setShowCreateModal(true); }}>
                Create Destination
            </Button>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>City</th>
                        <th>Country</th>
                        <th>Location</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {destinations.map(destination => (
                        <tr key={destination._id}>
                            <td>{destination.name}</td>
                            <td>{destination.city}</td>
                            <td>{destination.country}</td>
                            <td>{destination.location}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => openEditModal(destination)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => deleteDestination(destination._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Create Destination Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Destination</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={formData.name} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" name="city" value={formData.city} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control type="text" name="country" value={formData.country} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" name="location" value={formData.location} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Short Description</Form.Label>
                            <Form.Control as="textarea" name="short_description" value={formData.short_description} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Long Description</Form.Label>
                            <Form.Control as="textarea" name="long_description" value={formData.long_description} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" name="image" value={formData.image} onChange={handleFormChange} />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Longitude</Form.Label>
                                    <Form.Control type="number" name="longitude" value={formData.coordinates.coordinates[0]} onChange={handleFormChange} required step="any" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Latitude</Form.Label>
                                    <Form.Control type="number" name="latitude" value={formData.coordinates.coordinates[1]} onChange={handleFormChange} required step="any" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit">
                            Create
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Destination Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Destination</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={formData.name} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" name="city" value={formData.city} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control type="text" name="country" value={formData.country} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" name="location" value={formData.location} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Short Description</Form.Label>
                            <Form.Control as="textarea" name="short_description" value={formData.short_description} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Long Description</Form.Label>
                            <Form.Control as="textarea" name="long_description" value={formData.long_description} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" name="image" value={formData.image} onChange={handleFormChange} />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Longitude</Form.Label>
                                    <Form.Control type="number" name="longitude" value={formData.coordinates.coordinates[0]} onChange={handleFormChange} required step="any" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Latitude</Form.Label>
                                    <Form.Control type="number" name="latitude" value={formData.coordinates.coordinates[1]} onChange={handleFormChange} required step="any" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit">
                            Update
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );

    const renderBusinesses = () => (
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
                            <Button
                                variant={business.status === "pending" ? "secondary" : "outline-secondary"}
                                size="sm"
                                className="me-2"
                                onClick={() => updateBusinessStatus(business._id, "pending")}
                            >
                                Pending
                            </Button>
                            <Button
                                variant={business.status === "approved" ? "success" : "outline-success"}
                                size="sm"
                                className="me-2"
                                onClick={() => updateBusinessStatus(business._id, "approved")}
                            >
                                Approve
                            </Button>
                            <Button
                                variant={business.status === "rejected" ? "danger" : "outline-danger"}
                                size="sm"
                                onClick={() => updateBusinessStatus(business._id, "rejected")}
                            >
                                Reject
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    return (
        <Container fluid>
            <Row>
                <Col md={2} style={{ backgroundColor: "#162F65", minHeight: "100vh", padding: "20px" }}>
                    <Button
                        variant="light"
                        onClick={() => setShowSidebar(true)}
                        className="d-md-none mb-3"
                        style={{ width: "100%" }}
                    >
                        Menu
                    </Button>
                    <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} responsive="md">
                        <Offcanvas.Header closeButton style={{ backgroundColor: "#162F65", color: "white" }}>
                            <Offcanvas.Title>Admin Panel</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body style={{ backgroundColor: "#162F65", color: "white" }}>
                            <Nav className="flex-column">
                                <Nav.Link
                                    onClick={() => { setActiveTab("dashboard"); setShowSidebar(false); }}
                                    active={activeTab === "dashboard"}
                                    className="text-white py-3 d-flex align-items-center"
                                    style={{ backgroundColor: activeTab === "dashboard" ? "#1d3f8a" : "transparent", borderRadius: "8px" }}
                                >
                                    <FaTachometerAlt className="me-2" /> Dashboard
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => { setActiveTab("destinations"); setShowSidebar(false); }}
                                    active={activeTab === "destinations"}
                                    className="text-white py-3 d-flex align-items-center"
                                    style={{ backgroundColor: activeTab === "destinations" ? "#1d3f8a" : "transparent", borderRadius: "8px" }}
                                >
                                    <FaMapMarkerAlt className="me-2" /> Destinations
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => { setActiveTab("businesses"); setShowSidebar(false); }}
                                    active={activeTab === "businesses"}
                                    className="text-white py-3 d-flex align-items-center"
                                    style={{ backgroundColor: activeTab === "businesses" ? "#1d3f8a" : "transparent", borderRadius: "8px" }}
                                >
                                    <FaStore className="me-2" /> Businesses
                                </Nav.Link>
                                <Nav.Link
                                    onClick={handleLogout}
                                    className="text-white py-3 d-flex align-items-center"
                                    style={{ backgroundColor: "transparent", borderRadius: "8px" }}
                                >
                                    <FaSignOutAlt className="me-2" /> Logout
                                </Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Offcanvas>
                </Col>
                <Col md={10} className="mt-3 mb-3">
                    <h2 className="mb-4 fw-bold" style={{ color: "#007bff" }}>
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </h2>
                    {message && <Alert variant={messageVariant}>{message}</Alert>}
                    {activeTab === "dashboard" && renderDashboard()}
                    {activeTab === "destinations" && renderDestinations()}
                    {activeTab === "businesses" && renderBusinesses()}
                </Col>
            </Row>
        </Container>
    );
};

export default AdminPanel;