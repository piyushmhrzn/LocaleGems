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
import { Helmet } from "react-helmet"; // ✅ SEO Helmet import

import HomeBanner1 from "../../public/images/home-banner1.jpg";
import HomeBanner2 from "../../public/images/home-banner2.jpg";
import HomeBanner3 from "../../public/images/home-banner3.jpg";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { events, destinations, blogs } = useContext(AppContext);

  return (
    <>
      {/* ✅ SEO Helmet for Home Page */}
      <Helmet>
        <title>LocaleGems | Discover Authentic Local Experiences</title>
        <meta
          name="description"
          content="Discover cultural destinations, local events, and travel blogs on LocaleGems. Your one-stop platform to explore hidden gems around the world."
        />
        <meta
          name="keywords"
          content="LocaleGems, travel, local events, cultural experiences, hidden destinations, travel blog"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://localegems25.onrender.com/" />
        <meta property="og:title" content="LocaleGems" />
        <meta
          property="og:description"
          content="Explore authentic cultural experiences, local events, and destinations with LocaleGems."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://localegems25.onrender.com/" />
        <meta property="og:image" content="https://localegems25.onrender.com/preview.jpg" />
      </Helmet>

      <NavBar />

      <Banner
        heading={t("Discover the Best Cultural Experiences")}
        subheading={t("Find the most authentic local experiences near you")}
        images={[HomeBanner1, HomeBanner2, HomeBanner3]}
        isSlider={true}
      >
        <div className="text-center mt-5">
          <CustomButton
            label={t("Explore Now")}
            variant="light"
            size="lg"
            rounded="true"
            onClick={() => navigate("/destinations")}
          />
        </div>
      </Banner>

      <Container>
        {/* Events Cards */}
        <Row className="my-5">
          <h2 className="text-center mt-4 mb-4">{t("Featured Cultural Events")}</h2>
          <Row>
            {events.map((event) => (
              <Col key={event._id} md={6}>
                <Link to={`/events/${event.slug}`} style={{ textDecoration: "none" }}>
                  <EventCard data={event} />
                </Link>
              </Col>
            ))}
          </Row>
          <div className="viewmore text-center mt-3">
            <CustomButton
              label="View More Events"
              variant="light"
              size="md"
              onClick={() => navigate("/events")}
            />
          </div>
        </Row>

        <hr />

        {/* Destination Cards */}
        <Row className="mb-5">
          <h2 className="text-center mt-4 mb-4">Top Destinations</h2>
          <Row>
            {destinations.map((destination) => (
              <Col key={destination._id} md={4}>
                <Link to={`/destinations/${destination.slug}`} style={{ textDecoration: "none" }}>
                  <Card data={destination} type="destination" />
                </Link>
              </Col>
            ))}
          </Row>
          <div className="viewmore text-center mt-3">
            <CustomButton
              label="View More Destinations"
              variant="dark"
              size="md"
              onClick={() => navigate("/destinations")}
            />
          </div>
        </Row>

        <hr />

        {/* Blog Cards */}
        <Row className="mb-5">
          <h2 className="text-center mt-4 mb-4">Blogs</h2>
          <Row>
            {blogs.map((blog) => (
              <Col key={blog._id} md={6}>
                <BlogCard data={blog} />
              </Col>
            ))}
          </Row>
          <div className=" viewmore text-center mt-3">
            <CustomButton
              label="View More Blogs"
              variant="dark"
              size="md"
              onClick={() => navigate("/blogs")}
            />
          </div>
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default Home;
