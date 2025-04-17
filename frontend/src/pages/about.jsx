
import React from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { ShopWindow, Compass, GlobeAmericas } from "react-bootstrap-icons";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import AboutBanner from "../../public/images/about-banner.jpg";
import TravelGroup from "../../public/images/travel-group.jpg";
import VisionTravel from "../../public/images/vision-travel.jpg";
import { Helmet } from "react-helmet"; // ✅ SEO Helmet

const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>About LocaleGems | Discover Our Mission</title>
        <meta
          name="description"
          content="Learn about LocaleGems – a platform dedicated to connecting travelers with local cultural experiences, supporting communities and preserving heritage."
        />
        <meta name="keywords" content="about LocaleGems, cultural tourism, mission, travel values, tourism platform" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://localegems25.onrender.com/about" />
        <meta property="og:title" content="About LocaleGems | Discover Our Mission" />
        <meta property="og:description" content="Connecting travelers with authentic cultural experiences and supporting local communities worldwide." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://localegems25.onrender.com/about" />
        <meta property="og:image" content="https://localegems25.onrender.com/preview.jpg" />
      </Helmet>

      <NavBar />
      <Banner
        heading={t("About Us")}
        subheading={t("Connecting travelers with local cultural gems")}
        backgroundImage={AboutBanner}
      />

      <Container className="my-5 text-center">
        <Row className="align-items-center justify-content-center mb-5">
          <Col md={6} className="text-start">
            <h2 className="mb-4">🌍 Our Mission</h2>
            <p className="lead">
              At <strong>LocaleGems</strong>, we aim to connect travelers with unique cultural experiences,
              events, and destinations for a truly authentic journey. We're more than a platform—we're a cultural connector that supports meaningful tourism and community growth.
            </p>
          </Col>
          <Col md={6}>
            <Image
              src={TravelGroup}
              fluid
              rounded
              className="shadow"
              alt="Mission"
              style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
            />
          </Col>
        </Row>

        <Container className="my-5 text-center">
          <Row className="justify-content-center mb-5 bg-mute">
            <Col md={10}>
              <h2 className="mb-4">✨ Why LocaleGems?</h2>
              <p className="mb-4">We create value for all:</p>
              <Row xs={1} md={3} className="g-4">
                <Col>
                  <Card className="h-100 text-center shadow border-0">
                    <Card.Body>
                      <ShopWindow size={48} className="text-primary mb-3" />
                      <Card.Title>Local Communities</Card.Title>
                      <Card.Text>
                        We help small businesses gain visibility and increase revenue through our platform.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className="h-100 text-center shadow border-0">
                    <Card.Body>
                      <Compass size={48} className="text-success mb-3" />
                      <Card.Title>Travelers</Card.Title>
                      <Card.Text>
                        Discover and book authentic cultural experiences, tailored to your interests.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className="h-100 text-center shadow border-0">
                    <Card.Body>
                      <GlobeAmericas size={48} className="text-warning mb-3" />
                      <Card.Title>Culture</Card.Title>
                      <Card.Text>
                        Support preservation and celebration of heritage through immersive travel.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>

        <Row className="align-items-center justify-content-center my-5 flex-md-row-reverse">
          <Col md={6} className="text-start">
            <h2 className="mb-4">🚀 Our Vision</h2>
            <p className="lead">
              We envision a world where every journey helps preserve culture and empower communities.
              With future features like multi-language support, event reminders, and gamification,
              LocaleGems will make travel not just meaningful—but fun and personalized too.
            </p>
          </Col>
          <Col md={6}>
            <Image
              src={VisionTravel}
              fluid
              rounded
              className="shadow-commander"
              alt="Vision"
              style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
            />
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default About;
