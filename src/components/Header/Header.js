import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

export default function Header({menuItems}){
    return <Navbar bg="white" expand="lg" sticky="top">
            <Navbar.Brand href="#home">RAWGraphs</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    {
                        menuItems.map((d,i)=>{
                            return <Nav.Link key={'item'+i} href={d.href}>{d.label}</Nav.Link>
                        })
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
}