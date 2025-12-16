import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { supabase } from '../supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const BRAND_RED = '#8B0000';
const LIGHT_GREEN = '#e6f7ec';
const LIGHT_GRAY = '#f5f6f8';

export default function ProfileHistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const { data, error } = await supabase
      .from('profile_changes_history')
      .select('*')
      .order('changed_at', { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setHistory(data || []);
    }
  };

  const formatValue = (val) => {
    if (!val) return '—';

    if (Array.isArray(val)) {
      return val.join(', ');
    }

    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
          return parsed.join(', ');
        }
      } catch {}

      return val
        .split(',')
        .map((v) => v.trim())
        .join(', ');
    }

    return val.toString();
  };

  return (
        <SafeAreaView style={{ flex: 1}} edges={["bottom","left","right"]}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile Change History</Text>

      {history.length === 0 && (
        <Text style={styles.noDataText}>
          No profile changes found.
        </Text>
      )}

      {history.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Profile Updated</Text>
            <Text style={styles.date}>
              {new Date(item.changed_at).toLocaleString()}
            </Text>
          </View>

          <View style={styles.divider} />

          {Object.entries(item.changes).map(
            ([field, change], index, arr) => (
              <View key={field} style={styles.changeRow}>
                <View style={styles.fieldBadge}>
                  <Text style={styles.fieldText}>
                    {field}
                  </Text>
                </View>

                <View style={styles.valuesContainer}>
                  <View style={styles.valueBlock}>
                    <Text style={styles.valueLabel}>
                      Before
                    </Text>
                    <Text style={styles.oldValue}>
                      {formatValue(change.old)}
                    </Text>
                  </View>

                  <View style={styles.valueBlock}>
                    <Text style={styles.valueLabel}>
                      After
                    </Text>
                    <Text style={styles.newValue}>
                      {formatValue(change.new)}
                    </Text>
                  </View>
                </View>

                {index !== arr.length - 1 && (
                  <View style={styles.innerDivider} />
                )}
              </View>
            )
          )}
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f6f8',
  },

  header: {
    fontSize: 26,
    fontWeight: '800',
    color: BRAND_RED,
    textAlign: 'center',
    marginVertical: 20,
    marginTop:0,
  },

  noDataText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: '#777',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  cardHeader: {
    marginBottom: 6,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },

  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },

  changeRow: {
    marginBottom: 14,
  },

  fieldBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },

  fieldText: {
    fontSize: 15,
    fontWeight: '700',
    color: "black",
    textTransform: 'capitalize',
  },

  valuesContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  valueBlock: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 10,
    padding: 12,
  },

  valueLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
  },

  oldValue: {
    fontSize: 14,
    color: '#666',
  },

  newValue: {
    fontSize: 14,
    color: '#1a7f37',
    fontWeight: '600',
  },

  innerDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 14,
  },
});




// import React, { useEffect, useState } from 'react';
// import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
// import { supabase } from '../supabase';

// const { width } = Dimensions.get('window');
// const BRAND_RED = '#8B0000';
// const LIGHT_GREEN = '#ccfbc7ff';
// const LIGHT_GRAY = '#f0f0f0';
// const LIGHT_RED = '#ffe5e5';

// export default function ProfileHistoryScreen() {
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     loadHistory();
//   }, []);

//   const loadHistory = async () => {
//     const { data, error } = await supabase
//       .from('profile_changes_history')
//       .select('*')
//       .order('changed_at', { ascending: false });
//     if (error) console.log(error);
//     else setHistory(data);
//   };

//   // Format values (arrays, JSON strings, or plain strings)
//   const formatValue = (val) => {
//     if (!val) return '—';
//     if (Array.isArray(val)) return val.join(', ');
//     if (typeof val === 'string') {
//       try {
//         const parsed = JSON.parse(val);
//         if (Array.isArray(parsed)) return parsed.join(', ');
//       } catch {}
//       return val.split(',').map(v => v.trim()).join(', ');
//     }
//     return val.toString();
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>Profile Change History</Text>

//       {history.length === 0 && (
//         <Text style={styles.noDataText}>No profile changes found.</Text>
//       )}

//       {history.map((item) => (
//         <View key={item.id} style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Text style={styles.cardTitle}>Changes Made</Text>
//             <Text style={styles.date}>{new Date(item.changed_at).toLocaleString()}</Text>
//           </View>

//           {Object.entries(item.changes).map(([field, change]) => (
//             <View key={field} style={styles.changeRow}>
//               <View style={styles.fieldContainer}>
//                 <Text style={styles.field}>{field}</Text>
//               </View>

//               <View style={styles.valuesContainer}>
//                 <View style={styles.oldValueContainer}>
//                   <Text style={styles.oldValue}>{formatValue(change.old)}</Text>
//                 </View>
//                 <Text style={styles.arrow}>to</Text>
//                 <View style={styles.newValueContainer}>
//                   <Text style={styles.newValue}>{formatValue(change.new)}</Text>
//                 </View>
//               </View>
//             </View>
//           ))}
//         </View>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 15,
//     paddingBottom: 50,
//     backgroundColor: '#f9f9f9',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: BRAND_RED,
//     textAlign: 'center',
//     marginVertical: 20,
//   },
//   noDataText: {
//     textAlign: 'center',
//     marginTop: 50,
//     fontSize: 16,
//     color: '#888',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     marginBottom: 15,
//     padding: 18,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 6 },
//     shadowRadius: 10,
//     elevation: 4,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#333',
//   },
//   changeRow: {
//     marginBottom: 12,
//   },
//   fieldContainer: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 8,
//     alignSelf: 'flex-start',
//     marginBottom: 6,
//   },
//   field: {
//     fontWeight: '600',
//     fontSize: 14,
//     color: BRAND_RED,
//   },
//   valuesContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   oldValueContainer: {
//     flex: 1,
//     backgroundColor: LIGHT_GRAY,
//     borderRadius: 8,
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     marginRight: 6,
//   },
//   oldValue: {
//     fontSize: 14,
//     color: '#666',
//   },
//   arrow: {
//     fontSize: 16,
//     color: BRAND_RED,
//     fontWeight: 'bold',
//   },
//   newValueContainer: {
//     flex: 1,
//     backgroundColor: LIGHT_GREEN,
//     borderRadius: 8,
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     marginLeft: 6,
//   },
//   newValue: {
//     fontSize: 14,
//     // color: BRAND_RED,
//     fontWeight: '600',
//   },
//   date: {
//     fontSize: 12,
//     color: '#999',
//     alignSelf: 'flex-end',
//   },
// });
