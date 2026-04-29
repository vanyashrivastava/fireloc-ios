import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Modal, TextInput, Alert, Image, ActionSheetIOS, Platform,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Notifications from 'expo-notifications';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const { width } = Dimensions.get('window');

// Configure how notifications appear when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const LA_REGION = {
  latitude: 34.0522,
  longitude: -118.2437,
  latitudeDelta: 0.8,
  longitudeDelta: 0.8,
};

export default function MapScreen() {
  const [fires, setFires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFire, setSelectedFire] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [droppedPin, setDroppedPin] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [attachment, setAttachment] = useState(null); // { uri, type: 'image'|'file', name }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef(null);
  const reportMapRef = useRef(null);

  // ── Request notification permissions on mount ──────────────────────────────
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permission not granted');
      }
    })();
  }, []);

  // ── Fetch fire data ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchFireData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'FireData'));
        const fireData = [];
        querySnapshot.forEach((doc) => {
          fireData.push({ id: doc.id, ...doc.data() });
        });
        setFires(fireData);
      } catch (error) {
        console.error('Error fetching fire data:', error);
        Alert.alert('Error', 'Failed to load fire data');
      } finally {
        setLoading(false);
      }
    };
    fetchFireData();
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#EF4444';
      case 'high':     return '#F97316';
      case 'moderate': return '#EAB308';
      default:         return '#10B981';
    }
  };

  const filteredFires = fires.filter(fire => {
    if (filter === 'all')         return true;
    if (filter === 'active')      return fire.status === 'Active';
    if (filter === 'evacuations') return fire.evacuations;
    return true;
  });

  const activeCount = fires.filter(f => f.status === 'Active').length;

  const handleFireCardPress = (fire) => {
    if (mapRef.current && fire.latitude && fire.longitude) {
      mapRef.current.animateToRegion({
        latitude: fire.latitude,
        longitude: fire.longitude,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      }, 600);
    }
    setSelectedFire(fire.id === selectedFire ? null : fire.id);
  };

  // ── Attachment handlers ────────────────────────────────────────────────────

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is required to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      setAttachment({ uri: asset.uri, type: 'image', name: 'photo.jpg' });
    }
  };

  const handlePickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Photo library access is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      setAttachment({ uri: asset.uri, type: 'image', name: asset.uri.split('/').pop() || 'photo.jpg' });
    }
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.length) {
        const asset = result.assets[0];
        setAttachment({ uri: asset.uri, type: 'file', name: asset.name });
      }
    } catch {
      Alert.alert('Error', 'Could not open file picker.');
    }
  };

  /** Show native action sheet (iOS) or Alert menu (Android) */
  const handleAttachmentPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', '📷  Take a Photo', '🖼  Choose from Camera Roll', '📁  Upload a File'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) handleTakePhoto();
          if (buttonIndex === 2) handlePickFromLibrary();
          if (buttonIndex === 3) handlePickFile();
        }
      );
    } else {
      Alert.alert('Add Evidence', 'Choose an option', [
        { text: '📷  Take a Photo',            onPress: handleTakePhoto },
        { text: '🖼  Choose from Camera Roll', onPress: handlePickFromLibrary },
        { text: '📁  Upload a File',            onPress: handlePickFile },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  // ── Submit + push notification ─────────────────────────────────────────────
  const sendAlertNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 Report Received — Thank You!',
        body: 'Our AI model has been alerted and is analyzing your report. Emergency services have been notified.',
        sound: true,
        data: { type: 'fire_report' },
      },
      trigger: null, // fires immediately
    });
  };

  const handleSubmit = async () => {
    if (!location && !droppedPin) {
      Alert.alert('Location Required', 'Please provide an address or drop a pin on the map.');
      return;
    }
    setIsSubmitting(true);
    try {
      // TODO: upload `attachment` to your storage + write report doc to Firestore here

      await sendAlertNotification();

      Alert.alert(
        '✅ Report Submitted',
        'Our AI model has been alerted! Thank you for helping keep the community safe.',
        [{
          text: 'OK',
          onPress: () => {
            setShowReportModal(false);
            setLocation('');
            setDescription('');
            setShowMap(false);
            setDroppedPin(null);
            setAttachment(null);
          },
        }]
      );
    } catch {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Fire Map</Text>
          <Text style={styles.subtitle}>Real-time wildfire tracking</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active Fires</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {fires.reduce((sum, f) => sum + (f.acres || 0), 0).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Acres Burned</Text>
          </View>
        </View>

        {/* Apple Maps Widget */}
        <View style={styles.mapWidget}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>Los Angeles Area</Text>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => mapRef.current?.animateToRegion(LA_REGION, 600)}
            >
              <View style={styles.locationDot} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading map...</Text>
            </View>
          ) : (
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_DEFAULT}
              initialRegion={LA_REGION}
              showsUserLocation
              showsCompass
              showsScale
            >
              {filteredFires.map((fire) =>
                fire.latitude && fire.longitude ? (
                  <Marker
                    key={fire.id}
                    coordinate={{ latitude: fire.latitude, longitude: fire.longitude }}
                    onPress={() => setSelectedFire(fire.id === selectedFire ? null : fire.id)}
                  >
                    <View style={[styles.markerOuter, { backgroundColor: getSeverityColor(fire.severity) }]}>
                      <Text style={styles.markerIcon}>🔥</Text>
                      {fire.evacuations && (
                        <View style={styles.evacuationBadge}>
                          <Text style={styles.evacuationIcon}>⚠</Text>
                        </View>
                      )}
                    </View>
                    <Callout tooltip={false}>
                      <View style={styles.calloutContainer}>
                        <Text style={styles.calloutName}>{fire.name}</Text>
                        <Text style={styles.calloutDetail}>
                          {(fire.acres || 0).toLocaleString()} acres • {fire.containment ?? 0}% contained
                        </Text>
                        {fire.evacuations && (
                          <Text style={styles.calloutEvac}>⚠ Evacuation Orders</Text>
                        )}
                      </View>
                    </Callout>
                  </Marker>
                ) : null
              )}
            </MapView>
          )}

          <View style={styles.mapFooter}>
            <Text style={styles.mapFooterText}>Tap markers for details</Text>
          </View>
        </View>

        {/* Report CTA */}
        <TouchableOpacity style={styles.reportButton} onPress={() => setShowReportModal(true)}>
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
                style={[styles.filterButton, filter === filterType && styles.filterButtonActive]}
                onPress={() => setFilter(filterType)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filter === filterType && styles.filterButtonTextActive,
                ]}>
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Incident Cards */}
        <View style={styles.incidentsSection}>
          <Text style={styles.incidentsTitle}>Recent Incidents</Text>
          {filteredFires.map((fire) => (
            <TouchableOpacity
              key={fire.id}
              style={[styles.incidentCard, selectedFire === fire.id && styles.incidentCardSelected]}
              onPress={() => handleFireCardPress(fire)}
              activeOpacity={0.8}
            >
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
                <Text style={styles.incidentStat}>🔥 {(fire.acres || 0).toLocaleString()} acres</Text>
                <Text style={styles.incidentStat}>💧 {fire.containment ?? 0}% contained</Text>
              </View>

              {fire.evacuations && (
                <View style={styles.evacuationWarning}>
                  <Text style={styles.evacuationWarningText}>⚠ Evacuation Orders</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ════════════════════════════════════════
          Report Modal
      ════════════════════════════════════════ */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>

            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.backButton} onPress={() => setShowReportModal(false)}>
                <Text style={styles.backButtonText}>✕ Close</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>Report a Fire</Text>
              <Text style={styles.modalSubtitle}>Help us respond quickly to emergencies</Text>
            </View>

            {/* ── Location ── */}
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
                  <Text style={styles.mapInstruction}>Long-press anywhere to drop a pin</Text>
                  <MapView
                    ref={reportMapRef}
                    style={styles.interactiveMap}
                    provider={PROVIDER_DEFAULT}
                    initialRegion={LA_REGION}
                    showsUserLocation
                    onLongPress={(e) => setDroppedPin(e.nativeEvent.coordinate)}
                  >
                    {droppedPin && (
                      <Marker coordinate={droppedPin} pinColor="#EF4444" title="Reported Location" />
                    )}
                  </MapView>
                  {droppedPin && (
                    <Text style={styles.coordinatesText}>
                      {droppedPin.latitude.toFixed(4)}°N, {Math.abs(droppedPin.longitude).toFixed(4)}°W
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* ── Evidence / Attachment ── */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Evidence (Optional)</Text>
              <Text style={styles.sectionDescription}>
                Add a photo or file to help emergency responders
              </Text>

              {attachment ? (
                /* ── Preview card ── */
                <View style={styles.attachmentPreview}>
                  {attachment.type === 'image' ? (
                    <Image
                      source={{ uri: attachment.uri }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.filePreview}>
                      <Text style={styles.filePreviewIcon}>📁</Text>
                      <Text style={styles.filePreviewName} numberOfLines={1}>
                        {attachment.name}
                      </Text>
                    </View>
                  )}

                  <View style={styles.attachmentActions}>
                    <TouchableOpacity style={styles.attachmentActionBtn} onPress={handleAttachmentPress}>
                      <Text style={styles.attachmentActionText}>Replace</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.attachmentActionBtn, styles.attachmentActionBtnDanger]}
                      onPress={() => setAttachment(null)}
                    >
                      <Text style={[styles.attachmentActionText, styles.attachmentActionTextDanger]}>
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                /* ── Three option tiles ── */
                <View style={styles.attachmentOptions}>
                  <TouchableOpacity style={styles.attachmentTile} onPress={handleTakePhoto}>
                    <Text style={styles.attachmentTileIcon}>📷</Text>
                    <Text style={styles.attachmentTileLabel}>Take a{'\n'}Photo</Text>
                    <Text style={styles.attachmentTileSub}>Open camera</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.attachmentTile} onPress={handlePickFromLibrary}>
                    <Text style={styles.attachmentTileIcon}>🖼</Text>
                    <Text style={styles.attachmentTileLabel}>Camera{'\n'}Roll</Text>
                    <Text style={styles.attachmentTileSub}>Choose image</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.attachmentTile} onPress={handlePickFile}>
                    <Text style={styles.attachmentTileIcon}>📁</Text>
                    <Text style={styles.attachmentTileLabel}>Upload{'\n'}File</Text>
                    <Text style={styles.attachmentTileSub}>Any file type</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* ── Description ── */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Additional Details (Optional)</Text>
              <Text style={styles.sectionDescription}>Describe what you're seeing</Text>
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

            {/* Notice */}
            <View style={styles.noticeContainer}>
              <Text style={styles.noticeIcon}>ℹ️</Text>
              <View style={styles.noticeContent}>
                <Text style={styles.noticeTitle}>Important</Text>
                <Text style={styles.noticeText}>
                  If you are in immediate danger, call 911 first. This report will alert our AI model and local authorities immediately.
                </Text>
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Submitting…' : 'Submit Report'}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  titleContainer: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 12 },
  title: { fontSize: 42, fontWeight: '300', color: '#111827', letterSpacing: -0.5, marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#6B7280', fontWeight: '400' },

  statsContainer: { flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 20, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  statNumber: { fontSize: 32, fontWeight: '300', color: '#111827', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#6B7280', fontWeight: '500' },

  mapWidget: {
    marginHorizontal: 24, marginTop: 8, backgroundColor: '#FFFFFF',
    borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  mapHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  mapTitle: { fontSize: 16, fontWeight: '500', color: '#111827' },
  locationButton: { width: 36, height: 36, backgroundColor: '#F3F4F6', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  locationDot: { width: 10, height: 10, backgroundColor: '#3B82F6', borderRadius: 5, borderWidth: 2, borderColor: '#BFDBFE' },
  loadingContainer: { height: 300, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' },
  loadingText: { color: '#9CA3AF', fontSize: 14 },
  map: { height: 300, width: '100%' },

  markerOuter: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  markerIcon: { fontSize: 18 },
  evacuationBadge: {
    position: 'absolute', top: -3, right: -3, backgroundColor: '#DC2626',
    width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#FFFFFF',
  },
  evacuationIcon: { fontSize: 8, color: '#FFF' },

  calloutContainer: { width: 200, padding: 10 },
  calloutName: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 3 },
  calloutDetail: { fontSize: 12, color: '#6B7280' },
  calloutEvac: { fontSize: 11, color: '#DC2626', fontWeight: '600', marginTop: 4 },

  mapFooter: { paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#F9FAFB', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  mapFooterText: { fontSize: 12, color: '#9CA3AF', textAlign: 'center' },

  reportButton: { marginHorizontal: 24, marginTop: 24, backgroundColor: '#111827', borderRadius: 16, paddingVertical: 20, paddingHorizontal: 24, alignItems: 'center' },
  reportButtonText: { fontSize: 18, fontWeight: '500', color: '#FFFFFF', marginBottom: 4, letterSpacing: -0.2 },
  reportButtonSubtext: { fontSize: 13, color: '#9CA3AF', fontWeight: '400' },

  filterSection: { paddingHorizontal: 24, paddingTop: 32 },
  filterTitle: { fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  filterContainer: { flexDirection: 'row', gap: 8 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6' },
  filterButtonActive: { backgroundColor: '#111827' },
  filterButtonText: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  filterButtonTextActive: { color: '#FFFFFF' },

  incidentsSection: { paddingHorizontal: 24, paddingTop: 32 },
  incidentsTitle: { fontSize: 22, fontWeight: '400', color: '#111827', marginBottom: 16, letterSpacing: -0.3 },
  incidentCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  incidentCardSelected: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  incidentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  incidentInfo: { flex: 1 },
  incidentTime: { fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  incidentName: { fontSize: 17, fontWeight: '500', color: '#111827', marginBottom: 3 },
  incidentLocation: { fontSize: 13, color: '#6B7280' },
  incidentIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  incidentIconText: { fontSize: 26 },
  incidentStats: { flexDirection: 'row', gap: 16, marginTop: 8 },
  incidentStat: { fontSize: 13, color: '#6B7280' },
  evacuationWarning: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 10, padding: 8, marginTop: 10 },
  evacuationWarningText: { color: '#DC2626', fontSize: 12, fontWeight: '600' },

  modalContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  modalHeader: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 12 },
  backButton: { alignSelf: 'flex-start' },
  backButtonText: { fontSize: 16, color: '#111827', fontWeight: '500' },
  modalTitleContainer: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32 },
  modalTitle: { fontSize: 42, fontWeight: '300', color: '#111827', letterSpacing: -0.5, marginBottom: 8 },
  modalSubtitle: { fontSize: 16, color: '#6B7280', fontWeight: '400' },

  section: { paddingHorizontal: 24, marginBottom: 32 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionDescription: { fontSize: 14, color: '#6B7280', marginBottom: 16 },

  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#111827' },

  mapToggleButton: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  mapToggleText: { fontSize: 15, fontWeight: '500', color: '#111827' },
  mapContainer: { marginTop: 16 },
  mapInstruction: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 12 },
  interactiveMap: { height: 280, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  coordinatesText: { fontSize: 12, color: '#6B7280', textAlign: 'center', marginTop: 12 },

  // Three attachment tiles
  attachmentOptions: { flexDirection: 'row', gap: 10 },
  attachmentTile: {
    flex: 1, backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#E5E7EB',
    borderRadius: 16, paddingVertical: 20, alignItems: 'center', gap: 5,
  },
  attachmentTileIcon: { fontSize: 28 },
  attachmentTileLabel: { fontSize: 12, fontWeight: '600', color: '#111827', textAlign: 'center' },
  attachmentTileSub: { fontSize: 11, color: '#9CA3AF', textAlign: 'center' },

  // Attachment preview card
  attachmentPreview: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, overflow: 'hidden' },
  previewImage: { width: '100%', height: 200 },
  filePreview: { height: 120, alignItems: 'center', justifyContent: 'center', gap: 8 },
  filePreviewIcon: { fontSize: 40 },
  filePreviewName: { fontSize: 14, color: '#374151', fontWeight: '500', paddingHorizontal: 16 },
  attachmentActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  attachmentActionBtn: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  attachmentActionBtnDanger: { borderLeftWidth: 1, borderLeftColor: '#E5E7EB' },
  attachmentActionText: { fontSize: 14, fontWeight: '500', color: '#111827' },
  attachmentActionTextDanger: { color: '#EF4444' },

  textArea: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#111827', minHeight: 120 },

  noticeContainer: { flexDirection: 'row', backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FDE68A', borderRadius: 12, padding: 16, marginHorizontal: 24, marginBottom: 24, gap: 12 },
  noticeIcon: { fontSize: 20 },
  noticeContent: { flex: 1 },
  noticeTitle: { fontSize: 14, fontWeight: '600', color: '#92400E', marginBottom: 4 },
  noticeText: { fontSize: 13, color: '#78350F', lineHeight: 18 },

  submitButton: { marginHorizontal: 24, backgroundColor: '#111827', borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  submitButtonDisabled: { backgroundColor: '#6B7280' },
  submitButtonText: { fontSize: 17, fontWeight: '600', color: '#FFFFFF', letterSpacing: -0.2 },
});

// npx expo install expo-image-picker expo-document-picker expo-notifications
