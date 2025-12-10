import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MedicationRefillScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medication Refill</Text>
      <Text style={styles.text}>
        Request refills for your existing prescriptions in simple steps.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 10 },
  text: { fontSize: 15, color: '#555', lineHeight: 22 },
});
