import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Modal } from 'react-native';

export default function AlertsScreen() {
  const [filter, setFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const alerts = [
    {
      id: 1,
      time: '9:00 AM, TODAY',
      name: 'Garment Shop',
      address: '1234, 2nd St, North Avenue.',
      type: 'fire',
      severity: 'high',
      icon: '🔥',
      color: '#F97316',
      coordinates: '34.0522°N, 118.2437°W',
      distance: '0.8 miles',
      description: 'This fire seems to be near you. Immediate evacuation recommended for residents within 1 mile radius.',
    },
    {
      id: 2,
      time: '9:20 AM, TODAY',
      name: 'City Museum',
      address: '1234, 2nd St, North Avenue.',
      type: 'medical',
      severity: 'critical',
      icon: '🏥',
      color: '#EF4444',
      coordinates: '34.0489°N, 118.2501°W',
      distance: '1.2 miles',
      description: 'Medical emergency reported in the area. Emergency services are on site.',
    },
    {
      id: 3,
      time: '9:00 AM, TODAY',
      name: 'Jwellery Store',
      address: '1234, 2nd St, North Avenue.',
      type: 'police',
      severity: 'moderate',
      icon: '🛡️',
      color: '#EAB308',
      coordinates: '34.0550°N, 118.2400°W',
      distance: '2.1 miles',
      description: 'Police activity reported. Avoid the area if possible.',
    },
    {
      id: 4,
      time: '9:20 AM, TODAY',
      name: 'Houston Zoo',
      address: '1234, 2nd St, North Avenue.',
      type: 'accident',
      severity: 'moderate',
      icon: '🚗',
      color: '#06B6D4',
      coordinates: '34.0478°N, 118.2520°W',
      distance: '3.5 miles',
      description: 'Traffic accident causing delays. Seek alternate routes.',
    },
    {
      id: 5,
      time: '8:45 AM, TODAY',
      name: 'Downtown Plaza',
      address: '5678, Main St, Central District.',
      type: 'fire',
      severity: 'critical',
      icon: '🔥',
      color: '#F97316',
      coordinates: '34.0420°N, 118.2470°W',
      distance: '0.3 miles',
      description: 'This fire seems to be near you. Evacuate immediately and follow official guidance.',
    },
    {
      id: 6,
      time: '8:30 AM, TODAY',
      name: 'Riverside Park',
      address: '9012, Park Ave, East Side.',
      type: 'medical',
      severity: 'moderate',
      icon: '🏥',
      color: '#EF4444',
      coordinates: '34.0600°N, 118.2350°W',
      distance: '4.2 miles',
      description: 'Medical emergency in progress. Emergency services responding.',
    },
  ];

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'critical') return alert.severity === 'critical';
    if (filter === 'today') return alert.time.includes('TODAY');
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
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

      {/* Alerts List */}
      <ScrollView 
        style={styles.alertsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredAlerts.map((alert) => (
          <TouchableOpacity 
            key={alert.id} 
            style={styles.alertCard}
            onPress={() => setSelectedAlert(alert)}
          >
            <View style={styles.alertContent}>
              <View style={styles.alertInfo}>
                <Text style={styles.alertTime}>{alert.time}</Text>
                <Text style={styles.alertName}>{alert.name}</Text>
                <Text style={styles.alertAddress}>{alert.address}</Text>
              </View>
              
              <View style={[styles.alertIconContainer, { backgroundColor: alert.color }]}>
                <Text style={styles.alertIcon}>{alert.icon}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.menuDots}>
              <Text style={styles.menuDotsText}>⋯</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={selectedAlert !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedAlert(null)}
      >
        {selectedAlert && (
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setSelectedAlert(null)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Image Placeholder */}
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderIcon}>{selectedAlert.icon}</Text>
                <Text style={styles.imagePlaceholderText}>Image Placeholder</Text>
              </View>

              {/* Content */}
              <View style={styles.modalContent}>
                <View style={styles.modalTitleSection}>
                  <Text style={styles.modalTitle}>{selectedAlert.name}</Text>
                  <Text style={styles.modalAddress}>{selectedAlert.address}</Text>
                  <Text style={styles.modalTime}>{selectedAlert.time}</Text>
                </View>

                {/* Distance Badge */}
                <View style={styles.distanceBadge}>
                  <Text style={styles.distanceText}>📍 {selectedAlert.distance} away</Text>
                </View>

                {/* Coordinates */}
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Coordinates</Text>
                  <Text style={styles.infoValue}>{selectedAlert.coordinates}</Text>
                </View>

                {/* Description */}
                <View style={styles.descriptionSection}>
                  <Text style={styles.descriptionText}>{selectedAlert.description}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Explore Evacuation Routes</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Resources & Help</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
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
});

