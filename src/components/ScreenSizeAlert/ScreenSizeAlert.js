import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { BsEnvelopeFill } from 'react-icons/bs'

// import styles from './ScreenSizeAlert.module.scss'

function ScreenSizeAlert() {
	const size = useWindowSize();
	
	const [showModal, setShowModal] = useState(size.width<992);

	const handleClose = () => setShowModal(false);
	// const handleShow = () => setShowModal(true);

	useEffect(() => {
		setShowModal(size.width<992);
  }, [size]);

	return (
			<Modal
				className="raw-modal"
				show={showModal}
				onHide={()=>setShowModal(false)}
				backdrop="static"
				keyboard={false}
				// size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title as="h5">🎉 Welcome to the new RAWGraphs!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p className="big">RAWGraphs 2.0 is designed for {size.width >= 768?'slightly ':' '}bigger desktop screens!</p>
					<p>Make your browser window bigger or to <a href="mailto:?subject=Visit+RAWGraphs+2.0&body=Hello%21%0D%0APlease+do+not+forget+to+take+a+look+at+the+new+version+of+RAWGraphs%21%0D%0A%0D%0AVisit%3A+https%3A%2F%2Fdev.rawgraphs.io%2F%0D%0A%0D%0ASee+you+later%2C%0D%0AThe+RAWGraphs+Team"><BsEnvelopeFill/> send yourself a reminder</a> to come back at a better time.</p>
					<p>Touch devices are not fully supported yet.</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary">Got it!</Button>
				</Modal.Footer>
			</Modal>
	)
}

export default ScreenSizeAlert

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}