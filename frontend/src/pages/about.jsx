import React from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const About = () => {
  return (
    <>
      <NavBar />

      <Banner
        heading="About Us"
        subheading="Connecting travelers with local cultural gems."
        backgroundImage="/images/about-banner.jpg"
      />

      <div className="container my-5">
        {/* Our Mission */}
        <div className="row mb-4">
          <div className="col">
            <h2>Our Mission</h2>
            <p>
              At <strong>LocaleGems</strong>, we aim to connect travelers with unique cultural experiences, 
              events, and destinations to provide a truly authentic and local travel journey. 
              We’re more than a platform—we’re a cultural connector that supports meaningful tourism and community growth.
            </p>
          </div>
        </div>

        {/* Why LocaleGems - With Icon Cards */}
        <div className="row mb-4">
          <div className="col">
            <h2>Why LocaleGems?</h2>
            <p>We create value for all:</p>
            <div className="row row-cols-1 row-cols-md-3 g-4">
              
              {/* Local Communities */}
              <div className="col">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <i className="bi bi-shop-window display-4 text-primary mb-3"></i>
                    <h5 className="card-title">For Local Communities</h5>
                    <p className="card-text">
                      We help small businesses gain visibility and increase revenue through our platform, 
                      bringing them closer to travelers seeking local experiences.
                    </p>
                  </div>
                </div>
              </div>

              {/* Travelers */}
              <div className="col">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <i className="bi bi-compass display-4 text-success mb-3"></i>
                    <h5 className="card-title">For Travelers</h5>
                    <p className="card-text">
                      We offer a reliable and easy-to-use space to discover and book genuine cultural experiences, 
                      tailored to individual interests and destinations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Culture */}
              <div className="col">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <i className="bi bi-globe-americas display-4 text-warning mb-3"></i>
                    <h5 className="card-title">For Culture</h5>
                    <p className="card-text">
                      We support the preservation and promotion of local traditions by enabling immersive tourism 
                      that celebrates heritage and identity.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Our Vision */}
        <div className="row mb-4">
          <div className="col">
            <h2>Our Vision</h2>
            <p>
              We envision a world where every journey helps preserve culture and empower communities. 
              With future features like multi-language support, event reminders, and gamification, 
              LocaleGems will make travel not just meaningful—but fun and personalized too. Get your journey started.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;
