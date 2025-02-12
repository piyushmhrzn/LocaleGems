import React, { useContext } from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { Container, Row, Col } from "react-bootstrap";

const About = () => {

  return (
    <>
      <NavBar />

      <Banner
        heading="About Us"
        subheading="Learn more about our mission and values."
        backgroundImage="/images/about-banner.jpg"
      />

      <Container>
        <h2 className="mt-4">About Us</h2>
      </Container>
      <Footer />
    </>
  );
};

export default About;