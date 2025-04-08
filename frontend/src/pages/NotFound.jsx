import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CustomButton from "../components/Button";

const NotFound = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <>
            <Container className="py-5 text-center" style={{ minHeight: "80vh" }}>
                <Row className="justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <Col md={8}>
                        <img
                            src="https://i.gifer.com/yH.gif"
                            alt="404 Not Found"
                            className="mb-4"
                            style={{ maxWidth: "100%", height: "auto", maxHeight: "300px" }}
                        />
                        <h1 className="display-1 fw-bold text-warning">404</h1>
                        <h2 className="mb-4">{t("Page Not Found")}</h2>
                        <p className="text-muted mb-4">
                            {t("Sorry, the page you're looking for doesn't exist or has been moved.")}
                        </p>
                        <CustomButton
                            label={t("Back to Home")}
                            variant="warning"
                            size="lg"
                            className="text-white"
                            rounded="true"
                            onClick={() => navigate("/")}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default NotFound;