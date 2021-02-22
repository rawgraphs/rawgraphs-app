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
      <span type="button" className="btn" onClick={resetScale}>
        <BsArrowCounterclockwise width="16" height="16" />
      </span>
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
      <span type="button" className="btn" onClick={invertScale}>
        <BsArrowLeftRight width="16" height="16" />
      </span>
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
      <span
        type="button"
        className={`btn ${locked ? 'Xbtn-primary' : ''}`}
        onClick={() => handleChangeLocked(!locked)}
      >
        {locked ? <BsUnlockFill width="16" height="16" /> : <BsLockFill width="16" height="16" />}
      </span>
    </OverlayTrigger>
  )
}

export { ResetBtn, InvertBtn, LockBtn }
