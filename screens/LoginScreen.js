import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabase";
import { MaterialIcons } from "@expo/vector-icons";

const BRAND_RED = "#8B0000";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Login via Supabase Auth
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({ email, password });
      
      if (loginError) throw loginError;

      const user = loginData.user;
      if (!user) throw new Error("Login failed");

      // 2️⃣ Fetch user profile info
      const { data: userInfo, error: userInfoError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      
      if (userInfoError) throw userInfoError;
      if (!userInfo) throw new Error("User profile not found");

      // 3️⃣ Generate 2FA code
      const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();

      // 4️⃣ Send 2FA code via Supabase Edge Function
      // Using .invoke() instead of manual fetch
      const { data: funcData, error: funcError } = await supabase.functions.invoke('send-2fa', {
        body: { email, code: twoFACode },
      });

      if (funcError) {
        throw new Error("We couldn't send your verification code. Please try again.");
      }

      // 5️⃣ Save data only after successful email send
      await AsyncStorage.setItem("@userProfile", JSON.stringify(userInfo));
      await AsyncStorage.setItem("@2faCode", twoFACode);
      await AsyncStorage.setItem("@2faUserId", user.id);

      navigation.replace("TwoFactorScreen");
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      Alert.alert("Login Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={{ position: "relative", width: "100%" }}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={login} style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Create Profile")}>
        <Text style={styles.loginText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 25 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 5, textAlign: "center", color: BRAND_RED },
  subtitle: { fontSize: 14, color: "#555", marginBottom: 20, textAlign: "center" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: Platform.OS === "ios" ? 15 : 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  eyeIcon: { position: "absolute", right: 12, top: Platform.OS === "ios" ? 18 : 15 },
  button: {
    backgroundColor: BRAND_RED,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  loginText: { marginTop: 20, textAlign: "center", color: BRAND_RED, fontWeight: "500" },
});




// Updated 18-12-2025
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Platform,
//   ActivityIndicator,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { supabase } from "../supabase";
// import { MaterialIcons } from "@expo/vector-icons";

// // Backend endpoint for sending 2FA
// // const SEND_2FA_URL = "https://kiataker.netlify.app/.netlify/functions/send2fa";
// const SEND_2FA_URL = "https://kiataker2factorverification.netlify.app/.netlify/functions/send2fa";


// // Kare Red brand color
// const BRAND_RED = "#8B0000";

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const login = async () => {
//     if (!email || !password) {
//       alert("Please enter email and password");
//       return;
//     }

//     setLoading(true);

//     try {
//       // 1️⃣ Login via Supabase Auth
//       const { data: loginData, error: loginError } =
//         await supabase.auth.signInWithPassword({ email, password });
//       if (loginError) throw loginError;

//       const user = loginData.user;
//       if (!user) throw new Error("Login failed");

//       // 2️⃣ Fetch user info from `users` table
//       const { data: userInfo, error: userInfoError } = await supabase
//         .from("users")
//         .select("*")
//         .eq("id", user.id)
//         .maybeSingle();
//       if (userInfoError) throw userInfoError;
//       if (!userInfo) throw new Error("User profile not found");

//       // 3️⃣ Save user info locally
//       await AsyncStorage.setItem("@userProfile", JSON.stringify(userInfo));

//       // 4️⃣ Generate 2FA code
//       const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();
//       await AsyncStorage.setItem("@2faCode", twoFACode);
//       await AsyncStorage.setItem("@2faUserId", user.id);

//       // 5️⃣ Send 2FA code to user's email
//       const response = await fetch(SEND_2FA_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, code: twoFACode }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to send verification code");
//       }

//       navigation.replace("TwoFactorScreen");
//     } catch (err) {
//       console.log("LOGIN ERROR:", err);
//       alert(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//       <ScrollView
//         contentContainerStyle={styles.container}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Text style={styles.title}>Welcome Back</Text>
//         <Text style={styles.subtitle}>Login to continue</Text>

//         <TextInput
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           style={styles.input}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />

//         <View style={{ position: "relative", width: "100%" }}>
//           <TextInput
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             style={styles.input}
//             secureTextEntry={!showPassword}
//           />
//           <TouchableOpacity
//             style={styles.eyeIcon}
//             onPress={() => setShowPassword(!showPassword)}
//           >
//             <MaterialIcons
//               name={showPassword ? "visibility" : "visibility-off"}
//               size={22}
//               color="#555"
//             />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity onPress={login} style={styles.button} disabled={loading}>
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Login</Text>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => navigation.navigate("Create Profile")}>
//           <Text style={styles.loginText}>Don't have an account? Register</Text>
//         </TouchableOpacity>
//       </ScrollView>
  
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 25,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 5,
//     textAlign: "center",
//     color: BRAND_RED,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 12,
//     padding: Platform.OS === "ios" ? 15 : 12,
//     marginBottom: 12,
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   eyeIcon: { position: "absolute", right: 12, top: Platform.OS === "ios" ? 18 : 15 },
//   button: {
//     backgroundColor: BRAND_RED,
//     padding: 15,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 15,
//     width: "100%",
//     shadowColor: BRAND_RED,
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 3,
//   },
//   buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//   loginText: { marginTop: 20, textAlign: "center", color: BRAND_RED, fontWeight: "500" },
// });





// // // Old Layout 10-12-2025 Updated

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Platform,
//   ActivityIndicator,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { supabase } from "../supabase";
// import { MaterialIcons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";

// // Backend endpoint for sending 2FA
// const SEND_2FA_URL = "https://kiataker.netlify.app/.netlify/functions/send2fa";

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const login = async () => {
//     if (!email || !password) {
//       alert("Please enter email and password");
//       return;
//     }

//     setLoading(true);

//     try {
//       const { data: existingUser, error: userCheckError } = await supabase
//         .from("users")
//         .select("id, name, email")
//         .eq("email", email)
//         .maybeSingle();

//       if (userCheckError) throw userCheckError;

//       if (!existingUser) {
//         alert("No account exists with this email. Please register first.");
//         return;
//       }

//       const { data: loginData, error: loginError } =
//         await supabase.auth.signInWithPassword({ email, password });

//       if (loginError) throw loginError;

//       const user = loginData.user;

//       await AsyncStorage.setItem("@userProfile", JSON.stringify(existingUser));

//       const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();
//       await AsyncStorage.setItem("@2faCode", twoFACode);
//       await AsyncStorage.setItem("@2faUserId", user.id);

//       const response = await fetch(SEND_2FA_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, code: twoFACode }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to send verification code");
//       }

//       navigation.replace("TwoFactorScreen");
//     } catch (err) {
//       console.log("LOGIN ERROR:", err);
//       alert(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LinearGradient colors={["#6DD5FA", "#ffffff"]} style={styles.gradient}>
//       <ScrollView
//         contentContainerStyle={styles.container}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Text style={styles.title}>Welcome Back</Text>
//         <Text style={styles.subtitle}>Login to continue</Text>

//         <TextInput
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           style={styles.input}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />

//         <View style={{ position: "relative", width: "100%" }}>
//           <TextInput
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             style={styles.input}
//             secureTextEntry={!showPassword}
//           />
//           <TouchableOpacity
//             style={styles.eyeIcon}
//             onPress={() => setShowPassword(!showPassword)}
//           >
//             <MaterialIcons
//               name={showPassword ? "visibility" : "visibility-off"}
//               size={22}
//               color="#555"
//             />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity onPress={login} style={styles.button} disabled={loading}>
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Login</Text>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => navigation.navigate("Register")}>
//           <Text style={styles.loginText}>Don't have an account? Register</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   gradient: { flex: 1 },
//   container: {
//     flexGrow: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 25,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 5,
//     textAlign: "center",
//     color: "#007bff",
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 12,
//     padding: Platform.OS === "ios" ? 15 : 12,
//     marginBottom: 12,
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   eyeIcon: { position: "absolute", right: 12, top: Platform.OS === "ios" ? 18 : 15 },
//   button: {
//     backgroundColor: "#007bff",
//     padding: 15,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 15,
//     width: "100%",
//     shadowColor: "#007bff",
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 3,
//   },
//   buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//   loginText: { marginTop: 20, textAlign: "center", color: "#007bff", fontWeight: "500" },
// });