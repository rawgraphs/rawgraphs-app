import React from 'react'
import styles from './Footer.module.scss'
import { Row, Col, Container } from 'react-bootstrap'
import { BsFillEnvelopeFill } from 'react-icons/bs'
import { FaTwitter, FaGithub } from 'react-icons/fa'
import { GiMoneyStack } from 'react-icons/gi'

export default function Footer(props) {
  return (
    <Container className={styles.footer} fluid>
        <Row>
          <Col xs={3}><p className="small">RAWGraphs is an open source project by DensityDesign Lab, Calibro and Inmagik.</p></Col>
          <Col xs={3}><p className="small">This version is intended to be available only for the backers of the crowdfunding campaign.</p></Col>
          <Col sm={{span:3, offset:0}} md={{span:3, offset:1}} xl={{span:2, offset:2}}>
            <p><BsFillEnvelopeFill/> hello [at] rawgraphs.io</p>
            <p><FaTwitter/> <a href="https://twitter.com/rawgraphs" target="_blank" rel="noopener noreferrer">@rawgraphs</a></p>
          </Col>
          <Col sm={{span:3, offset:0}} md={{span:2, offset:0}} xl={{span:2, offset:0}}>
            <p><FaGithub/> <a href="https://github.com/rawgraphs" target="_blank" rel="noopener noreferrer">Github</a></p>
            <p><GiMoneyStack/> <a href="https://www.indiegogo.com/projects/rawgraphs-2-0-a-web-app-for-data-visualization#/" target="_blank" rel="noopener noreferrer">Support</a></p>
          </Col>
        </Row>
    </Container>
  )
}
