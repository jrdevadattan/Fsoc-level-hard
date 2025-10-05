// src/components/ConsentModal.jsx
import React, { useMemo, useState } from 'react'
import ConsentManager from '../utils/ConsentManager'

const Toggle = ({ label, description, checked, disabled, onChange, examples }) => (
  <div className="flex items-start justify-between gap-3 p-4 border rounded-xl bg-white">
    <div className="flex-1">
      <div className="font-semibold text-gray-800">{label} {disabled && <span className="ml-2 text-xs text-gray-500">(Always on)</span>}</div>
      <div className="text-sm text-gray-600 mt-1">{description}</div>
      {examples?.length ? (
        <div className="text-xs text-gray-500 mt-1">Examples: {examples.join(', ')}</div>
      ) : null}
    </div>
    <label className={`inline-flex items-center cursor-${disabled ? 'not-allowed' : 'pointer'}`}>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className={`w-12 h-7 flex items-center ${checked ? 'bg-purple-600' : 'bg-gray-300'} rounded-full p-1 transition-colors`}>
        <span className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform ${checked ? 'translate-x-5' : ''}`}></span>
      </span>
    </label>
  </div>
)

const ConsentModal = ({ consent, onSave, onAcceptAll, onClose }) => {
  const categories = useMemo(() => consent?.categories || {}, [consent])
  const [functional, setFunctional] = useState(Boolean(categories.functional))
  const [analytics, setAnalytics] = useState(Boolean(categories.analytics))
  const [marketing, setMarketing] = useState(Boolean(categories.marketing))

  const handleSave = () => {
    onSave?.({
      [ConsentManager.categories.functional]: functional,
      [ConsentManager.categories.analytics]: analytics,
      [ConsentManager.categories.marketing]: marketing,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-gray-50 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6 border">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🔧</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Privacy Preferences</h2>
            <p className="text-gray-600 mt-1 text-sm">Choose which categories of cookies we can use. You can change your choices anytime in Settings.</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <Toggle
            label="Essential"
            description="Required for core functionality such as app security and quiz progress."
            checked={true}
            disabled={true}
            examples={["Authentication state", "Quiz progress", "App functionality"]}
          />
          <Toggle
            label="Functional"
            description="Enhance functionality and personalization, like remembering preferences."
            checked={functional}
            onChange={setFunctional}
            examples={["Theme", "Language", "Quiz settings", "Bookmarks", "Badges"]}
          />
          <Toggle
            label="Analytics (simulated)"
            description="Help us understand app usage and performance."
            checked={analytics}
            onChange={setAnalytics}
            examples={["Page views", "Completion rates"]}
          />
          <Toggle
            label="Marketing (simulated)"
            description="Optional features like social sharing and personalization."
            checked={marketing}
            onChange={setMarketing}
            examples={["Social integrations", "Personalization"]}
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-semibold">Cancel</button>
          <button onClick={onAcceptAll} className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200 font-semibold">Accept All</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold">Save Preferences</button>
        </div>
      </div>
    </div>
  )
}

export default ConsentModal
