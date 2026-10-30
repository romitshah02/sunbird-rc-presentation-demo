import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import { I18nProvider, useI18n } from './i18n/i18n'
import LanguageSelect from './LanguageSelect'
import Home from './Home'
import Theatre from './pages/Theatre'
import Transport from './pages/Transport'
import Bank from './pages/Bank'
import Education from './pages/Education'

const NotFound = () => <p className="not-found">{useI18n().t('notFound')}</p>

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/theatre" element={<Theatre />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/bank" element={<Bank />} />
          <Route path="/education" element={<Education />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <LanguageSelect />
      </BrowserRouter>
    </I18nProvider>
  </StrictMode>,
)
