'use client';

import { useSettings } from '../contexts/SettingsContext';

export default function CheckInMethodModal() {
  const { checkInMethod, setCheckInMethod, showMethodModal, setShowMethodModal } = useSettings();

  if (!showMethodModal) return null;

  const handleConfirm = () => {
    setShowMethodModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-pink-50 to-pink-100 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Check-in Method
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please choose your preferred check-in method.
        </p>

        <div className="flex gap-3 mb-6">
          {/* Swipe Option */}
          <button
            onClick={() => setCheckInMethod('swipe')}
            className={`flex-1 p-3 rounded-2xl border-2 transition-all ${
              checkInMethod === 'swipe'
                ? 'border-pink-400 bg-pink-50 shadow-lg'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="bg-gray-100 rounded-xl p-3 mb-3 relative overflow-hidden">
              <div className="flex items-center gap-2 bg-orange-100 rounded-lg p-2 transform transition-transform">
                <span>🍳</span>
                <span className="text-xs text-gray-700">Eat Breakfast</span>
                <span className="ml-auto">👆➡️</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 text-center">Swipe right to check in</p>
            <div className={`w-5 h-5 rounded-full mx-auto mt-2 flex items-center justify-center ${
              checkInMethod === 'swipe' 
                ? 'bg-pink-400' 
                : 'border-2 border-gray-300'
            }`}>
              {checkInMethod === 'swipe' && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>

          {/* Tap Option */}
          <button
            onClick={() => setCheckInMethod('tap')}
            className={`flex-1 p-3 rounded-2xl border-2 transition-all ${
              checkInMethod === 'tap'
                ? 'border-pink-400 bg-pink-50 shadow-lg'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="bg-gray-100 rounded-xl p-3 mb-3">
              <div className="flex items-center gap-2 bg-purple-100 rounded-lg p-2">
                <span>🧘</span>
                <span className="text-xs text-gray-700">Yoga</span>
                <span className="ml-auto text-green-500">✓</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 text-center">Tap to check in</p>
            <div className={`w-5 h-5 rounded-full mx-auto mt-2 flex items-center justify-center ${
              checkInMethod === 'tap' 
                ? 'bg-pink-400' 
                : 'border-2 border-gray-300'
            }`}>
              {checkInMethod === 'tap' && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-2xl transition-all"
        >
          Confirm
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          You can change this later in Settings
        </p>
      </div>
    </div>
  );
}
