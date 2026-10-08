// This app doesn't register a service worker (see index.js), but keeps this
// around to clean up any that a previous deployment may have registered.

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error(error.message)
      })
  }
}
