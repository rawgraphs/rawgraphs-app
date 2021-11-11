// import React from "react"
import { BsClock, BsHash, BsType } from 'react-icons/bs'
import arEG from 'd3-time-format/locale/ar-EG.json'
import caES from 'd3-time-format/locale/ca-ES.json'
import csCZ from 'd3-time-format/locale/cs-CZ.json'
import daDK from 'd3-time-format/locale/da-DK.json'
import deCH from 'd3-time-format/locale/de-CH.json'
import deDE from 'd3-time-format/locale/de-DE.json'
import enCA from 'd3-time-format/locale/en-CA.json'
import enGB from 'd3-time-format/locale/en-GB.json'
import enUS from 'd3-time-format/locale/en-US.json'
import esES from 'd3-time-format/locale/es-ES.json'
import esMX from 'd3-time-format/locale/es-MX.json'
import faIR from 'd3-time-format/locale/fa-IR.json'
import fiFI from 'd3-time-format/locale/fi-FI.json'
import frCA from 'd3-time-format/locale/fr-CA.json'
import frFR from 'd3-time-format/locale/fr-FR.json'
import heIL from 'd3-time-format/locale/he-IL.json'
import huHU from 'd3-time-format/locale/hu-HU.json'
import itIT from 'd3-time-format/locale/it-IT.json'
import jaJP from 'd3-time-format/locale/ja-JP.json'
import koKR from 'd3-time-format/locale/ko-KR.json'
import mkMK from 'd3-time-format/locale/mk-MK.json'
import nbNO from 'd3-time-format/locale/nb-NO.json'
import nlNL from 'd3-time-format/locale/nl-NL.json'
import plPL from 'd3-time-format/locale/pl-PL.json'
import ptBR from 'd3-time-format/locale/pt-BR.json'
import ruRU from 'd3-time-format/locale/ru-RU.json'
import svSE from 'd3-time-format/locale/sv-SE.json'
import ukUA from 'd3-time-format/locale/uk-UA.json'
import zhCN from 'd3-time-format/locale/zh-CN.json'
import zhTW from 'd3-time-format/locale/zh-TW.json'

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

export const localeList = {
  'ar-EG': arEG,
  'ca-ES': caES,
  'cs-CZ': csCZ,
  'da-DK': daDK,
  'de-CH': deCH,
  'de-DE': deDE,
  'en-CA': enCA,
  'en-GB': enGB,
  'en-US': enUS,
  'es-ES': esES,
  'es-MX': esMX,
  'fa-IR': faIR,
  'fi-FI': fiFI,
  'fr-CA': frCA,
  'fr-FR': frFR,
  'he-IL': heIL,
  'hu-HU': huHU,
  'it-IT': itIT,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'mk-MK': mkMK,
  'nb-NO': nbNO,
  'nl-NL': nlNL,
  'pl-PL': plPL,
  'pt-BR': ptBR,
  'ru-RU': ruRU,
  'sv-SE': svSE,
  'uk-UA': ukUA,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
}

export const WEBWORKER_ACTIVE = true

export const separatorsLabels = {
  '\\t': 'Tab',
  ';': 'Semicolon',
  ',': 'Comma',
  '|': 'Pipe',
}

export const separatorsList = Object.keys(separatorsLabels)

export const DefaultSeparator = ","

export const AGGREGATIONS_LABELS = {
  "count": "Count",
  "mean": "Average",
  "median": "Median",
  "max": "Max",
  "min": "Min",
  "countDistinct": "Count unique",
  "sum": "Sum",
  "csv": "CSV",
  "csvDistinct": "CSV (unique)",
}

export const SCALES_LABELS = {
  "sequential": "Sequential",
  "diverging": "Diverging",
  "ordinal": "Ordinal"
}

export const COLOR_SCHEMES_LABELS = {
  "interpolateBlues": "Blue sequential",
  "interpolateGreens": "Green sequential",
  "interpolateReds": "Red sequential",
  "interpolateRdBu": "RdBu diverging",
  "interpolateBrBG": "BrBG diverging",
  "interpolatePiYG": "PiYG diverging",
  "schemeCategory10": "Categorical 10",
  "interpolateTurbo": "Turbo discrete",
  "interpolateSpectral": "Spectral discrete"
}