import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

function DataMismatchModal({
  replaceRequiresConfirmation,
  commitDataReplace,
  cancelDataReplace,
}) {
  const [showModal, setShowModal] = useState(true)

  const handleClose = () => {
    setShowModal(false)
  }
  return (
    <Modal
      className="raw-modal"
      show={showModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      // size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title as="h5">
          Warning:{' '}
          {replaceRequiresConfirmation === 'parse-error' && <>parsing error</>}
          {replaceRequiresConfirmation.startsWith('missing-column:') && (
            <>missing column</>
          )}
          {replaceRequiresConfirmation === 'type-mismatch' && (
            <>data-type mismatch</>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {replaceRequiresConfirmation === 'parse-error' && (
          <>
            <p>There was an error while parsing new data.</p>
            <p>
              You can load the new data and try to fix the error or return to
              the data previously loaded.
            </p>
          </>
        )}
        {replaceRequiresConfirmation.startsWith('missing-column:') && (
          <>
            <p>
              The data mapping of this project requires the dimension{' '}
              <span className="font-weight-bold">
                {replaceRequiresConfirmation.split(':')[1]}
              </span>
              , that we can't find in the new data.
            </p>
            <p>
              You can create a new data mapping with the new data or return to
              the data previously loaded.
            </p>
          </>
        )}
        {replaceRequiresConfirmation === 'type-mismatch' && (
          <>
            <p>
              The data-types previously set for this project can't be applied to
              the new data.
            </p>
            <p>
              You can use the new data and re-set data-types or return to the
              data previously loaded.
            </p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="warning"
          onClick={() => {
            commitDataReplace()
          }}
        >
          Load new data
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            cancelDataReplace()
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DataMismatchModal
