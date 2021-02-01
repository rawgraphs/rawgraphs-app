import React from 'react'
import { Alert } from 'react-bootstrap'
/**
 *
 * @param {string} type The warning type: success, secondary, warning, danger
 * @param {string} error The error message to be displayed
 */
function WarningMessage({ variant = "warning", message = "A default warning message."}) {
  return (
    <Alert variant={variant} className="my-2">
      {message}
    </Alert>
  )
}

export default WarningMessage
