import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Card } from 'react-native-paper';
import { sendTestNotification } from '../services/notifications';

const COLORS = {
  primary: '#FF4D2E',
  white: '#FFFFFF',
  gray: '#F5F5F5',
  darkGray: '#333333',
  lightGray: '#EEEEEE',
  border: '#DDDDDD',
};

export const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);
  const [refreshRate, setRefreshRate] = React.useState('10');

  const handleTestNotification = async () => {
    try {
      await sendTestNotification(
        'Test Notification',
        'This is a test notification from FireLoc'
      );
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const handleClearCache = () => {
    Alert.alert('Cache Cleared', 'Local cache has been cleared');
  };

  const handleLogout = () => {
    Alert.alert('Logged Out', 'You have been logged out');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <Card style={styles.settingCard}>
          <Card.Content style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive alerts for new fire detections
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </Card.Content>
        </Card>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleTestNotification}
        >
          <Text style={styles.actionButtonText}>📬 Send Test Notification</Text>
        </TouchableOpacity>
      </View>

      {/* Location Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>

        <Card style={styles.settingCard}>
          <Card.Content style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Share Location</Text>
              <Text style={styles.settingDescription}>
                Help improve fire detection accuracy
              </Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </Card.Content>
        </Card>
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>

        <Card style={styles.settingCard}>
          <Card.Content style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Refresh Rate</Text>
              <Text style={styles.settingDescription}>
                How often to check for new fires
              </Text>
            </View>
            <Text style={styles.refreshRateValue}>{refreshRate}s</Text>
          </Card.Content>
        </Card>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleClearCache}
        >
          <Text style={styles.actionButtonText}>🗑️ Clear Cache</Text>
        </TouchableOpacity>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
            🚪 Logout
          </Text>
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>FireLoc v1.0.0</Text>
        <Text style={styles.footerText}>
          Built with React Native & Expo
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray,
    paddingVertical: 12,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingCard: {
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#999999',
  },
  refreshRateValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  dangerButton: {
    backgroundColor: '#FFE5E5',
  },
  dangerButtonText: {
    color: COLORS.primary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
  },
});

export default SettingsScreen;
