import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { supabase } from '../supabase';

const { width } = Dimensions.get('window');
const BRAND_RED = '#8B0000';
const LIGHT_GREEN = '#ccfbc7ff';
const LIGHT_GRAY = '#f0f0f0';
const LIGHT_RED = '#ffe5e5';

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

  // Format values (arrays, JSON strings, or plain strings)
  const formatValue = (val) => {
    if (!val) return '—';
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.join(', ');
      } catch {}
      return val.split(',').map(v => v.trim()).join(', ');
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
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Changes Made</Text>
            <Text style={styles.date}>{new Date(item.changed_at).toLocaleString()}</Text>
          </View>

          {Object.entries(item.changes).map(([field, change]) => (
            <View key={field} style={styles.changeRow}>
              <View style={styles.fieldContainer}>
                <Text style={styles.field}>{field}</Text>
              </View>

              <View style={styles.valuesContainer}>
                <View style={styles.oldValueContainer}>
                  <Text style={styles.oldValue}>{formatValue(change.old)}</Text>
                </View>
                <Text style={styles.arrow}>to</Text>
                <View style={styles.newValueContainer}>
                  <Text style={styles.newValue}>{formatValue(change.new)}</Text>
                </View>
              </View>
            </View>
          ))}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: BRAND_RED,
    textAlign: 'center',
    marginVertical: 20,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  changeRow: {
    marginBottom: 12,
  },
  fieldContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  field: {
    fontWeight: '600',
    fontSize: 14,
    color: BRAND_RED,
  },
  valuesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oldValueContainer: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
  },
  oldValue: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 16,
    color: BRAND_RED,
    fontWeight: 'bold',
  },
  newValueContainer: {
    flex: 1,
    backgroundColor: LIGHT_GREEN,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginLeft: 6,
  },
  newValue: {
    fontSize: 14,
    // color: BRAND_RED,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
  },
});
