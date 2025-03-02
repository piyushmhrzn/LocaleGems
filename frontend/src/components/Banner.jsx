import React, { useEffect, useState } from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";

const Banner = ({
    heading,
    subheading,
    backgroundImage,
    images = [],
    isSlider = false,
    children,
    height = "100vh",
    overlayOpacity = 0
}) => {
    const [offsetY, setOffsetY] = useState(0);

    const handleScroll = () => {
        setOffsetY(window.scrollY * 0.5);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height,
                overflow: "hidden", // Prevent horizontal scroll
            }}
        >
            {isSlider ? (
                <Carousel fade interval={5000} controls={false} indicators={false}>
                    {images.map((img, index) => (
                        <Carousel.Item key={index} style={{ position: "relative", width: "100%", height }}>
                            <div
                                style={{
                                    backgroundImage: `url(${img})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    width: "100%",
                                    height,
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    transform: `translateY(${offsetY * 0.5}px)`, // Parallax Effect
                                    transition: "transform 0.1s ease-out",
                                }}
                            ></div>
                            <Container className="h-100 d-flex align-items-center justify-content-center text-white position-relative">
                                <Row>
                                    <Col className="text-center">
                                        <h1 className="display-3 fw-bold">{heading}</h1>
                                        <p className="lead">{subheading}</p>
                                        {children}
                                    </Col>
                                </Row>
                            </Container>
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <div
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: `center ${offsetY}px`,
                        width: "100%",
                        height,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    {/* Overlay only if overlayOpacity > 0 */}
                    {overlayOpacity > 0 && (
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
                            }}
                        />
                    )}
                    <Container>
                        <Row>
                            <Col>
                                <h1 className="display-3 fw-bold">{heading}</h1>
                                <p className="lead">{subheading}</p>
                                {children}
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </div>
    );
};

export default Banner;