import React from 'react'
import styles from './Section.module.scss'
import { Container, Row, Col } from 'react-bootstrap'

export default function Section(props) {
  return (
    <Container
      fluid
      className={
        [styles.section, props.className].join(' ')
      }
    >
      <Row>
        <Col>
          <h1>{props.title}</h1>
          {props.children}
        </Col>
      </Row>
    </Container>
  )
}
