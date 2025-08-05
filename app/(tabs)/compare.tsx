import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, TrendingUp, TrendingDown, MapPin, Calendar } from 'lucide-react-native';

interface MarketComparison {
  market: string;
  location: string;
  price: number;
  distance: string;
  rating: number;
  lastUpdated: string;
}

const mockComparisons: { [key: string]: MarketComparison[] } = {
  'Rice': [
    {
      market: 'Central Market',
      location: 'Delhi',
      price: 2800,
      distance: '12 km',
      rating: 4.5,
      lastUpdated: '2 hours ago',
    },
    {
      market: 'Grain Exchange',
      location: 'Delhi',
      price: 2750,
      distance: '18 km',
      rating: 4.2,
      lastUpdated: '1 hour ago',
    },
    {
      market: 'Wholesale Market',
      location: 'Gurgaon',
      price: 2900,
      distance: '25 km',
      rating: 4.0,
      lastUpdated: '3 hours ago',
    },
  ],
  'Wheat': [
    {
      market: 'Punjab Mandi',
      location: 'Punjab',
      price: 2350,
      distance: '5 km',
      rating: 4.8,
      lastUpdated: '30 min ago',
    },
    {
      market: 'Grain Market',
      location: 'Punjab',
      price: 2320,
      distance: '8 km',
      rating: 4.3,
      lastUpdated: '1 hour ago',
    },
    {
      market: 'Local Mandi',
      location: 'Haryana',
      price: 2380,
      distance: '15 km',
      rating: 4.1,
      lastUpdated: '2 hours ago',
    },
  ],
};

const crops = ['Rice', 'Wheat', 'Tomato', 'Onion', 'Potato'];

export default function CompareScreen() {
  const [selectedCrop, setSelectedCrop] = useState('Rice');

  const comparisons = mockComparisons[selectedCrop] || [];
  const sortedComparisons = comparisons.sort((a, b) => a.price - b.price);
  const bestPrice = sortedComparisons[0];
  const avgPrice = comparisons.reduce((sum, comp) => sum + comp.price, 0) / comparisons.length;

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Compare Prices</Text>
          <Text style={styles.subtitle}>Find the best deals across markets</Text>
        </View>

        {/* Crop Selection */}
        <View style={styles.cropSelection}>
          <Text style={styles.sectionTitle}>Select Crop</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cropScroll}>
            {crops.map((crop) => (
              <TouchableOpacity
                key={crop}
                style={[
                  styles.cropChip,
                  selectedCrop === crop && styles.cropChipActive
                ]}
                onPress={() => setSelectedCrop(crop)}
              >
                <Text style={[
                  styles.cropChipText,
                  selectedCrop === crop && styles.cropChipTextActive
                ]}>
                  {crop}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Price Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Best Price</Text>
            <Text style={styles.summaryValue}>₹{bestPrice?.price || 0}</Text>
            <Text style={styles.summaryMarket}>{bestPrice?.market}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Average Price</Text>
            <Text style={styles.summaryValue}>₹{Math.round(avgPrice)}</Text>
            <Text style={styles.summaryMarket}>Across all markets</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Price Range</Text>
            <Text style={styles.summaryValue}>
              ₹{comparisons.length > 0 ? Math.max(...comparisons.map(c => c.price)) - Math.min(...comparisons.map(c => c.price)) : 0}
            </Text>
            <Text style={styles.summaryMarket}>Difference</Text>
          </View>
        </View>

        {/* Market Comparisons */}
        <View style={styles.comparisonsContainer}>
          <Text style={styles.sectionTitle}>Market Comparison</Text>
          {sortedComparisons.map((comparison, index) => (
            <View key={index} style={styles.comparisonCard}>
              <View style={styles.comparisonHeader}>
                <View style={styles.marketInfo}>
                  <Text style={styles.marketName}>{comparison.market}</Text>
                  <View style={styles.locationContainer}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.locationText}>{comparison.location}</Text>
                    <Text style={styles.distanceText}>• {comparison.distance}</Text>
                  </View>
                </View>
                {index === 0 && (
                  <View style={styles.bestDealBadge}>
                    <Text style={styles.bestDealText}>Best Deal</Text>
                  </View>
                )}
              </View>

              <View style={styles.priceSection}>
                <Text style={styles.priceValue}>₹{comparison.price}</Text>
                <Text style={styles.priceUnit}>per quintal</Text>
                {index > 0 && (
                  <View style={styles.priceDifference}>
                    <TrendingUp size={14} color="#EF4444" />
                    <Text style={styles.priceDifferenceText}>
                      +₹{comparison.price - bestPrice.price} more
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.comparisonFooter}>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingStars}>{renderStars(comparison.rating)}</Text>
                  <Text style={styles.ratingValue}>{comparison.rating}</Text>
                </View>
                <View style={styles.updateContainer}>
                  <Calendar size={12} color="#9CA3AF" />
                  <Text style={styles.updateText}>{comparison.lastUpdated}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Price Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Price Trend (Last 7 Days)</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartPlaceholder}>
              <BarChart3 size={48} color="#9CA3AF" />
              <Text style={styles.chartText}>Price trend chart will be displayed here</Text>
              <Text style={styles.chartSubtext}>Connect to live data for real-time trends</Text>
            </View>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>Price Comparison Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>💡 Smart Selling</Text>
            <Text style={styles.tipText}>Consider transportation costs when choosing distant markets with higher prices.</Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>⏰ Timing Matters</Text>
            <Text style={styles.tipText}>Check market timings and peak hours for better price negotiations.</Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>📱 Stay Updated</Text>
            <Text style={styles.tipText}>Enable notifications to get alerts when prices reach your target range.</Text>
          </View>
        </View>

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
  cropSelection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  cropScroll: {
    flexDirection: 'row',
  },
  cropChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cropChipActive: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  cropChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  cropChipTextActive: {
    color: '#FFFFFF',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  summaryCard: {
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
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#22C55E',
    marginBottom: 2,
  },
  summaryMarket: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  comparisonsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  comparisonCard: {
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
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  marketInfo: {
    flex: 1,
  },
  marketName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  distanceText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  bestDealBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestDealText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16A34A',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginRight: 8,
  },
  priceUnit: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  priceDifference: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceDifferenceText: {
    fontSize: 12,
    color: '#EF4444',
    marginLeft: 4,
    fontWeight: '600',
  },
  comparisonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStars: {
    fontSize: 12,
    color: '#FBBF24',
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  updateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  chartPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  chartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
  },
  chartSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  tipsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 20,
  },
});