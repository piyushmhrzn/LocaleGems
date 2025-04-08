import React from "react";
import { Container, Spinner } from "react-bootstrap";
import "../../public/css/loader.css";

const Loader = () => {
    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="fancy-loader">
                <div className="dot dot1"></div>
                <div className="dot dot2"></div>
                <div className="dot dot3"></div>
                <div className="dot dot4"></div>
                <div className="dot dot5"></div>
            </div>
            <p className="mt-3 text-muted">Loading...</p>
        </Container>
    );
};

export default Loader;