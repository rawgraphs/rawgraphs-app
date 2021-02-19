import React, { useCallback } from 'react'
import { Dropdown } from 'react-bootstrap'
import { localeList } from '../../constants'

export default function DateLocaleSelector({
  title,
  value,
  onChange,
  ...props
}) {
  const handleChange = useCallback(
    (locale) => {
      if (onChange) {
        const nextLocale = locale
        onChange(nextLocale)
      }
    },
    [onChange]
  )

  return (
    <div className="option">
      {title}
      <Dropdown className="d-inline-block raw-dropdown">
        <Dropdown.Toggle variant="white" className="">
          {value}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Header>
            <span>
              from{' '}
              <a
                href="https://github.com/d3/d3-time-format/tree/master/locale"
                target="_blank"
                rel="noopener noreferrer"
              >
                d3-time-format
              </a>
            </span>
          </Dropdown.Header>
          {Object.keys(localeList).map((d) => {
            return (
              <Dropdown.Item key={d} onSelect={() => handleChange(d)}>
                {d}
              </Dropdown.Item>
            )
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
