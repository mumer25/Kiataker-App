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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState('Doctor');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single();

      if (data?.name) setUserName(data.name);
    } catch (e) {
      console.log('Load user error:', e);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.clear();
    navigation.replace("Landing");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7FAFD" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <View style={styles.profileBox}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={28} color="#1565C0" />
            </View>
            <View>
              <Text style={styles.welcomeTxt}>Welcome</Text>
              <Text style={styles.nameTxt}>{userName}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutTab} onPress={logout}>
            <MaterialIcons name="logout" size={22} color="#D32F2F" />
          </TouchableOpacity>
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

        <View style={styles.grid}>
          <DashboardCard icon="biotech" title="AI Diagnosis" />
          <DashboardCard icon="assignment" title="Reports" />
          <DashboardCard icon="history" title="History" />
          <DashboardCard icon="settings" title="Settings" />
        </View>
      </ScrollView>
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

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  cardText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
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
