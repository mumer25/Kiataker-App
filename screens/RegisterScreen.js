import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const register = async () => {
    if (!name || !email || !phone || !age || !gender || !address || !password || !confirmPassword) {
      alert('Please fill all fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
      );
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const ageInt = parseInt(age);
    if (isNaN(ageInt)) {
      alert('Age must be a number');
      return;
    }
    setLoading(true);
    try {
      const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
      if (existingUser) {
        alert('User with this email already exists');
        setLoading(false);
        return;
      }
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      const userId = authData.user?.id;
      if (!userId) throw new Error('Signup failed');
      const { error: dbError } = await supabase.from('users').insert([
        { id: userId, name, email, phone, age: ageInt, gender, address },
      ]);
      if (dbError) throw dbError;
      alert('Registration Successful! Please verify your email.');
      navigation.navigate('Login');
    } catch (err) {
      console.log('REGISTER ERROR:', err);
      alert(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#6DD5FA', '#ffffff']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Register to manage your health professionally</Text>

        <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          style={styles.input}
          keyboardType="numeric"
        />

        <View style={[styles.input, styles.pickerContainer]}>
          <Picker
            selectedValue={gender}
            onValueChange={setGender}
            style={{ height: 50, width: '100%' }}
            itemStyle={{ fontSize: 14 }}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          style={[styles.input, { height: 80 }]}
          multiline
        />

        <View style={{ position: 'relative', width: '100%' }}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={22} color="#555" />
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity onPress={register} style={styles.button} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5, textAlign: 'center', color: '#007bff' },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 20, textAlign: 'center' },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: Platform.OS === 'ios' ? 15 : 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pickerContainer: { justifyContent: 'center' ,height: 50},
  eyeIcon: { position: 'absolute', right: 12, top: Platform.OS === 'ios' ? 18 : 15 },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
    shadowColor: '#007bff',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loginText: { marginTop: 20, textAlign: 'center', color: '#007bff', fontWeight: '500' },
});



// Upgraded Layout

// // screens/RegisterScreen.js
// import React, { useState } from 'react';
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
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { supabase } from '../supabase';
// import { MaterialIcons } from '@expo/vector-icons';

// export default function RegisterScreen({ navigation }) {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [age, setAge] = useState('');
//   const [gender, setGender] = useState('Male');
//   const [address, setAddress] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const register = async () => {
//     if (!name || !email || !phone || !age || !gender || !address || !password || !confirmPassword) {
//       Alert.alert('Error', 'Please fill all fields');
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       Alert.alert('Error', 'Please enter a valid email');
//       return;
//     }

//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
//     if (!passwordRegex.test(password)) {
//       Alert.alert(
//         'Error',
//         'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
//       );
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return;
//     }

//     const ageInt = parseInt(age);
//     if (isNaN(ageInt)) {
//       Alert.alert('Error', 'Age must be a number');
//       return;
//     }

//     setLoading(true);

//     try {
//       // 1️⃣ Check if email already exists in users table
//       const { data: existingUser, error: existingUserError } = await supabase
//         .from('users')
//         .select('id')
//         .eq('email', email)
//         .single();

//       if (existingUser) {
//         Alert.alert('Error', 'User with this email already exists');
//         setLoading(false);
//         return;
//       }

//       // 2️⃣ Create user in Supabase Auth
//       const { data: authData, error: authError } = await supabase.auth.signUp({
//         email,
//         password,
//       });
//       if (authError) throw authError;

//       const userId = authData.user?.id;
//       if (!userId) throw new Error('Signup failed');

//       // 3️⃣ Insert profile data into Supabase users table
//       const { error: dbError } = await supabase.from('users').insert([
//         {
//           id: userId,
//           name,
//           email,
//           phone,
//           age: ageInt,
//           gender,
//           address,
//         },
//       ]);
//       if (dbError) throw dbError;

//       Alert.alert(
//         'Registration Successful',
//         'Please check your email inbox and verify your email before logging in.'
//       );

//       navigation.navigate('Login');
//     } catch (err) {
//       console.log('REGISTER ERROR:', err);
//       Alert.alert('Error', err.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
//       <Text style={styles.title}>Create Account</Text>
//       <Text style={styles.subtitle}>Register to manage your health professionally</Text>

//       <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={styles.input} />

//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <TextInput
//         placeholder="Phone Number"
//         value={phone}
//         onChangeText={setPhone}
//         style={styles.input}
//         keyboardType="phone-pad"
//       />

//       <TextInput
//         placeholder="Age"
//         value={age}
//         onChangeText={setAge}
//         style={styles.input}
//         keyboardType="numeric"
//       />

//       <View style={[styles.input, { height: 50, paddingVertical: 0 }]}>
//         <Picker
//           selectedValue={gender}
//           onValueChange={setGender}
//           style={{ height: 50, width: "100%" }}
//           itemStyle={{ fontSize: 14 }}
//         >
//           <Picker.Item label="Male" value="Male" />
//           <Picker.Item label="Female" value="Female" />
//           <Picker.Item label="Other" value="Other" />
//         </Picker>
//       </View>

//       <TextInput
//         placeholder="Address"
//         value={address}
//         onChangeText={setAddress}
//         style={[styles.input, { height: 80 }]}
//         multiline
//       />

//       <View style={{ position: 'relative' }}>
//         <TextInput
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           style={styles.input}
//           secureTextEntry={!showPassword}
//         />
//         <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
//           <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={22} color="#555" />
//         </TouchableOpacity>
//       </View>

//       <TextInput
//         placeholder="Confirm Password"
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         style={styles.input}
//         secureTextEntry
//       />

//       <TouchableOpacity onPress={register} style={styles.button} disabled={loading}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//         <Text style={styles.loginText}>Already have an account? Login</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, padding: 25, backgroundColor: '#f0f4f7', justifyContent: 'center' },
//   title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
//   subtitle: { fontSize: 14, color: '#555', marginBottom: 20, textAlign: 'center' },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     padding: Platform.OS === 'ios' ? 15 : 10,
//     marginBottom: 12,
//     backgroundColor: '#fff',
//   },
//   eyeIcon: { position: 'absolute', right: 10, top: Platform.OS === 'ios' ? 15 : 12 },
//   button: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
//   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   loginText: { marginTop: 20, textAlign: 'center', color: '#007bff', fontWeight: '500' },
// });



// // screens/RegisterScreen.js
// import React, { useState } from 'react';
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
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Picker } from '@react-native-picker/picker';
// import { supabase } from '../supabase';
// import { MaterialIcons } from '@expo/vector-icons';

// export default function RegisterScreen({ navigation }) {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [age, setAge] = useState('');
//   const [gender, setGender] = useState('Male');
//   const [address, setAddress] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const register = async () => {
//     if (!name || !email || !phone || !age || !gender || !address || !password || !confirmPassword) {
//       Alert.alert('Error', 'Please fill all fields');
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       Alert.alert('Error', 'Please enter a valid email');
//       return;
//     }

//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
//     if (!passwordRegex.test(password)) {
//       Alert.alert(
//         'Error',
//         'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
//       );
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return;
//     }

//     const ageInt = parseInt(age);
//     if (isNaN(ageInt)) {
//       Alert.alert('Error', 'Age must be a number');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Sign up with Supabase Auth
//       const { data: authData, error } = await supabase.auth.signUp({ email, password });
//       if (error) throw error;

//       // Store pending user data locally
//       await AsyncStorage.setItem(
//         'pendingUser',
//         JSON.stringify({ name, phone, age: ageInt, gender, address })
//       );

//       Alert.alert(
//         'Registration Successful',
//         'Please verify your email before logging in. Check your inbox for the confirmation link.'
//       );
//       navigation.navigate('Login');
//     } catch (err) {
//       console.log('REGISTER ERROR:', err);
//       Alert.alert('Error', err.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
//       <Text style={styles.title}>Create Account</Text>
//       <Text style={styles.subtitle}>Register to manage your health professionally</Text>

//       <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={styles.input} />
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         placeholder="Phone Number"
//         value={phone}
//         onChangeText={setPhone}
//         style={styles.input}
//         keyboardType="phone-pad"
//       />
//       <TextInput
//         placeholder="Age"
//         value={age}
//         onChangeText={setAge}
//         style={styles.input}
//         keyboardType="numeric"
//       />

//       <View style={[styles.input, { height: 50, paddingVertical: 0 }]}>
//         <Picker
//           selectedValue={gender}
//           onValueChange={(itemValue) => setGender(itemValue)}
//           style={{ height: 50, width: '100%' }}
//           itemStyle={{ fontSize: 14, height: 50 }}
//         >
//           <Picker.Item label="Male" value="Male" />
//           <Picker.Item label="Female" value="Female" />
//           <Picker.Item label="Other" value="Other" />
//         </Picker>
//       </View>

//       <TextInput
//         placeholder="Address"
//         value={address}
//         onChangeText={setAddress}
//         style={[styles.input, { height: 80 }]}
//         multiline
//       />

//       <View style={{ position: 'relative' }}>
//         <TextInput
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           style={styles.input}
//           secureTextEntry={!showPassword}
//         />
//         <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
//           <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={22} color="#555" />
//         </TouchableOpacity>
//       </View>

//       <TextInput
//         placeholder="Confirm Password"
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         style={styles.input}
//         secureTextEntry
//       />

//       <TouchableOpacity onPress={register} style={styles.button} disabled={loading}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//         <Text style={styles.loginText}>Already have an account? Login</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, padding: 25, backgroundColor: '#f0f4f7', justifyContent: 'center' },
//   title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
//   subtitle: { fontSize: 14, color: '#555', marginBottom: 20, textAlign: 'center' },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     padding: Platform.OS === 'ios' ? 15 : 10,
//     marginBottom: 12,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//   },
//   eyeIcon: { position: 'absolute', right: 10, top: Platform.OS === 'ios' ? 15 : 12 },
//   button: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
//   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   loginText: { marginTop: 20, textAlign: 'center', color: '#007bff', fontWeight: '500' },
// });

