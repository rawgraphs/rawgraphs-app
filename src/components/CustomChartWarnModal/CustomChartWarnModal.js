import { Modal, Button } from 'react-bootstrap'

export default function CustomChartWarnModal({
  toConfirmCustomChart,
  abortCustomChartLoad,
  confirmCustomChartLoad,
}) {
  return (
    <Modal
      show={toConfirmCustomChart !== null}
      onHide={() => abortCustomChartLoad(null)}
      backdrop="static"
      centered
      aria-labelledby="contained-modal-title-vcenter"
      className="raw-modal"
      contentClassName='border'
    >
      <Modal.Header closeButton>
        <Modal.Title>Warning!</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          You are about to execute third party JavaScript continue at your own
          risk.
        </p>
        {toConfirmCustomChart && toConfirmCustomChart.type === 'project' && (
          <div
            title={toConfirmCustomChart.value.rawCustomChart.source}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
            }}
          >
            {toConfirmCustomChart.value.rawCustomChart.source}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <Button
          variant="light"
          onClick={() => {
            abortCustomChartLoad()
          }}
        >
          Don't execute
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            confirmCustomChartLoad()
          }}
        >
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
