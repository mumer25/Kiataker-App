import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { supabase } from '../supabase';

const { width } = Dimensions.get('window');
const BRAND_RED = '#8B0000';

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
    if (error) console.log(error);
    else setHistory(data);
  };

  // Utility to format values (arrays, JSON strings, or plain strings)
  const formatValue = (val) => {
    if (!val) return '—';

    if (Array.isArray(val)) return val.join(', ');

    if (typeof val === 'string') {
      // Try parsing JSON string
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.join(', ');
      } catch (err) {
        // fallback: maybe comma-separated string already
        return val.split(',').map((v) => v.trim()).join(', ');
      }
    }

    return val.toString();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile Change History</Text>

      {history.length === 0 && (
        <Text style={styles.noDataText}>No profile changes found.</Text>
      )}

      {history.map((item) => (
        <View key={item.id} style={styles.card}>
          {Object.entries(item.changes).map(([field, change]) => (
            <View key={field} style={styles.changeRow}>
              <Text style={styles.field}>{field}</Text>
              <View style={styles.valuesContainer}>
                <Text style={styles.oldValue}>{formatValue(change.old)}</Text>
                <Text style={styles.arrow}> to </Text>
                <Text style={styles.newValue}>{formatValue(change.new)}</Text>
              </View>
            </View>
          ))}
          <Text style={styles.date}>
            {new Date(item.changed_at).toLocaleString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 50,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: BRAND_RED,
    textAlign: 'center',
    marginVertical: 15,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  changeRow: {
    marginBottom: 12,
  },
  field: {
    fontWeight: '600',
    fontSize: 15,
    color: '#555',
    marginBottom: 5,
  },
  valuesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oldValue: {
    flex: 1,
    fontSize: 14,
    color: '#999',
    backgroundColor: '#f0f0f0',
    padding: 6,
    borderRadius: 6,
    textAlign: 'center',
  },
  arrow: {
    fontSize: 16,
    color: BRAND_RED,
    marginHorizontal: 6,
    fontWeight: 'bold',
  },
  newValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_RED,
    backgroundColor: '#ffe5e5',
    padding: 6,
    borderRadius: 6,
    textAlign: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    textAlign: 'right',
  },
});
