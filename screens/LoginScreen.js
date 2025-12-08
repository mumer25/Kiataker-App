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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Backend endpoint for sending 2FA
const SEND_2FA_URL = "https://kiataker.netlify.app/.netlify/functions/send2fa";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const { data: existingUser, error: userCheckError } = await supabase
        .from("users")
        .select("id, name, email")
        .eq("email", email)
        .maybeSingle();

      if (userCheckError) throw userCheckError;

      if (!existingUser) {
        alert("No account exists with this email. Please register first.");
        return;
      }

      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (loginError) throw loginError;

      const user = loginData.user;

      await AsyncStorage.setItem("@userProfile", JSON.stringify(existingUser));

      const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();
      await AsyncStorage.setItem("@2faCode", twoFACode);
      await AsyncStorage.setItem("@2faUserId", user.id);

      const response = await fetch(SEND_2FA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: twoFACode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send verification code");
      }

      navigation.replace("TwoFactorScreen");
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#6DD5FA", "#ffffff"]} style={styles.gradient}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
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

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.loginText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#007bff",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: Platform.OS === "ios" ? 15 : 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  eyeIcon: { position: "absolute", right: 12, top: Platform.OS === "ios" ? 18 : 15 },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
    shadowColor: "#007bff",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  loginText: { marginTop: 20, textAlign: "center", color: "#007bff", fontWeight: "500" },
});



// Upgraded Layout

// // screens/LoginScreen.js
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
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { supabase } from "../supabase";
// import { MaterialIcons } from "@expo/vector-icons";

// // Backend endpoint for sending 2FA
// const SEND_2FA_URL = "https://kiataker.netlify.app/.netlify/functions/send2fa";

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const login = async () => {
//     if (!email || !password) {
//       Alert.alert("Error", "Please enter email and password");
//       return;
//     }

//     setLoading(true);

//     try {
//       // ✅ 1. Check if user profile exists in `users` table
//       const { data: existingUser, error: userCheckError } = await supabase
//         .from("users")
//         .select("id, name, email")
//         .eq("email", email)
//         .maybeSingle();

//       if (userCheckError) throw userCheckError;

//       if (!existingUser) {
//         Alert.alert(
//           "Account Not Found",
//           "No account exists with this email. Please register first."
//         );
//         return;
//       }

//       // ✅ 2. Sign in with Supabase Auth
//       const { data: loginData, error: loginError } =
//         await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });

//       if (loginError) throw loginError;

//       const user = loginData.user;

//       // ✅ 3. Save profile locally
//       await AsyncStorage.setItem(
//         "@userProfile",
//         JSON.stringify(existingUser)
//       );

//       // ✅ 4. Generate and store 2FA code
//       const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();

//       await AsyncStorage.setItem("@2faCode", twoFACode);
//       await AsyncStorage.setItem("@2faUserId", user.id);

//       // ✅ 5. Send code via backend
//       const response = await fetch(SEND_2FA_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, code: twoFACode }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to send verification code");
//       }

//       // ✅ 6. Go to 2FA screen (do NOT navigate to Home manually)
//       navigation.replace("TwoFactorScreen");

//     } catch (err) {
//       console.log("LOGIN ERROR:", err);
//       Alert.alert("Login Error", err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView
//       contentContainerStyle={styles.container}
//       keyboardShouldPersistTaps="handled"
//     >
//       <Text style={styles.title}>Welcome Back</Text>
//       <Text style={styles.subtitle}>Login to continue</Text>

//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <View style={{ position: "relative" }}>
//         <TextInput
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           style={styles.input}
//           secureTextEntry={!showPassword}
//         />
//         <TouchableOpacity
//           style={styles.eyeIcon}
//           onPress={() => setShowPassword(!showPassword)}
//         >
//           <MaterialIcons
//             name={showPassword ? "visibility" : "visibility-off"}
//             size={22}
//             color="#555"
//           />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity onPress={login} style={styles.button} disabled={loading}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Login</Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate("Register")}>
//         <Text style={styles.loginText}>Don't have an account? Register</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: "center",
//     padding: 25,
//     backgroundColor: "#f0f4f7"
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 5,
//     textAlign: "center"
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 20,
//     textAlign: "center"
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: Platform.OS === "ios" ? 15 : 10,
//     marginBottom: 12,
//     backgroundColor: "#fff"
//   },
//   eyeIcon: {
//     position: "absolute",
//     right: 10,
//     top: Platform.OS === "ios" ? 15 : 12
//   },
//   button: {
//     backgroundColor: "#007bff",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 10
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16
//   },
//   loginText: {
//     marginTop: 20,
//     textAlign: "center",
//     color: "#007bff",
//     fontWeight: "500"
//   }
// });


// // screens/LoginScreen.js
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
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { supabase } from "../supabase";
// import { MaterialIcons } from "@expo/vector-icons";

// // Backend endpoint for sending 2FA
// const SEND_2FA_URL = "https://kiataker.netlify.app/.netlify/functions/send2fa";

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const login = async () => {
//     if (!email || !password) {
//       Alert.alert("Error", "Please enter email and password");
//       return;
//     }

//     setLoading(true);

//     try {
//       // 1️⃣ Check if user exists in `users` table
//       const { data: existingUser, error: userCheckError } = await supabase
//         .from("users")
//         .select("*")
//         .eq("email", email)
//         .single();

//       if (userCheckError && userCheckError.code !== "PGRST116") {
//         // PGRST116 = no rows found
//         throw userCheckError;
//       }

//       if (!existingUser) {
//         Alert.alert("Error", "No account found with this email. Please register first.");
//         setLoading(false);
//         return;
//       }

//       // 2️⃣ Sign in with Supabase Auth
//       const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });
//       if (loginError) throw loginError;

//       const user = loginData.user;

//       // 3️⃣ Check email verification
//       if (!user.email_confirmed_at) {
//         setLoading(false);
//         Alert.alert(
//           "Email Not Verified",
//           "Please verify your email before logging in.",
//           [
//             {
//               text: "Resend Email",
//               onPress: async () => {
//                 try {
//                   const { error: resendError } = await supabase.auth.resendVerificationEmail(email);
//                   if (resendError) throw resendError;
//                   Alert.alert("Success", "Verification email resent. Check your inbox.");
//                 } catch (e) {
//                   Alert.alert("Error", e.message || "Failed to resend email");
//                 }
//               },
//             },
//             { text: "OK", style: "cancel" },
//           ]
//         );
//         return;
//       }

//       // 4️⃣ Store profile data locally
//       await AsyncStorage.setItem("@userProfile", JSON.stringify(existingUser));

//       // 5️⃣ Generate 6-digit 2FA code
//       const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();

//       // 6️⃣ Store 2FA code and userId locally
//       await AsyncStorage.setItem("@2faCode", twoFACode);
//       await AsyncStorage.setItem("@2faUserId", user.id);

//       // 7️⃣ Send code via backend
//       const response = await fetch(SEND_2FA_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, code: twoFACode }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to send verification code");
//       }

//       // 8️⃣ Navigate to TwoFactorScreen
//       navigation.replace("TwoFactorScreen");

//     } catch (err) {
//       console.log("LOGIN ERROR:", err);
//       Alert.alert("Login Error", err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView
//       contentContainerStyle={styles.container}
//       keyboardShouldPersistTaps="handled"
//     >
//       <Text style={styles.title}>Welcome Back</Text>
//       <Text style={styles.subtitle}>Login to continue</Text>

//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <View style={{ position: "relative" }}>
//         <TextInput
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           style={styles.input}
//           secureTextEntry={!showPassword}
//         />
//         <TouchableOpacity
//           style={styles.eyeIcon}
//           onPress={() => setShowPassword(!showPassword)}
//         >
//           <MaterialIcons
//             name={showPassword ? "visibility" : "visibility-off"}
//             size={22}
//             color="#555"
//           />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity onPress={login} style={styles.button} disabled={loading}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Login</Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate("Register")}>
//         <Text style={styles.loginText}>Don't have an account? Register</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, justifyContent: "center", padding: 25, backgroundColor: "#f0f4f7" },
//   title: { fontSize: 28, fontWeight: "bold", marginBottom: 5, textAlign: "center" },
//   subtitle: { fontSize: 14, color: "#555", marginBottom: 20, textAlign: "center" },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: Platform.OS === "ios" ? 15 : 10,
//     marginBottom: 12,
//     backgroundColor: "#fff",
//   },
//   eyeIcon: { position: "absolute", right: 10, top: Platform.OS === "ios" ? 15 : 12 },
//   button: { backgroundColor: "#007bff", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
//   buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//   loginText: { marginTop: 20, textAlign: "center", color: "#007bff", fontWeight: "500" },
// });




// // screens/LoginScreen.js
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
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { supabase } from "../supabase";
// import { MaterialIcons } from "@expo/vector-icons";

// // Backend endpoint for sending 2FA
// const SEND_2FA_URL = "https://kiataker.netlify.app/.netlify/functions/send2fa";

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const login = async () => {
//     if (!email || !password) {
//       Alert.alert("Error", "Please enter email and password");
//       return;
//     }

//     setLoading(true);

//     try {
//       // 1️⃣ Sign in with Supabase
//       const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
//       if (loginError) throw loginError;

//       const user = loginData.user;

//       // 2️⃣ Check email verification
//       if (!user.email_confirmed_at) {
//         setLoading(false);
//         Alert.alert(
//           "Email Not Verified",
//           "Please verify your email before logging in.",
//           [
//             {
//               text: "Resend Email",
//               onPress: async () => {
//                 try {
//                   const { error: resendError } = await supabase.auth.resendVerificationEmail(email);
//                   if (resendError) throw resendError;
//                   Alert.alert("Success", "Verification email resent. Check your inbox.");
//                 } catch (e) {
//                   Alert.alert("Error", e.message || "Failed to resend email");
//                 }
//               },
//             },
//             { text: "OK", style: "cancel" },
//           ]
//         );
//         return;
//       }

//       // 3️⃣ Generate 6-digit 2FA code
//       const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();

//       // 4️⃣ Store 2FA code and userId locally
//       await AsyncStorage.setItem("@2faCode", twoFACode);
//       await AsyncStorage.setItem("@2faUserId", user.id);

//       // 5️⃣ Send code via backend
//       const response = await fetch(SEND_2FA_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, code: twoFACode }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to send verification code");
//       }

//       // 6️⃣ Navigate to TwoFactorScreen
//       navigation.replace("TwoFactorScreen");

//     } catch (err) {
//       console.log("LOGIN ERROR:", err);
//       Alert.alert("Login Error", err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
//       <Text style={styles.title}>Welcome Back</Text>
//       <Text style={styles.subtitle}>Login to continue</Text>

//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <View style={{ position: "relative" }}>
//         <TextInput
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           style={styles.input}
//           secureTextEntry={!showPassword}
//         />
//         <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
//           <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={22} color="#555" />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity onPress={login} style={styles.button} disabled={loading}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate("Register")}>
//         <Text style={styles.loginText}>Don't have an account? Register</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, justifyContent: "center", padding: 25, backgroundColor: "#f0f4f7" },
//   title: { fontSize: 28, fontWeight: "bold", marginBottom: 5, textAlign: "center" },
//   subtitle: { fontSize: 14, color: "#555", marginBottom: 20, textAlign: "center" },
//   input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: Platform.OS === "ios" ? 15 : 10, marginBottom: 12, backgroundColor: "#fff" },
//   eyeIcon: { position: "absolute", right: 10, top: Platform.OS === "ios" ? 15 : 12 },
//   button: { backgroundColor: "#007bff", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
//   buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//   loginText: { marginTop: 20, textAlign: "center", color: "#007bff", fontWeight: "500" },
// });
