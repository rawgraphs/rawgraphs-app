import React from 'react'
import { Alert } from 'react-bootstrap'
/**
 *
 * @param {string} type The warning type: success, secondary, warning, danger
 * @param {string} error The error message to be displayed
 */
function WarningMessage({
  variant = 'warning',
  message = 'A default warning message.',
  action = null,
}) {
  return (
    <Alert
      variant={variant}
      className="my-2 d-flex flex-row justify-content-between align-items-center"
    >
      {message}
      {action}
    </Alert>
  )
}

export default WarningMessage
