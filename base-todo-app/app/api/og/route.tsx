import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get('type') || 'default';
  const value = searchParams.get('value') || '0';
  const name = searchParams.get('name') || 'User';

  let emoji = '✨';
  let title = 'Daily Tasks';
  let subtitle = 'Build better habits';
  let gradient = 'linear-gradient(135deg, #0066CC 0%, #6B5BFF 50%, #00D4FF 100%)';

  if (type === 'streak') {
    emoji = '🔥';
    title = `${value} Day Streak!`;
    subtitle = `${name} is unstoppable`;
    gradient = 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 50%, #FF8E53 100%)';
  } else if (type === 'score') {
    emoji = '🏆';
    title = `${Number(value).toLocaleString()} Points`;
    subtitle = `${name}'s achievement`;
    gradient = 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)';
  } else if (type === 'achievement') {
    emoji = '🏅';
    title = 'Achievement Unlocked!';
    subtitle = name;
    gradient = 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 50%, #6B5BFF 100%)';
  } else if (type === 'tasks') {
    emoji = '✅';
    title = `${value} Tasks Done`;
    subtitle = `${name} is productive`;
    gradient = 'linear-gradient(135deg, #00B894 0%, #00CEC9 50%, #0984E3 100%)';
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: gradient,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '32px',
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          <span style={{ fontSize: '120px', marginBottom: '20px' }}>{emoji}</span>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 900,
              color: 'white',
              margin: 0,
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: 'rgba(255,255,255,0.9)',
              margin: '16px 0 0 0',
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '28px', color: 'rgba(255,255,255,0.8)' }}>
            Daily Tasks • Build Better Habits
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
