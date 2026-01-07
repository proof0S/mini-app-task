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
      <div className="bg-gradient-to-b from-pink-50 to-pink-100 rounded-3xl p-5 w-full max-w-[340px] shadow-2xl">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-1">
          Check-in Method
        </h2>
        <p className="text-center text-gray-500 text-sm mb-4">
          Please choose your preferred check-in method.
        </p>

        <div className="flex gap-2 mb-4">
          {/* Swipe Option */}
          <button
            onClick={() => setCheckInMethod('swipe')}
            className={`flex-1 p-2 rounded-xl border-2 transition-all ${
              checkInMethod === 'swipe'
                ? 'border-pink-400 bg-pink-50 shadow-md'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="bg-amber-50 rounded-lg p-2 mb-2 flex items-center justify-center gap-1">
              <span className="text-base">🍳</span>
              <span className="text-xs text-gray-700">Eat Breakfast</span>
              <span className="text-sm">👆➡️</span>
            </div>
            <p className="text-[10px] text-gray-600 text-center">Swipe right to check in</p>
            <div className={`w-4 h-4 rounded-full mx-auto mt-1.5 flex items-center justify-center ${
              checkInMethod === 'swipe' 
                ? 'bg-pink-400' 
                : 'border-2 border-gray-300'
            }`}>
              {checkInMethod === 'swipe' && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>

          {/* Tap Option */}
          <button
            onClick={() => setCheckInMethod('tap')}
            className={`flex-1 p-2 rounded-xl border-2 transition-all ${
              checkInMethod === 'tap'
                ? 'border-pink-400 bg-pink-50 shadow-md'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="bg-purple-50 rounded-lg p-2 mb-2 flex items-center justify-center gap-1">
              <span className="text-base">🧘</span>
              <span className="text-xs text-gray-700">Yoga</span>
              <span className="text-green-500 text-sm">✓</span>
            </div>
            <p className="text-[10px] text-gray-600 text-center">Tap to check in</p>
            <div className={`w-4 h-4 rounded-full mx-auto mt-1.5 flex items-center justify-center ${
              checkInMethod === 'tap' 
                ? 'bg-pink-400' 
                : 'border-2 border-gray-300'
            }`}>
              {checkInMethod === 'tap' && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-2xl transition-all text-sm"
        >
          Confirm
        </button>

        <p className="text-[10px] text-gray-400 text-center mt-3">
          You can change this later in Settings
        </p>
      </div>
    </div>
  );
}
