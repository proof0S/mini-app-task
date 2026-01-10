'use client';

import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: {
    type: 'achievement' | 'streak' | 'task' | 'score';
    title: string;
    description: string;
    emoji: string;
    value?: number;
    userName?: string;
  };
}

export default function ShareModal({ isOpen, onClose, shareData }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  if (!isOpen) return null;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://daily-tasks-mini.vercel.app';
  
  // Frame URL for rich preview
  const frameUrl = `${baseUrl}/frames?type=${shareData.type}&value=${shareData.value || 0}&name=${encodeURIComponent(shareData.userName || 'User')}`;
  
  const shareText = `${shareData.emoji} ${shareData.title}\n\n${shareData.description}\n\n🎯 Join me on Daily Tasks!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${frameUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFarcasterShare = () => {
    setSharing(true);
    // Farcaster composer with frame embed
    const encodedText = encodeURIComponent(shareText);
    const embedUrl = encodeURIComponent(frameUrl);
    window.open(`https://warpcast.com/~/compose?text=${encodedText}&embeds[]=${embedUrl}`, '_blank');
    setTimeout(() => {
      setSharing(false);
      onClose();
    }, 1000);
  };

  const handleTwitterShare = () => {
    const encodedText = encodeURIComponent(`${shareText}\n\n${baseUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
  };

  // Preview image URL
  const previewImageUrl = `${baseUrl}/api/og?type=${shareData.type}&value=${shareData.value || 0}&name=${encodeURIComponent(shareData.userName || 'User')}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-white/10 animate-scaleIn">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📤</span> Share
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview Card - looks like actual frame */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl overflow-hidden mb-6 border border-white/20">
          {/* Image Preview */}
          <div className="aspect-[1.91/1] bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="text-center z-10">
              <span className="text-6xl block mb-2">{shareData.emoji}</span>
              <h3 className="text-white font-bold text-xl">{shareData.title}</h3>
              <p className="text-white/80 text-sm mt-1">{shareData.description}</p>
            </div>
          </div>
          
          {/* Frame buttons preview */}
          <div className="flex gap-2 p-3 bg-white/5">
            <div className="flex-1 py-2 bg-white/10 rounded-lg text-white/80 text-xs text-center">
              🎯 Start My Journey
            </div>
            <div className="flex-1 py-2 bg-white/10 rounded-lg text-white/80 text-xs text-center">
              🏆 View Leaderboard
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-3">
          {/* Farcaster - Primary */}
          <button
            onClick={handleFarcasterShare}
            disabled={sharing}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-2xl text-white font-bold flex items-center justify-center gap-3 transition-all btn-press disabled:opacity-50"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.24 2.4H5.76A3.36 3.36 0 002.4 5.76v12.48a3.36 3.36 0 003.36 3.36h12.48a3.36 3.36 0 003.36-3.36V5.76a3.36 3.36 0 00-3.36-3.36zm-1.44 15.36h-2.4l-2.4-4.8-2.4 4.8H7.2l3.6-7.2-3.6-7.2h2.4l2.4 4.8 2.4-4.8h2.4l-3.6 7.2 3.6 7.2z"/>
            </svg>
            {sharing ? 'Opening Warpcast...' : 'Cast with Frame'}
          </button>

          {/* Twitter/X */}
          <button
            onClick={handleTwitterShare}
            className="w-full py-4 bg-black hover:bg-gray-900 rounded-2xl text-white font-bold flex items-center justify-center gap-3 transition-all btn-press border border-white/20"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Share on X
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white font-bold flex items-center justify-center gap-3 transition-all btn-press"
          >
            {copied ? (
              <>
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to Clipboard
              </>
            )}
          </button>
        </div>

        <p className="text-white/40 text-xs text-center mt-4">
          🖼️ Your share will include a beautiful preview card!
        </p>
      </div>
    </div>
  );
}
