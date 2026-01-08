'use client';

import { useState, useEffect } from 'react';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: { price: number[] };
}

interface CryptoTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MiniChart = ({ data, isPositive }: { data: number[]; isPositive: boolean }) => {
  if (!data || data.length === 0) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((price, i) => {
    const x = (i / (data.length - 1)) * 60;
    const y = 20 - ((price - min) / range) * 18;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="60" height="24" className="opacity-80">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? '#10B981' : '#EF4444'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function CryptoTracker({ isOpen, onClose }: CryptoTrackerProps) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [allCoins, setAllCoins] = useState<{id: string; symbol: string; name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['bitcoin', 'ethereum', 'solana']);
  const [showAddCoin, setShowAddCoin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('crypto_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAllCoins = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1'
        );
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        setAllCoins(data.map((c: any) => ({ id: c.id, symbol: c.symbol, name: c.name })));
      } catch (err) {
        console.error('Failed to fetch coin list:', err);
      }
    };

    fetchAllCoins();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || favorites.length === 0) return;

    const fetchPrices = async () => {
      try {
        setLoading(true);
        const ids = favorites.join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`
        );
        
        if (!response.ok) throw new Error('API error');
        
        const data = await response.json();
        setCoins(data);
        setError(null);
      } catch (err) {
        setError('Fiyatlar yüklenemedi');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [isOpen, favorites]);

  const addFavorite = (coinId: string) => {
    if (!favorites.includes(coinId)) {
      const newFavorites = [...favorites, coinId];
      setFavorites(newFavorites);
      localStorage.setItem('crypto_favorites', JSON.stringify(newFavorites));
    }
    setShowAddCoin(false);
    setSearchQuery('');
  };

  const removeFavorite = (coinId: string) => {
    const newFavorites = favorites.filter(id => id !== coinId);
    setFavorites(newFavorites);
    localStorage.setItem('crypto_favorites', JSON.stringify(newFavorites));
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    if (price >= 1) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    return `$${price.toLocaleString('en-US', { maximumFractionDigits: 6 })}`;
  };

  const filteredCoins = allCoins.filter(
    coin => !favorites.includes(coin.id) && 
    (coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 20);

  if (!isOpen) return null;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white drop-shadow-lg flex items-center gap-2">
            <span>📈</span> Crypto
          </h1>
          <p className="text-white/80 text-sm font-medium">Track your favorite coins</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
          <span className="text-green-400 text-xs font-medium">● Live</span>
        </div>
      </div>

      {/* Coin List */}
      <div className="space-y-3">
        {loading && coins.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-8 bg-white/10 rounded-2xl backdrop-blur-xl">
            <span className="text-4xl mb-3 block">😕</span>
            <p className="text-white/60 text-sm">{error}</p>
          </div>
        ) : (
          coins.map((coin, index) => (
            <div
              key={coin.id}
              className={`flex items-center gap-3 p-4 bg-white/10 hover:bg-white/15 rounded-2xl backdrop-blur-xl border border-white/10 transition-all group card-hover animate-slideUp stagger-${Math.min(index + 1, 5)}`}
              style={{ opacity: 0, animationFillMode: 'forwards' }}
            >
              <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full" />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{coin.symbol.toUpperCase()}</span>
                  <span className="text-white/50 text-xs truncate">{coin.name}</span>
                </div>
                <p className="text-white text-xl font-black">{formatPrice(coin.current_price)}</p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <MiniChart 
                  data={coin.sparkline_in_7d?.price.slice(-24) || []} 
                  isPositive={coin.price_change_percentage_24h >= 0}
                />
                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                  coin.price_change_percentage_24h >= 0 
                    ? 'text-green-400 bg-green-500/20' 
                    : 'text-red-400 bg-red-500/20'
                }`}>
                  {coin.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                  {Math.abs(coin.price_change_percentage_24h)?.toFixed(2)}%
                </span>
              </div>

              <button
                onClick={() => removeFavorite(coin.id)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-xl transition-all btn-press"
              >
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Coin */}
      {!showAddCoin ? (
        <button
          onClick={() => setShowAddCoin(true)}
          className="w-full mt-4 p-4 border-2 border-dashed border-white/30 hover:border-white/50 rounded-2xl text-white/70 hover:text-white transition-all flex items-center justify-center gap-2 btn-press"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-semibold">Add Coin</span>
        </button>
      ) : (
        <div className="mt-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 animate-scaleIn">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coins..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 mb-3"
            autoFocus
          />
          
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {filteredCoins.length > 0 ? (
              filteredCoins.map(coin => (
                <button
                  key={coin.id}
                  onClick={() => addFavorite(coin.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl transition-all text-left btn-press"
                >
                  <span className="text-white font-bold">{coin.symbol.toUpperCase()}</span>
                  <span className="text-white/50 text-sm">{coin.name}</span>
                </button>
              ))
            ) : (
              <p className="text-white/40 text-sm text-center py-4">
                {searchQuery ? 'No coins found' : 'Loading...'}
              </p>
            )}
          </div>

          <button
            onClick={() => {
              setShowAddCoin(false);
              setSearchQuery('');
            }}
            className="w-full mt-3 py-2 text-white/60 hover:text-white text-sm transition-all"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Footer */}
      <p className="text-white/40 text-xs text-center mt-6">
        Data from CoinGecko • Updates every 30s
      </p>
    </div>
  );
}
