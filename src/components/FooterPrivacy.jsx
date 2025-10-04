// src/components/FooterPrivacy.jsx
import React, { useContext, useMemo } from 'react'
import { ConsentContext } from '../context/ConsentContext'
import ConsentManager from '../utils/ConsentManager'
import { Link } from 'react-router-dom'

const FooterPrivacy = () => {
  const { consent, revokeConsent } = useContext(ConsentContext)
  const status = useMemo(() => {
    const c = consent || ConsentManager.getConsent()
    const onlyEssential = c.categories && c.categories.functional === false && c.categories.analytics === false && c.categories.marketing === false
    return {
      label: onlyEssential ? 'Privacy-friendly' : 'Custom',
      color: onlyEssential ? 'bg-green-100 text-green-700 border-green-200' : 'bg-purple-100 text-purple-700 border-purple-200',
    }
  }, [consent])

  return (
    <footer className="fixed bottom-2 right-2 z-40">
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur border border-gray-200 shadow-lg rounded-full px-3 py-1">
        <span aria-hidden>🍪</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${status.color}`}>{status.label}</span>
        <Link to="/settings/privacy" className="text-xs text-purple-700 hover:underline">Privacy</Link>
        <Link to="/privacy/cookies" className="text-xs text-purple-700 hover:underline">Cookie Policy</Link>
        <button onClick={revokeConsent} className="text-xs text-gray-600 hover:text-gray-800" title="Revoke consent">Revoke</button>
      </div>
    </footer>
  )
}

export default FooterPrivacy
