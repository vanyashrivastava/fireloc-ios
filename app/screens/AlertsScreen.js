import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import * as Location from 'expo-location';

export default function AlertsScreen() {
  const [filter, setFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  // Convert degrees to radians for haversine distance math
  const toRad = (deg) => (deg * Math.PI) / 180;

  // Compute distance between two latitude/longitude pairs in kilometers
  const distanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Check whether a JS Date object is today on the user's device
  const isToday = (date) => {
    if (!date) return false;

    const now = new Date();

    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  };

  useEffect(() => {
    const fetchEverything = async () => {
      try {
        // Ask for current device location permission
        const { status } = await Location.requestForegroundPermissionsAsync();

        let currentUserLocation = null;

        if (status === 'granted') {
          const current = await Location.getCurrentPositionAsync({});
          currentUserLocation = {
            latitude: current.coords.latitude,
            longitude: current.coords.longitude,
          };
          setUserLocation(currentUserLocation);
        } else {
          console.warn('Location permission not granted');
        }

        // Fetch FireAlerts from Firestore
        const querySnapshot = await getDocs(collection(db, 'FireAlerts'));

        const rawAlerts = [];
        querySnapshot.forEach((docSnap) => {
          rawAlerts.push({
            id: docSnap.id,
            ...docSnap.data(),
          });
        });

        const alertsData = [];

        // Loop through each FireAlert document
        for (const alertItem of rawAlerts) {
          const geo = alertItem.location;

          // Reverse-geocode the GeoPoint into a real-world address
          let name = 'Detected fire';
          let address = 'Location unavailable';

          if (geo) {
            try {
              const results = await Location.reverseGeocodeAsync({
                latitude: geo.latitude,
                longitude: geo.longitude,
              });

              const place = results[0];

              if (place) {
                // Title line: prefer street number + street name
                const streetTitle =
                  place.streetNumber && place.street
                    ? `${place.streetNumber} ${place.street}`
                    : place.street || place.name || place.city || place.region || 'Detected fire';
              
                name = streetTitle;
              
                // Subtitle / address line: fuller spelled-out address
                const addressParts = [
                  place.name,
                  place.streetNumber && place.street
                    ? `${place.streetNumber} ${place.street}`
                    : place.street,
                  place.city,
                  place.region,
                  place.postalCode,
                  place.country,
                ].filter(Boolean);
              
                if (addressParts.length > 0) {
                  address = addressParts.join(', ');
                }
              }
            } catch (geoError) {
              console.warn('Reverse geocoding failed:', geoError);
            }
          }

          // Derive severity from confidence
          const confidence =
            typeof alertItem.confidence === 'number'
              ? alertItem.confidence
              : 0;

          const severity =
            confidence >= 0.9
              ? 'critical'
              : confidence >= 0.7
              ? 'high'
              : 'moderate';

          // Convert Firestore timestamp to JS Date
          const alertDate =
            alertItem.timestamp && alertItem.timestamp.toDate
              ? alertItem.timestamp.toDate()
              : null;

          // User-friendly time string for display
          const timeString = alertDate
            ? alertDate.toLocaleString()
            : 'Unknown time';

          // Coordinates string for modal detail
          const coordinates = geo
            ? `${geo.latitude.toFixed(4)}° N, ${Math.abs(
                geo.longitude
              ).toFixed(4)}° ${geo.longitude < 0 ? 'W' : 'E'}`
            : 'Coordinates unavailable';

          // Compute distance from current phone location
          let distanceString = 'Distance unavailable';
          if (currentUserLocation && geo) {
            const km = distanceKm(
              currentUserLocation.latitude,
              currentUserLocation.longitude,
              geo.latitude,
              geo.longitude
            );
            const miles = km * 0.621371;
            distanceString = `${miles.toFixed(1)} miles away`;
          }

          alertsData.push({
            id: alertItem.id,
            time: timeString,
            timestampDate: alertDate, // keep actual Date for filtering
            name,
            address,
            type: 'fire',
            severity,
            description: `Status: ${
              alertItem.status || 'unknown'
            }\nConfidence: ${confidence}\nElevation: ${
              alertItem.elevation ?? 'n/a'
            }`,
            coordinates,
            distance: distanceString,
            icon: '🔥',
            color:
              severity === 'critical'
                ? '#EF4444'
                : severity === 'high'
                ? '#F97316'
                : '#EAB308',
          });
        }

        setAlerts(alertsData);
      } catch (error) {
        console.error('Error loading alerts:', error);
        Alert.alert('Error', 'Failed to load alerts or location data');
      } finally {
        setLoading(false);
      }
    };

    fetchEverything();
  }, []);

  // Filter using real severity + real timestamp
  const filteredAlerts = alerts.filter((alertItem) => {
    if (filter === 'all') return true;
    if (filter === 'critical') return alertItem.severity === 'critical';
    if (filter === 'today') return isToday(alertItem.timestampDate);
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Incidents</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {['all', 'critical', 'today'].map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterButton,
              filter === filterType && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(filterType)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === filterType && styles.filterButtonTextActive,
              ]}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Alerts List */}
      <ScrollView
        style={styles.alertsList}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading alerts...</Text>
          </View>
        ) : filteredAlerts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No incidents found</Text>
            <Text style={styles.emptyStateText}>
              There are no alerts matching the current filter.
            </Text>
          </View>
        ) : (
          filteredAlerts.map((alertItem) => (
            <TouchableOpacity
              key={alertItem.id}
              style={styles.alertCard}
              onPress={() => setSelectedAlert(alertItem)}
              activeOpacity={0.9}
            >
              <View style={styles.alertContent}>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertTime}>{alertItem.time}</Text>
                  <Text style={styles.alertName}>{alertItem.name}</Text>
                  <Text style={styles.alertAddress}>{alertItem.address}</Text>
                </View>

                <View
                  style={[
                    styles.alertIconContainer,
                    { backgroundColor: `${alertItem.color}20` },
                  ]}
                >
                  <Text style={styles.alertIcon}>{alertItem.icon}</Text>
                </View>
              </View>

              <View style={styles.menuDots}>
                <Text style={styles.menuDotsText}>···</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={!!selectedAlert}
        animationType="slide"
        onRequestClose={() => setSelectedAlert(null)}
      >
        <View style={styles.modalContainer}>
          {selectedAlert && (
            <>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedAlert(null)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderIcon}>
                    {selectedAlert.icon}
                  </Text>
                  <Text style={styles.imagePlaceholderText}>
                    Image Placeholder
                  </Text>
                </View>

                <View style={styles.modalContent}>
                  <View style={styles.modalTitleSection}>
                    <Text style={styles.modalTitle}>{selectedAlert.name}</Text>
                    <Text style={styles.modalAddress}>
                      {selectedAlert.address}
                    </Text>
                    <Text style={styles.modalTime}>{selectedAlert.time}</Text>
                  </View>

                  <View style={styles.distanceBadge}>
                    <Text style={styles.distanceText}>
                      📍 {selectedAlert.distance}
                    </Text>
                  </View>

                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Coordinates</Text>
                    <Text style={styles.infoValue}>
                      {selectedAlert.coordinates}
                    </Text>
                  </View>

                  <View style={styles.descriptionSection}>
                    <Text style={styles.descriptionText}>
                      {selectedAlert.description}
                    </Text>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.primaryButton}>
                      <Text style={styles.primaryButtonText}>
                        Explore Evacuation Routes
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton}>
                      <Text style={styles.secondaryButtonText}>
                        Resources & Help
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: '300',
    color: '#111827',
    letterSpacing: -0.5,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#111827',
  },
  filterButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  alertsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  alertContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertInfo: {
    flex: 1,
    paddingRight: 16,
  },
  alertTime: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  alertName: {
    fontSize: 24,
    fontWeight: '400',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  alertAddress: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 20,
  },
  alertIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: 36,
  },
  menuDots: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  menuDotsText: {
    fontSize: 24,
    color: '#D1D5DB',
    letterSpacing: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6B7280',
  },
  imagePlaceholder: {
    height: 250,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  imagePlaceholderIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalTitleSection: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: '400',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  modalAddress: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  modalTime: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  distanceBadge: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  distanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '400',
  },
  descriptionSection: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  descriptionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});