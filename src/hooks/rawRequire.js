/* eslint-disable no-restricted-globals */
import * as d3 from 'd3'
import * as rawgraphsCore from '@rawgraphs/rawgraphs-core'
import LRU from 'lru-cache'

const queue = []
const cache = new LRU(50)

const DEPENDENCIES_ALIAS = {
  d3,
  rawgraphsCore,
}

/**
 * Reauire a dependency
 *
 * @param {string} name
 */
function requireDependency(name) {
  const dep = DEPENDENCIES_ALIAS[name]
  if (!dep) {
    // TODO: Link url tutorial bundler...
    throw new Error(
      `Missing dependency ${name} please bundle it in your custom chart build.`
    )
  }
  return dep
}

function define(...params) {
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
      : requireDependency(dep)
  )
  // Run factory ... This will write into exports
  factory(...rutimeDepencies)
  // Push filled exports
  queue.push(exports)
}

define.amd = {}

/**
 *
 * @param {string} url
 */
function requireFromUrl(url) {
  return new Promise((resolve, reject) => {
    window.define = define
    const scriptTag = document.createElement('script')
    scriptTag.src = url
    scriptTag.async = true
    scriptTag.addEventListener(
      'load',
      () => {
        // Pop last exports
        const finalExports = queue.pop()
        scriptTag.remove()
        resolve(finalExports)
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

export async function requireRawChartsFromUrl(url) {
  if (cache.get(url)) {
    return Promise.resolve(cache.get(url))
  }
  const daExports = await requireFromUrl(url)
  if (!daExports) {
    return []
  }
  const charts = Object.values(daExports).filter(isRawChartLike)
  // NOTE: Cache only relevant exports ...
  if (charts.length > 0) {
    cache.set(url, charts)
  }
  return charts
}

export function requireRawChartsFromUrlWebWorker(url) {
  if (cache.get(url)) {
    return cache.get(url)
  }
  const daExports = requireFromUrlWebWorker(url)
  if (!daExports) {
    return []
  }
  const charts = Object.values(daExports).filter(isRawChartLike)
  // NOTE: Cache only relevant exports ...
  if (charts.length > 0) {
    cache.set(url, charts)
  }
  return charts
}

/**
 *
 * @param {string} url
 */
function requireFromUrlWebWorker(url) {
  self.define = define
  self.importScripts(url)
  const finalExports = queue.pop()
  return finalExports
}
