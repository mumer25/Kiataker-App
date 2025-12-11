import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

const emergencyItems = [
  'Chest pain',
  'Shortness of breath',
  'Call 911',
];

export default function EmergencyScreen() {
  const handleItemPress = (item) => {
    if(item === 'Call 911') {
      Alert.alert('Emergency', 'Please dial 911 immediately!');
      // Optionally, you can use Linking to directly call 911 on a real device
    } else {
      Alert.alert('Emergency Symptom', item);
      // Replace with AI-guided recommendations or instructions
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.header}>Emergency</Text>
      <Text style={styles.subText}>
        Immediate assistance and guidance for life-threatening conditions. Follow instructions promptly.
      </Text>

      {emergencyItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.itemContainer, item === 'Call 911' && { backgroundColor: '#ffcccc' }]}
          onPress={() => handleItemPress(item)}
          activeOpacity={0.7}
        >
          <Text style={[styles.itemText, item === 'Call 911' && { color: '#8B0000', fontWeight: '700' }]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#8B0000',
    marginBottom: 8,
  },
  subText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#555',
  },
});
