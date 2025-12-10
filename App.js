import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { supabase } from "./supabase";

import LandingScreen from "./screens/LandingScreen";
import LoginScreen from "./screens/LoginScreen";
import CreateProfileScreen from "./screens/CreateProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import TwoFactorScreen from "./screens/TwoFactorScreen";
import SickVisitScreen from "./screens/SickVisitScreen";
import MedicationRefillScreen from "./screens/MedicationRefillScreen";
import STDExposureScreen from "./screens/STDExposureScreen";
import EmergencyScreen from "./screens/EmergencyScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userSession, setUserSession] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Get current session from Supabase
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) setUserSession(session.user);

        // Check if 2FA was verified previously
        const verified = await AsyncStorage.getItem("@2faVerified");
        setIsVerified(verified === "true");
      } catch (e) {
        console.log("Initialization error:", e);
      } finally {
        setLoading(false);
      }
    };

    initialize();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUserSession(session.user);
        } else {
          setUserSession(null);
          setIsVerified(false);
          AsyncStorage.removeItem("@2faVerified");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  // Determine initial route based on login & verification
  const initialRoute = userSession && isVerified ? "Home" : "Landing";

  return (
    <NavigationContainer>
     <Stack.Navigator
  screenOptions={{ headerShown: false }}
  initialRouteName={userSession && isVerified ? "Home" : "Landing"}
>
  {/* Landing and Auth Screens */}
  <Stack.Screen name="Landing" component={LandingScreen} />
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Create Profile" component={CreateProfileScreen} />

  {/* 2FA Screen */}
  {userSession && !isVerified && (
    <Stack.Screen name="TwoFactorScreen">
      {(props) => <TwoFactorScreen {...props} setIsVerified={setIsVerified} />}
    </Stack.Screen>
  )}

  {/* Home Screen */}
  {userSession && isVerified && <Stack.Screen name="Home" component={HomeScreen} />}

  {/* Bottom tabs/screens accessible for all users */}
  <Stack.Screen name="SickVisit" component={SickVisitScreen} />
  <Stack.Screen name="MedicationRefill" component={MedicationRefillScreen} />
  <Stack.Screen name="STDExposure" component={STDExposureScreen} />
  <Stack.Screen name="Emergency" component={EmergencyScreen} />
</Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFD",
  },
});







// import React, { useState, useEffect } from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { View, ActivityIndicator, StyleSheet } from "react-native";
// import { supabase } from "./supabase";

// import LandingScreen from "./screens/LandingScreen";
// import LoginScreen from "./screens/LoginScreen";
// import CreateProfileScreen from "./screens/CreateProfileScreen";
// import HomeScreen from "./screens/HomeScreen";
// import TwoFactorScreen from "./screens/TwoFactorScreen";
// import SickVisitScreen from "./screens/SickVisitScreen";
// import MedicationRefillScreen from "./screens/MedicationRefillScreen";
// import STDExposureScreen from "./screens/STDExposureScreen";
// import EmergencyScreen from "./screens/EmergencyScreen";

// const Stack = createNativeStackNavigator();

// export default function App() {
//   const [loading, setLoading] = useState(true);
//   const [userSession, setUserSession] = useState(null);
//   const [isVerified, setIsVerified] = useState(false);

//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         const {
//           data: { session },
//         } = await supabase.auth.getSession();
//         if (session?.user) setUserSession(session.user);

//         const verified = await AsyncStorage.getItem("@2faVerified");
//         setIsVerified(verified === "true");
//       } catch (e) {
//         console.log("Initialization error:", e);
//       } finally {
//         setLoading(false); // ✅ Only stop loading after session check
//       }
//     };

//     initialize();

//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         if (session?.user) setUserSession(session.user);
//         else {
//           setUserSession(null);
//           setIsVerified(false);
//           AsyncStorage.removeItem("@2faVerified");
//         }
//       }
//     );

//     return () => listener.subscription.unsubscribe();
//   }, []);

//   // ✅ Show full splash until we know user session
//   if (loading) {
//     return (
//       <View style={styles.splash}>
//         <ActivityIndicator size="large" color="#1565C0" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {!userSession && (
//           <>
//             <Stack.Screen name="Landing" component={LandingScreen} />
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="Create Profile" component={CreateProfileScreen} />
//           </>
//         )}

//         {userSession && !isVerified && (
//           <Stack.Screen name="TwoFactorScreen">
//             {(props) => (
//               <TwoFactorScreen {...props} setIsVerified={setIsVerified} />
//             )}
//           </Stack.Screen>
//         )}

//         {userSession && isVerified && (
//           <Stack.Screen name="Home" component={HomeScreen} />
//         )}

//         <Stack.Screen name="SickVisit" component={SickVisitScreen} />
//         <Stack.Screen
//           name="MedicationRefill"
//           component={MedicationRefillScreen}
//         />
//         <Stack.Screen name="STDExposure" component={STDExposureScreen} />
//         <Stack.Screen name="Emergency" component={EmergencyScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   splash: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F7FAFD",
//   },
// });

// // App.js
// import React from 'react';
// import AppNavigator from './navigation/AppNavigator';

// export default function App() {
//   return <AppNavigator />;
// }
