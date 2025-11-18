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
};

export const FireMarker = ({ fire, onPress }) => {
  // Component for rendering fire marker on map
  // This is primarily used for data structure; the actual map marker is handled by MapScreen
  return (
    <TouchableOpacity onPress={onPress} style={styles.marker}>
      <Text style={styles.markerText}>🔥</Text>
    </TouchableOpacity>
  );
};

// Expanded fire detail card shown when marker is tapped
export const FireDetailCard = ({ fire, onMarkViewed, onClose }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card style={styles.detailCard}>
      <Card.Content style={styles.cardContent}>
        <Text style={styles.cardTitle}>🔥 Fire Alert</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Latitude:</Text>
          <Text style={styles.value}>{fire.latitude.toFixed(6)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Longitude:</Text>
          <Text style={styles.value}>{fire.longitude.toFixed(6)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Detected:</Text>
          <Text style={styles.value}>{formatDate(fire.timestamp)}</Text>
        </View>

        {fire.confidence && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Confidence:</Text>
            <Text style={styles.value}>
              {(fire.confidence * 100).toFixed(0)}%
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            onMarkViewed(fire.id);
            onClose();
          }}
        >
          <Text style={styles.buttonText}>Mark as Viewed</Text>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  marker: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerText: {
    fontSize: 28,
  },
  detailCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  label: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    textAlign: 'right',
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FireMarker;
