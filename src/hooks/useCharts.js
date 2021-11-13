import { useEffect, useMemo, useState } from 'react'
import sha1 from 'js-sha1'
import difference from 'lodash/difference'
import uniq from 'lodash/uniq'
import charts from '../charts'
import { requireRawChartsFromUrl } from './rawRequire'

const STORE_NS = 'rawCustomCharts'

function getNextCustomCharts(prevCharts, newChartsToInject) {
  const newIds = newChartsToInject.map((c) => c.metadata.id)
  return prevCharts
    .filter((c) => !newIds.includes(c.metadata.id))
    .concat(newChartsToInject)
}

function makeFileSha1(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function (event) {
      resolve(sha1(event.target.result))
    }
    reader.readAsArrayBuffer(file)
  })
}

async function storeCustomCharts(nextCustomCharts) {
  const toStoreCustomCharts = nextCustomCharts.map((chart) => ({
    id: chart.metadata.id,
    source: chart.rawCustomChart.source,
  }))
  localStorage.setItem(STORE_NS, JSON.stringify(toStoreCustomCharts))
  const cache = await window.caches.open(STORE_NS)
  const nextShas = toStoreCustomCharts
    .map((chart) =>
      chart.source.indexOf('file:') === 0
        ? chart.source.replace('file:', '')
        : null
    )
    .filter(Boolean)
  const cacheKeys = await cache.keys()
  const currentShas = cacheKeys.map((k) => k.url.split('/').slice(-1)[0])
  const toRemoveShas = difference(currentShas, nextShas)
  await Promise.all(toRemoveShas.map((rmSha) => cache.delete('/' + rmSha)))
}

async function loadStoredCustomCharts() {
  const storedCustomCharts = JSON.parse(localStorage.getItem(STORE_NS) ?? '[]')
  const cache = await window.caches.open(STORE_NS)

  const packsToLoad = await Promise.all(
    uniq(storedCustomCharts.map((chart) => chart.source)).map((source) => {
      if (source.indexOf('file:') === 0) {
        return cache.match('/' + source.replace('file:', '')).then((m) => {
          if (!m) {
            return Promise.resolve(null)
          }
          return m.blob().then((b) => ({
            source,
            url: URL.createObjectURL(b),
          }))
        })
      }
      if (source.indexOf('url:') === 0) {
        return Promise.resolve({
          source,
          url: source.replace('url:', ''),
        })
      }
      return Promise.resolve(null)
    })
  ).then((packs) => packs.filter(Boolean))

  const loadedChartsById = await Promise.all(
    packsToLoad.map((p) =>
      requireRawChartsFromUrl(p.url).then((charts) =>
        charts.map((chart) => ({
          ...chart,
          rawCustomChart: p,
        }))
      )
    )
  ).then((nChars) =>
    nChars.reduce((o, charts) => {
      charts.forEach((c) => {
        o[c.metadata.id] = c
      })
      return o
    }, {})
  )

  return storedCustomCharts.map((c) => loadedChartsById[c.id]).filter(Boolean)
}

export default function useCharts() {
  const [customCharts, setCustomCharts] = useState([])

  useEffect(() => {
    loadStoredCustomCharts().then(setCustomCharts)
  }, [])

  async function loadCustomChartFromUrl(url) {
    let newChartsToInject = await requireRawChartsFromUrl(url)
    if (newChartsToInject.length === 0) {
      return
    }
    const source = `url:${url}`
    newChartsToInject = newChartsToInject.map((chart) => ({
      ...chart,
      rawCustomChart: {
        source,
        url,
      },
    }))
    const nextCustomCharts = getNextCustomCharts(
      customCharts,
      newChartsToInject
    )
    setCustomCharts(nextCustomCharts)
    await storeCustomCharts(nextCustomCharts)
  }

  async function uploadCustomChart(file) {
    if (!file) {
      return
    }
    const url = URL.createObjectURL(file)
    let newChartsToInject = await requireRawChartsFromUrl(url)
    if (newChartsToInject.length === 0) {
      return
    }
    const fileSha1 = await makeFileSha1(file)
    const source = `file:${fileSha1}`
    newChartsToInject = newChartsToInject.map((chart) => ({
      ...chart,
      rawCustomChart: {
        source,
        url,
      },
    }))
    const nextCustomCharts = getNextCustomCharts(
      customCharts,
      newChartsToInject
    )
    setCustomCharts(nextCustomCharts)
    const cache = await window.caches.open(STORE_NS)
    await cache.put(fileSha1, new Response(file))
    await storeCustomCharts(nextCustomCharts)
  }

  async function removeCustomChart(chart) {
    const nextCustomCharts = customCharts.filter((c) => c.metadata.id !== chart.metadata.id)
    setCustomCharts(nextCustomCharts)
    await storeCustomCharts(nextCustomCharts)
  }

  const allCharts = useMemo(() => charts.concat(customCharts), [customCharts])
  return [
    allCharts,
    { uploadCustomChart, removeCustomChart, loadCustomChartFromUrl },
  ]
}
