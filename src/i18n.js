import i18next from 'i18next'
import ChainedBackend from 'i18next-chained-backend'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18next
  .use(LanguageDetector)
  .use(ChainedBackend)
  .use(initReactI18next)
  .init({
    supportedLngs: ['it', 'en', 'fr'],
    preload: ['en'],
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    backend: {
      backends: [
        resourcesToBackend((lng, ns, clb) => {
          Promise.all([
            import(`./locales/${lng}.json`).then((r) => r.default),
            import(`@rawgraphs/rawgraphs-charts/locales/${lng}.json`).then(
              (r) => r.default
            ),
          ])
            .then((resources) => {
              const r = { ...resources[0], RAWCharts: resources[1] }
              clb(null, r)
            })
            .catch(clb)
        }),
      ],
    },
  })
