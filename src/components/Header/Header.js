import React from 'react'
import styles from './Header.module.scss'
import { Navbar, Nav } from 'react-bootstrap'

export default function Header({ menuItems }) {
  return (
    <Navbar bg="white" expand="lg" sticky="top" className={styles.navbar}>
      <Navbar.Brand href="/"><b>RAW</b><span className="text-primary">Graphs</span> 2.0 beta</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {menuItems.map((d, i) => {
            return (
              <Nav.Link key={'item' + i} href={d.href}>
                {d.label}
              </Nav.Link>
            )
          })}
          <a
            role="button"
            href="https://github.com/rawgraphs/rawgraphs-app/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-primary ml-2 d-flex flex-column align-items-center justify-content-center"
          >
            Report issue
          </a>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
