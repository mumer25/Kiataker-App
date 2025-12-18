import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

const medicationItems = [
  'Hypertension (high blood pressure)',
  'Asthma (COPD)',
  'Hypothyroid (thyroid disorders)',
  'Herpes outbreak',
  'Hyperlipidemia (high cholesterol)',
  'Atopic dermatitis (eczema)',
  'Migraines',
  'Seasonal allergies',
  'Diabetes (on meds)',
];

// Sort alphabetically
const sortedMedications = medicationItems.sort((a, b) => a.localeCompare(b));

export default function MedicationRefillScreen() {
  const handleItemPress = (item) => {
    Alert.alert('Selected Medication', item); 
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.header}>Medication Refill</Text>
      <Text style={styles.subText}>
        Get recommendations and request medication refills for your current prescriptions.
      </Text>

      {sortedMedications.map((item, index) => (
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





// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

// const medicationItems = [
//   'Hypertension (high blood pressure)',
//   'Asthma (COPD)',
//   'Hypothyroid (thyroid disorders)',
//   'Herpes outbreak',
//   'Hyperlipidemia (high cholesterol)',
//   'Atopic dermatitis (eczema)',
//   'Migraines',
//   'Seasonal allergies',
//   'Diabetes (on meds)',
// ];

// export default function MedicationRefillScreen() {
//   const handleItemPress = (item) => {
//     Alert.alert('Selected Medication', item); 
//     // You can replace this with navigation or any action
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
//       <Text style={styles.header}>Medication Refill</Text>
//       <Text style={styles.subText}>
//         Get recommendations and request refills for your current prescriptions safely and efficiently.
//       </Text>

//       {medicationItems.map((item, index) => (
//         <TouchableOpacity
//           key={index}
//           style={styles.itemContainer}
//           onPress={() => handleItemPress(item)}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.itemText}>{item}</Text>
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#8B0000',
//     marginBottom: 8,
//   },
//   subText: {
//     fontSize: 15,
//     color: '#555',
//     lineHeight: 22,
//     marginBottom: 20,
//   },
//   itemContainer: {
//     backgroundColor: '#f9f9f9',
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 1,
//   },
//   itemText: {
//     fontSize: 16,
//     color: '#555',
//   },
// });
