import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { AlertsPanel } from '../components/AlertsPanel';
import useFireData from '../hooks/useFireData';

const COLORS = {
  primary: '#FF4D2E',
  white: '#FFFFFF',
};

const { height } = Dimensions.get('window');

export const AlertsScreen = ({ navigation }) => {
  const {
    fires,
    alerts,
    loading,
    unreadCount,
    activeFireCount,
    refetch,
    handleAlertRead,
  } = useFireData(10000);

  const [refreshing, setRefreshing] = useState(false);

  const handleAlertPress = (alert) => {
    // Navigate to map and zoom to fire location
    navigation.navigate('MapScreen');
    // The map screen would need to handle receiving fire location data via route params
    // For now, this serves as navigation placeholder
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && alerts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AlertsPanel
        alerts={alerts}
        activeFireCount={activeFireCount}
        unreadCount={unreadCount}
        onAlertPress={handleAlertPress}
        onMarkAsRead={handleAlertRead}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AlertsScreen;
