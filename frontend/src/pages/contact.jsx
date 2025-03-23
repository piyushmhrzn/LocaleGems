import React from "react";
import NavBar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <>
      <NavBar />

      <Banner
        heading="Contact Us"
        subheading="Stay connected with us."
        backgroundImage="/images/contact-banner.jpg"
      />

      <div className="container my-5">
        {/* Contact Info Cards */}
        <div className="row text-center mb-5">
          {/* Address */}
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <i className="bi bi-geo-alt-fill display-5 text-primary mb-3"></i>
                <h5 className="card-title">Address</h5>
                <p className="card-text">
                  123 Culture Street<br />
                  Travel City, TG 45678
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <i className="bi bi-envelope-fill display-5 text-success mb-3"></i>
                <h5 className="card-title">Email</h5>
                <p className="card-text">contact@localegems.com</p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <i className="bi bi-telephone-fill display-5 text-warning mb-3"></i>
                <h5 className="card-title">Phone</h5>
                <p className="card-text">+1 (800) 123-4567</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow p-4">
              <h3 className="mb-3">Send a Message</h3>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" className="form-control" id="name" placeholder="Your name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" placeholder="Your email" />
                </div>
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input type="text" className="form-control" id="subject" placeholder="Subject" />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea className="form-control" id="message" rows="5" placeholder="Write your message here..."></textarea>
                </div>
                <button type="submit" className="btn btn-primary px-4">Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
