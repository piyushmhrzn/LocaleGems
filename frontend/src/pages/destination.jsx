
import React, { useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { AppContext } from "../context/AppContext";
import { useTranslation } from "react-i18next";
import DestinationBanner from "../../public/images/destination-banner.jpg";
import { Helmet } from "react-helmet"; // ✅ Helmet for SEO

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
    fetchDestinations(currentDestinationPage);
  }, [currentDestinationPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalDestinationPages) {
      fetchDestinations(newPage);
    }
  };

  return (
    <>
      <Helmet>
        <title>Hidden Cultural Destinations | LocaleGems</title>
        <meta
          name="description"
          content="Discover hidden cultural gems and offbeat travel destinations with LocaleGems. Explore unique places around the world."
        />
        <meta
          name="keywords"
          content="hidden destinations, cultural tourism, offbeat travel, undiscovered places, LocaleGems"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://localegems25.onrender.com/destinations" />
        <meta property="og:title" content="Hidden Cultural Destinations | LocaleGems" />
        <meta
          property="og:description"
          content="Explore the world's best-kept secrets and cultural travel gems with LocaleGems."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://localegems25.onrender.com/destinations" />
        <meta property="og:image" content="https://localegems25.onrender.com/preview.jpg" />
      </Helmet>

      <NavBar />
      <Banner
        heading={t("Hidden Destinations you must visit")}
        subheading={t("We bring you all the hidden treasures from around the world")}
        backgroundImage={DestinationBanner}
      />
      <Container>
        <h2 className="mt-4 text-center mb-4">Hidden Destinations</h2>

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
