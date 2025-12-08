import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function TwoFactorScreen({ navigation, setIsVerified }) {
  const [inputCode, setInputCode] = useState("");
  const [storedCode, setStoredCode] = useState(null);
  const [storedUserId, setStoredUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const code = await AsyncStorage.getItem("@2faCode");
        const userId = await AsyncStorage.getItem("@2faUserId");
        setStoredCode(code);
        setStoredUserId(userId);
      } catch (e) {
        console.log("Failed to load 2FA info:", e);
      }
    };
    loadData();
  }, []);

  const verifyCode = async () => {
    if (inputCode.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the 6-digit code sent to your email.");
      return;
    }

    setLoading(true);
    try {
      if (inputCode === storedCode) {
        await AsyncStorage.setItem("@2faVerified", "true");
        setIsVerified(true);
        await AsyncStorage.setItem("@loggedInUserId", storedUserId);
        await AsyncStorage.removeItem("@2faCode");
        await AsyncStorage.removeItem("@2faUserId");

        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        Alert.alert("Incorrect Code", "The verification code is incorrect.");
      }
    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = () => {
    Alert.alert("Resend", "Resend code feature coming soon...");
  };

  return (
    <LinearGradient colors={['#6DD5FA', '#FFFFFF']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title}>Verification Code</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to your email
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter code"
              keyboardType="number-pad"
              maxLength={6}
              value={inputCode}
              onChangeText={setInputCode}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={verifyCode}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify</Text>
              )}
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.resendButton}
              onPress={resendCode}
            >
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007bff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 5,
    backgroundColor: "#f7f9fc",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendButton: {
    marginTop: 15,
    alignItems: "center",
  },
  resendText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "500",
  },
});



// // screens/TwoFactorScreen.js
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function TwoFactorScreen({ navigation, setIsVerified }) {
//   const [inputCode, setInputCode] = useState("");
//   const [storedCode, setStoredCode] = useState(null);
//   const [storedUserId, setStoredUserId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Load stored 2FA info on mount
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const code = await AsyncStorage.getItem("@2faCode");
//         const userId = await AsyncStorage.getItem("@2faUserId");
//         setStoredCode(code);
//         setStoredUserId(userId);
//       } catch (e) {
//         console.log("Failed to load 2FA info:", e);
//       }
//     };
//     loadData();
//   }, []);

//   const verifyCode = async () => {
//     if (inputCode.length !== 6) {
//       Alert.alert("Invalid Code", "Please enter the 6-digit code sent to your email.");
//       return;
//     }

//     setLoading(true);

//     try {
//       if (inputCode === storedCode) {
//         // ✅ Mark user as verified
//         await AsyncStorage.setItem("@2faVerified", "true");
//         setIsVerified(true);

//         // ✅ Persist logged-in user id
//         await AsyncStorage.setItem("@loggedInUserId", storedUserId);

//         // ✅ Clear temporary 2FA data
//         await AsyncStorage.removeItem("@2faCode");
//         await AsyncStorage.removeItem("@2faUserId");

//         // ✅ Navigate to Home (persistent)
//         navigation.reset({
//           index: 0,
//           routes: [{ name: "Home" }],
//         });
//       } else {
//         Alert.alert("Incorrect Code", "The verification code is incorrect.");
//       }
//     } catch (err) {
//       Alert.alert("Error", err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resendCode = () => {
//     Alert.alert("Resend", "Resend code feature coming soon...");
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <Text style={styles.title}>Verification Code</Text>
//       <Text style={styles.subtitle}>
//         Enter the 6-digit code sent to your email.
//       </Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter code"
//         keyboardType="number-pad"
//         maxLength={6}
//         value={inputCode}
//         onChangeText={setInputCode}
//       />

//       <TouchableOpacity style={styles.button} onPress={verifyCode} activeOpacity={0.8}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Verify</Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.resendButton} onPress={resendCode}>
//         <Text style={styles.resendText}>Resend Code</Text>
//       </TouchableOpacity>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 25,
//     justifyContent: "center",
//     backgroundColor: "#F7FAFD",
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//     color: "#1565C0",
//   },
//   subtitle: {
//     fontSize: 15,
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#555",
//   },
//   input: {
//     height: 55,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 12,
//     paddingHorizontal: 20,
//     fontSize: 20,
//     textAlign: "center",
//     letterSpacing: 5,
//     backgroundColor: "#fff",
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#1565C0",
//     padding: 15,
//     borderRadius: 12,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   resendButton: {
//     marginTop: 10,
//     alignItems: "center",
//   },
//   resendText: {
//     color: "#1565C0",
//     fontSize: 16,
//   },
// });




// // screens/TwoFactorScreen.js
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function TwoFactorScreen({ navigation, setIsVerified }) {
//   const [inputCode, setInputCode] = useState("");
//   const [storedCode, setStoredCode] = useState(null);
//   const [storedUserId, setStoredUserId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Load stored 2FA info
//   useEffect(() => {
//     const loadData = async () => {
//       const code = await AsyncStorage.getItem("@2faCode");
//       const userId = await AsyncStorage.getItem("@2faUserId");
//       setStoredCode(code);
//       setStoredUserId(userId);
//     };
//     loadData();
//   }, []);

//   const verifyCode = async () => {
//     if (inputCode.length !== 6) {
//       Alert.alert("Invalid Code", "Please enter the 6-digit code sent to your email.");
//       return;
//     }

//     setLoading(true);

//     try {
//       if (inputCode === storedCode) {
//         // ✅ Mark user as verified
//         await AsyncStorage.setItem("@2faVerified", "true");
//         setIsVerified(true);

//         // ✅ Optional: Store logged in userId
//         await AsyncStorage.setItem("@loggedInUserId", storedUserId);

//         // ✅ Clear temporary 2FA data
//         await AsyncStorage.removeItem("@2faCode");
//         await AsyncStorage.removeItem("@2faUserId");

//         // ✅ Navigate to Home
//         navigation.replace("Home");
//       } else {
//         Alert.alert("Incorrect Code", "The verification code is incorrect.");
//       }
//     } catch (err) {
//       Alert.alert("Error", err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resendCode = () => {
//     Alert.alert("Resend", "Resend code feature coming soon...");
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Verification Code</Text>
//       <Text style={styles.subtitle}>
//         Enter the 6-digit code sent to your email.
//       </Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter code"
//         keyboardType="number-pad"
//         maxLength={6}
//         value={inputCode}
//         onChangeText={setInputCode}
//       />

//       <TouchableOpacity style={styles.button} onPress={verifyCode}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Verify</Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.resendButton} onPress={resendCode}>
//         <Text style={styles.resendText}>Resend Code</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 25,
//     justifyContent: "center",
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 15,
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   input: {
//     height: 55,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     paddingHorizontal: 20,
//     fontSize: 20,
//     textAlign: "center",
//     letterSpacing: 5,
//     backgroundColor: "#f9f9f9",
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#007bff",
//     padding: 15,
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   resendButton: {
//     marginTop: 20,
//   },
//   resendText: {
//     color: "#007bff",
//     textAlign: "center",
//     fontSize: 16,
//   },
// });



// // screens/TwoFactorScreen.js
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { supabase } from "../supabase";

// export default function TwoFactorScreen({ navigation }) {
//   const [inputCode, setInputCode] = useState("");
//   const [storedCode, setStoredCode] = useState(null);
//   const [storedUserId, setStoredUserId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Load stored 2FA info
//   useEffect(() => {
//     const loadData = async () => {
//       const code = await AsyncStorage.getItem("@2faCode");
//       const userId = await AsyncStorage.getItem("@2faUserId");
//       setStoredCode(code);
//       setStoredUserId(userId);
//     };
//     loadData();
//   }, []);

//   const verifyCode = async () => {
//     if (inputCode.length !== 6) {
//       Alert.alert("Invalid Code", "Please enter the 6-digit code sent to your email.");
//       return;
//     }

//     setLoading(true);

//     try {
//       if (inputCode === storedCode) {

//         // OPTIONAL: You can store login session here
//         await AsyncStorage.setItem("@loggedInUserId", storedUserId);


//         // Clear temporary 2FA data
//         await AsyncStorage.removeItem("@2faCode");
//         await AsyncStorage.removeItem("@2faUserId");

//         await AsyncStorage.setItem('@2faVerified', 'true');


//         // Navigate to home screen
//         navigation.replace("Home");
//       } else {
//         Alert.alert("Incorrect Code", "The verification code is incorrect.");
//       }
//     } catch (err) {
//       Alert.alert("Error", err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Verification Code</Text>
//       <Text style={styles.subtitle}>
//         Enter the 6-digit code sent to your email.
//       </Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter code"
//         keyboardType="number-pad"
//         maxLength={6}
//         value={inputCode}
//         onChangeText={setInputCode}
//       />

//       <TouchableOpacity style={styles.button} onPress={verifyCode}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Verify</Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.resendButton}
//         onPress={() => Alert.alert("Resend", "Resend code feature coming soon...")}
//       >
//         <Text style={styles.resendText}>Resend Code</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 25,
//     justifyContent: "center",
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 15,
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   input: {
//     height: 55,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     paddingHorizontal: 20,
//     fontSize: 20,
//     textAlign: "center",
//     letterSpacing: 5,
//     backgroundColor: "#f9f9f9",
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#007bff",
//     padding: 15,
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   resendButton: {
//     marginTop: 20,
//   },
//   resendText: {
//     color: "#007bff",
//     textAlign: "center",
//     fontSize: 16,
//   },
// });

