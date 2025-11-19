import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Alert,
} from 'react-native';
// Note: We'll use a mocked Slider for pure React Native code consistency within the Modal
import Slider from '@react-native-community/slider';

// --- Subpage/Modal Components ---

const ConfidenceThresholdModal = ({ isVisible, onClose, currentThreshold, setThreshold }) => {
  const [tempThreshold, setTempThreshold] = useState(currentThreshold);

  const handleSave = () => {
    setThreshold(tempThreshold);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalHeader}>
          <TouchableOpacity style={modalStyles.backButton} onPress={onClose}>
            <Text style={modalStyles.backButtonText}>✕ Close</Text>
          </TouchableOpacity>
        </View>

        <View style={modalStyles.content}>
          <Text style={modalStyles.modalTitle}>AI Alert Confidence</Text>
          <Text style={modalStyles.modalSubtitle}>
            Set the minimum certainty level the AI must meet to send you a notification.
          </Text>

          {/* Display Value */}
          <View style={modalStyles.displayValueContainer}>
            <Text style={modalStyles.displayValue}>{Math.round(tempThreshold)}%</Text>
          </View>

          {/* Slider Control */}
          <Slider
            style={modalStyles.slider}
            minimumValue={60}
            maximumValue={100}
            step={5}
            value={tempThreshold}
            onValueChange={setTempThreshold}
            minimumTrackTintColor="#111827"
            maximumTrackTintColor="#D1D5DB"
            thumbTintColor="#111827"
          />

          <View style={modalStyles.minMaxText}>
            <Text style={modalStyles.minText}>60% (More Alerts)</Text>
            <Text style={modalStyles.maxText}>100% (Fewer Alerts)</Text>
          </View>
          
          <Text style={modalStyles.infoText}>
            A lower threshold means you'll receive more alerts, including potential false positives. 
            A higher threshold ensures greater accuracy.
          </Text>

          <TouchableOpacity style={modalStyles.saveButton} onPress={handleSave}>
            <Text style={modalStyles.saveButtonText}>Save Threshold</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// --- Main Settings Component ---

export default function SettingsScreen() {
  const [threshold, setThreshold] = useState(90);
  const [showThresholdModal, setShowThresholdModal] = useState(false);

  const navigateToSubpage = (settingName, content) => {
    Alert.alert(
      `${settingName} Details`, 
      content,
      [{ text: 'OK' }]
    );
  };
  
  // Custom Settings Item component for the consistent look
  const SettingsItem = ({ icon, text, subtext, onPress }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <Text style={styles.itemIcon}>{icon}</Text>
        <View>
          <Text style={styles.itemText}>{text}</Text>
          {subtext && <Text style={styles.itemSubtext}>{subtext}</Text>}
        </View>
      </View>
      <Text style={styles.itemChevron}>&gt;</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your preferences and security</Text>
        </View>

        {/* Search Bar Placeholder */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchText}>Search for a setting...</Text>
        </View>

        {/* Section 1: Account & Core */}
        <View style={styles.section}>
          <SettingsItem 
            icon="👤" 
            text="Account" 
            onPress={() => navigateToSubpage(
              'Account',
              'View/Edit Profile, Username, Email, and link connected services (e.g., Google Fit).'
            )} 
          />
          <SettingsItem 
            icon="🔔" 
            text="Notifications" 
            onPress={() => navigateToSubpage(
              'Notifications',
              'Manage Push Alerts, SMS/Email preferences, and quiet hours.'
            )} 
          />
          <SettingsItem 
            icon="👁️" 
            text="Appearance" 
            onPress={() => navigateToSubpage(
              'Appearance',
              'Toggle between Light Mode and Dark Mode.'
            )} 
          />
        </View>

        {/* Section 2: AI Control & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Alert Preferences</Text>
          <SettingsItem 
            icon="🧠" 
            text="AI Confidence Threshold" 
            subtext={`${Math.round(threshold)}% minimum certainty`}
            onPress={() => setShowThresholdModal(true)} 
          />
          <SettingsItem 
            icon="🔒" 
            text="Privacy & Security" 
            onPress={() => navigateToSubpage(
              'Privacy & Security',
              'Review and update data usage permissions and security settings.'
            )} 
          />
        </View>

        {/* Section 3: Support & Info */}
        <View style={styles.section}>
          <SettingsItem 
            icon="🎧" 
            text="Help and Support" 
            onPress={() => navigateToSubpage(
              'Help and Support',
              'Access FAQs, Tutorials, and contact Support Team.'
            )} 
          />
          <SettingsItem 
            icon="❓" 
            text="About FireLoc" 
            onPress={() => navigateToSubpage(
              'About FireLoc',
              'FireLoc uses YOLOv8n models running on Android phones to detect wildfires across the LA area. We are proudly working under the Center for AI in Society at USC.'
            )} 
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      
      {/* Confidence Threshold Modal */}
      <ConfidenceThresholdModal
        isVisible={showThresholdModal}
        onClose={() => setShowThresholdModal(false)}
        currentThreshold={threshold}
        setThreshold={setThreshold}
      />
    </View>
  );
}

// --- Main Settings Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  // TITLE STYLE MATCHING 'Fire Map' and 'Incidents'
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  section: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F9FAFB', 
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 20,
    marginRight: 16,
    color: '#111827',
  },
  itemText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '400',
  },
  itemSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  itemChevron: {
    fontSize: 18,
    color: '#D1D5DB',
    fontWeight: '600',
  },
});


// --- Modal Styles ---

const modalStyles = StyleSheet.create({
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
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: '400',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
    marginBottom: 32,
  },
  displayValueContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F3F4F6',
    paddingVertical: 30,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  displayValue: {
    fontSize: 60,
    fontWeight: '200',
    color: '#111827',
    letterSpacing: -1,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  minMaxText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 20,
  },
  minText: {
    fontSize: 13,
    color: '#6B7280',
  },
  maxText: {
    fontSize: 13,
    color: '#6B7280',
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  saveButton: {
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});