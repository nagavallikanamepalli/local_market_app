import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Filter, TrendingUp, TrendingDown, Bell, Shield } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useMarket } from '@/contexts/MarketContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const { prices, loading, refreshPrices, categories } = useMarket();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPrices();
    setRefreshing(false);
  };

  const filteredPrices = prices.slice(0, 8).filter(price => 
    price.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
    price.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') {
      return <TrendingUp size={16} color="#22C55E" />;
    } else if (trend === 'down') {
      return <TrendingDown size={16} color="#EF4444" />;
    }
    return null;
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return '#22C55E';
      case 'down':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const calculateStats = () => {
    if (prices.length === 0) return { avgPrice: 0, growth: 0, activeMarkets: 0 };
    
    const avgPrice = Math.round(prices.reduce((sum, p) => sum + p.price, 0) / prices.length);
    const growth = prices.reduce((sum, p) => sum + p.change, 0) / prices.length;
    const activeMarkets = new Set(prices.map(p => p.market)).size;
    
    return { avgPrice, growth, activeMarkets };
  };

  const stats = calculateStats();

  if (loading && prices.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={styles.loadingText}>Loading market prices...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning, {user?.name?.split(' ')[0] || 'Farmer'}!</Text>
            <Text style={styles.subtitle}>Today's market prices • Live updates</Text>
          </View>
          <TouchableOpacity style={styles.locationButton}>
            <MapPin size={20} color="#22C55E" />
            <Text style={styles.locationText}>{user?.location || 'All Locations'}</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search crops or markets..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#22C55E" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={[styles.categoryCard, { backgroundColor: `${category.color}20` }]}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>₹{stats.avgPrice.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Avg. Price Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: stats.growth >= 0 ? '#22C55E' : '#EF4444' }]}>
              {stats.growth >= 0 ? '+' : ''}{stats.growth.toFixed(1)}%
            </Text>
            <Text style={styles.statLabel}>Market Growth</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.activeMarkets}</Text>
            <Text style={styles.statLabel}>Active Markets</Text>
          </View>
        </View>

        {/* Market Prices */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Prices</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pricesContainer}>
          {filteredPrices.map((price) => (
            <TouchableOpacity key={price.id} style={styles.priceCard}>
              <Image source={{ uri: price.image }} style={styles.cropImage} />
              <View style={styles.priceInfo}>
                <View style={styles.priceHeader}>
                  <View style={styles.cropNameContainer}>
                    <Text style={styles.cropName}>{price.crop}</Text>
                    {price.verified && <Shield size={14} color="#22C55E" />}
                  </View>
                  <View style={styles.trendContainer}>
                    {renderTrendIcon(price.trend, price.change)}
                    <Text style={[styles.trendText, { color: getTrendColor(price.trend) }]}>
                      {price.change > 0 ? '+' : ''}{price.change.toFixed(1)}%
                    </Text>
                  </View>
                </View>
                <Text style={styles.priceValue}>₹{price.price} <Text style={styles.priceUnit}>{price.unit}</Text></Text>
                <View style={styles.marketInfo}>
                  <Text style={styles.marketName}>{price.market}</Text>
                  <Text style={styles.locationName}>{price.location}</Text>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.qualityBadge}>{price.quality}</Text>
                  <Text style={styles.dateText}>
                    {new Date(price.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard}>
              <Bell size={24} color="#F59E0B" />
              <Text style={styles.actionText}>Set Price Alert</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <TrendingUp size={24} color="#3B82F6" />
              <Text style={styles.actionText}>Compare Markets</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 12,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoryCard: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
  },
  pricesContainer: {
    paddingHorizontal: 20,
  },
  priceCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cropImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  priceInfo: {
    flex: 1,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginRight: 6,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#22C55E',
    marginBottom: 8,
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
  marketInfo: {
    marginBottom: 6,
  },
  marketName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  locationName: {
    fontSize: 13,
    color: '#6B7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qualityBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: '#22C55E',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 0.48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});