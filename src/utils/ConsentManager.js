// src/utils/ConsentManager.js
// Centralized consent and storage gating utility

const CONSENT_STORAGE_KEY = 'cookieConsent.v1'
const CONSENT_VERSION = 1
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000

const CATEGORIES = {
  essential: 'essential',
  functional: 'functional',
  analytics: 'analytics',
  marketing: 'marketing',
}

function getDNTEnabled() {
  try {
    const dnt =
      (navigator && (navigator.doNotTrack || navigator.msDoNotTrack)) ||
      (window && window.doNotTrack)
    return dnt === '1' || dnt === 1
  } catch (_) {
    return false
  }
}

function now() {
  return Date.now()
}

function defaultConsent() {
  const dnt = getDNTEnabled()
  return {
    version: CONSENT_VERSION,
    givenAt: null,
    expiresAt: null,
    dntApplied: dnt,
    categories: {
      [CATEGORIES.essential]: true,
      [CATEGORIES.functional]: dnt ? false : false,
      [CATEGORIES.analytics]: dnt ? false : false,
      [CATEGORIES.marketing]: dnt ? false : false,
    },
  }
}

class ConsentManager {
  static categories = CATEGORIES

  static getConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
      if (!raw) return defaultConsent()
      const parsed = JSON.parse(raw)
      // ensure version and shape
      if (!parsed.version || parsed.version !== CONSENT_VERSION) {
        return defaultConsent()
      }
      if (!parsed.categories) parsed.categories = defaultConsent().categories
      return parsed
    } catch (e) {
      return defaultConsent()
    }
  }

  static isExpired(consent = null) {
    const c = consent || this.getConsent()
    if (!c.givenAt || !c.expiresAt) return true
    return now() > c.expiresAt
  }

  static shouldShowBanner() {
    const c = this.getConsent()
    return this.isExpired(c)
  }

  static saveConsent(partial) {
    const current = this.getConsent()
    const next = {
      ...current,
      ...partial,
    }
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next))
      return next
    } catch (e) {
      console.warn('Failed to save consent', e)
      return current
    }
  }

  static setPreferences(categories) {
    // categories: { functional?: bool, analytics?: bool, marketing?: bool }
    const c = this.getConsent()
    const givenAt = now()
    const updated = {
      version: CONSENT_VERSION,
      dntApplied: c.dntApplied || getDNTEnabled(),
      givenAt,
      expiresAt: givenAt + ONE_YEAR_MS,
      categories: {
        ...c.categories,
        ...categories,
        [CATEGORIES.essential]: true, // always on
      },
    }
    return this.saveConsent(updated)
  }

  static acceptAll() {
    return this.setPreferences({
      [CATEGORIES.functional]: true,
      [CATEGORIES.analytics]: true,
      [CATEGORIES.marketing]: true,
    })
  }

  static rejectAll() {
    return this.setPreferences({
      [CATEGORIES.functional]: false,
      [CATEGORIES.analytics]: false,
      [CATEGORIES.marketing]: false,
    })
  }

  static revokeConsent() {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY)
    } catch (_) {}
  }

  static hasConsent(category) {
    const c = this.getConsent()
    if (category === CATEGORIES.essential) return true
    return Boolean(c.categories?.[category]) && !this.isExpired(c)
  }

  // Storage helpers respecting consent for writes
  static setItem(key, value, category = CATEGORIES.functional) {
    if (this.hasConsent(category)) {
      try {
        localStorage.setItem(key, value)
        return true
      } catch (e) {
        console.warn('Failed to set item', key, e)
        return false
      }
    }
    return false
  }

  static getItem(key) {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      return null
    }
  }

  static removeItem(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (e) {
      return false
    }
  }

  static exportAllData() {
    try {
      const data = {}
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        data[k] = localStorage.getItem(k)
      }
      return data
    } catch (e) {
      return {}
    }
  }

  static clearAllData() {
    try {
      localStorage.clear()
      return true
    } catch (e) {
      return false
    }
  }
}

export default ConsentManager
