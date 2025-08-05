import React, { createContext, useContext, useState, useEffect } from 'react';
import { MarketPrice, Market, PriceAlert, CropCategory } from '@/types/market';

interface MarketContextType {
  prices: MarketPrice[];
  markets: Market[];
  alerts: PriceAlert[];
  categories: CropCategory[];
  loading: boolean;
  refreshPrices: () => Promise<void>;
  addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  removePriceAlert: (id: string) => void;
  searchPrices: (query: string, filters?: any) => MarketPrice[];
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

// Enhanced mock data
const mockCategories: CropCategory[] = [
  { id: '1', name: 'Grains', icon: '🌾', color: '#F59E0B', crops: ['Rice', 'Wheat', 'Barley', 'Corn'] },
  { id: '2', name: 'Vegetables', icon: '🥕', color: '#10B981', crops: ['Tomato', 'Onion', 'Potato', 'Cabbage'] },
  { id: '3', name: 'Fruits', icon: '🍎', color: '#EF4444', crops: ['Apple', 'Mango', 'Orange', 'Banana'] },
  { id: '4', name: 'Pulses', icon: '🫘', color: '#8B5CF6', crops: ['Lentils', 'Chickpeas', 'Black Gram'] },
  { id: '5', name: 'Spices', icon: '🌶️', color: '#F97316', crops: ['Turmeric', 'Chili', 'Coriander'] },
  { id: '6', name: 'Cash Crops', icon: '🎋', color: '#06B6D4', crops: ['Sugarcane', 'Cotton', 'Jute'] },
];

const mockMarkets: Market[] = [
  {
    id: '1',
    name: 'Central Agricultural Market',
    location: 'Delhi',
    address: 'Azadpur Mandi, Delhi',
    phone: '+91 11 2765 4321',
    openingHours: '6:00 AM - 6:00 PM',
    rating: 4.5,
    isActive: true,
  },
  {
    id: '2',
    name: 'Punjab Grain Exchange',
    location: 'Punjab',
    address: 'Ludhiana Grain Market',
    phone: '+91 161 234 5678',
    openingHours: '5:00 AM - 8:00 PM',
    rating: 4.8,
    isActive: true,
  },
];

const generateMockPrices = (): MarketPrice[] => {
  const crops = [
    { name: 'Rice', image: 'https://images.pexels.com/photos/33199/rice-grain-seed-food.jpg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Wheat', image: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Tomato', image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Onion', image: 'https://images.pexels.com/photos/128536/pexels-photo-128536.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Potato', image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Sugarcane', image: 'https://images.pexels.com/photos/6567304/pexels-photo-6567304.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Cotton', image: 'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Corn', image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];

  const locations = ['Delhi', 'Punjab', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh'];
  const markets = ['Central Market', 'Grain Exchange', 'Wholesale Market', 'Local Mandi', 'Agricultural Market'];
  const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
  const qualities: ('Premium' | 'Standard' | 'Basic')[] = ['Premium', 'Standard', 'Basic'];

  return crops.flatMap((crop, cropIndex) =>
    locations.slice(0, 3 + Math.floor(Math.random() * 3)).map((location, locIndex) => ({
      id: `${cropIndex}-${locIndex}-${Date.now()}`,
      crop: crop.name,
      price: Math.floor(Math.random() * 3000) + 500,
      unit: ['Rice', 'Wheat', 'Cotton', 'Sugarcane'].includes(crop.name) ? 'per quintal' : 'per kg',
      market: markets[Math.floor(Math.random() * markets.length)],
      location,
      date: new Date().toISOString().split('T')[0],
      trend: trends[Math.floor(Math.random() * trends.length)],
      change: (Math.random() * 20) - 10,
      image: crop.image,
      quality: qualities[Math.floor(Math.random() * qualities.length)],
      verified: Math.random() > 0.2,
      lastUpdated: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    }))
  );
};

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [markets] = useState<Market[]>(mockMarkets);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [categories] = useState<CropCategory[]>(mockCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPrices(generateMockPrices());
      setLoading(false);
    }, 1000);
  };

  const refreshPrices = async () => {
    setLoading(true);
    setTimeout(() => {
      setPrices(generateMockPrices());
      setLoading(false);
    }, 500);
  };

  const addPriceAlert = (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const removePriceAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const searchPrices = (query: string, filters?: any): MarketPrice[] => {
    let filtered = prices;

    if (query) {
      filtered = filtered.filter(price =>
        price.crop.toLowerCase().includes(query.toLowerCase()) ||
        price.location.toLowerCase().includes(query.toLowerCase()) ||
        price.market.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filters?.category && filters.category !== 'All') {
      const category = categories.find(cat => cat.name === filters.category);
      if (category) {
        filtered = filtered.filter(price => category.crops.includes(price.crop));
      }
    }

    if (filters?.location && filters.location !== 'All Locations') {
      filtered = filtered.filter(price => price.location === filters.location);
    }

    if (filters?.quality && filters.quality !== 'All') {
      filtered = filtered.filter(price => price.quality === filters.quality);
    }

    return filtered;
  };

  return (
    <MarketContext.Provider
      value={{
        prices,
        markets,
        alerts,
        categories,
        loading,
        refreshPrices,
        addPriceAlert,
        removePriceAlert,
        searchPrices,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};