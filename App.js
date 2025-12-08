import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from './supabase';

import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import TwoFactorScreen from './screens/TwoFactorScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userSession, setUserSession] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) setUserSession(session.user);

        const verified = await AsyncStorage.getItem('@2faVerified');
        setIsVerified(verified === 'true');
      } catch (e) {
        console.log('Initialization error:', e);
      } finally {
        setLoading(false); // ✅ Only stop loading after session check
      }
    };

    initialize();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUserSession(session.user);
      else {
        setUserSession(null);
        setIsVerified(false);
        AsyncStorage.removeItem('@2faVerified');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // ✅ Show full splash until we know user session
  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userSession && (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}

        {userSession && !isVerified && (
          <Stack.Screen name="TwoFactorScreen">
            {props => <TwoFactorScreen {...props} setIsVerified={setIsVerified} />}
          </Stack.Screen>
        )}

        {userSession && isVerified && (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFD',
  },
});





// // App.js
// import React from 'react';
// import AppNavigator from './navigation/AppNavigator';

// export default function App() {
//   return <AppNavigator />;
// }
