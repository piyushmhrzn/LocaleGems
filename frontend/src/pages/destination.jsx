import React, { useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { AppContext } from "../context/AppContext";
import { useTranslation } from "react-i18next";

const Destinations = () => {
  const { t } = useTranslation();
  const {
    destinations,
    fetchDestinations,
    currentDestinationPage,
    totalDestinationPages,
    loading,
  } = useContext(AppContext);

  useEffect(() => {
    fetchDestinations(currentDestinationPage); // Load destinations when component mounts
  }, [currentDestinationPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalDestinationPages) {
      fetchDestinations(newPage);
    }
  };

  return (
    <>
      <NavBar />
      <Banner
        heading={t("Hidden Destinations you must visit")}
        subheading={t("We bring you all the hidden treasures from around the world")}
        backgroundImage="/images/destination-banner.jpg"
      />
      <Container>
        <h2 className="mt-4">Hidden Destinations</h2>

        {loading ? (
          <p>Loading destinations...</p>
        ) : (
          <>
            <Row className="mb-5">
              {destinations.map((destination) => (
                <Col key={destination._id} md={4}>
                  <Link to={`/destinations/${destination.slug}`} style={{ textDecoration: "none" }}>
                    <Card data={destination} type="destination" />
                  </Link>
                </Col>
              ))}
            </Row>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mb-5">
              <Button
                variant="primary"
                disabled={currentDestinationPage === 1}
                onClick={() => handlePageChange(currentDestinationPage - 1)}
              >
                Previous
              </Button>
              <span className="mx-3 align-self-center">
                Page {currentDestinationPage} of {totalDestinationPages}
              </span>
              <Button
                variant="primary"
                disabled={currentDestinationPage === totalDestinationPages}
                onClick={() => handlePageChange(currentDestinationPage + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Destinations;