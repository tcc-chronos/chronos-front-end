import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DefaultLayout, Training, NotFound } from './components'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Training />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>,
)
