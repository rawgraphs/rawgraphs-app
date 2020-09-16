import React from 'react'
import styles from './Footer.module.scss'
import { Row, Col, Container } from 'react-bootstrap'

export default function Footer(props) {
  return (
    <Container className={styles.footer} fluid>
      <Container>
        <Row>
          <Col>{props.children}</Col>
        </Row>
      </Container>
    </Container>
  )
}
