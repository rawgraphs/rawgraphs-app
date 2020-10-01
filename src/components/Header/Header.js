import React from 'react'
import styles from './Header.module.scss'
import { Navbar, Nav } from 'react-bootstrap'

export default function Header({ menuItems }) {
  return (
    <Navbar bg="white" expand="lg" sticky="top" className={styles.navbar}>
      <Navbar.Brand href="/">RAWGraphs 2.0 (limited access)</Navbar.Brand>
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
          <button className="btn btn-sm btn-primary ml-2" onClick={()=>{
            const win = window.open("https://forms.gle/T8y8HvQ1754hMfjH7","_blank");
            win.focus();
          }}>
            Bugs? Feedback?
          </button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
