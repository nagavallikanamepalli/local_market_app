export interface MarketPrice {
  id: string;
  crop: string;
  price: number;
  unit: string;
  market: string;
  location: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  image: string;
  quality: 'Premium' | 'Standard' | 'Basic';
  verified: boolean;
  adminId?: string;
  lastUpdated: string;
}

export interface Market {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  openingHours: string;
  rating: number;
  distance?: string;
  isActive: boolean;
}

export interface PriceAlert {
  id: string;
  userId: string;
  crop: string;
  targetPrice: number;
  condition: 'above' | 'below';
  location: string;
  isActive: boolean;
  createdAt: string;
}

export interface CropCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  crops: string[];
}