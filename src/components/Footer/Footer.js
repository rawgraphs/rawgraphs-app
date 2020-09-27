import React from 'react'
import styles from './Footer.module.scss'
import { Row, Col, Container } from 'react-bootstrap'
import { BsFillEnvelopeFill } from 'react-icons/bs'
import { FaTwitter, FaGithub } from 'react-icons/fa'
import { GiMoneyStack } from 'react-icons/gi'

const commitHash = process.env.REACT_APP_VERSION || 'dev'

export default function Footer(props) {
  return (
    <Container fluid style={{backgroundColor: 'var(--dark)'}}>
      <Container className={styles.footer} >
        <Row>
          <Col xs={6} sm={{span:6, order:1}} lg={{span:3,order:1}}><p className="Xsmall">RAWGraphs is an open source project desdigned and developed by <a href="http://densitydesign.org/" target="_blank" rel="noopener noreferrer">DensityDesign</a>, <a href="https://calib.ro/" target="_blank" rel="noopener noreferrer">Calibro</a> and <a href="https://inmagik.com/" target="_blank" rel="noopener noreferrer">Inmagik</a>.</p></Col>
          <Col xs={6} sm={{span:6, order:3}} lg={{span:3,order:1}}><p className="Xsmall">This <span title={commitHash}>version</span> is intended to be available only for the backers of the crowdfunding campaign.</p></Col>
          <Col sm={{span:6, order:2}} md={{span:3}} xl={{span:2, offset:2}}>
            <p><BsFillEnvelopeFill/> hello <span className="small">AT</span> rawgraphs.io</p>
            <p><FaTwitter/> <a href="https://twitter.com/rawgraphs" target="_blank" rel="noopener noreferrer">@rawgraphs</a></p>
          </Col>
          <Col sm={{span:6, order:4}} md={{span:2}} xl={{span:2, offset:0}}>
            <p><FaGithub/> <a href="https://github.com/rawgraphs" target="_blank" rel="noopener noreferrer">Github</a></p>
            <p><GiMoneyStack/> <a href="https://www.indiegogo.com/projects/rawgraphs-2-0-a-web-app-for-data-visualization#/" target="_blank" rel="noopener noreferrer">Support</a></p>
          </Col>
        </Row>
      </Container>
    </Container>
  )
}
