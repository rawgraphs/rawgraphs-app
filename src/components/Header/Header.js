import React from 'react'
import find from 'lodash/find'
import styles from './Header.module.scss'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { ReactCountryFlag } from 'react-country-flag'
import { useTranslation } from 'react-i18next'

const FLAGS = [
  {
    code: 'en',
    country: 'gb',
    label: 'English',
  },
  {
    code: 'it',
    country: 'it',
    label: 'Italiano',
  },
  {
    code: 'fr',
    country: 'fr',
    label: 'Français',
  },
]

export default function Header({ menuItems }) {
  const { i18n } = useTranslation()

  return (
    <Navbar bg="white" expand="lg" sticky="top" className={styles.navbar}>
      <Navbar.Brand href="/">
        <b>RAW</b>
        <span className="text-primary">Graphs</span> 2.0 beta
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <NavDropdown
            title={
              <ReactCountryFlag
                style={{
                  height: 15,
                  width: 15,
                }}
                svg
                countryCode={
                  find(FLAGS, { code: i18n.language })?.country ?? 'gb'
                }
              />
            }
            id="basic-nav-dropdown"
          >
            {FLAGS.map((f) => (
              <NavDropdown.Item
                active={i18n.language === f.code}
                key={f.code}
                onSelect={() => i18n.changeLanguage(f.code)}
              >
                <ReactCountryFlag
                  countryCode={f.country}
                  svg
                  style={{
                    height: 15,
                    width: 15,
                  }}
                />{' '}
                {f.label}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
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
