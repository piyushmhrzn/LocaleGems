import React, { useContext } from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { Container, Row, Col } from "react-bootstrap";

const Contact = () => {

  return (
    <>
      <NavBar />

      <Banner
        heading="Contact Us"
        subheading="Stay connected with us."
        backgroundImage="/images/contact-banner.jpg"
      />

      <Container>
        <h2 className="mt-4">Contact</h2>
      </Container>
      <Footer />
    </>
  );
};

export default Contact;