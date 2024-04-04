import React from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";

const ShowMap = () => {
  return (
    <Container className="mb-5">
      <Row className="mb-4">
        <Col
          md={{ span: 6, offset: 3 }}
          className="d-flex flex-column align-items-center text-center"
        >
          <h5>
            <Badge bg="primary" className="rounded-0 text-uppercase">
              Mapa
            </Badge>
          </h5>
          <h2 className="fw-bold">Ubícanos en google maps</h2>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 8, offset: 2 }} className="map-responsive">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3926.0942561092784!2d-67.6136006249654!3d10.253981689864824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTDCsDE1JzE0LjMiTiA2N8KwMzYnMzkuNyJX!5e0!3m2!1sen!2sus!4v1712071257658!5m2!1sen!2sus"
            width="600"
            height="450"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="responsivemap"
            style={{ border: 0, width: "100%", height: "200px" }} // Added to ensure responsiveness
          ></iframe>
        </Col>
      </Row>
    </Container>
  );
};

export default ShowMap;
