import React, { useContext } from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { Container, Row, Col } from "react-bootstrap";
import Card from "../components/Card";
import BlogCard from "../components/BlogCard";
import EventCard from "../components/EventCard";
import CustomButton from "../components/Button";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HomeBanner1 from "../../public/images/home-banner1.jpg";
import HomeBanner2 from "../../public/images/home-banner2.jpg";
import HomeBanner3 from "../../public/images/home-banner3.jpg";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { events, destinations, blogs } = useContext(AppContext);

  return (
    <>
      <NavBar />

      <Banner
        heading={t("Discover the Best Cultural Experiences")}
        subheading={t("Find the most authentic local experiences near you")}
        images={[HomeBanner1, HomeBanner2, HomeBanner3]}
        isSlider={true} // Enable slider for home page
      >
        <div className="text-center mt-5">
          <CustomButton
            label={t("Explore Now")}
            variant="light"
            size="lg"
            rounded="true"
            onClick={() => navigate("/destinations")} // Navigate to Destinations page
          />
        </div>
      </Banner>

      <Container>
        {/* Events Cards */}
        <Row className="my-5">
          <h2 className="text-center mt-4 mb-4">{t("Featured Cultural Events")}</h2>
          <Row>
            {events.map(event => (
              <Col key={event._id} md={6}>
                <Link to={`/events/${event.slug}`} style={{ textDecoration: "none" }}>
                  <EventCard data={event} /> {/* Use EventCard */}
                </Link>
              </Col>
            ))}
          </Row>
          {/* View More Button */}
          <div className="viewmore text-center mt-3">
            <CustomButton
              label="View More Events"
              variant="light"
              size="md"
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
                <Link to={`/destinations/${destination.slug}`} style={{ textDecoration: "none" }}>
                  <Card data={destination} type="destination" />
                </Link>
              </Col>
            ))}
          </Row>
          {/* View More Button */}
          <div className="viewmore text-center mt-3">
            <CustomButton
              label="View More Destinations"
              variant="dark"
              size="md"
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
          <div className=" viewmore text-center mt-3">
            <CustomButton
              label="View More Blogs"
              variant="dark"
              size="md"
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