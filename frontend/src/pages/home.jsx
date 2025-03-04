import React, { useContext } from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { Container, Row, Col } from "react-bootstrap";
import Card from "../components/Card";
import BlogCard from "../components/BlogCard";
import EventCard from "../components/EventCard"; //
import CustomButton from "../components/Button";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { events } = useContext(AppContext);
  const { destinations } = useContext(AppContext);
  const { blogs } = useContext(AppContext);

  return (
    <>
      <NavBar />

      <Banner
        heading="Discover the Best Cultural Experiences"
        subheading="Find the most authentic local experiences near you."
        images={["/images/home-banner1.jpg", "/images/home-banner2.jpg", "/images/home-banner3.jpg"]}
        isSlider={true} // Enable slider for home page
      >
        <div className="text-center mt-5">
          <CustomButton
            label="Explore Now"
            variant="light"
            size="lg"
            rounded="true"
            onClick={() => navigate("/destinations")} // Navigate to Destinations page
          />
        </div>
      </Banner>

      <Container>
        {/* Events Cards */}
        <Row className="mb-5">
          <h2 className="text-center mt-4 mb-4">Featured Cultural Events</h2>
          <Row>
            {events.map(event => (
              <Col key={event._id} md={6}>
                <Link to={`/events/${event._id}`} style={{ textDecoration: "none" }}>
                  <EventCard data={event} /> {/* Use EventCard */}
                </Link>
              </Col>
            ))}
          </Row>
          {/* View More Button */}
          <div className="text-center mt-3">
            <CustomButton
              label="View More Events"
              variant="dark"
              size="md"
              rounded="true"
              onClick={() => navigate("/events")} // Navigate to Events page
            />
          </div>
        </Row>

        <hr />

        {/* Destination Cards */}
        <Row className="mb-5">
          <h2 className="text-center mt-4 mb-4">Top Destinations</h2>
          <Row>
            {destinations.map(destination => (
              <Col key={destination._id} md={4}>
                <Link to={`/destinations/${destination._id}`} style={{ textDecoration: "none" }}>
                  <Card data={destination} type="destination" />
                </Link>
              </Col>
            ))}
          </Row>
          {/* View More Button */}
          <div className="text-center mt-3">
            <CustomButton
              label="View More Destinations"
              variant="dark"
              size="md"
              rounded="true"
              onClick={() => navigate("/destinations")} // Navigate to Destinations page
            />
          </div>
        </Row>

        <hr />

        {/* Blogs Cards */}
        <Row className="mb-5">
          <h2 className="text-center mt-4 mb-4">Blogs</h2>
          <Row>
            {blogs.map(blog => (
              <Col key={blog._id} md={6}>
                <BlogCard data={blog} /> {/* Use BlogCard */}
              </Col>
            ))}
          </Row>
          {/* View More Button */}
          <div className="text-center mt-3">
            <CustomButton
              label="View More Blogs"
              variant="dark"
              size="md"
              rounded="true"
              onClick={() => navigate("/blogs")} // Navigate to blogs page
            />
          </div>
        </Row>

      </Container>
      <Footer />
    </>
  );
};

export default Home;