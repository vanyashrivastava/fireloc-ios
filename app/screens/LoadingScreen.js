import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

const COLORS = {
  primary: '#FF4D2E',
  white: '#FFFFFF',
  darkGray: '#333333',
};

const { height } = Dimensions.get('window');

export const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🔥</Text>
        <Text style={styles.appName}>FireLoc</Text>
        <Text style={styles.subtitle}>Loading Fire Data…</Text>
      </View>

      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={styles.loader}
      />

      <Text style={styles.footer}>Stay Alert, Stay Safe</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '500',
  },
  loader: {
    marginVertical: 32,
  },
  footer: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});

export default LoadingScreen;
