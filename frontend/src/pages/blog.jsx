import React, { useContext } from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { Container, Row, Col } from "react-bootstrap";
import Card from "../components/Card";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet"; // ✅ SEO Helmet
import BlogBanner from "../../public/images/blog-banner.jpg";

const Blogs = () => {
  const { t } = useTranslation();
  const { blogs } = useContext(AppContext);

  return (
    <>
      {/* ✅ SEO Helmet Block */}
      <Helmet>
        <title>LocaleGems | Travel & Culture Blogs</title>
        <meta
          name="description"
          content="Read the latest travel stories, cultural insights, and local discoveries on the LocaleGems blog. Stay inspired and informed."
        />
        <meta
          name="keywords"
          content="LocaleGems blog, travel stories, cultural experiences, local insights, cultural tourism"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://localegems25.onrender.com/blogs" />
        <meta property="og:title" content="LocaleGems Blog | Travel Stories & Culture" />
        <meta
          property="og:description"
          content="Explore inspiring travel stories and cultural insights from around the world, curated by LocaleGems."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://localegems25.onrender.com/blogs" />
        <meta property="og:image" content="https://localegems25.onrender.com/preview.jpg" />
      </Helmet>

      <NavBar />

      <Banner
        heading={t("Our Blog")}
        subheading={t("Stay updated with the latest stories and insights")}
        backgroundImage={BlogBanner}
      />

      <Container>
        <h2 className="mt-4 text-center mb-4">Blogs</h2>
        <Row className="mb-5">
          {blogs.map(blog => (
            <Col key={blog._id} md={4}>
              <Card data={blog} type="blog" />
            </Col>
          ))}
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default Blogs;
