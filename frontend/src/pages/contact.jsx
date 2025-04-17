
import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { GeoAltFill, EnvelopeFill, TelephoneFill } from "react-bootstrap-icons";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import ContactBanner from "../../public/images/contact-banner.jpg";
import { Helmet } from "react-helmet"; // ✅ SEO Helmet

const Contact = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Contact LocaleGems | Get in Touch with Us</title>
        <meta
          name="description"
          content="Have questions or suggestions? Contact the LocaleGems team for support, inquiries, or collaborations. We're here to help!"
        />
        <meta name="keywords" content="contact LocaleGems, travel support, customer service, travel help" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://localegems25.onrender.com/contact" />
        <meta property="og:title" content="Contact LocaleGems | Get in Touch with Us" />
        <meta property="og:description" content="Reach out to LocaleGems with questions, feedback, or collaboration ideas." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://localegems25.onrender.com/contact" />
        <meta property="og:image" content="https://localegems25.onrender.com/preview.jpg" />
      </Helmet>

      <NavBar />

      <Banner
        heading={t("Contact Us")}
        subheading={t("Stay connected with us")}
        backgroundImage={ContactBanner}
      />

      <Container className="my-5">
        <Row className="text-center mb-5" md={3} xs={1}>
          <Col className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <GeoAltFill size={48} className="text-primary mb-3" />
                <Card.Title>Address</Card.Title>
                <Card.Text>
                  123 Culture Street<br />
                  Travel City, TG 45678
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <EnvelopeFill size={48} className="text-success mb-3" />
                <Card.Title>Email</Card.Title>
                <Card.Text>contact@localegems.com</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <TelephoneFill size={48} className="text-warning mb-3" />
                <Card.Title>Phone</Card.Title>
                <Card.Text>+1 (800) 123-4567</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow p-4">
              <Card.Body>
                <h3 className="mb-3">Send a Message</h3>
                <Form>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Your name" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Your email" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="subject">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control type="text" placeholder="Subject" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="message">
                    <Form.Label>Message</Form.Label>
                    <Form.Control as="textarea" rows={5} placeholder="Write your message here..." />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="px-4">
                    Send
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default Contact;
