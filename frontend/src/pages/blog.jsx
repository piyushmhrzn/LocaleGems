import React, { useContext } from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { Container, Row, Col } from "react-bootstrap";
import Card from "../components/Card";
import { useTranslation } from "react-i18next";
import BlogBanner from "../../public/images/blog-banner.jpg";

const Blogs = () => {
  const { t } = useTranslation();
  const { blogs } = useContext(AppContext);

  return (
    <>
      <NavBar />

      <Banner
        heading={t("Our Blog")}
        subheading={t("Stay updated with the latest stories and insights")}
        backgroundImage={BlogBanner}
      />

      <Container>
        <h2 className="mt-4">Blogs</h2>
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