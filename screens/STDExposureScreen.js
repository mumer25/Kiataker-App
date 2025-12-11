import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

const stdItems = [
  'Chlamydia',
  'Trichomonas',
  'Chlamydia and Trichomonas',
  'Gonorrhea',
];

export default function STDExposureScreen() {
  const handleItemPress = (item) => {
    Alert.alert('Selected STD', item); 
    // Replace with navigation or action for AI-guided recommendations
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.header}>STD Exposure</Text>
      <Text style={styles.subText}>
        Access confidential care and advice for potential STD exposures safely and discreetly.
      </Text>

      {stdItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.itemContainer}
          onPress={() => handleItemPress(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.itemText}>{item}</Text>
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
