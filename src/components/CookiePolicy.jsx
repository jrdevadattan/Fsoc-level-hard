// src/components/CookiePolicy.jsx
import React from 'react'

const CookiePolicy = () => {
  const lastUpdated = new Date().toISOString().split('T')[0]
  return (
<div className="min-h-screen theme-screen p-4">
      <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-white/20 p-6">
        <h1 className="text-3xl font-bold text-gray-800">Cookie Policy</h1>
        <div className="text-sm text-gray-500">Last updated: {lastUpdated}</div>
        <div className="prose max-w-none text-gray-700 mt-4">
          <h2>What are cookies?</h2>
          <p>
            Cookies are small text files stored on your device by your browser when you visit a website or use a web app. They help us remember your preferences and improve your experience.
          </p>
          <h2>Cookies we use</h2>
          <ul className="list-disc pl-6">
            <li><strong>Essential</strong>: Required for core functionality (e.g., quiz progress).</li>
            <li><strong>Functional</strong>: Preferences and personalization (e.g., quiz settings, bookmarks, badges).</li>
            <li><strong>Analytics (simulated)</strong>: Usage statistics to understand performance (no third-party tracking is loaded).</li>
            <li><strong>Marketing (simulated)</strong>: Optional integrations such as social sharing (not enabled by default).</li>
          </ul>
          <h2>Local storage keys</h2>
          <ul className="list-disc pl-6">
            <li><code>quizPausedState</code> (Essential): quiz restore data; retention up to 24 hours or until cleared.</li>
            <li><code>quiz_bookmarks</code> (Functional): saved questions; retained until you delete them.</li>
            <li><code>userBadges</code> and <code>badgeStats</code> (Functional): achievement data; retained until you delete them.</li>
            <li><code>quizPreferences</code> (Functional): quiz settings; retained until you change or delete them.</li>
            <li><code>cookieConsent.v1</code> (Essential): your consent choices; retained for up to 1 year.</li>
          </ul>
          <h2>How long do we keep this data?</h2>
          <p>
            Essential data is kept only as long as needed for functionality (e.g., quiz state up to 24 hours). Other data persists until you clear it using the Privacy Settings or your browser settings.
          </p>
          <h2>How to control cookies</h2>
          <p>
            You can manage your preferences at any time via the Privacy Settings in the app. You can also control cookies in your browser settings.
          </p>
          <h2>Contact</h2>
          <p>
            If you have questions about this policy, please reach out via the repository issue tracker.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CookiePolicy
