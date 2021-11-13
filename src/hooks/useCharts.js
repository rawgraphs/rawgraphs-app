import { useCallback, useEffect, useMemo, useState } from 'react'
import { sha3_512 } from 'js-sha3'
import difference from 'lodash/difference'
import uniq from 'lodash/uniq'
import charts from '../charts'
import { requireRawChartsFromUrl } from './rawRequire'

const STORE_NS = 'rawCustomCharts'

const NPM_CDN = 'https://cdn.jsdelivr.net/npm/'

function getNextCustomCharts(prevCharts, newChartsToInject) {
  const newIds = newChartsToInject.map((c) => c.metadata.id)
  return prevCharts
    .filter((c) => !newIds.includes(c.metadata.id))
    .concat(newChartsToInject)
}

function makeFileHash(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function (event) {
      resolve(sha3_512(event.target.result))
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
  const nextHashses = toStoreCustomCharts
    .map((chart) =>
      chart.source.indexOf('file:') === 0
        ? chart.source.replace('file:', '')
        : null
    )
    .filter(Boolean)
  const cacheKeys = await cache.keys()
  const currentHashses = cacheKeys.map((k) => k.url.split('/').slice(-1)[0])
  const toRemoveHashes = difference(currentHashses, nextHashses)
  await Promise.all(toRemoveHashes.map((hash) => cache.delete('/' + hash)))
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
      if (source.indexOf('npm:') === 0) {
        return Promise.resolve({
          source,
          url: NPM_CDN + source.replace('npm:', ''),
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

  const loadCustomChartsFromUrlAsSource = useCallback(
    async (source, url) => {
      let newChartsToInject = await requireRawChartsFromUrl(url)
      if (newChartsToInject.length === 0) {
        return
      }
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
    },
    [customCharts]
  )

  const loadCustomChartsFromUrl = useCallback(
    async (url) => {
      const source = `url:${url}`
      await loadCustomChartsFromUrlAsSource(source, url)
    },
    [loadCustomChartsFromUrlAsSource]
  )

  const loadCustomChartsFromNpm = useCallback(
    async (name) => {
      const source = `npm:${name}`
      const url = NPM_CDN + name
      await loadCustomChartsFromUrlAsSource(source, url)
    },
    [loadCustomChartsFromUrlAsSource]
  )

  const uploadCustomCharts = useCallback(
    async (file) => {
      if (!file) {
        return
      }
      const url = URL.createObjectURL(file)
      let newChartsToInject = await requireRawChartsFromUrl(url)
      if (newChartsToInject.length === 0) {
        return
      }
      const fileHash = await makeFileHash(file)
      const source = `file:${fileHash}`
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
      await cache.put(fileHash, new Response(file))
      await storeCustomCharts(nextCustomCharts)
    },
    [customCharts]
  )

  const removeCustomChart = useCallback(
    async (chart) => {
      const nextCustomCharts = customCharts.filter(
        (c) => c.metadata.id !== chart.metadata.id
      )
      setCustomCharts(nextCustomCharts)
      await storeCustomCharts(nextCustomCharts)
    },
    [customCharts]
  )

  const allCharts = useMemo(() => charts.concat(customCharts), [customCharts])
  return [
    allCharts,
    {
      uploadCustomCharts,
      removeCustomChart,
      loadCustomChartsFromUrl,
      loadCustomChartsFromNpm,
    },
  ]
}
