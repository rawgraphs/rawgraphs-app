import { useEffect, useMemo, useState } from 'react'
import charts from '../charts'
import { requireRawChartsFromUrl } from './rawRequire'

function makeSetNewChartsUniqueFn(newChartsToInject) {
  return (prevCharts) => {
    const newIds = newChartsToInject.map((c) => c.metadata.id)
    return prevCharts
      .filter((c) => !newIds.includes(c.metadata.id))
      .concat(newChartsToInject)
  }
}

export default function useCharts() {
  const [customCharts, setCustomCharts] = useState([])

  // useEffect(() => {
  //   // Grab all scripts in cache
  //   window.caches.open('customCharts').then((cache) => {
  //     cache
  //       .keys()
  //       // Get all blobs ... with packs ...
  //       .then((keys) => {
  //         return Promise.all(
  //           keys.map((k) =>
  //             cache
  //               .match(k)
  //               .then((m) =>
  //                 m.blob().then((b) => [k.url.split('/').slice(-1)[0], b])
  //               )
  //           )
  //         )
  //       })
  //       // Generate urls for blobs and wait all scripts to load
  //       .then((blobsWithPacks) => {
  //         return Promise.all(
  //           blobsWithPacks.map(([pack, blob]) => {
  //             return new Promise((resolve) => {
  //               const url = URL.createObjectURL(blob)
  //               const scriptTag = document.createElement('script')
  //               scriptTag.src = url
  //               scriptTag.addEventListener('load', () => resolve([pack, url]), {
  //                 once: true,
  //               })
  //               document.head.append(scriptTag)
  //             })
  //           })
  //         )
  //       })
  //       // Finally read the stack and add charts in cache to current state
  //       .then((packsWithUrls) => {
  //         const urlsByPack = packsWithUrls.reduce((by, [pack, url]) => {
  //           by[pack] = url
  //           return by
  //         }, {})
  //         const newChartsToInject = popAllCustomChartsStack()
  //         setCustomCharts(
  //           makeSetNewChartsUniqueFn(
  //             newChartsToInject.map((c) => {
  //               // TODO: Find a better approach
  //               const rawPkg = c.metadata.id?.split('.')?.[0]
  //               return {
  //                 ...c,
  //                 rawCustomChart: {
  //                   url: urlsByPack[rawPkg],
  //                 },
  //               }
  //             })
  //           )
  //         )
  //       })
  //   })
  // }, [])

  function loadCustomChartFromUrl(url) {
    requireRawChartsFromUrl(url).then((newChartsToInject) => {
      setCustomCharts(
        makeSetNewChartsUniqueFn(
          newChartsToInject.map((c) => ({
            ...c,
            rawCustomChart: {
              url,
            },
          }))
        )
      )
    })
  }

  function uploadCustomChart(file) {
    if (!file) {
      return
    }
    const url = URL.createObjectURL(file)
    requireRawChartsFromUrl(url).then((newChartsToInject) => {
      setCustomCharts(
        makeSetNewChartsUniqueFn(
          newChartsToInject.map((c) => ({
            ...c,
            rawCustomChart: {
              url,
            },
          }))
        )
      )
    })
    // const scriptTag = document.createElement('script')
    // scriptTag.src = url
    // scriptTag.addEventListener(
    //   'load',
    //   () => {
    //     const newChartsToInject = popAllCustomChartsStack()
    //     setCustomCharts(
    //       makeSetNewChartsUniqueFn(
    //         newChartsToInject.map((c) => ({
    //           ...c,
    //           rawCustomChart: {
    //             url,
    //           },
    //         }))
    //       )
    //     )

    //     // TODO: Find a better approach
    //     const rawPkg = newChartsToInject
    //       .map((r) => r.metadata.id)[0]
    //       ?.split('.')?.[0]

    //     if (rawPkg) {
    //       window.caches.open('customCharts').then((cache) => {
    //         cache.put(rawPkg, new Response(file))
    //       })
    //     }
    //   },
    //   {
    //     once: true,
    //   }
    // )
    // document.head.append(scriptTag)
  }

  function removeCustomChart(chart) {
    const rawPkg = chart.metadata.id?.split('.')?.[0]
    setCustomCharts((charts) =>
      charts.filter((c) => c.metadata.id !== chart.metadata.id)
    )
    if (rawPkg) {
      window.caches.open('customCharts').then((cache) => {
        cache.delete(rawPkg)
      })
    }
  }

  const allCharts = useMemo(() => charts.concat(customCharts), [customCharts])
  return [allCharts, { uploadCustomChart, removeCustomChart }]
}
