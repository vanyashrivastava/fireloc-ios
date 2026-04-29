// dark-mode-system applied
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';

const COLORS = {
  primary: '#EF4444',
  white: '#1A1A1A',
  gray: '#242424',
  darkGray: '#FFFFFF',
  lightGray: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.10)',
  unreadBg: '#242424',
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
    shadowOpacity: 0.5,
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
    color: 'rgba(255,255,255,0.55)',
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
    color: 'rgba(255,255,255,0.30)',
  },
  markReadBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 6,
  },
  markReadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default AlertCard;
