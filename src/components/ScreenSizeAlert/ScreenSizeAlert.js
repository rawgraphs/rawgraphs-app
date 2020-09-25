import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'

// import styles from './ScreenSizeAlert.module.scss'

function ScreenSizeAlert({ width, height }) {
	const [showModal, setShowModal] = useState(window.innerWidth<992);

	const handleClose = () => setShowModal(false);
	// const handleShow = () => setShowModal(true);

	useEffect(() => {
		// console.log(width)
    setShowModal(width < 992 ? true : false);
  }, [width]);

	return (
		<Modal
			show={showModal}
			onHide={handleClose}
			backdrop="static"
			keyboard={false}
			// size="lg"
      aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title>Hello!</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Welcome! RAWGraphs 2 is designed to work on bigger viewports! Come back later or enlarge your browser window!
			</Modal.Body>
		</Modal>
	)
}

export default ScreenSizeAlert