// screens/SplashScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Landing'); // Go to Landing after splash
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1565C0" barStyle="light-content" />

      {/* Medical + AI Icon */}
      <MaterialIcons name="health-and-safety" size={80} color="#fff" />

      {/* App Name */}
      <Text style={styles.title}>Kiataker</Text>

      {/* Tagline */}
      <Text style={styles.subtitle}>
        Smart AI-powered clinical assistant
      </Text>

      {/* Loader */}
      <ActivityIndicator size="large" color="#fff" style={{ marginTop: 30 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1565C0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 5,
  },
});
