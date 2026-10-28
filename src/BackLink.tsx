import { Link } from 'react-router-dom'
import { useI18n } from './i18n/i18n'

// Back to the home page. A real link, so it works with middle-click and keyboard.
export default function BackLink({ className = '' }: { className?: string }) {
  const { t } = useI18n()
  return (
    <Link to="/" className={`back-link ${className}`.trim()}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5M11 6l-6 6 6 6" />
      </svg>
      {t('back')}
    </Link>
  )
}
