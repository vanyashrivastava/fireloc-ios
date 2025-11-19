import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, Modal, TextInput, Alert } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const [fires, setFires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFire, setSelectedFire] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [markerPosition, setMarkerPosition] = useState({ x: 150, y: 120 });
  const [showMap, setShowMap] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  useEffect(() => {
    // Simulated wildfire data
    const mockFireData = [
      {
        id: 1,
        name: 'Palisades Fire',
        location: 'Pacific Palisades, CA',
        severity: 'critical',
        acres: 2847,
        containment: 35,
        status: 'Active',
        evacuations: true,
        time: '6:30 AM, TODAY',
        top: 60,
        left: 40,
      },
      {
        id: 2,
        name: 'Topanga Canyon Fire',
        location: 'Topanga Canyon Blvd',
        severity: 'high',
        acres: 1250,
        containment: 60,
        status: 'Active',
        evacuations: false,
        time: '8:15 AM, TODAY',
        top: 120,
        left: 100,
      },
      {
        id: 3,
        name: 'Santa Monica Mountains',
        location: 'Santa Monica Mountains',
        severity: 'moderate',
        acres: 580,
        containment: 85,
        status: 'Contained',
        evacuations: false,
        time: '9:00 AM, TODAY',
        top: 180,
        left: 140,
      },
      {
        id: 4,
        name: 'Griffith Park Fire',
        location: 'Griffith Park Observatory',
        severity: 'high',
        acres: 945,
        containment: 45,
        status: 'Active',
        evacuations: true,
        time: '7:45 AM, TODAY',
        top: 90,
        left: 180,
      },
    ];

    setTimeout(() => {
      setFires(mockFireData);
      setLoading(false);
    }, 1000);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#EF4444';
      case 'high': return '#F97316';
      case 'moderate': return '#EAB308';
      default: return '#10B981';
    }
  };

  const filteredFires = fires.filter(fire => {
    if (filter === 'all') return true;
    if (filter === 'active') return fire.status === 'Active';
    if (filter === 'evacuations') return fire.evacuations;
    return true;
  });

  const activeCount = fires.filter(f => f.status === 'Active').length;

  const handleMapPress = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    setMarkerPosition({ x: locationX, y: locationY });
  };

  const handlePhotoUpload = () => {
    setPhotoUploaded(true);
    Alert.alert('Photo Selected', 'Photo evidence has been added to your report.');
  };

  const handleSubmit = () => {
    if (!location && !showMap) {
      Alert.alert('Location Required', 'Please provide a location or drop a pin on the map.');
      return;
    }

    Alert.alert(
      'Report Submitted',
      'Thank you for your report. Emergency services have been notified.',
      [{ 
        text: 'OK', 
        onPress: () => {
          setShowReportModal(false);
          setLocation('');
          setDescription('');
          setShowMap(false);
          setPhotoUploaded(false);
        }
      }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Fire Map</Text>
          <Text style={styles.subtitle}>Real-time wildfire tracking</Text>
        </View>

        {/* Active Fires Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active Fires</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {fires.reduce((sum, f) => sum + f.acres, 0).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Acres Burned</Text>
          </View>
        </View>

        {/* Map Widget */}
        <View style={styles.mapWidget}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>Los Angeles Area</Text>
            <TouchableOpacity style={styles.locationButton}>
              <View style={styles.locationDot} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <View style={styles.map}>
              {/* Placeholder Map */}
              <View style={styles.mapPlaceholder}>
                <Text style={styles.mapPlaceholderText}>📍</Text>
              </View>

              {/* Fire Markers */}
              {filteredFires.map((fire) => (
                <TouchableOpacity
                  key={fire.id}
                  style={[
                    styles.marker,
                    { 
                      top: fire.top, 
                      left: fire.left,
                      backgroundColor: getSeverityColor(fire.severity),
                    }
                  ]}
                  onPress={() => setSelectedFire(fire.id === selectedFire ? null : fire.id)}
                >
                  <Text style={styles.markerIcon}>🔥</Text>
                  {fire.evacuations && (
                    <View style={styles.evacuationBadge}>
                      <Text style={styles.evacuationIcon}>⚠</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              {/* Selected Fire Info */}
              {selectedFire && (
                <View style={styles.mapPopup}>
                  {(() => {
                    const fire = fires.find(f => f.id === selectedFire);
                    return (
                      <>
                        <Text style={styles.popupName}>{fire.name}</Text>
                        <Text style={styles.popupDetail}>
                          {fire.acres.toLocaleString()} acres • {fire.containment}% contained
                        </Text>
                      </>
                    );
                  })()}
                </View>
              )}
            </View>
          )}

          {/* Map Footer */}
          <View style={styles.mapFooter}>
            <Text style={styles.mapFooterText}>Tap markers for details</Text>
          </View>
        </View>

        {/* Report Button */}
        <TouchableOpacity 
          style={styles.reportButton}
          onPress={() => setShowReportModal(true)}
        >
          <Text style={styles.reportButtonText}>See something? Say something.</Text>
          <Text style={styles.reportButtonSubtext}>Report a fire in your area</Text>
        </TouchableOpacity>

        {/* Filters */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Filter Incidents</Text>
          <View style={styles.filterContainer}>
            {['all', 'active', 'evacuations'].map((filterType) => (
              <TouchableOpacity
                key={filterType}
                style={[
                  styles.filterButton,
                  filter === filterType && styles.filterButtonActive
                ]}
                onPress={() => setFilter(filterType)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filter === filterType && styles.filterButtonTextActive
                ]}>
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Incidents List */}
        <View style={styles.incidentsSection}>
          <Text style={styles.incidentsTitle}>Recent Incidents</Text>
          
          {filteredFires.map((fire) => (
            <View key={fire.id} style={styles.incidentCard}>
              <View style={styles.incidentHeader}>
                <View style={styles.incidentInfo}>
                  <Text style={styles.incidentTime}>{fire.time}</Text>
                  <Text style={styles.incidentName}>{fire.name}</Text>
                  <Text style={styles.incidentLocation}>{fire.location}</Text>
                </View>
                <View style={[styles.incidentIcon, { backgroundColor: getSeverityColor(fire.severity) }]}>
                  <Text style={styles.incidentIconText}>🔥</Text>
                </View>
              </View>

              <View style={styles.incidentStats}>
                <Text style={styles.incidentStat}>🔥 {fire.acres.toLocaleString()} acres</Text>
                <Text style={styles.incidentStat}>💧 {fire.containment}% contained</Text>
              </View>

              {fire.evacuations && (
                <View style={styles.evacuationWarning}>
                  <Text style={styles.evacuationWarningText}>⚠ Evacuation Orders</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Report Modal */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setShowReportModal(false)}
              >
                <Text style={styles.backButtonText}>✕ Close</Text>
              </TouchableOpacity>
            </View>

            {/* Title */}
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>Report a Fire</Text>
              <Text style={styles.modalSubtitle}>Help us respond quickly to emergencies</Text>
            </View>

            {/* Location Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Location</Text>
              <Text style={styles.sectionDescription}>
                Enter an address or drop a pin on the map
              </Text>

              <TextInput
                style={styles.input}
                placeholder="123 Main Street, Los Angeles, CA"
                placeholderTextColor="#9CA3AF"
                value={location}
                onChangeText={setLocation}
              />

              <TouchableOpacity 
                style={styles.mapToggleButton}
                onPress={() => setShowMap(!showMap)}
              >
                <Text style={styles.mapToggleText}>
                  {showMap ? '📍 Hide Map' : '📍 Drop Pin on Map'}
                </Text>
              </TouchableOpacity>

              {showMap && (
                <View style={styles.mapContainer}>
                  <Text style={styles.mapInstruction}>
                    Tap anywhere to drop a pin
                  </Text>
                  <TouchableOpacity
                    style={styles.interactiveMap}
                    activeOpacity={1}
                    onPress={handleMapPress}
                  >
                    <View style={styles.mapBackground}>
                      <Text style={styles.mapBackgroundText}>📍</Text>
                      <Text style={styles.mapBackgroundLabel}>Los Angeles Area</Text>
                    </View>

                    <View 
                      style={[
                        styles.droppedMarker,
                        { 
                          left: markerPosition.x - 20,
                          top: markerPosition.y - 40,
                        }
                      ]}
                    >
                      <Text style={styles.markerIconLarge}>📍</Text>
                      <View style={styles.markerPulse} />
                    </View>
                  </TouchableOpacity>
                  
                  <Text style={styles.coordinatesText}>
                    Coordinates: {(34.0522 + (markerPosition.y - 120) * 0.001).toFixed(4)}°N, 
                    {(118.2437 - (markerPosition.x - 150) * 0.001).toFixed(4)}°W
                  </Text>
                </View>
              )}
            </View>

            {/* Photo Evidence Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Photo Evidence (Optional)</Text>
              <Text style={styles.sectionDescription}>
                Upload photos to help emergency responders
              </Text>

              {photoUploaded ? (
                <View style={styles.photoUploaded}>
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoPlaceholderIcon}>📷</Text>
                    <Text style={styles.photoPlaceholderText}>Photo Added</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.changePhotoButton}
                    onPress={handlePhotoUpload}
                  >
                    <Text style={styles.changePhotoText}>Change Photo</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={handlePhotoUpload}
                >
                  <Text style={styles.uploadIcon}>📷</Text>
                  <Text style={styles.uploadButtonText}>Upload Photo</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Description Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Additional Details (Optional)</Text>
              <Text style={styles.sectionDescription}>
                Describe what you're seeing
              </Text>

              <TextInput
                style={styles.textArea}
                placeholder="e.g., Large smoke plume visible from highway, flames approximately 20 feet high..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Important Notice */}
            <View style={styles.noticeContainer}>
              <Text style={styles.noticeIcon}>ℹ️</Text>
              <View style={styles.noticeContent}>
                <Text style={styles.noticeTitle}>Important</Text>
                <Text style={styles.noticeText}>
                  If you are in immediate danger, call 911 first. This report will be sent to local authorities.
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: '300',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '300',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  mapWidget: {
    marginHorizontal: 24,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  locationButton: {
    width: 36,
    height: 36,
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationDot: {
    width: 10,
    height: 10,
    backgroundColor: '#3B82F6',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#BFDBFE',
  },
  loadingContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  map: {
    height: 300,
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  mapPlaceholder: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  mapPlaceholderText: {
    fontSize: 40,
    opacity: 0.3,
  },
  marker: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markerIcon: {
    fontSize: 18,
  },
  evacuationBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#DC2626',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  evacuationIcon: {
    fontSize: 8,
  },
  mapPopup: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  popupName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  popupDetail: {
    fontSize: 12,
    color: '#6B7280',
  },
  mapFooter: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  mapFooterText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  reportButton: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  reportButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  reportButtonSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  filterSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#111827',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  incidentsSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  incidentsTitle: {
    fontSize: 22,
    fontWeight: '400',
    color: '#111827',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  incidentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  incidentInfo: {
    flex: 1,
  },
  incidentTime: {
    fontSize: 10,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  incidentName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 3,
  },
  incidentLocation: {
    fontSize: 13,
    color: '#6B7280',
  },
  incidentIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  incidentIconText: {
    fontSize: 26,
  },
  incidentStats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  incidentStat: {
    fontSize: 13,
    color: '#6B7280',
  },
  evacuationWarning: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 8,
    marginTop: 10,
  },
  evacuationWarningText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  modalTitleContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 42,
    fontWeight: '300',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  mapToggleButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  mapToggleText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  mapContainer: {
    marginTop: 16,
  },
  mapInstruction: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  interactiveMap: {
    height: 280,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
    overflow: 'hidden',
  },
  mapBackground: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -30 }],
    alignItems: 'center',
    opacity: 0.3,
  },
  mapBackgroundText: {
    fontSize: 32,
    marginBottom: 4,
  },
  mapBackgroundLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  droppedMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerIconLarge: {
    fontSize: 40,
    zIndex: 2,
  },
  markerPulse: {
    position: 'absolute',
    top: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    opacity: 0.3,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
  },
  uploadButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadButtonText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  photoUploaded: {
    gap: 12,
  },
  photoPlaceholder: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  photoPlaceholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  photoPlaceholderText: {
    fontSize: 14,
    color: '#6B7280',
  },
  changePhotoButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  changePhotoText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
    minHeight: 120,
  },
  noticeContainer: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  noticeIcon: {
    fontSize: 20,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
  submitButton: {
    marginHorizontal: 24,
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});