import React from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import {
  BsArrowCounterclockwise,
  BsArrowLeftRight,
  BsLockFill,
  BsUnlockFill,
} from 'react-icons/bs'

function ResetBtn({ resetScale }) {
  return (
    <OverlayTrigger
      key="bottom"
      placement="bottom"
      overlay={<Tooltip id={`tooltip-top`}>Reset domain</Tooltip>}
    >
      <button type="button" className="btn" onClick={resetScale}>
        <BsArrowCounterclockwise width="16" height="16" />
      </button>
    </OverlayTrigger>
  )
}

function InvertBtn({ invertScale }) {
  return (
    <OverlayTrigger
      key="bottom"
      placement="bottom"
      overlay={<Tooltip id={`tooltip-top`}>Invert</Tooltip>}
    >
      <button type="button" className="btn" onClick={invertScale}>
        <BsArrowLeftRight width="16" height="16" />
      </button>
    </OverlayTrigger>
  )
}

function LockBtn({ handleChangeLocked, locked }) {
  return (
    <OverlayTrigger
      key="bottom"
      placement="bottom"
      overlay={<Tooltip id={`tooltip-top`}>{locked ? 'Unlock' : 'Lock'} scale</Tooltip>}
    >
      <button
        type="button"
        className={`btn ${locked ? 'btn-primary' : ''}`}
        onClick={() => handleChangeLocked(!locked)}
      >
        {locked ? <BsUnlockFill width="16" height="16" /> : <BsLockFill width="16" height="16" />}
      </button>
    </OverlayTrigger>
  )
}

export { ResetBtn, InvertBtn, LockBtn }
