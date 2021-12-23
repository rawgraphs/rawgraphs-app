import * as Comlink from 'comlink'
import * as rollupBrowser from 'rollup/dist/rollup.browser'
import virtual from '@rollup/plugin-virtual'
import minify from 'babel-minify'

// console.log('...Start bundler worker...')
const minifyPlugin = {
  renderChunk(code) {
    const out = minify(code)
    return { code: out.code, map: out.map }
  },
}

/**
 * @type {import('rollup')}
 */
const rollup = rollupBrowser

/**
 * @param {Record<string, string>} code
 * @returns {Promise<string>}
 */
async function createBundle(code, options) {
  const isProd = options.mode === 'production'

  const plugins = [virtual(code)]

  if (isProd) {
    plugins.push(minifyPlugin)
  }

  const build = await rollup.rollup({
    input: 'index',
    external: (source, importer, isResolved) => {
      if (source.startsWith('./') || source.startsWith('../')) {
        return false
      }
      return true
    },
    plugins,
  })
  const { output } = await build.generate({
    format: isProd ? 'umd' : 'amd',
    name: 'customChartBuiltWithRAW',
  })
  return output[0].code
}

const obj = {
  createBundle,
}

Comlink.expose(obj)
