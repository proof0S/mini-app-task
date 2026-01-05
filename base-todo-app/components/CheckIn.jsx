'use client';

import { useState } from 'react';

export default function CheckIn() {
  const [checkInMode, setCheckInMode] = useState('tap');
  const [isChecked, setIsChecked] = useState(false);

  const handleTap = () => {
    if (checkInMode === 'tap') {
      setIsChecked(!isChecked);
    }
  };

  return (
    <div className="check-in-container">
      <h2>Today's Check-in</h2>
      
      <div className="mode-selector">
        <button 
          onClick={() => setCheckInMode('tap')}
          className={checkInMode === 'tap' ? 'active' : ''}
        >
          Tap Mode
        </button>
        <button 
          onClick={() => setCheckInMode('swipe')}
          className={checkInMode === 'swipe' ? 'active' : ''}
        >
          Swipe Mode
        </button>
      </div>

      <div 
        className={`check-box ${isChecked ? 'checked' : ''}`}
        onClick={handleTap}
      >
        {isChecked ? '✓ Completed' : 'Click to Check'}
      </div>

      <style jsx>{`
        .check-in-container {
          padding: 20px;
          text-align: center;
          max-width: 400px;
          margin: 0 auto;
        }

        .mode-selector {
          margin: 20px 0;
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .mode-selector button {
          padding: 10px 20px;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
          border-radius: 5px;
          transition: all 0.3s;
        }

        .mode-selector button.active {
          background: #007bff;
          color: white;
        }

        .check-box {
          width: 200px;
          height: 200px;
          margin: 20px auto;
          border: 2px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.3s;
          user-select: none;
        }

        .check-box.checked {
          background: #4CAF50;
          color: white;
          border-color: #4CAF50;
        }

        .check-box:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
