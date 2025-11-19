import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Platform } from 'react-native';

const { width } = Dimensions.get('window');

// --- Helper Components ---

const DotIndicator = ({ activeIndex, count }) => (
  <View style={styles.indicatorContainer}>
    {[...Array(count)].map((_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          activeIndex === index && styles.activeDot,
        ]}
      />
    ))}
  </View>
);

const FeatureCard = ({ icon, title, subtitle }) => (
  <View style={styles.featureCard}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <View style={styles.featureTextGroup}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureSubtitle}>{subtitle}</Text>
    </View>
  </View>
);

// --- Page 1: Hype & Main Value Prop ---

const PageOne = ({ onNext }) => (
  <View style={styles.page}>
    <View style={styles.heroContent}>
      <Text style={styles.heroEmoji}>🔥</Text>
      
      {/* Hype Title: Thin and Large */}
      <Text style={styles.heroTitle}>
        Stay Ahead of the{' '}
        <Text style={styles.heroTitleHighlight}>Fire</Text>
      </Text>
      
      <Text style={styles.heroSubtitle}>
        Get real-time intelligence and instant alerts powered by AI to protect your home and community.
      </Text>
    </View>

    <TouchableOpacity style={styles.skipButton} onPress={onNext}>
      <Text style={styles.skipButtonText}>Skip Introduction &rarr;</Text>
    </TouchableOpacity>
  </View>
);

// --- Page 2: Features & CTA ---

const PageTwo = ({ onGetStarted }) => (
  <View style={styles.page}>
    <View style={styles.featuresList}>
      <Text style={styles.pageTwoTitle}>Protect What Matters</Text>
      
      <FeatureCard 
        icon="🧠" 
        title="Live Fire Detection" 
        subtitle="AI-powered analysis of ground reports and cameras." 
      />
      <FeatureCard 
        icon="🗺️" 
        title="Interactive Map" 
        subtitle="Visualize fire perimeters, severity, and status updates." 
      />
      <FeatureCard 
        icon="🔔" 
        title="Instant Alerts" 
        subtitle="Critical push notifications based on your safety threshold." 
      />
      
      <View style={styles.noticeContainer}>
        <Text style={styles.noticeIcon}>📍</Text>
        <Text style={styles.noticeText}>
          We require background location access to provide accurate, nearby alerts.
        </Text>
      </View>
    </View>

    <TouchableOpacity
      style={styles.ctaButton}
      onPress={onGetStarted}
    >
      <Text style={styles.ctaButtonText}>Get Started</Text>
    </TouchableOpacity>
  </View>
);


// --- Main Component ---

export default function LandingScreenCarousel({ navigation }) {
  const [pageIndex, setPageIndex] = useState(0);
  
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setPageIndex(newIndex);
  };
  
  const handleGetStarted = () => {
    // Navigate to the main application flow (e.g., Auth or Home)
    navigation.navigate('MainApp'); 
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
      >
        <PageOne onNext={() => setPageIndex(1)} />
        <PageTwo onGetStarted={handleGetStarted} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <DotIndicator activeIndex={pageIndex} count={2} />
      </View>
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollViewContent: {
    width: width * 2, // 2 pages wide
    height: '100%',
  },
  page: {
    width: width,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: Platform.OS === 'ios' ? 0 : 40, 
  },
  
  // --- Page 1 Styles ---
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  heroEmoji: {
    fontSize: 100,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 56,
    fontWeight: '300',
    color: '#111827',
    letterSpacing: -1.5,
    textAlign: 'center',
    marginBottom: 16,
  },
  heroTitleHighlight: {
    color: '#EF4444', // Use a high-severity color for emphasis
    fontWeight: '500', 
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 10,
  },
  skipButton: {
    alignSelf: 'center',
    marginBottom: 40,
    paddingVertical: 10,
  },
  skipButtonText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  
  // --- Page 2 Styles ---
  featuresList: {
    flex: 1,
    paddingTop: 0,
    gap: 16,
  },
  pageTwoTitle: {
    fontSize: 32,
    fontWeight: '400',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 24,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featureIcon: {
    fontSize: 30,
  },
  featureTextGroup: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  featureSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  noticeContainer: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7', // Light yellow for a warning/info box
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noticeIcon: {
    fontSize: 20,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
  ctaButton: {
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.2,
  },

  // --- Carousel Dots ---
  bottomBar: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB', // Light gray inactive dot
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#111827', // Black active dot
    width: 20, // Slightly longer active dot for emphasis
  },
});