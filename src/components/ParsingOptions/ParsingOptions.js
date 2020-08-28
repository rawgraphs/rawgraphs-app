import React from 'react';
import { Row, Col } from 'react-bootstrap';
import SeparatorSelector from './SeparatorSelector';
import ThousandsSeparatorSelector from './ThousandsSeparatorSelector';
import DecimalsSeparatorSelector from './DecimalsSeparatorSelector';
import DateLocaleSelector from './DateLocaleSelector';
import StackSelector from './StackSelector';

import styles from './ParsingOptions.module.scss'

export default function ParsingOptions(props) {
  return (
    <Row>
      <Col className={styles.parsingOptions}>

        <SeparatorSelector
          title="Column separator"
          value={props.separator}
          onChange={nextSeparator => props.setSeparator(nextSeparator)}
        />
        <ThousandsSeparatorSelector
          title="Thousands separator"
          value={props.thousandsSeparator}
          onChange={nextSeparator => props.setThousandsSeparator(nextSeparator)}
        />
        <DecimalsSeparatorSelector
          title="Decimals separator"
          value={props.decimalsSeparator}
          onChange={nextSeparator => props.setDecimalsSeparator(nextSeparator)}
        />

        <DateLocaleSelector
          title="Date Locale"
          value={props.locale}
          localeList={props.localeList}
          onChange={nextLocale => props.setLocale(nextLocale)}
        />
        <StackSelector
          title="Stack data on"
          value={props.stackDimension}
          list={props.dimensions}
          onChange={nextStackDimension => props.setStackDimension(nextStackDimension)}
        />

      </Col>
    </Row>
  )
}