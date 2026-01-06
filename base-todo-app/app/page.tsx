'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';
import TodoApp from '@/components/TodoApp';
import { SettingsProvider } from '@/contexts/SettingsContext';

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;
        
        if (context?.user) {
          setUser(context.user);
        }
        
        sdk.actions.ready();
        setIsSDKLoaded(true);
      } catch (error) {
        console.log('Running outside Farcaster, loading anyway...');
        setIsSDKLoaded(true);
      }
    };
    
    load();
  }, []);

  if (!isSDKLoaded) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #0066CC 0%, #0099FF 25%, #00BFFF 50%, #6B5BFF 75%, #00D4FF 100%)'
        }}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center animate-pulse">
            <span className="text-3xl">✨</span>
          </div>
          <p className="text-white/80 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SettingsProvider>
      <TodoApp user={user} />
    </SettingsProvider>
  );
}
