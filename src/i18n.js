import i18next from 'i18next'
import ChainedBackend from 'i18next-chained-backend'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'

i18next
  .use(ChainedBackend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    preload: ['en'],
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production',
    backend: {
      backends: [
        resourcesToBackend((lng, ns, clb) => {
          Promise.all([
            import(`@rawgraphs/rawgraphs-charts/locales/${lng}.json`).then(r => r.default),
            import(`./locales/${lng}.json`).then(r => r.default),
          ]).then((resources) => {
            console.log(resources)
            const r = { ...resources[0], ...resources[1] }
            clb(null, r)
          }).catch(clb)
        }),
      ],
    },
  })
