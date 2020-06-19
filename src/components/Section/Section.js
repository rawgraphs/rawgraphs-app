import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default function Section(props) {
    return  <Row>
                <Col className="section">
                    <h4>{props.title}</h4>
                    {props.children}
                </Col>
            </Row>
}