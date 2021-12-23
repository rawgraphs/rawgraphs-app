import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'

const BuilderApp = React.lazy(() => import('./BuilderApp'))

export default function WebApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/builder"
          element={
            <Suspense
              fallback={
                <h1 className="text-primary">Loading the awesome...</h1>
              }
            >
              <BuilderApp />
            </Suspense>
          }
        />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  )
}
