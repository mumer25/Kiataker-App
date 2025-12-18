import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

const sickVisitItems = [
  'Sore throat (only)',
  'Sinus symptoms (only)',
  'Cold symptoms (multiple)',
  'Painful rash (sensitive rash)',
  'Contact with poison ivy',
  'Yeast after antibiotic use',
  'Tick bite',
  'Toothache',
  'Acne',
];

// Sort alphabetically
const sortedSickVisitItems = sickVisitItems.sort((a, b) => a.localeCompare(b));

export default function SickVisitScreen() {
  const handleItemPress = (item) => {
    Alert.alert('Selected', item); // replace with navigation or any action
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.header}>Sick Visit</Text>
      <Text style={styles.subText}>
        Get personalized science-backed clinical treatment for common illnesses.
      </Text>

      {sortedSickVisitItems.map((item, index) => (
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

// const sickVisitItems = [
//   'Sore throat (only)',
//   'Sinus symptoms (only)',
//   'Cold symptoms (multiple)',
//   'Painful rash (sensitive rash)',
//   'Contact with poison ivy',
//   'Yeast after antibiotic use',
//   'Tick bite',
//   'Toothache',
//   'Acne',
// ];

// export default function SickVisitScreen() {
//   const handleItemPress = (item) => {
//     Alert.alert('Selected', item); // replace with navigation or any action
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
//       <Text style={styles.header}>Sick Visit</Text>
//      <Text style={styles.subText}>
//   Get personalized guidance for common illnesses and medication management.
// </Text>


//       {sickVisitItems.map((item, index) => (
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
