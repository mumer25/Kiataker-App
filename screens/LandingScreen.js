import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  // Animated values for floating circles
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={['#6DD5FA', '#FFFFFF']}
      style={styles.container}
    >
      {/* Floating circles */}
      <Animated.View
        style={[
          styles.circle,
          { backgroundColor: 'rgba(255,255,255,0.3)',
            transform: [{ translateY: floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, -50] }) }] 
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          { backgroundColor: 'rgba(0,123,255,0.2)',
            transform: [{ translateY: floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -80] }) }],
            left: width * 0.6,
          },
        ]}
      />

      {/* Main content */}
      <Image
        source={require('../assets/DoctorImage.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to KiaTaker</Text>
      <Text style={styles.subtitle}>
        Find diseases, get solutions, and manage your health professionally.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={[styles.buttonText, { color: '#007bff' }]}>Register</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  circle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    top: height * 0.2,
    left: width * 0.1,
  },
  image: { width: width * 0.8, height: height * 0.5, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#007bff' },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 30, paddingHorizontal: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  button: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center', marginHorizontal: 5, elevation: 2 },
  loginButton: { backgroundColor: '#007bff' },
  registerButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#007bff' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});



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
