import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Alert, Offcanvas, Nav, Card, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTachometerAlt, FaMapMarkerAlt, FaStore, FaSignOutAlt, FaUsers, FaCalendarAlt } from "react-icons/fa"; // Added FaUsers, FaCalendarAlt

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [businesses, setBusinesses] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [users, setUsers] = useState([]); // New state for users
    const [events, setEvents] = useState([]); // New state for events
    const [message, setMessage] = useState("");
    const [messageVariant, setMessageVariant] = useState("");
    const [showSidebar, setShowSidebar] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false); // For destinations and events
    const [showEditModal, setShowEditModal] = useState(false); // For destinations and events
    const [showViewModal, setShowViewModal] = useState(false); // For business details
    const [selectedItem, setSelectedItem] = useState(null); // Generic selected item (destination, event, or business)
    const [formData, setFormData] = useState({
        // For destinations
        name: "",
        city: "",
        country: "",
        location: "",
        short_description: "",
        long_description: "",
        image: "",
        coordinates: { coordinates: ["", ""] },
        // For events
        date: "",
        user_id: "",
        destination_id: "",
    });
    const navigate = useNavigate();

    const showMessage = (msg, variant) => {
        setMessage(msg);
        setMessageVariant(variant);
        setTimeout(() => {
            setMessage("");
            setMessageVariant("");
        }, 3000);
    };

    useEffect(() => {
        fetchBusinesses();
        fetchDestinations();
        fetchUsers();
        fetchEvents();
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

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get("http://localhost:3000/api/users/all", { // Assuming endpoint
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.data || []);
        } catch (error) {
            showMessage("Failed to fetch users: " + (error.response?.data?.message || error.message), "danger");
        }
    };

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get("http://localhost:3000/api/events/all", { // Assuming endpoint
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents(response.data.data || []);
        } catch (error) {
            showMessage("Failed to fetch events: " + (error.response?.data?.message || error.message), "danger");
        }
    };

    const updateBusinessStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.put(
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

    const deleteEvent = async (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                const token = localStorage.getItem("authToken");
                await axios.delete(`http://localhost:3000/api/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                showMessage("Event deleted successfully", "success");
                fetchEvents();
            } catch (error) {
                showMessage("Failed to delete event: " + (error.response?.data?.message || error.message), "danger");
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
            date: "",
            user_id: "",
            destination_id: "",
        });
    };

    const handleCreateSubmit = async (e, type) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("authToken");
            const url = type === "destination" ? "http://localhost:3000/api/destinations" : "http://localhost:3000/api/events";
            await axios.post(url, formData, { headers: { Authorization: `Bearer ${token}` } });
            showMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully`, "success");
            setShowCreateModal(false);
            resetForm();
            type === "destination" ? fetchDestinations() : fetchEvents();
        } catch (error) {
            showMessage(`Failed to create ${type}: ` + (error.response?.data?.message || error.message), "danger");
        }
    };

    const handleEditSubmit = async (e, type) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("authToken");
            const url = type === "destination"
                ? `http://localhost:3000/api/destinations/${selectedItem._id}`
                : `http://localhost:3000/api/events/${selectedItem._id}`;
            await axios.put(url, formData, { headers: { Authorization: `Bearer ${token}` } });
            showMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`, "success");
            setShowEditModal(false);
            resetForm();
            type === "destination" ? fetchDestinations() : fetchEvents();
        } catch (error) {
            showMessage(`Failed to update ${type}: ` + (error.response?.data?.message || error.message), "danger");
        }
    };

    const openEditModal = (item, type) => {
        setSelectedItem(item);
        if (type === "destination") {
            setFormData({
                name: item.name,
                city: item.city,
                country: item.country,
                location: item.location,
                short_description: item.short_description,
                long_description: item.long_description,
                image: item.image || "",
                coordinates: { coordinates: [item.coordinates.coordinates[0], item.coordinates.coordinates[1]] },
                date: "",
                user_id: "",
                destination_id: "",
            });
        } else if (type === "event") {
            setFormData({
                name: item.name,
                date: item.date.split("T")[0], // Format for input type="date"
                user_id: item.user_id?._id || "",
                destination_id: item.destination_id?._id || "",
                location: item.location || "",
                image: item.image || "",
                coordinates: { coordinates: ["", ""] },
                city: "",
                country: "",
            });
        }
        setShowEditModal(true);
    };

    const openViewModal = (business) => {
        setSelectedItem(business);
        setShowViewModal(true);
    };

    const renderDashboard = () => (
        <Card className="p-4 shadow-lg">
            <h3 className="mb-4 fw-bold" style={{ color: "#007bff" }}>Dashboard</h3>
            <Row>
                <Col md={3}>
                    <Card className="text-center p-3">
                        <Card.Title>Total Businesses</Card.Title>
                        <Card.Text className="display-4">{businesses.length}</Card.Text>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center p-3">
                        <Card.Title>Total Destinations</Card.Title>
                        <Card.Text className="display-4">{destinations.length}</Card.Text>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center p-3">
                        <Card.Title>Total Events</Card.Title>
                        <Card.Text className="display-4">{events.length}</Card.Text>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center p-3">
                        <Card.Title>Total Users</Card.Title>
                        <Card.Text className="display-4">{users.length}</Card.Text>
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
                                    onClick={() => openEditModal(destination, "destination")}
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
            <Modal show={showCreateModal && activeTab === "destinations"} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Destination</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => handleCreateSubmit(e, "destination")}>
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
        </>
    );

    const renderBusinesses = () => (
        <>
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
                                    className="me-2"
                                    onClick={() => updateBusinessStatus(business._id, "rejected")}
                                >
                                    Reject
                                </Button>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => openViewModal(business)}
                                >
                                    View
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* View Business Modal */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Business Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedItem && (
                        <div>
                            <p><strong>Name:</strong> {selectedItem.name}</p>
                            <p><strong>Contact Email:</strong> {selectedItem.contactEmail}</p>
                            <p><strong>Contact Phone:</strong> {selectedItem.contactPhone || "N/A"}</p>
                            <p><strong>Destination:</strong> {selectedItem.destination_id?.name || "N/A"}</p>
                            <p><strong>Proximity to Destination:</strong> {selectedItem.proximity_to_destination} km</p>
                            <p><strong>Status:</strong> {selectedItem.status}</p>
                            <p><strong>Address:</strong> {selectedItem.location || "N/A"}</p>
                            <p><strong>City:</strong> {selectedItem.city || "N/A"}</p>
                            <p><strong>Country:</strong> {selectedItem.country || "N/A"}</p>
                            <p><strong>Description:</strong> {selectedItem.description || "N/A"}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

    const renderUsers = () => (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user._id}>
                        <td>{user.firstname}</td>
                        <td>{user.lastname}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    const renderEvents = () => (
        <>
            <Button variant="primary" className="mb-3" onClick={() => { resetForm(); setShowCreateModal(true); }}>
                Create Event
            </Button>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Event Date</th>
                        <th>Host/Owner</th>
                        <th>Destination</th>
                        <th>Location</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event._id}>
                            <td>{event.name}</td>
                            <td>{new Date(event.date).toLocaleDateString()}</td>
                            <td>{event.user_id?.firstname} {event.user_id?.lastname}</td>
                            <td>{event.destination_id?.name || "N/A"}</td>
                            <td>{event.location}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => openEditModal(event, "event")}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => deleteEvent(event._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Create Event Modal */}
            <Modal show={showCreateModal && activeTab === "events"} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => handleCreateSubmit(e, "event")}>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Name</Form.Label>
                            <Form.Control type="text" name="name" value={formData.name} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Date</Form.Label>
                            <Form.Control type="date" name="date" value={formData.date} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Host</Form.Label>
                            <Form.Select name="user_id" value={formData.user_id} onChange={handleFormChange} required>
                                <option value="">Select User</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>{user.firstname} {user.lastname}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Location</Form.Label>
                            <Form.Control type="text" name="location" value={formData.location} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Destination</Form.Label>
                            <Form.Select name="destination_id" value={formData.destination_id} onChange={handleFormChange} required>
                                <option value="">Select Destination</option>
                                {destinations.map(dest => (
                                    <option key={dest._id} value={dest._id}>{dest.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" name="image" value={formData.image} onChange={handleFormChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Create
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Event Modal */}
            <Modal show={showEditModal && activeTab === "events"} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => handleEditSubmit(e, "event")}>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Name</Form.Label>
                            <Form.Control type="text" name="name" value={formData.name} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Date</Form.Label>
                            <Form.Control type="date" name="date" value={formData.date} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Host</Form.Label>
                            <Form.Select name="user_id" value={formData.user_id} onChange={handleFormChange} required>
                                <option value="">Select User</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>{user.firstname} {user.lastname}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Location</Form.Label>
                            <Form.Control type="text" name="location" value={formData.location} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Destination</Form.Label>
                            <Form.Select name="destination_id" value={formData.destination_id} onChange={handleFormChange} required>
                                <option value="">Select Destination</option>
                                {destinations.map(dest => (
                                    <option key={dest._id} value={dest._id}>{dest.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" name="image" value={formData.image} onChange={handleFormChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Update
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
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
                                    onClick={() => { setActiveTab("users"); setShowSidebar(false); }}
                                    active={activeTab === "users"}
                                    className="text-white py-3 d-flex align-items-center"
                                    style={{ backgroundColor: activeTab === "users" ? "#1d3f8a" : "transparent", borderRadius: "8px" }}
                                >
                                    <FaUsers className="me-2" /> Users
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => { setActiveTab("events"); setShowSidebar(false); }}
                                    active={activeTab === "events"}
                                    className="text-white py-3 d-flex align-items-center"
                                    style={{ backgroundColor: activeTab === "events" ? "#1d3f8a" : "transparent", borderRadius: "8px" }}
                                >
                                    <FaCalendarAlt className="me-2" /> Events
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
                    {activeTab === "users" && renderUsers()}
                    {activeTab === "events" && renderEvents()}
                    {activeTab === "destinations" && showEditModal && (
                        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Destination</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={(e) => handleEditSubmit(e, "destination")}>
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
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AdminPanel;