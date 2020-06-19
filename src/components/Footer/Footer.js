import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default function Footer(props){
    return <Row>
            <Col className="footer">
                {props.children}
            </Col>
        </Row>
}