import * as Comlink from 'comlink'
import * as rollupBrowser from 'rollup/dist/rollup.browser'
import virtual from '@rollup/plugin-virtual'

console.log('Hello bundler worker!')

/**
 * @type {import('rollup')}
 */
const rollup = rollupBrowser

async function createBundle(code) {
  const build = await rollup.rollup({
    input: 'index',
    plugins: [
      virtual({
        chart: code,
        index: `export { default as chart } from './chart'`,
      }),
    ],
  })
  const { output } = await build.generate({ format: 'umd', name: 'devcharts' })
  return output[0].code
}

const obj = {
  createBundle,
}

Comlink.expose(obj)
