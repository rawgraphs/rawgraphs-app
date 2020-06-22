import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

export default function Footer(props){
    return  <Container className="footer" fluid>
                <Container>
                    <Row>
                        <Col >
                            {props.children}
                        </Col>
                    </Row>
                </Container>
            </Container>
}