
import React, { useContext, useState } from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import CustomButton from "../components/Button";
import { AppContext } from "../context/AppContext";
import { Container, Row, Col, Card, Button, Modal, Form, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileBanner from "../../public/images/profile-banner.jpg";
import { Helmet } from "react-helmet"; // ✅ SEO Helmet

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

const Profile = () => {
    const navigate = useNavigate();

    try {
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
        const [previewImage, setPreviewImage] = useState(
            user && user.image ? `${apiUrl}${user.image}` : "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png"
        );
        const [error, setError] = useState("");

        if (!user) {
            navigate("/login");
            return null;
        }

        const handleShowModal = () => setShowModal(true);
        const handleCloseModal = () => {
            setShowModal(false);
            setError("");
            setFormData({
                firstname: user?.firstname || "",
                lastname: user?.lastname || "",
                email: user?.email || "",
                phone: user?.phone || "",
                address: user?.address || "",
                city: user?.city || "",
                country: user?.country || "",
            });
        };

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleImageChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setPreviewImage(URL.createObjectURL(file));
                handleImageUpload(file);
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.put(
                    `${apiUrl}/api/users/${user._id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUser(response.data.data);
                handleCloseModal();
            } catch (err) {
                setError(err.response?.data?.message || "Failed to update profile");
            }
        };

        const handleImageUpload = async (imageFile) => {
            const data = new FormData();
            data.append("image", imageFile);
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.put(
                    `${apiUrl}/api/users/${user._id}`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                setUser(response.data.data);
                setError("");
            } catch (err) {
                setError(err.response?.data?.message || "Failed to upload image");
                setPreviewImage(user?.image ? `${apiUrl}${user.image}` : "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png");
            }
        };

        return (
            <>
                <Helmet>
                    <title>{`Profile - ${user.firstname} ${user.lastname} | LocaleGems`}</title>
                    <meta
                        name="description"
                        content={`Manage your profile, view your travel preferences, and update your LocaleGems account settings.`}
                    />
                    <meta name="robots" content="noindex, nofollow" />
                </Helmet>

                <NavBar />
                <Banner
                    heading={`Welcome, ${user.firstname} ${user.lastname}`}
                    subheading="Manage your profile and explore your journey with LocaleGems"
                    backgroundImage={ProfileBanner}
                    height="50vh"
                />
                {/* ... Rest of the JSX remains the same as original */}
                <Footer />
            </>
        );
    } catch (error) {
        console.error("Error in Profile component:", error);
        return <div>Error loading profile: {error.message}</div>;
    }
};

export default Profile;
