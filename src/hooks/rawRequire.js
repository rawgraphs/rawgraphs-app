/* eslint-disable no-restricted-globals */
import * as d3 from 'd3'
import * as rawgraphsCore from '@rawgraphs/rawgraphs-core'
import LRU from 'lru-cache'

export const NPM_CDN = 'https://cdn.jsdelivr.net/npm/'

/**
 * NOTE: In a perfect we got type definition from core
 *
 * @typedef {{
 *  metadata: { id: string }
 * }} ChartContract
 */

const queue = []
const cacheChartsPkg = new LRU(50)
const cacheDependenciesTree = new LRU(400)

const DEPENDENCIES_ALIAS = {
  d3,
  '@rawgraphs/rawgraphs-core': rawgraphsCore,
}

/**
 * Reauire a dependency in the DOM Context and cache it
 *
 * @param {string} name
 */
async function requireDependency(name) {
  if (DEPENDENCIES_ALIAS[name]) {
    return DEPENDENCIES_ALIAS[name]
  }
  let url
  try {
    url = new URL(name)
  } catch (e) {
    url = new URL(`${NPM_CDN}${name}`)
  }
  const sUrl = url.toString()
  if (cacheDependenciesTree.has(sUrl)) {
    return cacheDependenciesTree.get(sUrl)
  }
  const v = await requireFromUrl(sUrl.toString())
  if (v) {
    cacheDependenciesTree.set(sUrl, v)
  }
  return v
}

/**
 * AMD Define for the DOM Context
 */
function defineDOM(...params) {
  /**
   * @type {(dependencies: string[]) void}
   */
  let factory
  /**
   * @type string[]
   */
  let dependencies
  // Adjust various AMD callding patterhns
  if (params.length < 2) {
    factory = params[0]
    dependencies = []
  } else {
    if (params.length >= 3) {
      params = params.slice(1)
    }
    dependencies = params[0]
    factory = params[1]
  }
  // Instance dependencies
  const exports = {}
  const module = { exports }
  const rutimeDepenciesPromises = dependencies.map((dep) =>
    dep === 'exports'
      ? Promise.resolve(exports)
      : dep === 'module'
      ? Promise.resolve(module)
      : requireDependency(dep)
  )
  queue.push(
    Promise.all(rutimeDepenciesPromises).then((rutimeDepencies) => {
      // Run factory ... This will (maybe) write into exports
      const outFactory = factory(...rutimeDepencies)
      if (
        !dependencies.includes('exports') &&
        !dependencies.includes('module') &&
        outFactory
      ) {
        // NOTE: In this case the factory return module
        return outFactory
      }
      // Push filled exports
      return exports
    })
  )
}

defineDOM.amd = {}

/**
 * Reauire a dependency in Web Worker Context
 *
 * @param {string} name
 */
function requireDependencyWebWorker(name) {
  if (DEPENDENCIES_ALIAS[name]) {
    return DEPENDENCIES_ALIAS[name]
  }
  let url
  try {
    url = new URL(name)
  } catch (e) {
    url = new URL(`${NPM_CDN}${name}`)
  }
  const sUrl = url.toString()
  if (cacheDependenciesTree.has(sUrl)) {
    return cacheDependenciesTree.get(sUrl)
  }
  const v = requireFromUrlWebWorker(sUrl.toString())
  if (v) {
    cacheDependenciesTree.set(sUrl, v)
  }
  return v
}

/**
 * AMD Define for the WebWorker Context
 */
function defineWebWorker(...params) {
  /**
   * @type {(dependencies: string[]) void}
   */
  let factory
  /**
   * @type string[]
   */
  let dependencies
  // Adjust various AMD callding patterhns
  if (params.length < 2) {
    factory = params[0]
    dependencies = []
  } else {
    if (params.length >= 3) {
      params = params.slice(1)
    }
    dependencies = params[0]
    factory = params[1]
  }
  // Instance dependencies
  const exports = {}
  const module = { exports }
  const rutimeDepencies = dependencies.map((dep) =>
    dep === 'exports'
      ? exports
      : dep === 'module'
      ? module
      : requireDependencyWebWorker(dep)
  )
  // Run factory ... This will (maybe) write into exports
  const outFactory = factory(...rutimeDepencies)
  if (
    !dependencies.includes('exports') &&
    !dependencies.includes('module') &&
    outFactory
  ) {
    // NOTE: In this case the factory return module
    queue.push(outFactory)
  } else {
    queue.push(exports)
  }
}
defineWebWorker.amd = {}

/**
 * Require from URL in the DOM
 *
 * @param {string} url
 */
function requireFromUrl(url) {
  return new Promise((resolve, reject) => {
    window.define = defineDOM
    const scriptTag = document.createElement('script')
    scriptTag.src = url
    scriptTag.async = true
    scriptTag.addEventListener(
      'load',
      () => {
        // Pop last exports
        const promiseFinalExports = queue.pop()
        if (!promiseFinalExports) {
          reject(`Problem during the execution of ${url}`)
          return
        }
        return promiseFinalExports
          .then(() => {
            scriptTag.remove()
            resolve(promiseFinalExports)
          })
          .catch((err) => {
            scriptTag.remove()
            reject(err)
          })
      },
      {
        once: true,
      }
    )
    scriptTag.addEventListener(
      'error',
      () => {
        scriptTag.remove()
        reject(`Cannot import url ${url}`)
      },
      {
        once: true,
      }
    )
    document.head.append(scriptTag)
  })
}

function isRawChartLike(obj) {
  if (typeof obj === 'object' && obj !== null) {
    return (
      typeof obj.render === 'function' && typeof obj.metadata.id === 'string'
    )
  }
  return false
}

/**
 * @param {string} url
 * @returns {Promise<ChartContract[]>}
 */
export async function requireRawChartsFromUrl(url) {
  if (cacheChartsPkg.get(url)) {
    return Promise.resolve(cacheChartsPkg.get(url))
  }
  const daExports = await requireFromUrl(url)
  if (!daExports) {
    return []
  }
  const charts = Object.values(daExports).filter(isRawChartLike)
  // NOTE: Cache only relevant exports ...
  if (charts.length > 0) {
    cacheChartsPkg.set(url, charts)
  }
  return charts
}

/**
 * @param {string} url
 * @returns {ChartContract[]}
 */
export function requireRawChartsFromUrlWebWorker(url) {
  if (cacheChartsPkg.get(url)) {
    return cacheChartsPkg.get(url)
  }
  const daExports = requireFromUrlWebWorker(url)
  if (!daExports) {
    return []
  }
  const charts = Object.values(daExports).filter(isRawChartLike)
  // NOTE: Cache only relevant exports ...
  if (charts.length > 0) {
    cacheChartsPkg.set(url, charts)
  }
  return charts
}

/**
 * Require from url in WebWorker context
 *
 * @param {string} url
 */
function requireFromUrlWebWorker(url) {
  self.define = defineWebWorker
  self.importScripts(url)
  const finalExports = queue.pop()
  return finalExports
}
