import React, { useContext } from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { Container, Row, Col } from "react-bootstrap";
import Card from "../components/Card";
import { useNavigate, Link } from "react-router-dom";

const Destinations = () => {
  const { destinations } = useContext(AppContext);

  return (
    <>
      <NavBar />

      <Banner
        heading="Hidden Destinations you must visit"
        subheading="We bring you all the hidden treasues from around the world."
        backgroundImage="/images/destination-banner.jpg"
      />

      <Container>
        <h2 className="mt-4">Hidden Destinations</h2>
        <Row className="mb-5">
          {destinations.map(destination => (
            <Col key={destination._id} md={4}>
              <Link to={`/destinations/${destination._id}`} style={{ textDecoration: "none" }}>
                <Card data={destination} type="destination" />
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Destinations;