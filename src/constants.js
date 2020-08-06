import React from "react"
import { BsClock, BsHash, BsType } from "react-icons/bs"

// removed from ColumnCard.js, we use dataTypeIcons instead
export const DATATYPE_ICONS = {
  'date': <BsClock />,
  'number': <BsHash />,
  'string': <BsType />
}

export const dataTypeIcons = {
  'date': BsClock,
  'number': BsHash,
  'string': BsType
}