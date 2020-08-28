import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import SeparatorSelector from './SeparatorSelector';
import ThousandsSeparatorSelector from './ThousandsSeparatorSelector';
import DecimalsSeparatorSelector from './DecimalsSeparatorSelector';
import DateLocaleSelector from './DateLocaleSelector';
import StackSelector from './StackSelector';

import styles from './ParsingOptions.module.scss'
import { BsArrowRepeat } from 'react-icons/bs';
import { get } from 'lodash';

export default function ParsingOptions(props) {
  const refreshData = async () => {
    const response = await fetch(props.dataSource.url)
    props.onDataRefreshed(await response.text())
  }

  return (
    <Row>
      <Col className={styles.parsingOptions}>

        <b>DATA PARSING OPTIONS</b>

        {props.userDataType === "csv" && (
          <SeparatorSelector
            title="Column separator"
            value={props.separator}
            onChange={nextSeparator => props.setSeparator(nextSeparator)}
          />
        )}
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

        {get(props.dataSource, "type", "") === "url" && (
          <Button
            color="primary"
            className={styles["refresh-button"]}
            onClick={() => refreshData()}
          >
            <BsArrowRepeat className="mr-2" />
            {"Refresh data from url"}
          </Button>
        )}

        <div className="divider mb-3 mt-0" />

        <b>DATA TRANSFORMATION</b>

        <StackSelector
          title="Stack on"
          value={props.stackDimension}
          list={props.dimensions}
          onChange={nextStackDimension => props.setStackDimension(nextStackDimension)}
        />

      </Col>
    </Row>
  )
}