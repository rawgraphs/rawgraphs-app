// import React from "react"
import { BsClock, BsHash, BsType } from 'react-icons/bs'

// // creplaced with the following
// export const DATATYPE_ICONS = {
//   'date': <BsClock />,
//   'number': <BsHash />,
//   'string': <BsType />
// }

export const DateIcon = BsClock
export const NumberIcon = BsHash
export const StringIcon = BsType

export const dataTypeIcons = {
  date: DateIcon,
  number: NumberIcon,
  string: StringIcon,
}

export const WEBWORKER_ACTIVE = true
