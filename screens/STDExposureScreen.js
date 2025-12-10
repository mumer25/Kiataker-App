import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function STDExposureScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>STD Exposure</Text>
      <Text style={styles.text}>
        Confidential care and guidance in case of STD exposure.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 10 },
  text: { fontSize: 15, color: '#555', lineHeight: 22 },
});
