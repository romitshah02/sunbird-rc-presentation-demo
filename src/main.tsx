import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import Theatre from './pages/Theatre'
import Transport from './pages/Transport'
import Bank from './pages/Bank'

const NotFound = () => <p className="not-found">Not found</p>

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/theatre" replace />} />
        <Route path="/theatre" element={<Theatre />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/bank" element={<Bank />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
