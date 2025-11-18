import React, { useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Card } from 'react-native-paper';
import BottomSheet, {
  useBottomSheetAnimatedPosition,
  useBottomSheetInternal,
} from '@react-native-community/hooks';
import AlertCard from './AlertCard';

const COLORS = {
  primary: '#FF4D2E',
  white: '#FFFFFF',
  gray: '#F5F5F5',
  darkGray: '#333333',
  lightGray: '#EEEEEE',
  border: '#DDDDDD',
};

export const AlertsPanel = ({
  alerts,
  activeFireCount,
  unreadCount,
  onAlertPress,
  onMarkAsRead,
  onRefresh,
  refreshing = false,
}) => {
  const sortedAlerts = useMemo(() => {
    return [...alerts].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [alerts]);

  return (
    <View style={styles.container}>
      {/* Header Statistics */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statNumber}>{activeFireCount}</Text>
            <Text style={styles.statLabel}>Active Fires</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statNumber, { color: COLORS.primary }]}>
              {unreadCount}
            </Text>
            <Text style={styles.statLabel}>Unread Alerts</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Alerts List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Alerts</Text>

        {alerts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No alerts yet</Text>
            <Text style={styles.emptySubtext}>
              Stay tuned for fire detection updates
            </Text>
          </View>
        ) : (
          <ScrollView
            scrollEnabled={true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.primary}
              />
            }
            style={styles.alertsList}
            showsVerticalScrollIndicator={false}
          >
            {sortedAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onPress={() => onAlertPress(alert)}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
            <View style={styles.listBottom} />
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: COLORS.gray,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    fontWeight: '500',
  },
  section: {
    flex: 1,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkGray,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.gray,
  },
  alertsList: {
    flex: 1,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#999999',
    marginTop: 8,
  },
  listBottom: {
    height: 20,
  },
});

export default AlertsPanel;
