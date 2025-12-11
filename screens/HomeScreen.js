// Updated 11-12-2025
// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProfileScreen from './ProfileScreen';


const { width } = Dimensions.get('window');

const BRAND_RED = "#8B0000";

// Tab data array
const tabs = [
  { title: "Sick Visit", icon: "stethoscope", screen: "SickVisit" },
  { title: "Medication", icon: "pill", screen: "MedicationRefill" },
  { title: "STD Exposure", icon: "alert-circle-outline", screen: "STDExposure" },
  { title: "Emergency", icon: "ambulance", screen: "Emergency" },

];

export default function HomeScreen({ navigation }) {
  const [firstName, setFirstName] = useState('User');
  const [lastName, setLastName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
const slideAnim = useState(new Animated.Value(-width))[0]; // hidden on the left


   const iconSize = width > 400 ? 42 : 36;
  const tabCardWidth = width > 350 ? "48%" : "100%";

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      // Get currently logged in user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch additional info from 'users' table
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name, profile_photo')
        .eq('id', user.id)
        .single();

      if (error) {
        console.log('Supabase fetch error:', error.message);
        return;
      }

      if (data?.first_name) setFirstName(data.first_name);
      if (data?.last_name) setLastName(data.last_name);
      if (data?.profile_photo) setProfilePhoto(data.profile_photo);
    } catch (e) {
      console.log('Load user error:', e);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.clear();
    navigation.replace('Landing');
  };

  const openProfile = () => {
  setIsProfileOpen(true);
  Animated.timing(slideAnim, {
    toValue: 0, // fully visible
    duration: 300,
    useNativeDriver: false,
    easing: Easing.out(Easing.ease),
  }).start();
};

const closeProfile = () => {
  Animated.timing(slideAnim, {
    toValue: -width, // slide out
    duration: 300,
    useNativeDriver: false,
    easing: Easing.in(Easing.ease),
  }).start(() => setIsProfileOpen(false));
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7FAFD" />
      <ScrollView contentContainerStyle={styles.container} scrollEnabled={!isProfileOpen}>
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <View style={styles.profileBox}>
            {/* {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <MaterialIcons name="person" size={28} color="#1565C0" />
              </View>
            )} */}
          <TouchableOpacity onPress={openProfile}>
  {profilePhoto ? (
    <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
  ) : (
    <View style={styles.avatar}>
      <MaterialIcons name="person" size={28} color="#1565C0" />
    </View>
  )}
</TouchableOpacity>


            <View>
              <Text style={styles.welcomeTxt}>Welcome</Text>
              <Text style={styles.nameTxt}>{firstName}</Text>
            </View>
          </View>

          {/* <TouchableOpacity style={styles.logoutTab} onPress={logout}>
            <MaterialIcons name="logout" size={22} color="#D32F2F" />
          </TouchableOpacity> */}
        </View>

        {/* ===== MAIN AI CARD ===== */}
        <View style={styles.mainCard}>
          <Text style={styles.mainTitle}>AI Clinical Assistant</Text>
          <Text style={styles.mainSub}>
            Smart AI-powered disease detection and treatment insights.
          </Text>

          <TouchableOpacity style={styles.mainBtn}>
            <Text style={styles.mainBtnText}>Start Diagnosis</Text>
          </TouchableOpacity>
        </View>

        {/* ===== QUICK ACCESS ===== */}
        <Text style={styles.sectionTitle}>Quick Access</Text>

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

     {/* Sidebar */}
{isProfileOpen && (
  <Animated.View
    style={{
      position: "absolute",
      top: 0,
      left: slideAnim,
      width: "75%",
      height: "100%",
      backgroundColor: "#0a84ff",
      zIndex: 999,
      shadowColor: "#000",
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
    }}
  >
    <ProfileScreen
      navigation={navigation}
      isSidebar={true}
      onClose={closeProfile}
    />
  </Animated.View>
)}

    </SafeAreaView>
  );
}

/* ===== Small Card Component ===== */
const DashboardCard = ({ icon, title }) => (
  <TouchableOpacity style={styles.card}>
    <MaterialIcons name={icon} size={32} color="#1565C0" />
    <Text style={styles.cardText}>{title}</Text>
  </TouchableOpacity>
);

/* ===== Styles ===== */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFD',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
  },

  welcomeTxt: {
    fontSize: 14,
    color: '#666',
  },

  nameTxt: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D47A1',
  },

  logoutTab: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 12,
  },

  mainCard: {
    backgroundColor: '#1565C0',
    borderRadius: 20,
    padding: 22,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },

  mainSub: {
    fontSize: 14,
    color: '#E3F2FD',
    marginBottom: 16,
    lineHeight: 20,
  },

  mainBtn: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  mainBtnText: {
    color: '#1565C0',
    fontWeight: '700',
    fontSize: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },

   tabsGrid: { width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  tabCard: { backgroundColor: "#fff", borderRadius: 18, paddingVertical: 24, marginBottom: 15, alignItems: "center", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, borderWidth: 1, borderColor: "#f2f2f2" },
  tabTitle: { marginTop: 10, fontSize: 14, fontWeight: "700", color: "#222", textAlign: "center" },
});




// // screens/HomeScreen.js
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   ScrollView,
//   Dimensions,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { supabase } from '../supabase';
// import { MaterialIcons } from '@expo/vector-icons';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const { width } = Dimensions.get('window');

// export default function HomeScreen({ navigation }) {
//   const [userName, setUserName] = useState('Doctor');

//   useEffect(() => {
//     loadUser();
//   }, []);

//   const loadUser = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;

//       const { data } = await supabase
//         .from('users')
//         .select('name')
//         .eq('id', user.id)
//         .single();

//       if (data?.name) setUserName(data.name);
//     } catch (e) {
//       console.log('Load user error:', e);
//     }
//   };

//   const logout = async () => {
//     await supabase.auth.signOut();
//     await AsyncStorage.clear();
//     navigation.replace("Landing");
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F7FAFD" />
//       <ScrollView contentContainerStyle={styles.container}>
//         {/* ===== HEADER ===== */}
//         <View style={styles.header}>
//           <View style={styles.profileBox}>
//             <View style={styles.avatar}>
//               <MaterialIcons name="person" size={28} color="#1565C0" />
//             </View>
//             <View>
//               <Text style={styles.welcomeTxt}>Welcome</Text>
//               <Text style={styles.nameTxt}>{userName}</Text>
//             </View>
//           </View>

//           <TouchableOpacity style={styles.logoutTab} onPress={logout}>
//             <MaterialIcons name="logout" size={22} color="#D32F2F" />
//           </TouchableOpacity>
//         </View>

//         {/* ===== MAIN AI CARD ===== */}
//         <View style={styles.mainCard}>
//           <Text style={styles.mainTitle}>AI Clinical Assistant</Text>
//           <Text style={styles.mainSub}>
//             Smart AI-powered disease detection and treatment insights.
//           </Text>

//           <TouchableOpacity style={styles.mainBtn}>
//             <Text style={styles.mainBtnText}>Start Diagnosis</Text>
//           </TouchableOpacity>
//         </View>

//         {/* ===== QUICK ACCESS ===== */}
//         <Text style={styles.sectionTitle}>Quick Access</Text>

//         <View style={styles.grid}>
//           <DashboardCard icon="biotech" title="AI Diagnosis" />
//           <DashboardCard icon="assignment" title="Reports" />
//           <DashboardCard icon="history" title="History" />
//           <DashboardCard icon="settings" title="Settings" />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// /* ===== Small Card Component ===== */
// const DashboardCard = ({ icon, title }) => (
//   <TouchableOpacity style={styles.card}>
//     <MaterialIcons name={icon} size={32} color="#1565C0" />
//     <Text style={styles.cardText}>{title}</Text>
//   </TouchableOpacity>
// );

// /* ===== Styles ===== */
// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F7FAFD',
//   },
//   container: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },

//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 20,
//     marginBottom: 20,
//   },

//   profileBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },

//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 30,
//     backgroundColor: '#E3F2FD',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   welcomeTxt: {
//     fontSize: 14,
//     color: '#666',
//   },

//   nameTxt: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#0D47A1',
//   },

//   logoutTab: {
//     backgroundColor: '#FFEBEE',
//     padding: 10,
//     borderRadius: 12,
//   },

//   mainCard: {
//     backgroundColor: '#1565C0',
//     borderRadius: 20,
//     padding: 22,
//     marginBottom: 25,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 10,
//     elevation: 4,
//   },

//   mainTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: 6,
//   },

//   mainSub: {
//     fontSize: 14,
//     color: '#E3F2FD',
//     marginBottom: 16,
//     lineHeight: 20,
//   },

//   mainBtn: {
//     backgroundColor: '#fff',
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: 'center',
//   },

//   mainBtnText: {
//     color: '#1565C0',
//     fontWeight: '700',
//     fontSize: 15,
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 16,
//   },

//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },

//   card: {
//     width: (width - 60) / 2,
//     backgroundColor: '#fff',
//     borderRadius: 18,
//     paddingVertical: 22,
//     paddingHorizontal: 12,
//     alignItems: 'center',
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 3,
//   },

//   cardText: {
//     marginTop: 12,
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//   },
// });




// // screens/HomeScreen.js
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   ScrollView,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { supabase } from '../supabase';
// import { MaterialIcons } from '@expo/vector-icons';

// export default function HomeScreen({ navigation }) {
//   const [userName, setUserName] = useState('Doctor');

//   useEffect(() => {
//     loadUser();
//   }, []);

//   const loadUser = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;

//       const { data } = await supabase
//         .from('users')
//         .select('name')
//         .eq('id', user.id)
//         .single();

//       if (data?.name) {
//         setUserName(data.name);
//       }
//     } catch (e) {
//       console.log('Load user error:', e);
//     }
//   };

//  const logout = async () => {
//   await supabase.auth.signOut();
//   await AsyncStorage.clear();
//   navigation.replace("Landing");
// };


//   return (
//     <ScrollView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F7FAFD" />

//       {/* ===== HEADER ===== */}
//       <View style={styles.header}>
//         {/* Profile + Name */}
//         <View style={styles.profileBox}>
//           <View style={styles.avatar}>
//             <MaterialIcons name="person" size={28} color="#1565C0" />
//           </View>
//           <View>
//             <Text style={styles.welcomeTxt}>Welcome</Text>
//             <Text style={styles.nameTxt}>{userName}</Text>
//           </View>
//         </View>

//         {/* Logout icon tab */}
//         <TouchableOpacity style={styles.logoutTab} onPress={logout}>
//           <MaterialIcons name="logout" size={22} color="#D32F2F" />
//         </TouchableOpacity>
//       </View>

//       {/* ===== MAIN AI CARD ===== */}
//       <View style={styles.mainCard}>
//         <Text style={styles.mainTitle}>AI Clinical Assistant</Text>
//         <Text style={styles.mainSub}>
//           Smart AI-powered disease detection and treatment insights.
//         </Text>

//         <TouchableOpacity style={styles.mainBtn}>
//           <Text style={styles.mainBtnText}>Start Diagnosis</Text>
//         </TouchableOpacity>
//       </View>

//       {/* ===== QUICK ACCESS ===== */}
//       <Text style={styles.sectionTitle}>Quick Access</Text>

//       <View style={styles.grid}>
//         <DashboardCard icon="biotech" title="AI Diagnosis" />
//         <DashboardCard icon="assignment" title="Reports" />
//         <DashboardCard icon="history" title="History" />
//         <DashboardCard icon="settings" title="Settings" />
//       </View>
//     </ScrollView>
//   );
// }

// /* ===== Small Card Component ===== */
// const DashboardCard = ({ icon, title }) => (
//   <TouchableOpacity style={styles.card}>
//     <MaterialIcons name={icon} size={32} color="#1565C0" />
//     <Text style={styles.cardText}>{title}</Text>
//   </TouchableOpacity>
// );

// /* ===== Styles ===== */
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F7FAFD',
//     paddingHorizontal: 20,
//   },

//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 20,
//     marginBottom: 20,
//   },

//   profileBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },

//   avatar: {
//     width: 55,
//     height: 55,
//     borderRadius: 30,
//     backgroundColor: '#E3F2FD',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   welcomeTxt: {
//     fontSize: 14,
//     color: '#666',
//   },

//   nameTxt: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#0D47A1',
//   },

//   logoutTab: {
//     backgroundColor: '#FFEBEE',
//     padding: 10,
//     borderRadius: 12,
//   },

//   mainCard: {
//     backgroundColor: '#1565C0',
//     borderRadius: 20,
//     padding: 22,
//     marginBottom: 25,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 10,
//     elevation: 4,
//   },

//   mainTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: 6,
//   },

//   mainSub: {
//     fontSize: 14,
//     color: '#E3F2FD',
//     marginBottom: 16,
//     lineHeight: 20,
//   },

//   mainBtn: {
//     backgroundColor: '#fff',
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: 'center',
//   },

//   mainBtnText: {
//     color: '#1565C0',
//     fontWeight: '700',
//     fontSize: 15,
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 16,
//   },

//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },

//   card: {
//     width: '48%',
//     backgroundColor: '#fff',
//     borderRadius: 18,
//     padding: 22,
//     alignItems: 'center',
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 3,
//   },

//   cardText: {
//     marginTop: 12,
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//   },
// });
