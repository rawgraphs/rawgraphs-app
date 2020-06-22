import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function Section(props) {
    return  <Container fluid>
                <Row>
                    <Col className="section">
                        <h1>{props.title}</h1>
                        {props.children}
                    </Col>
                </Row>
            </Container>
}