import React, { useContext, useState } from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import CustomButton from "../components/Button";
import { AppContext } from "../context/AppContext";
import { Container, Row, Col, Card, Button, Modal, Form, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
    const navigate = useNavigate();
    const { user, setUser, logout } = useContext(AppContext);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        city: user?.city || "",
        country: user?.country || "",
    });
    const [error, setError] = useState("");

    // If user is not logged in, redirect to login
    if (!user) {
        navigate("/login");
        return null;
    }

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setError("");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.put(
                `http://localhost:3000/api/users/${user._id}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUser(response.data.data); // Update context with new user data
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        }
    };

    return (
        <>
            <NavBar />

            <Banner
                heading={`Welcome, ${user.firstname} ${user.lastname}`}
                subheading="Manage your profile and explore your journey with LocaleGems"
                backgroundImage="/images/profile-banner.jpg"
                height="50vh"
            />

            <Container className="my-5">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="shadow-lg border-0 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                            <Card.Body className="p-4">
                                {/* Circular Avatar */}
                                <div className="text-center mb-4">
                                    <Image
                                        src={user.image || "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png"} // Default placeholder if no image
                                        roundedCircle
                                        style={{
                                            width: "150px",
                                            height: "150px",
                                            objectFit: "cover",
                                            border: "4px solid #0C66EA",
                                        }}
                                        alt="Profile Picture"
                                    />
                                </div>

                                <h2 className="text-center mb-4" style={{ fontWeight: "bold", color: "#343a40" }}>
                                    Your Profile
                                </h2>

                                <Row className="g-4">
                                    <Col md={6}>
                                        <div className="p-3 bg-white rounded-3 shadow-sm">
                                            <p className="mb-2" style={{ color: "#6c757d" }}>
                                                <strong style={{ color: "#0C66EA" }}>First Name:</strong> {user.firstname}
                                            </p>
                                            <p className="mb-2" style={{ color: "#6c757d" }}>
                                                <strong style={{ color: "#0C66EA" }}>Last Name:</strong> {user.lastname}
                                            </p>
                                            <p className="mb-2" style={{ color: "#6c757d" }}>
                                                <strong style={{ color: "#0C66EA" }}>Email:</strong> {user.email}
                                            </p>
                                            <p className="mb-2" style={{ color: "#6c757d" }}>
                                                <strong style={{ color: "#0C66EA" }}>Role:</strong>{" "}
                                                <span className="badge bg-primary">{user.role}</span>
                                            </p>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="p-3 bg-white rounded-3 shadow-sm">
                                            <p className="mb-2" style={{ color: "#6c757d" }}>
                                                <strong style={{ color: "#0C66EA" }}>Phone:</strong>{" "}
                                                {user.phone || <span className="text-muted">Not provided</span>}
                                            </p>
                                            <p className="mb-2" style={{ color: "#6c757d" }}>
                                                <strong style={{ color: "#0C66EA" }}>Address:</strong>{" "}
                                                {user.address || <span className="text-muted">Not provided</span>}
                                            </p>
                                            <p className="mb-2" style={{ color: "#6c757d" }}>
                                                <strong style={{ color: "#0C66EA" }}>City:</strong>{" "}
                                                {user.city || <span className="text-muted">Not provided</span>}
                                            </p>
                                            <p className="mb-2" style={{ color: "#6c757d" }}>
                                                <strong style={{ color: "#0C66EA" }}>Country:</strong>{" "}
                                                {user.country || <span className="text-muted">Not provided</span>}
                                            </p>
                                        </div>
                                    </Col>
                                </Row>

                                <div className="text-center mt-4">
                                    <CustomButton
                                        variant="primary"
                                        className="text-white me-3"
                                        label="Edit Profile"
                                        rounded
                                        onClick={handleShowModal}
                                    />
                                    <CustomButton
                                        variant="danger"
                                        className="text-white"
                                        label="Logout"
                                        rounded
                                        onClick={logout}
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Edit Profile Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="firstname">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="lastname">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="phone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="address">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="city">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="country">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="text-center">
                            <Button variant="primary" type="submit" className="me-2">
                                Save Changes
                            </Button>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Footer />
        </>
    );
};

export default Profile;