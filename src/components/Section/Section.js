import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default function Section(props) {
    return  <Row>
                <Col className="section">
                    <h1>{props.title}</h1>
                    {props.children}
                </Col>
            </Row>
}