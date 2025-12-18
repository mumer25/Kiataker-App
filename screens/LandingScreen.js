import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const BRAND_RED = "#8B0000";

const tabs = [
  {
    title: "Sick Visit",
    description: "Get personalized science-backed clinical treatment for common illnesses.",
    icon: "stethoscope",
    items: [
      "Sore throat (only)",
      "Sinus symptoms (only)",
      "Cold symptoms (multiple)",
      "Painful rash (sensitive rash)",
      "Contact with poison ivy",
      "Yeast after antibiotic use",
      "Tick bite",
      "Toothache",
      "Acne",
    ].sort((a, b) => a.localeCompare(b)),
  },
  {
    title: "Medication Refill",
    description: "Get recommendations and request medication refills for your current prescriptions.",
    icon: "pill",
    items: [
      "Hypertension (high blood pressure)",
      "Asthma (COPD)",
      "Hypothyroid (thyroid disorders)",
      "Herpes outbreak",
      "Hyperlipidemia (high cholesterol)",
      "Atopic dermatitis (eczema)",
      "Migraines",
      "Seasonal allergies",
      "Diabetes (on meds)",
    ].sort((a, b) => a.localeCompare(b)),
  },
  {
    title: "STD Exposure",
    description: "Access confidential treatment and advice for potential std exposures safely and discreetly.",
    icon: "alert-circle-outline",
    items: ["Chlamydia", "Trichomonas", "Chlamydia and Trichomonas", "Gonorrhea"].sort(
      (a, b) => a.localeCompare(b)
    ),
  },
  {
    title: "Emergency",
    description: "For life-threatening situations. Please seek immediate professional help.",
    icon: "ambulance",
    items: ["Chest pain", "Shortness of breath", "Call 911"],
  },
];

export default function LandingScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItems, setModalItems] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  const iconSize = width > 400 ? 42 : 36;
  const tabCardWidth = width > 350 ? "48%" : "100%";

  const handleTabPress = (tab) => {
    setModalTitle(tab.title);
    setModalDescription(tab.description);
    setModalItems(tab.items);
    setModalVisible(true);
  };

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

      {/* Top Description - Now all Gray */}
      <View style={styles.headerDescriptionBox}>
        <Text style={styles.subtitleGray}>Smart AI Powered — disease detection</Text>
        <Text style={styles.subtitleGray}>with evidence based treatment.</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.loginBtn} activeOpacity={0.8} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.createBtn} activeOpacity={0.8} onPress={() => navigation.navigate("Create Profile")}>
          <Text style={styles.createText}>Create Profile</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.helpTitle}>How KiaTaker can help?</Text>

      <View style={styles.tabsGrid}>
        {tabs.map((tab, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.tabCard, { width: tabCardWidth }]}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name={tab.icon} size={iconSize} color={BRAND_RED} />
            <Text style={styles.tabTitle}>{tab.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <TouchableOpacity 
              style={styles.closeIcon} 
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="#999" />
            </TouchableOpacity>

            {/* Modal Header Container - Left Aligned */}
            <View style={styles.modalHeaderContainer}>
               <Text style={styles.modalHeader}>{modalTitle}</Text>
               <Text style={styles.modalDescriptionText}>{modalDescription}</Text>
            </View>

            <ScrollView style={{ maxHeight: 350, width: "100%" }} showsVerticalScrollIndicator={false}>
              {modalItems.map((item, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.modalItem,
                    item === "Call 911" && { backgroundColor: "#ffcccc" },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      item === "Call 911" && { color: "#8B0000", fontWeight: "700" },
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 30, alignItems: "center" },
  logo: { width: width * 0.65, height: 120, marginBottom: 15 },
  title: { fontSize: 26, fontWeight: "800", color: "#111", textAlign: "center", marginBottom: 15 },
  
  // Header Description - Uniform Gray
  headerDescriptionBox: { width: '100%', alignItems: 'center', marginBottom: 35 },
  subtitleGray: { fontSize: 16, color: "#666", textAlign: "center", lineHeight: 22 },

  buttonRow: { flexDirection: "row", width: "100%", gap: 12, marginBottom: 35 },
  loginBtn: { flex: 1, backgroundColor: BRAND_RED, paddingVertical: 14, borderRadius: 16, alignItems: "center" },
  createBtn: { flex: 1, borderWidth: 1, borderColor: BRAND_RED, paddingVertical: 14, borderRadius: 16, alignItems: "center" },
  loginText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  createText: { color: BRAND_RED, fontSize: 16, fontWeight: "600" },

  helpTitle: { width: "100%", fontSize: 18, fontWeight: "700", marginBottom: 15, color: "#111" },
  tabsGrid: { width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  tabCard: { backgroundColor: "#fff", borderRadius: 18, paddingVertical: 24, marginBottom: 15, alignItems: "center", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, borderWidth: 1, borderColor: "#f2f2f2" },
  tabTitle: { marginTop: 10, fontSize: 14, fontWeight: "700", color: "#222", textAlign: "center" },

  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: { width: "90%", backgroundColor: "#fff", padding: 25, borderRadius: 24, elevation: 10 },
  
  closeIcon: { position: 'absolute', top: 15, right: 15, zIndex: 10 },
  
  // Left Aligned Header
  modalHeaderContainer: { width: '100%', marginBottom: 20 },
  modalHeader: { fontSize: 24, fontWeight: "800", color: BRAND_RED, marginBottom: 8, textAlign: 'left' },
  modalDescriptionText: { fontSize: 14, color: "#666", textAlign: 'left', lineHeight: 20,width: '100%' },

  modalItem: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, backgroundColor: "#f7f7f7", marginBottom: 10, width: '100%' },
  modalItemText: { fontSize: 16, color: "#444", fontWeight: '500' },
});



// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Dimensions,
//   ScrollView,
//   Modal,
//   Pressable,
// } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// const { width } = Dimensions.get("window");
// const BRAND_RED = "#8B0000";

// // Tab data array
// const tabs = [
//   {
//     title: "Sick Visit",
//     icon: "stethoscope",
//     items: [
//       "Sore throat (only)",
//       "Sinus symptoms (only)",
//       "Cold symptoms (multiple)",
//       "Painful rash (sensitive rash)",
//       "Contact with poison ivy",
//       "Yeast after antibiotic use",
//       "Tick bite",
//       "Toothache",
//       "Acne",
//     ].sort((a, b) => a.localeCompare(b)), // alphabetically
//   },
//   {
//     title: "Medication",
//     icon: "pill",
//     items: [
//       "Hypertension (high blood pressure)",
//       "Asthma (COPD)",
//       "Hypothyroid (thyroid disorders)",
//       "Herpes outbreak",
//       "Hyperlipidemia (high cholesterol)",
//       "Atopic dermatitis (eczema)",
//       "Migraines",
//       "Seasonal allergies",
//       "Diabetes (on meds)",
//     ].sort((a, b) => a.localeCompare(b)), // alphabetically
//   },
//   {
//     title: "STD Exposure",
//     icon: "alert-circle-outline",
//     items: ["Chlamydia", "Trichomonas", "Chlamydia and Trichomonas", "Gonorrhea"].sort(
//       (a, b) => a.localeCompare(b)
//     ), // alphabetically
//   },
//   {
//     title: "Emergency",
//     icon: "ambulance",
//     items: ["Chest pain", "Shortness of breath", "Call 911"], // original order
//   },
// ];

// export default function LandingScreen({ navigation }) {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalItems, setModalItems] = useState([]);
//   const [modalTitle, setModalTitle] = useState("");

//   const iconSize = width > 400 ? 42 : 36;
//   const tabCardWidth = width > 350 ? "48%" : "100%";

//   const handleTabPress = (tab) => {
//     setModalTitle(tab.title);
//     setModalItems(tab.items);
//     setModalVisible(true);
//   };

//   const handleItemPress = (item) => {
//     if (item === "Call 911") {
//       alert("Please dial 911 immediately!");
//     } else {
//       alert(item);
//     }
//   };

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.content}
//       showsVerticalScrollIndicator={false}
//     >
//       <Image
//         source={require("../assets/Kiataker-Logo-Landing.png")}
//         style={styles.logo}
//         resizeMode="contain"
//       />

//       <Text style={styles.title}>Welcome to KiaTaker</Text>

//       <Text style={styles.subtitle}>
//         Find diseases, get solutions, and manage your health professionally.
//       </Text>

//       {/* Auth Buttons */}
//       <View style={styles.buttonRow}>
//         <TouchableOpacity style={styles.loginBtn} activeOpacity={0.8} onPress={() => navigation.navigate("Login")}>
//           <Text style={styles.loginText}>Login</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.createBtn} activeOpacity={0.8} onPress={() => navigation.navigate("Create Profile")}>
//           <Text style={styles.createText}>Create Profile</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.helpTitle}>How KiaTaker can help?</Text>

//       {/* Bottom Tabs */}
//       <View style={styles.tabsGrid}>
//         {tabs.map((tab, idx) => (
//           <TouchableOpacity
//             key={idx}
//             style={[styles.tabCard, { width: tabCardWidth }]}
//             onPress={() => handleTabPress(tab)}
//             activeOpacity={0.8}
//           >
//             <MaterialCommunityIcons name={tab.icon} size={iconSize} color={BRAND_RED} />
//             <Text style={styles.tabTitle}>{tab.title}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalHeader}>{modalTitle}</Text>
//             <ScrollView style={{ maxHeight: 300, width: "100%" }}>
//               {modalItems.map((item, idx) => (
//                 <TouchableOpacity
//                   key={idx}
//                   style={[
//                     styles.modalItem,
//                     item === "Call 911" && { backgroundColor: "#ffcccc" },
//                   ]}
//                   onPress={() => handleItemPress(item)}
//                   activeOpacity={0.7}
//                 >
//                   <Text
//                     style={[
//                       styles.modalItemText,
//                       item === "Call 911" && { color: "#8B0000", fontWeight: "700" },
//                     ]}
//                   >
//                     {item}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//             <Pressable
//               style={[styles.modalButton, { backgroundColor: BRAND_RED }]}
//               onPress={() => setModalVisible(false)}
//             >
//               <Text style={{ color: "#fff", fontWeight: "700" }}>Close</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   content: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 30, alignItems: "center" },
//   logo: { width: width * 0.65, height: 140, marginBottom: 15 },
//   title: { fontSize: 28, fontWeight: "700", color: "#111", textAlign: "center", marginBottom: 8 },
//   subtitle: { fontSize: 15, color: "#666", textAlign: "center", marginBottom: 30, lineHeight: 22, maxWidth: 500 },
//   buttonRow: { flexDirection: "row", width: "100%", gap: 12, marginBottom: 35 },
//   loginBtn: { flex: 1, backgroundColor: BRAND_RED, paddingVertical: 14, borderRadius: 16, alignItems: "center", elevation: 3 },
//   createBtn: { flex: 1, borderWidth: 1, borderColor: BRAND_RED, paddingVertical: 14, borderRadius: 16, alignItems: "center", backgroundColor: "#fff", elevation: 3 },
//   loginText: { color: "#fff", fontSize: 16, fontWeight: "600" },
//   createText: { color: BRAND_RED, fontSize: 16, fontWeight: "600" },
//   helpTitle: { width: "100%", fontSize: 18, fontWeight: "700", marginBottom: 15, color: "#111" },
//   tabsGrid: { width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
//   tabCard: { backgroundColor: "#fff", borderRadius: 18, paddingVertical: 24, marginBottom: 15, alignItems: "center", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, borderWidth: 1, borderColor: "#f2f2f2" },
//   tabTitle: { marginTop: 10, fontSize: 14, fontWeight: "700", color: "#222", textAlign: "center" },

//   modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
//   modalContent: { width: "85%", backgroundColor: "#fff", padding: 20, borderRadius: 16, alignItems: "center", elevation: 5 },
//   modalHeader: { fontSize: 20, fontWeight: "700", marginBottom: 15, color: "#111" },
//   modalItem: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, backgroundColor: "#f9f9f9", marginBottom: 10 },
//   modalItemText: { fontSize: 16, color: "#555" },
//   modalButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginTop: 10 },
// });




// Updated 17-12-2025
// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Dimensions,
//   ScrollView,
// } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// const { width } = Dimensions.get("window");
// const BRAND_RED = "#8B0000";

// // Tab data array
// const tabs = [
//   { title: "Sick Visit", icon: "stethoscope", screen: "Sick Visit" },
//   { title: "Medication", icon: "pill", screen: "Medication Refill" },
//   { title: "STD Exposure", icon: "alert-circle-outline", screen: "STD Exposure" },
//   { title: "Emergency", icon: "ambulance", screen: "Emergency" },
// ];

// export default function LandingScreen({ navigation }) {
//   const iconSize = width > 400 ? 42 : 36;
//   const tabCardWidth = width > 350 ? "48%" : "100%";

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.content}
//       showsVerticalScrollIndicator={false}
//     >
//       <Image
//         source={require("../assets/Kiataker-Logo-Landing.png")}
//         style={styles.logo}
//         resizeMode="contain"
//       />

//       <Text style={styles.title}>Welcome to KiaTaker</Text>

//       <Text style={styles.subtitle}>
//         Find diseases, get solutions, and manage your health professionally.
//       </Text>

//       {/* Auth Buttons */}
//       <View style={styles.buttonRow}>
//         <TouchableOpacity
//           style={styles.loginBtn}
//           activeOpacity={0.8}
//           onPress={() => navigation.navigate("Login")}
//         >
//           <Text style={styles.loginText}>Login</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.createBtn}
//           activeOpacity={0.8}
//           onPress={() => navigation.navigate("Create Profile")}
//         >
//           <Text style={styles.createText}>Create Profile</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.helpTitle}>How KiaTaker can help?</Text>

//       {/* Bottom Tabs */}
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
//   container: { flex: 1, backgroundColor: "#fff" },
//   content: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 30, alignItems: "center" },
//   logo: { width: width * 0.65, height: 140, marginBottom: 15 },
//   title: { fontSize: 28, fontWeight: "700", color: "#111", textAlign: "center", marginBottom: 8 },
//   subtitle: { fontSize: 15, color: "#666", textAlign: "center", marginBottom: 30, lineHeight: 22, maxWidth: 500 },
//   buttonRow: { flexDirection: "row", width: "100%", gap: 12, marginBottom: 35 },
//   loginBtn: { flex: 1, backgroundColor: BRAND_RED, paddingVertical: 14, borderRadius: 16, alignItems: "center", elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6 },
//   createBtn: { flex: 1, borderWidth: 1, borderColor: BRAND_RED, paddingVertical: 14, borderRadius: 16, alignItems: "center", backgroundColor: "#fff", elevation: 3, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6 },
//   loginText: { color: "#fff", fontSize: 16, fontWeight: "600" },
//   createText: { color: BRAND_RED, fontSize: 16, fontWeight: "600" },
//   helpTitle: { width: "100%", fontSize: 18, fontWeight: "700", marginBottom: 15, color: "#111" },
//   tabsGrid: { width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
//   tabCard: { backgroundColor: "#fff", borderRadius: 18, paddingVertical: 24, marginBottom: 15, alignItems: "center", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, borderWidth: 1, borderColor: "#f2f2f2" },
//   tabTitle: { marginTop: 10, fontSize: 14, fontWeight: "700", color: "#222", textAlign: "center" },
// });



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
