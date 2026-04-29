// dark-mode-system applied
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
// Dot Indicator
// ─────────────────────────────────────────────────────────────────────────────
const DotIndicator = ({ activeIndex, count, light }) => (
  <View style={styles.indicatorContainer}>
    {[...Array(count)].map((_, i) => (
      <View
        key={i}
        style={[
          styles.dot,
          light ? styles.dotLight : styles.dotDark,
          activeIndex === i && (light ? styles.activeDotLight : styles.activeDotDark),
        ]}
      />
    ))}
  </View>
);

// ─────────────────────────────────────────────────────────────────────────────
// Page 1 — Dark, dramatic hero
// ─────────────────────────────────────────────────────────────────────────────
const PageOne = ({ onNext, scrollToNext }) => {
  const pulse = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in the text content
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 900,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // Pulsing glow behind the fire emoji
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.18, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.page, styles.pageDark]}>
      {/* Background embers — purely decorative rings */}
      <View style={styles.ring1} />
      <View style={styles.ring2} />

      <View style={styles.heroContent}>
        {/* Pulsing glow */}
        <Animated.View style={[styles.glowCircle, { transform: [{ scale: pulse }] }]} />
        <Text style={styles.heroEmoji}>🔥</Text>

        <Animated.View style={{ opacity: fadeIn }}>
          <Text style={styles.heroLabel}>WILDFIRE INTELLIGENCE</Text>
          <Text style={styles.heroTitle}>
            Stay ahead{'\n'}of the{' '}
            <Text style={styles.heroTitleRed}>fire.</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Real-time AI-powered alerts and live fire tracking — so you and your community are never caught off guard.
          </Text>
        </Animated.View>
      </View>

      {/* Bottom actions */}
      <View style={styles.heroBottom}>
        <DotIndicator activeIndex={0} count={3} light />
        <TouchableOpacity style={styles.heroNextBtn} onPress={scrollToNext}>
          <Text style={styles.heroNextBtnText}>See how it works  →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Page 2 — Feature highlights
// ─────────────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '🧠',
    title: 'Live AI Detection',
    subtitle: 'Ground reports and camera feeds are analyzed the moment they arrive.',
    accent: '#1A1A1A',
    border: 'rgba(255,255,255,0.10)',
  },
  {
    icon: '🗺️',
    title: 'Interactive Map',
    subtitle: 'See fire perimeters, severity zones, and evacuation routes at a glance.',
    accent: '#1A1A1A',
    border: 'rgba(255,255,255,0.10)',
  },
  {
    icon: '🔔',
    title: 'Smart Alerts',
    subtitle: 'Push notifications tuned to your exact location and risk threshold.',
    accent: '#1A1A1A',
    border: 'rgba(255,255,255,0.10)',
  },
];

const PageTwo = ({ scrollToNext }) => {
  const slideIn = useRef(new Animated.Value(40)).current;
  const fadeIn  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideIn, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.page, styles.pageLight]}>
      <Animated.View style={[styles.pageTwoInner, { opacity: fadeIn, transform: [{ translateY: slideIn }] }]}>
        <Text style={styles.pageTwoEyebrow}>WHAT YOU GET</Text>
        <Text style={styles.pageTwoTitle}>Built for{'\n'}safety-first living.</Text>

        <View style={styles.featuresList}>
          {FEATURES.map((f) => (
            <View key={f.title} style={[styles.featureCard, { backgroundColor: f.accent, borderColor: f.border }]}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <View style={styles.featureTextGroup}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureSubtitle}>{f.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>

      <View style={styles.pageBottom}>
        <DotIndicator activeIndex={1} count={3} />
        <TouchableOpacity style={styles.outlineBtn} onPress={scrollToNext}>
          <Text style={styles.outlineBtnText}>Next  →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Page 3 — Permissions + CTA
// ─────────────────────────────────────────────────────────────────────────────
const PERMISSIONS = [
  { icon: '📍', label: 'Location', desc: 'Background access for hyper-local alerts near your home.' },
  { icon: '🔔', label: 'Notifications', desc: 'Instant push alerts when fire conditions change near you.' },
  { icon: '📷', label: 'Camera & Photos', desc: 'Submit photo evidence to help emergency responders.' },
];

const PageThree = ({ onGetStarted }) => {
  const fadeIn  = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideIn, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.page, styles.pageLight]}>
      <Animated.View style={[styles.pageTwoInner, { opacity: fadeIn, transform: [{ translateY: slideIn }] }]}>
        <Text style={styles.pageTwoEyebrow}>BEFORE WE START</Text>
        <Text style={styles.pageTwoTitle}>A few quick{'\n'}permissions.</Text>
        <Text style={styles.permissionsSubtitle}>
          We only ask for what's essential. You can change these at any time in Settings.
        </Text>

        <View style={styles.permissionsList}>
          {PERMISSIONS.map((p) => (
            <View key={p.label} style={styles.permissionRow}>
              <View style={styles.permissionIconWrap}>
                <Text style={styles.permissionIcon}>{p.icon}</Text>
              </View>
              <View style={styles.permissionText}>
                <Text style={styles.permissionLabel}>{p.label}</Text>
                <Text style={styles.permissionDesc}>{p.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>

      <View style={styles.pageBottom}>
        <DotIndicator activeIndex={2} count={3} />
        <TouchableOpacity style={styles.ctaButton} onPress={onGetStarted} activeOpacity={0.85}>
          <Text style={styles.ctaButtonText}>Allow & Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onGetStarted} style={styles.skipSmall}>
          <Text style={styles.skipSmallText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function LandingScreenCarousel({ navigation }) {
  const [pageIndex, setPageIndex] = useState(0);
  const scrollRef = useRef(null);

  // Programmatically scroll to a page — fixes the skip button bug from before
  const scrollTo = (index) => {
    scrollRef.current?.scrollTo({ x: width * index, animated: true });
    setPageIndex(index);
  };

  const handleScroll = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex !== pageIndex) setPageIndex(newIndex);
  };

  const handleGetStarted = () => {
    navigation.navigate('MainApp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ width: width * 3 }}
      >
        <PageOne scrollToNext={() => scrollTo(1)} />
        <PageTwo  scrollToNext={() => scrollTo(2)} />
        <PageThree onGetStarted={handleGetStarted} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },

  page: {
    width,
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: Platform.OS === 'ios' ? 24 : 40,
  },
  pageDark:  { backgroundColor: '#0F0F0F' },
  pageLight: { backgroundColor: '#0F0F0F', justifyContent: 'space-between', paddingTop: 64 },

  // ── Page 1 ──
  ring1: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.08)',
    top: height * 0.15 - 250,
    left: width / 2 - 250,
  },
  ring2: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.13)',
    top: height * 0.15 - 170,
    left: width / 2 - 170,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 40,
  },
  glowCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(239,68,68,0.18)',
    top: -20,
    left: -20,
    // blurs aren't native but the alpha + scale pulse gives a soft glow feel
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: 24,
    zIndex: 1,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#EF4444',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 58,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: -2,
    lineHeight: 62,
    marginBottom: 20,
  },
  heroTitleRed: {
    color: '#EF4444',
    fontWeight: '600',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '400',
    lineHeight: 26,
    maxWidth: 300,
  },
  heroBottom: {
    paddingBottom: 8,
    gap: 24,
  },
  heroNextBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  heroNextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.2,
  },

  // ── Page 2 & 3 shared ──
  pageTwoInner: {
    flex: 1,
  },
  pageTwoEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#EF4444',
    marginBottom: 12,
  },
  pageTwoTitle: {
    fontSize: 40,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: -1.2,
    lineHeight: 46,
    marginBottom: 32,
  },

  // Feature cards
  featuresList: { gap: 12 },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 14,
    borderWidth: 1,
  },
  featureIcon: { fontSize: 28 },
  featureTextGroup: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 },
  featureSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 18 },

  // Permissions
  permissionsSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 22,
    marginTop: -20,
    marginBottom: 28,
  },
  permissionsList: { gap: 0 },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  permissionIconWrap: {
    width: 44,
    height: 44,
    backgroundColor: '#242424',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  permissionIcon: { fontSize: 20 },
  permissionText: { flex: 1, paddingTop: 2 },
  permissionLabel: { fontSize: 15, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 },
  permissionDesc: { fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 18 },

  // Bottom nav areas
  pageBottom: {
    gap: 16,
    paddingBottom: 8,
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#0F0F0F',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  skipSmall: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  skipSmallText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.30)',
  },

  // Dots
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 7,
    width: 7,
    borderRadius: 4,
  },
  dotDark:       { backgroundColor: 'rgba(255,255,255,0.30)' },
  dotLight:      { backgroundColor: 'rgba(255,255,255,0.3)' },
  activeDotDark:  { backgroundColor: '#FFFFFF', width: 22 },
  activeDotLight: { backgroundColor: '#FFFFFF',  width: 22 },
});