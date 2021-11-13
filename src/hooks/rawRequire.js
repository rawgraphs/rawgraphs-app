/* eslint-disable no-restricted-globals */
import * as d3 from 'd3'
import * as rawgraphsCore from '@rawgraphs/rawgraphs-core'

const queue = []

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
export function requireFromUrl(url) {
  return new Promise((resolve) => {
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
  const daExports = await requireFromUrl(url)
  if (!daExports) {
    return []
  }
  return Object.values(daExports).filter(isRawChartLike)
}

export function requireRawChartsFromUrlWebWorker(url) {
  const daExports = requireFromUrlWebWorker(url)
  if (!daExports) {
    return []
  }
  return Object.values(daExports).filter(isRawChartLike)
}

/**
 *
 * @param {string} url
 */
export function requireFromUrlWebWorker(url) {
  self.define = define
  self.importScripts(url)
  return queue.pop()
}
