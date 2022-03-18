import { useCallback, useEffect, useState } from 'react'
import { sha3_512 } from 'js-sha3'
import difference from 'lodash/difference'
import uniq from 'lodash/uniq'
import find from 'lodash/find'
import { requireRawChartsFromUrl, NPM_CDN } from './rawRequire'
import './chart-types'

const STORE_NS = 'rawCustomCharts'

/**
 * @param {CustomChartContract[]} prevCharts
 * @param {CustomChartContract[]} newChartsToInject
 * @returns {[CustomChartContract[],CustomChartContract[]]}
 */
function getNextCustomChartsAndReleased(prevCharts, newChartsToInject) {
  const newIds = newChartsToInject.map((c) => c.metadata.id)
  const releasedCustomCharts = []
  const nextCustomCharts = prevCharts
    .filter((prevChart) => {
      const shouldBeReleased = newIds.includes(prevChart.metadata.id)
      if (shouldBeReleased) {
        releasedCustomCharts.push(prevChart)
      }
      return !shouldBeReleased
    })
    .concat(newChartsToInject)
  return [nextCustomCharts, releasedCustomCharts]
}

/**
 * @param {CustomChartContract[]} nextCustomCharts
 */
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

/**
 * @param {File} file
 * @returns {Promise<string>}
 */
function makeFileHash(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function (event) {
      resolve(sha3_512(event.target.result))
    }
    reader.readAsArrayBuffer(file)
  })
}

async function loadStoredCustomCharts() {
  /**
   * @type {StoredCustomChart[]}
   */
  const storedCustomCharts = JSON.parse(localStorage.getItem(STORE_NS) ?? '[]')
  const cache = await window.caches.open(STORE_NS)

  // Calculate an unique list of sources to load
  // It also read caches storage and create a browser url for file sources
  const packsToLoad = await Promise.all(
    uniq(storedCustomCharts.map((chart) => chart.source)).map(
      /**
       * @param {string} source
       * @returns {Promise<{ source: string, url: string } | null>}
       */
      (source) => {
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
      }
    )
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
  ).then((nChars) => {
    /**
     * @type {Record<string, CustomChartContract>}
     */
    const by = {}
    return nChars.reduce((o, charts) => {
      charts.forEach((c) => {
        o[c.metadata.id] = c
      })
      return o
    }, by)
  })

  return storedCustomCharts.map((c) => loadedChartsById[c.id]).filter(Boolean)
}

async function exportCustomChart(chart) {
  if (!chart.rawCustomChart) {
    // Not a custom chart
    return null
  }
  const { source } = chart.rawCustomChart
  if (source.indexOf('file:') === 0) {
    const cache = await window.caches.open(STORE_NS)
    const hash = source.replace('file:', '')
    const result = await cache.match(`/${hash}`)
    if (!result) {
      throw new Error(`File not found: ${hash}`)
    }
    const content = await result.text()
    return {
      source,
      content,
    }
  }
  return {
    source,
  }
}

/**
 * This hook handle the custom user charts.
 * It's business is to load custom charts from some `source`:
 *  - `file:hash` File source we hash the file content to identify "which" file
 *  - `url:cdn_url` An url that point to a js file bundled as UMD | AMD
 *  - `npm:name` A valid package name on npm registry bundled also as UMD | AMD
 *
 * It loads the current custom charts on mount from user storage and sync
 * them when you call its methods.
 *
 * @param {{ storage: boolean }}
 * @returns {[CustomChartContract[], {
 *  uploadCustomCharts: (file?: File, mode?:  'replace' | 'add') => Promise<CustomChartContract[]>
 *  loadCustomChartsFromUrl: (url: string) => Promise<CustomChartContract[]>
 *  loadCustomChartsFromNpm: (name: string) => Promise<CustomChartContract[]>
 *  importCustomChartFromProject: (projectChart: CustomChartContract) => Promise<CustomChartContract>
 *  removeCustomChart: (chart: CustomChartContract) => Promise<CustomChartContract[]>
 *  exportCustomChart: (chart: CustomChartContract) => Promise<{ source: string, content: string | null }>
 * }]}
 */
export default function useCustomCharts({ storage = true } = { storage: true }) {
  const [customCharts, setCustomCharts] = useState([])

  // Loads custom charts saved in user storage
  useEffect(() => {
    if (storage) {
      loadStoredCustomCharts().then(setCustomCharts)
    }
  }, [storage])

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
      const [
        nextCustomCharts,
        releasedCustomCharts,
      ] = getNextCustomChartsAndReleased(customCharts, newChartsToInject)
      releasedCustomCharts.forEach((c) => {
        URL.revokeObjectURL(c.rawCustomChart.url)
      })
      setCustomCharts(nextCustomCharts)
      if (storage) {
        await storeCustomCharts(nextCustomCharts)
      }
      return nextCustomCharts
    },
    [customCharts, storage]
  )

  const loadCustomChartsFromUrl = useCallback(
    async (url) => {
      const source = `url:${url}`
      return loadCustomChartsFromUrlAsSource(source, url)
    },
    [loadCustomChartsFromUrlAsSource]
  )

  const loadCustomChartsFromNpm = useCallback(
    async (name) => {
      const source = `npm:${name}`
      const url = NPM_CDN + name
      return loadCustomChartsFromUrlAsSource(source, url)
    },
    [loadCustomChartsFromUrlAsSource]
  )

  const uploadCustomCharts = useCallback(
    async (file, mode = 'add') => {
      if (!file) {
        return []
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
      const [nextCustomCharts, releasedCustomCharts] =
        mode === 'replace'
          ? [newChartsToInject, customCharts]
          : getNextCustomChartsAndReleased(customCharts, newChartsToInject)
      releasedCustomCharts.forEach((c) => {
        URL.revokeObjectURL(c.rawCustomChart.url)
      })
      setCustomCharts(nextCustomCharts)
      if (storage) {
        const cache = await window.caches.open(STORE_NS)
        await cache.put(fileHash, new Response(file))
        await storeCustomCharts(nextCustomCharts)
      }
      return nextCustomCharts
    },
    [customCharts, storage]
  )

  const importCustomChartFromProject = useCallback(
    async (projectChart) => {
      const { source, content } = projectChart.rawCustomChart
      let url, file, fileHash
      if (source.indexOf('url:') === 0) {
        url = source.replace('url:', '')
      } else if (source.indexOf('npm:') === 0) {
        url = NPM_CDN + source.replace('npm:', '')
      } else if (source.indexOf('file:') === 0) {
        fileHash = source.replace('file:', '')
        file = new File([content], `${fileHash}.js`, {
          type: 'application/json',
        })
        url = URL.createObjectURL(file)
      } else {
        throw new Error(`Try to import invalid source ${source}`)
      }
      const newChartsToInject = await requireRawChartsFromUrl(url)
      let newChart = find(
        newChartsToInject,
        (c) => c.metadata.id === projectChart.metadata.id
      )
      if (!newChart) {
        throw new Error(
          `Can't find chart ${projectChart.metadata.id} from ${source}`
        )
      }
      newChart = {
        ...newChart,
        rawCustomChart: {
          source,
          url,
        },
      }
      const [
        nextCustomCharts,
        releasedCustomCharts,
      ] = getNextCustomChartsAndReleased(customCharts, [newChart])
      releasedCustomCharts.forEach((c) => {
        URL.revokeObjectURL(c.rawCustomChart.url)
      })
      setCustomCharts(nextCustomCharts)
      if (storage) {
        if (file) {
          const cache = await window.caches.open(STORE_NS)
          await cache.put(fileHash, new Response(file))
        }
        await storeCustomCharts(nextCustomCharts)
      }
      return newChart
    },
    [customCharts, storage]
  )

  const removeCustomChart = useCallback(
    async (chart) => {
      const nextCustomCharts = customCharts.filter(
        (c) => c.metadata.id !== chart.metadata.id
      )
      setCustomCharts(nextCustomCharts)
      if (storage) {
        await storeCustomCharts(nextCustomCharts)
      }
      return nextCustomCharts
    },
    [customCharts, storage]
  )

  return [
    customCharts,
    {
      uploadCustomCharts,
      removeCustomChart,
      loadCustomChartsFromUrl,
      loadCustomChartsFromNpm,
      exportCustomChart,
      importCustomChartFromProject,
    },
  ]
}
