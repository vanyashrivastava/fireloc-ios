// dark-mode-system applied
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />
      <Text style={styles.text}>About Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
  },
  text: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});
