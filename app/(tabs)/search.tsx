import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, MapPin, Calendar, TrendingUp, TrendingDown, Shield } from 'lucide-react-native';
import { useMarket } from '@/contexts/MarketContext';

export default function SearchScreen() {
  const { searchPrices, categories } = useMarket();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedQuality, setSelectedQuality] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const locations = ['All Locations', 'Delhi', 'Punjab', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh'];
  const qualities = ['All', 'Premium', 'Standard', 'Basic'];
  const cropCategories = ['All', ...categories.map(cat => cat.name)];

  const searchResults = searchPrices(searchQuery, {
    category: selectedCategory,
    location: selectedLocation,
    quality: selectedQuality,
  });

  const renderTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp size={14} color="#22C55E" />;
    if (trend === 'down') return <TrendingDown size={14} color="#EF4444" />;
    return null;
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#22C55E';
      case 'down': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Search Crops</Text>
          <Text style={styles.subtitle}>Find the best prices near you</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search crops, markets, or locations..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity 
            style={[styles.filterButton, showFilters && styles.filterButtonActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? '#FFFFFF' : '#22C55E'} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {cropCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category && styles.categoryChipActive
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      selectedCategory === category && styles.categoryChipTextActive
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Location Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Location</Text>
              <ScrollView style={styles.locationList}>
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location}
                    style={styles.locationItem}
                    onPress={() => setSelectedLocation(location)}
                  >
                    <MapPin size={16} color="#6B7280" />
                    <Text style={[
                      styles.locationText,
                      selectedLocation === location && styles.locationTextActive
                    ]}>
                      {location}
                    </Text>
                    {selectedLocation === location && (
                      <View style={styles.locationSelected} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Quality Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Quality</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {qualities.map((quality) => (
                  <TouchableOpacity
                    key={quality}
                    style={[
                      styles.categoryChip,
                      selectedQuality === quality && styles.categoryChipActive
                    ]}
                    onPress={() => setSelectedQuality(quality)}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      selectedQuality === quality && styles.categoryChipTextActive
                    ]}>
                      {quality}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Date Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Date Range</Text>
              <View style={styles.dateContainer}>
                <TouchableOpacity style={styles.dateButton}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.dateText}>Last 7 days</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateButton}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.dateText}>Last 30 days</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Search Results */}
        {searchQuery && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>
              Search Results ({searchResults.length})
            </Text>
            {searchResults.length > 0 ? (
              <View style={styles.resultsList}>
                {searchResults.map((price) => (
                  <TouchableOpacity key={price.id} style={styles.resultCard}>
                    <Image source={{ uri: price.image }} style={styles.resultImage} />
                    <View style={styles.resultInfo}>
                      <View style={styles.resultHeader}>
                        <View style={styles.resultNameContainer}>
                          <Text style={styles.resultName}>{price.crop}</Text>
                          {price.verified && <Shield size={12} color="#22C55E" />}
                        </View>
                        <View style={styles.trendContainer}>
                          {renderTrendIcon(price.trend)}
                          <Text style={[styles.trendText, { color: getTrendColor(price.trend) }]}>
                            {price.change > 0 ? '+' : ''}{price.change.toFixed(1)}%
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.resultPrice}>
                        ₹{price.price} <Text style={styles.resultUnit}>{price.unit}</Text>
                      </Text>
                      <View style={styles.resultLocation}>
                        <MapPin size={12} color="#6B7280" />
                        <Text style={styles.resultLocationText}>
                          {price.market}, {price.location}
                        </Text>
                      </View>
                      <View style={styles.resultFooter}>
                        <Text style={styles.qualityBadge}>{price.quality}</Text>
                        <Text style={styles.resultTime}>
                          {new Date(price.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
              </View>
            )}
          </View>
        )}

        {/* Recent Searches */}
        {!searchQuery && (
          <View style={styles.recentContainer}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.recentItems}>
              {['Rice prices', 'Tomato Delhi', 'Wheat Punjab', 'Onion rates'].map((search, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.recentItem}
                  onPress={() => setSearchQuery(search.split(' ')[0])}
                >
                  <Search size={16} color="#6B7280" />
                  <Text style={styles.recentText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Popular Crops */}
        {!searchQuery && (
          <View style={styles.popularContainer}>
            <Text style={styles.sectionTitle}>Popular Crops</Text>
            <View style={styles.popularGrid}>
              {[
                { name: 'Rice', icon: '🌾', color: '#FEF3C7' },
                { name: 'Wheat', icon: '🌾', color: '#FDE68A' },
                { name: 'Tomato', icon: '🍅', color: '#FEE2E2' },
                { name: 'Onion', icon: '🧅', color: '#F3E8FF' },
                { name: 'Potato', icon: '🥔', color: '#FEF7ED' },
                { name: 'Sugarcane', icon: '🎋', color: '#ECFDF5' },
              ].map((crop, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.popularCard, { backgroundColor: crop.color }]}
                  onPress={() => setSearchQuery(crop.name)}
                >
                  <Text style={styles.popularIcon}>{crop.icon}</Text>
                  <Text style={styles.popularName}>{crop.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Search Tips */}
        {!searchQuery && (
          <View style={styles.tipsContainer}>
            <Text style={styles.sectionTitle}>Search Tips</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tipText}>• Use specific crop names for better results</Text>
              <Text style={styles.tipText}>• Include location for local market prices</Text>
              <Text style={styles.tipText}>• Filter by category to narrow down options</Text>
              <Text style={styles.tipText}>• Check multiple markets for price comparison</Text>
            </View>
          </View>
        )}

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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#111827',
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
  filterButtonActive: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#22C55E',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  locationList: {
    maxHeight: 150,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  locationTextActive: {
    color: '#22C55E',
    fontWeight: '600',
  },
  locationSelected: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 0.48,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  resultsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  resultCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginRight: 6,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  resultPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#22C55E',
    marginBottom: 4,
  },
  resultUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  resultLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultLocationText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  resultFooter: {
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
  resultTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  recentContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  recentItems: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  recentText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
  },
  popularContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  popularCard: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  popularIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  popularName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  tipsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tipsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  bottomSpacing: {
    height: 20,
  },
});