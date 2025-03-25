import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { ShopWindow, Compass, GlobeAmericas } from "react-bootstrap-icons";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <NavBar />

      <Banner
        heading="About Us"
        subheading="Connecting travelers with local cultural gems."
        backgroundImage="/images/about-banner.jpg"
      />

      <Container className="my-5">
        {/* Our Mission */}
        <Row className="mb-4">
          <Col>
            <h2>Our Mission</h2>
            <p>
              At <strong>LocaleGems</strong>, we aim to connect travelers with unique cultural experiences,
              events, and destinations to provide a truly authentic and local travel journey.
              We’re more than a platform—we’re a cultural connector that supports meaningful tourism and community growth.
            </p>
          </Col>
        </Row>

        {/* Why LocaleGems - With Icon Cards */}
        <Row className="mb-4">
          <Col>
            <h2>Why LocaleGems?</h2>
            <p>We create value for all:</p>
            <Row xs={1} md={3} className="g-4">
              {/* Local Communities */}
              <Col>
                <Card className="h-100 text-center">
                  <Card.Body>
                    <ShopWindow size={48} className="text-primary mb-3" /> {/* Replace <i> */}
                    <Card.Title>For Local Communities</Card.Title>
                    <Card.Text>
                      We help small businesses gain visibility and increase revenue through our platform,
                      bringing them closer to travelers seeking local experiences.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              {/* Travelers */}
              <Col>
                <Card className="h-100 text-center">
                  <Card.Body>
                    <Compass size={48} className="text-success mb-3" /> {/* Replace <i> */}
                    <Card.Title>For Travelers</Card.Title>
                    <Card.Text>
                      We offer a reliable and easy-to-use space to discover and book genuine cultural experiences,
                      tailored to individual interests and destinations.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              {/* Culture */}
              <Col>
                <Card className="h-100 text-center">
                  <Card.Body>
                    <GlobeAmericas size={48} className="text-warning mb-3" /> {/* Replace <i> */}
                    <Card.Title>For Culture</Card.Title>
                    <Card.Text>
                      We support the preservation and promotion of local traditions by enabling immersive tourism
                      that celebrates heritage and identity.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Our Vision */}
        <Row className="mb-4">
          <Col>
            <h2>Our Vision</h2>
            <p>
              We envision a world where every journey helps preserve culture and empower communities.
              With future features like multi-language support, event reminders, and gamification,
              LocaleGems will make travel not just meaningful—but fun and personalized too. Get your journey started.
            </p>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default About;