import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Card } from 'react-native-paper';

const COLORS = {
  primary: '#FF4D2E',
  white: '#FFFFFF',
  gray: '#F5F5F5',
  darkGray: '#333333',
  lightGray: '#EEEEEE',
};

const { width } = Dimensions.get('window');

export const AboutScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>🔥</Text>
        </View>
        <Text style={styles.appName}>FireLoc</Text>
        <Text style={styles.appVersion}>v1.0.0</Text>
      </View>

      {/* About Section */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.cardTitle}>About FireLoc</Text>
          <Text style={styles.cardDescription}>
            FireLoc uses YOLOv8 and mobile phone camera feeds for real-time fire
            detection. The mobile app provides hazard alerts and active fire
            visualization to help keep you informed about potential fire threats
            in your area.
          </Text>
        </Card.Content>
      </Card>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Features</Text>

        <Feature
          icon="📍"
          title="Real-Time Fire Detection"
          description="Instant alerts when fires are detected using advanced YOLOv8 AI"
        />

        <Feature
          icon="🗺️"
          title="Interactive Map"
          description="View active fires on an interactive Google Maps interface with zoom and location sharing"
        />

        <Feature
          icon="🔔"
          title="Push Notifications"
          description="Receive instant push notifications about new fire detections in your area"
        />

        <Feature
          icon="📊"
          title="Alert Dashboard"
          description="Track active fires and manage your alert preferences in one place"
        />
      </View>

      {/* Technology Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technology</Text>

        <TechCard
          name="YOLOv8"
          description="State-of-the-art object detection model for fire identification"
        />

        <TechCard
          name="React Native"
          description="Cross-platform mobile app framework for iOS and Android"
        />

        <TechCard
          name="Google Maps"
          description="Real-time geographic visualization of fire locations"
        />

        <TechCard
          name="Expo"
          description="Development platform for building React Native apps"
        />
      </View>

      {/* Credits Section */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.cardTitle}>Development</Text>
          <Text style={styles.cardDescription}>
            FireLoc is built by Vanya Shrivastava with a focus on real-time fire
            detection and community safety.
          </Text>
          <Text style={styles.cardDescription} style={{ marginTop: 8 }}>
            For updates and more information, visit{'\n'}
            <Text style={styles.linkText}>github.com/vanyashrivastava/fireloc</Text>
          </Text>
        </Card.Content>
      </Card>

      {/* Legal Section */}
      <View style={styles.legalSection}>
        <LegalLink text="Privacy Policy" />
        <Text style={styles.separator}>•</Text>
        <LegalLink text="Terms of Service" />
        <Text style={styles.separator}>•</Text>
        <LegalLink text="License" />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 FireLoc. All rights reserved.
        </Text>
        <Text style={styles.footerText} style={{ marginTop: 8 }}>
          Stay safe and informed.
        </Text>
      </View>
    </ScrollView>
  );
};

const Feature = ({ icon, title, description }) => (
  <Card style={styles.featureCard}>
    <Card.Content style={styles.featureContent}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </Card.Content>
  </Card>
);

const TechCard = ({ name, description }) => (
  <Card style={styles.techCard}>
    <Card.Content style={styles.techContent}>
      <Text style={styles.techName}>{name}</Text>
      <Text style={styles.techDescription}>{description}</Text>
    </Card.Content>
  </Card>
);

const LegalLink = ({ text }) => (
  <Text style={styles.legalLink}>{text}</Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 13,
    color: '#999999',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 21,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  featureCard: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 12,
    marginTop: 4,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  techCard: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  techContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  techName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  techDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 17,
  },
  legalSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  legalLink: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    paddingHorizontal: 6,
  },
  separator: {
    color: '#DDDDDD',
    marginHorizontal: 4,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
});

export default AboutScreen;
