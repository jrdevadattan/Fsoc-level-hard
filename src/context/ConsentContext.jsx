// src/context/ConsentContext.jsx
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import ConsentManager from '../utils/ConsentManager'
import CookieBanner from '../components/CookieBanner'
import ConsentModal from '../components/ConsentModal'

export const ConsentContext = createContext({
  consent: null,
  hasConsent: () => false,
  acceptAll: () => {},
  rejectAll: () => {},
  savePreferences: () => {},
  revokeConsent: () => {},
  openCustomize: () => {},
})

const ConsentProvider = ({ children }) => {
  const [consent, setConsent] = useState(ConsentManager.getConsent())
  const [showBanner, setShowBanner] = useState(ConsentManager.shouldShowBanner())
  const [showCustomize, setShowCustomize] = useState(false)

  useEffect(() => {
    // re-evaluate on mount; respect DNT and expiry
    setConsent(ConsentManager.getConsent())
    setShowBanner(ConsentManager.shouldShowBanner())
  }, [])

  const hasConsent = useCallback((category) => ConsentManager.hasConsent(category), [])

  const acceptAll = useCallback(() => {
    const updated = ConsentManager.acceptAll()
    setConsent(updated)
    setShowBanner(false)
    setShowCustomize(false)
  }, [])

  const rejectAll = useCallback(() => {
    const updated = ConsentManager.rejectAll()
    setConsent(updated)
    setShowBanner(false)
    setShowCustomize(false)
  }, [])

  const savePreferences = useCallback((categories) => {
    const updated = ConsentManager.setPreferences(categories)
    setConsent(updated)
    setShowBanner(false)
    setShowCustomize(false)
  }, [])

  const revokeConsent = useCallback(() => {
    ConsentManager.revokeConsent()
    setConsent(ConsentManager.getConsent())
    setShowBanner(true)
  }, [])

  const openCustomize = useCallback(() => setShowCustomize(true), [])
  const closeCustomize = useCallback(() => setShowCustomize(false), [])

  const value = useMemo(() => ({
    consent,
    hasConsent,
    acceptAll,
    rejectAll,
    savePreferences,
    revokeConsent,
    openCustomize,
  }), [consent, hasConsent, acceptAll, rejectAll, savePreferences, revokeConsent, openCustomize])

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {showBanner && (
        <CookieBanner
          onAcceptAll={acceptAll}
          onRejectAll={rejectAll}
          onCustomize={() => setShowCustomize(true)}
        />
      )}
      {showCustomize && (
        <ConsentModal
          consent={consent}
          onAcceptAll={acceptAll}
          onSave={savePreferences}
          onClose={closeCustomize}
        />)
      }
    </ConsentContext.Provider>
  )
}

export default ConsentProvider
