import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { FireDetailCard } from '../components/FireMarker';
import { markFireAsViewed } from '../services/fireApi';
import useFireData from '../hooks/useFireData';

const COLORS = {
  primary: '#FF4D2E',
  white: '#FFFFFF',
  gray: '#F5F5F5',
  darkGray: '#333333',
};

const { width, height } = Dimensions.get('window');

const INITIAL_REGION = {
  latitude: 34.05,
  longitude: -118.25,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export const MapScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const { fires, loading, error, lastUpdated } = useFireData(10000);
  const [selectedFire, setSelectedFire] = useState(null);

  const handleMarkerPress = (fire) => {
    setSelectedFire(fire);
  };

  const handleMarkViewed = async (fireId) => {
    try {
      await markFireAsViewed(fireId);
      setSelectedFire(null);
    } catch (err) {
      console.error('Error marking fire as viewed:', err);
    }
  };

  const handleZoomToFire = (fire) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: fire.latitude,
        longitude: fire.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  if (loading && fires.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading fires...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
      >
        {fires.map((fire) => (
          <Marker
            key={fire.id}
            coordinate={{
              latitude: fire.latitude,
              longitude: fire.longitude,
            }}
            onPress={() => handleMarkerPress(fire)}
            title={`Fire #${fire.id}`}
          >
            <Text style={styles.markerEmoji}>🔥</Text>
          </Marker>
        ))}
      </MapView>

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ Error: {error}</Text>
        </View>
      )}

      {/* Last Updated Info */}
      {lastUpdated && (
        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>
            Updated {new Date(lastUpdated).toLocaleTimeString()}
          </Text>
        </View>
      )}

      {/* Selected Fire Detail Card */}
      {selectedFire && (
        <View style={styles.detailCardContainer}>
          <FireDetailCard
            fire={selectedFire}
            onMarkViewed={handleMarkViewed}
            onClose={() => setSelectedFire(null)}
          />
        </View>
      )}

      {/* Fire Count Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{fires.length}</Text>
        <Text style={styles.badgeLabel}>Fires</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  map: {
    flex: 1,
    width,
    height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  markerEmoji: {
    fontSize: 32,
  },
  detailCardContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  errorBanner: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: '#FFE5E5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  errorText: {
    color: '#C00000',
    fontSize: 13,
    fontWeight: '500',
  },
  infoBanner: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  badgeLabel: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});

export default MapScreen;
