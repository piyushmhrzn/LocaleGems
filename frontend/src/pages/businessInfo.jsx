import React, { useContext, useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import CustomButton from "../components/Button";
import { Container, Row, Col, Alert, Card, Button, Modal, Form } from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { Helmet } from "react-helmet";
import RegisterBanner from "../../public/images/about-banner.jpg";

const BusinessInfo = () => {
    const { user } = useContext(AppContext);
    const [businesses, setBusinesses] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        location: "",
        city: "",
        country: "",
        contactEmail: "",
        contactPhone: "",
        destination_id: "",
        proximity_to_destination: "",
        website: "",
        businessHours: "",
        image: "",
    });

    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000"; // Use env var or fallback to localhost

    useEffect(() => {
        const fetchBusinesses = async () => {
            if (!user || user.role !== "owner") {
                setErrorMessage("You must be logged in as an owner to view this page.");
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem("authToken");
                const [businessResponse, destResponse] = await Promise.all([
                    axios.get(`${apiUrl}/api/businesses`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${apiUrl}/api/destinations/all`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                console.log("Businesses response:", businessResponse.data.data);
                setBusinesses(businessResponse.data.data);
                setDestinations(destResponse.data.data);
                setErrorMessage("");
            } catch (error) {
                setErrorMessage(error.response?.data?.message || "Failed to fetch data.");
                console.error("Error fetching data:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, [user]);

    const handleEditClick = (business) => {
        setSelectedBusiness(business);
        setFormData({
            name: business.name || "",
            category: business.category || "",
            description: business.description || "",
            location: business.location || "",
            city: business.city || "",
            country: business.country || "",
            contactEmail: business.contactEmail || "",
            contactPhone: business.contactPhone || "",
            destination_id: business.destination_id?._id || "",
            proximity_to_destination: business.proximity_to_destination || "",
            website: business.website || "",
            businessHours: business.businessHours || "",
            image: business.image || "",
        });
        setShowEditModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("authToken");
            console.log("Sending formData:", formData); // Debug log
            const response = await axios.put(
                `${apiUrl}/api/businesses/${selectedBusiness._id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setBusinesses(businesses.map(b => b._id === selectedBusiness._id ? response.data.data : b));
            setShowEditModal(false);
            setErrorMessage("Business updated successfully!");
        } catch (error) {
            setErrorMessage("Failed to update business: " + (error.response?.data?.message || error.message));
            console.error("Update error:", error.response?.data || error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
         <Helmet>
                <title>My Business Info | LocaleGems</title>
                <meta name="description" content="View and manage your registered business information on LocaleGems. Edit your listing, contact info, and more." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <NavBar />
            <Banner
                heading="Your Business Information"
                subheading="View details of your registered business."
                backgroundImage={RegisterBanner}
                height="60vh"
            />
            <Container className="my-5">
                <Row className="justify-content-md-center">
                    {errorMessage && (
                        <Alert variant={errorMessage.includes("successfully") ? "success" : "danger"}>
                            {errorMessage}
                        </Alert>
                    )}

                    {!errorMessage && businesses.length === 0 && (
                        <Alert variant="info">No businesses found. Register one to get started!</Alert>
                    )}

                    {businesses.map(business => (
                        <Col key={business._id} md={8}>
                            <Card className="p-4 shadow-lg rounded-3">
                                <Card.Body>
                                    <h3 className="text-center mb-4 fw-bold" style={{ color: "#162F65" }}>
                                        {business.name}
                                    </h3>

                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <p><strong>Category:</strong> {business.category}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Status:</strong> {business.status}</p>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col>
                                            <p><strong>Description:</strong> {business.description}</p>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <p><strong>Location:</strong> {business.location}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>City:</strong> {business.city || "N/A"}</p>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <p><strong>Country:</strong> {business.country || "N/A"}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Contact Email:</strong> {business.contactEmail}</p>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <p><strong>Contact Phone:</strong> {business.contactPhone}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p>
                                                <strong>Nearby Destination:</strong>{" "}
                                                {business.destination_id?.name || "N/A"} (
                                                {business.proximity_to_destination} km)
                                            </p>
                                        </Col>
                                    </Row>

                                    {business.website && (
                                        <Row className="mb-3">
                                            <Col>
                                                <p><strong>Website:</strong> <a href={business.website} target="_blank" rel="noopener noreferrer">{business.website}</a></p>
                                            </Col>
                                        </Row>
                                    )}

                                    {business.businessHours && (
                                        <Row className="mb-3">
                                            <Col>
                                                <p><strong>Business Hours:</strong> {business.businessHours}</p>
                                            </Col>
                                        </Row>
                                    )}

                                    {business.image && (
                                        <Row className="mb-3">
                                            <Col>
                                                <img
                                                    src={business.image}
                                                    alt={business.name}
                                                    className="img-fluid rounded"
                                                    style={{ maxWidth: "100%", height: "auto" }}
                                                />
                                            </Col>
                                        </Row>
                                    )}

                                    <Row className="mt-4">
                                        <Col className="text-center">
                                            <CustomButton label="Edit Business" variant="warning" rounded className="text-white" onClick={() => handleEditClick(business)} />
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Edit Business Modal */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Business</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleUpdateSubmit}>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="category">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleFormChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    rows={3}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="location">
                                <Form.Label>Location</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleFormChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="city">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleFormChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="country">
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleFormChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="contactEmail">
                                <Form.Label>Contact Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleFormChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="contactPhone">
                                <Form.Label>Contact Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleFormChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="destination_id">
                                <Form.Label>Nearby Destination</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="destination_id"
                                    value={formData.destination_id}
                                    onChange={handleFormChange}
                                    required
                                >
                                    <option value="">Select a destination</option>
                                    {destinations.map(dest => (
                                        <option key={dest._id} value={dest._id}>
                                            {dest.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="proximity_to_destination">
                                <Form.Label>Proximity to Destination (km)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="proximity_to_destination"
                                    value={formData.proximity_to_destination}
                                    onChange={handleFormChange}
                                    step="any"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="website">
                                <Form.Label>Website</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleFormChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="businessHours">
                                <Form.Label>Business Hours</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="businessHours"
                                    value={formData.businessHours}
                                    onChange={handleFormChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="image">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleFormChange}
                                />
                            </Form.Group>

                            <Button variant="warning" type="submit">
                                Update
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
            <Footer />
        </>
    );
};

export default BusinessInfo;