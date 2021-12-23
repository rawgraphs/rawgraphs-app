import * as Comlink from 'comlink'
import * as rollupBrowser from 'rollup/dist/rollup.browser'
import virtual from '@rollup/plugin-virtual'

console.log('Hello bundler worker!')

/**
 * @type {import('rollup')}
 */
const rollup = rollupBrowser

/**
 * @param {Record<string, string>} code
 * @returns {Promise<string>}
 */
async function createBundle(code) {
  const build = await rollup.rollup({
    input: 'index',
    external: (source, importer, isResolved) => {
      if (source.startsWith('./') || source.startsWith('../')) {
        return false
      }
      return true
    },
    plugins: [
      virtual(code),
    ],
  })
  const { output } = await build.generate({ format: 'amd' })
  return output[0].code
}

const obj = {
  createBundle,
}

Comlink.expose(obj)
