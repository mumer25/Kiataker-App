import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const BRAND_RED = "#8B0000";

// Tab data array
const tabs = [
  { title: "Sick Visit", icon: "stethoscope", screen: "Sick Visit" },
  { title: "Medication", icon: "pill", screen: "Medication Refill" },
  { title: "STD Exposure", icon: "alert-circle-outline", screen: "STD Exposure" },
  { title: "Emergency", icon: "ambulance", screen: "Emergency" },
];

export default function LandingScreen({ navigation }) {
  const iconSize = width > 400 ? 42 : 36;
  const tabCardWidth = width > 350 ? "48%" : "100%";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require("../assets/Kiataker-Logo-Landing.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to KiaTaker</Text>

      <Text style={styles.subtitle}>
        Find diseases, get solutions, and manage your health professionally.
      </Text>

      {/* Auth Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.loginBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Create Profile")}
        >
          <Text style={styles.createText}>Create Profile</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.helpTitle}>How KiaTaker can help?</Text>

      {/* Bottom Tabs */}
      <View style={styles.tabsGrid}>
        {tabs.map((tab, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.tabCard, { width: tabCardWidth }]}
            onPress={() => navigation.navigate(tab.screen)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name={tab.icon} size={iconSize} color={BRAND_RED} />
            <Text style={styles.tabTitle}>{tab.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 30, alignItems: "center" },
  logo: { width: width * 0.65, height: 140, marginBottom: 15 },
  title: { fontSize: 28, fontWeight: "700", color: "#111", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#666", textAlign: "center", marginBottom: 30, lineHeight: 22, maxWidth: 500 },
  buttonRow: { flexDirection: "row", width: "100%", gap: 12, marginBottom: 35 },
  loginBtn: { flex: 1, backgroundColor: BRAND_RED, paddingVertical: 14, borderRadius: 16, alignItems: "center", elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6 },
  createBtn: { flex: 1, borderWidth: 1, borderColor: BRAND_RED, paddingVertical: 14, borderRadius: 16, alignItems: "center", backgroundColor: "#fff", elevation: 3, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6 },
  loginText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  createText: { color: BRAND_RED, fontSize: 16, fontWeight: "600" },
  helpTitle: { width: "100%", fontSize: 18, fontWeight: "700", marginBottom: 15, color: "#111" },
  tabsGrid: { width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  tabCard: { backgroundColor: "#fff", borderRadius: 18, paddingVertical: 24, marginBottom: 15, alignItems: "center", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, borderWidth: 1, borderColor: "#f2f2f2" },
  tabTitle: { marginTop: 10, fontSize: 14, fontWeight: "700", color: "#222", textAlign: "center" },
});



// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Dimensions,
//   ScrollView,
// } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');
// const BRAND_RED = '#8B0000';

// // Tab data array
// const tabs = [
//   { title: 'Sick Visit', icon: 'stethoscope', screen: 'SickVisit' },
//   { title: 'Medication', icon: 'pill', screen: 'MedicationRefill' },
//   { title: 'STD Exposure', icon: 'alert-circle-outline', screen: 'STDExposure' },
//   { title: 'Emergency', icon: 'ambulance', screen: 'Emergency' },
// ];

// export default function LandingScreen({ navigation }) {
//   // Dynamic icon size based on screen width
//   const iconSize = width > 400 ? 42 : 36;

//   // Determine tab card width for responsiveness
//   const tabCardWidth = width > 350 ? '48%' : '100%';

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.content}
//       showsVerticalScrollIndicator={false}
//     >
//       {/* Logo */}
//       <Image
//         source={require('../assets/Kiataker-Logo-Landing.png')}
//         style={styles.logo}
//         resizeMode="contain"
//       />

//       {/* Title */}
//       <Text style={styles.title}>Welcome to KiaTaker</Text>

//       {/* Subtitle */}
//       <Text style={styles.subtitle}>
//         Find diseases, get solutions, and manage your health professionally.
//       </Text>

//       {/* Buttons */}
//       <View style={styles.buttonRow}>
//         <TouchableOpacity
//           style={styles.loginBtn}
//           activeOpacity={0.8}
//           onPress={() => navigation.navigate('Login')}
//         >
//           <Text style={styles.loginText}>Login</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.createBtn}
//           activeOpacity={0.8}
//           onPress={() => navigation.navigate('Create Profile')}
//         >
//           <Text style={styles.createText}>Create Profile</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Help Section */}
//       <Text style={styles.helpTitle}>How KiaTaker can help?</Text>

//       {/* Icon Tabs */}
//       <View style={styles.tabsGrid}>
//         {tabs.map((tab, idx) => (
//           <TouchableOpacity
//             key={idx}
//             style={[styles.tabCard, { width: tabCardWidth }]}
//             onPress={() => navigation.navigate(tab.screen)}
//             activeOpacity={0.8}
//           >
//             <MaterialCommunityIcons name={tab.icon} size={iconSize} color={BRAND_RED} />
//             <Text style={styles.tabTitle}>{tab.title}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },

//   content: {
//     paddingHorizontal: 20,
//     paddingTop: 50,
//     paddingBottom: 30,
//     alignItems: 'center',
//   },

//   logo: {
//     width: width * 0.65,
//     height: 140,
//     marginBottom: 15,
//   },

//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#111',
//     textAlign: 'center',
//     marginBottom: 8,
//   },

//   subtitle: {
//     fontSize: 15,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 30,
//     lineHeight: 22,
//     maxWidth: 500,
//   },

//   buttonRow: {
//     flexDirection: 'row',
//     width: '100%',
//     gap: 12,
//     marginBottom: 35,
//   },

//   loginBtn: {
//     flex: 1,
//     backgroundColor: BRAND_RED,
//     paddingVertical: 14,
//     borderRadius: 16,
//     alignItems: 'center',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },

//   createBtn: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: BRAND_RED,
//     paddingVertical: 14,
//     borderRadius: 16,
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//   },

//   loginText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   createText: {
//     color: BRAND_RED,
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   helpTitle: {
//     width: '100%',
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 15,
//     color: '#111',
//   },

//   tabsGrid: {
//     width: '100%',
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },

//   tabCard: {
//     backgroundColor: '#fff',
//     borderRadius: 18,
//     paddingVertical: 24,
//     marginBottom: 15,
//     alignItems: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     borderWidth: 1,
//     borderColor: '#f2f2f2',
//   },

//   tabTitle: {
//     marginTop: 10,
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#222',
//     textAlign: 'center',
//   },
// });




// Old Layout 10-12-2025 Updated

// import React, { useRef, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Animated } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// const { width, height } = Dimensions.get('window');

// export default function LandingScreen({ navigation }) {
//   // Animated values for floating circles
//   const floatAnim1 = useRef(new Animated.Value(0)).current;
//   const floatAnim2 = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim1, {
//           toValue: 1,
//           duration: 6000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim1, {
//           toValue: 0,
//           duration: 6000,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim2, {
//           toValue: 1,
//           duration: 8000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim2, {
//           toValue: 0,
//           duration: 8000,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);

//   return (
//     <LinearGradient
//       colors={['#6DD5FA', '#FFFFFF']}
//       style={styles.container}
//     >
//       {/* Floating circles */}
//       <Animated.View
//         style={[
//           styles.circle,
//           { backgroundColor: 'rgba(255,255,255,0.3)',
//             transform: [{ translateY: floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, -50] }) }] 
//           },
//         ]}
//       />
//       <Animated.View
//         style={[
//           styles.circle,
//           { backgroundColor: 'rgba(0,123,255,0.2)',
//             transform: [{ translateY: floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -80] }) }],
//             left: width * 0.6,
//           },
//         ]}
//       />

//       {/* Main content */}
//       <Image
//         source={require('../assets/Kiataker-Logo-Landing.png')}
//         style={styles.image}
//         resizeMode="contain"
//       />

//       <Text style={styles.title}>Welcome to KiaTaker</Text>
//       <Text style={styles.subtitle}>
//         Find diseases, get solutions, and manage your health professionally.
//       </Text>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={[styles.button, styles.loginButton]}
//           onPress={() => navigation.navigate('Login')}
//         >
//           <Text style={styles.buttonText}>Login</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.button, styles.registerButton]}
//           onPress={() => navigation.navigate('Register')}
//         >
//           <Text style={[styles.buttonText, { color: '#007bff' }]}>Register</Text>
//         </TouchableOpacity>
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   circle: {
//     position: 'absolute',
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     top: height * 0.2,
//     left: width * 0.1,
//   },
//   image: { width: width * 0.8, height: height * 0.5 },
//   title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#007bff' },
//   subtitle: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 30, paddingHorizontal: 10 },
//   buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
//   button: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center', marginHorizontal: 5, elevation: 2 },
//   loginButton: { backgroundColor: '#007bff' },
//   registerButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#007bff' },
//   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
// });



// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

// export default function LandingScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       {/* Local doctor illustration */}
//       <Image
//         source={require('../assets/LandingImage.png')}
//         style={styles.image}
//         resizeMode="contain"
//       />

//       <Text style={styles.title}>Welcome to KiaTaker</Text>
//       <Text style={styles.subtitle}>
//         Find diseases, get solutions, and manage your health professionally.
//       </Text>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={[styles.button, styles.loginButton]}
//           onPress={() => navigation.navigate('Login')}
//         >
//           <Text style={styles.buttonText}>Login</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.button, styles.registerButton]}
//           onPress={() => navigation.navigate('Register')}
//         >
//           <Text style={[styles.buttonText, { color: '#000' }]}>Register</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
//   image: { width: 300, height: 350, marginBottom: 30 },
//   title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
//   subtitle: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 30 },
//   buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
//   button: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
//   loginButton: { backgroundColor: '#007bff' },
//   registerButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#000' },
//   buttonText: { color: '#fff', fontWeight: 'bold' },
// });
