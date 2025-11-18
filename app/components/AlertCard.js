import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';

const COLORS = {
  primary: '#FF4D2E',
  white: '#FFFFFF',
  gray: '#F5F5F5',
  darkGray: '#333333',
  lightGray: '#EEEEEE',
  border: '#DDDDDD',
  unreadBg: '#FFF5F2',
};

export const AlertCard = ({ alert, onPress, onMarkAsRead }) => {
  const formatDate = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now - alertTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        !alert.read && styles.cardUnread,
      ]}
    >
      <Card style={[
        styles.innerCard,
        !alert.read && styles.innerCardUnread,
      ]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.header}>
            <Text style={styles.icon}>🔥</Text>
            <Text style={styles.title}>Fire Detected</Text>
            {!alert.read && <View style={styles.badge} />}
          </View>

          <Text style={styles.message} numberOfLines={2}>
            {alert.message}
          </Text>

          <View style={styles.footer}>
            <Text style={styles.timestamp}>{formatDate(alert.timestamp)}</Text>
            {!alert.read && (
              <TouchableOpacity
                onPress={() => onMarkAsRead(alert.id)}
                style={styles.markReadBtn}
              >
                <Text style={styles.markReadText}>Mark Read</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 10,
  },
  cardUnread: {
    backgroundColor: COLORS.unreadBg,
  },
  innerCard: {
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  innerCardUnread: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  cardContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darkGray,
    flex: 1,
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  message: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#999999',
  },
  markReadBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  markReadText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },
});

export default AlertCard;
