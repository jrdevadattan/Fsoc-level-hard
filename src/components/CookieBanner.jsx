// src/components/CookieBanner.jsx
import React from 'react'

const CookieBanner = ({ onAcceptAll, onRejectAll, onCustomize }) => {
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      {/* Banner */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl" aria-hidden>🍪</div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">We Value Your Privacy</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                We use essential cookies to make this app work. With your permission, we also use functional cookies to remember preferences and simulated analytics/marketing cookies to improve your experience. You can change your choices at any time.
              </p>
              <div className="mt-2 text-sm">
                <a href="/privacy/cookies" className="text-purple-600 hover:underline mr-4">Cookie Policy</a>
                <a href="/settings/privacy" className="text-purple-600 hover:underline">Privacy Settings</a>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <button onClick={onRejectAll} className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 font-semibold">Reject All</button>
            <button onClick={onCustomize} className="w-full sm:w-auto px-4 py-2 rounded-lg border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 font-semibold">Customize</button>
            <button onClick={onAcceptAll} className="w-full sm:w-auto px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold">Accept All</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieBanner
