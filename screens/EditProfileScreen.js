import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Image,
  Animated,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../supabase';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

const BRAND_RED = '#8B0000';
const totalSteps = 4;

export default function EditProfileScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  // Step 1 - Patient Info
  const [profile_photo, setProfilePhoto] = useState(null);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [middle_initial, setMiddleInitial] = useState('');
  const [dob, setDob] = useState('');
  const [dobDate, setDobDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('Male');
  const [race, setRace] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setStateField] = useState('');
  const [zip, setZip] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2 - Medical Info
  const [primary_care, setPrimaryCare] = useState('');
  const [current_medication_input, setCurrentMedicationInput] = useState('');
  const [current_medication, setCurrentMedication] = useState([]);
  const [allergies, setAllergies] = useState('');
  const [pharmacy, setPharmacy] = useState('');
  const [fax, setFax] = useState('');

  // Step 3 - Party Responsible
  const [billto, setBillto] = useState('');
  const [relationship, setRelationship] = useState('');
  const [responsible_address, setResponsibleAddress] = useState('');
  const [responsible_phone, setResponsiblePhone] = useState('');
  const [citystatezip, setCityStateZip] = useState('');

  // Step 4 - Consent
  const [consentgiven, setConsentGiven] = useState(false);

  // ---------------- Load User Data ----------------
  const loadUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) return console.log('Error fetching user:', error.message);

      // Step 1
      setFirstName(data.first_name || '');
      setLastName(data.last_name || '');
      setMiddleInitial(data.middle_initial || '');
      setDob(data.dob || '');
      setDobDate(data.dob ? new Date(data.dob) : new Date());
      setGender(data.gender || 'Male');
      setRace(data.race || '');
      setAddress(data.address || '');
      setCity(data.city || '');
      setStateField(data.state || '');
      setZip(data.zip || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setProfilePhoto(data.profile_photo || null);

      // Step 2
      setPrimaryCare(data.primary_care || '');
    //   setCurrentMedication(Array.isArray(data.current_medication) ? data.current_medication : []);
      
    // Check if current_medication is array or JSON string
let meds = [];
if (Array.isArray(data.current_medication)) {
  meds = data.current_medication;
} else if (typeof data.current_medication === 'string' && data.current_medication.length > 0) {
  try {
    meds = JSON.parse(data.current_medication); // parse JSON string
  } catch (err) {
    // fallback: if comma-separated string
    meds = data.current_medication.split(',').map((m) => m.trim());
  }
}
setCurrentMedication(meds);

    setAllergies(data.allergies || '');
      setPharmacy(data.pharmacy || '');
      setFax(data.fax || '');

      // Step 3
      setBillto(data.billto || '');
      setRelationship(data.relationship || '');
      setResponsibleAddress(data.responsible_address || '');
      setResponsiblePhone(data.responsible_phone || '');
      setCityStateZip(data.citystatezip || '');

      // Step 4
      setConsentGiven(data.consentgiven || false);
    } catch (err) {
      console.log('Load user error:', err);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: step / totalSteps,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [step]);

  // ---------------- Image Picker ----------------
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
        base64: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (!asset.base64) return alert('Image data missing.');

      const byteCharacters = atob(asset.base64);
      const byteNumbers = Array.from(byteCharacters).map((c) => c.charCodeAt(0));
      const fileData = Uint8Array.from(byteNumbers);
      const fileName = `profile_${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, fileData, { contentType: 'image/jpeg', upsert: true });

      if (uploadError) return alert('Image upload failed');

      const { data: publicData } = supabase.storage.from('profile-photos').getPublicUrl(fileName);
      setProfilePhoto(publicData.publicUrl);
    } catch (err) {
      console.log(err);
      alert('Something went wrong while uploading photo');
    }
  };

  const onDobChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDobDate(selectedDate);
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setDob(`${month}-${day}-${year}`);
    }
  };

  const handleNext = () => setStep(Math.min(step + 1, totalSteps));
  const handlePrev = () => setStep(Math.max(step - 1, 1));

  const addMedication = () => {
    if (!current_medication_input.trim()) return;
    setCurrentMedication([...current_medication, current_medication_input.trim()]);
    setCurrentMedicationInput('');
  };

  const deleteMedication = (index) => {
    const updatedList = [...current_medication];
    updatedList.splice(index, 1);
    setCurrentMedication(updatedList);
  };

  // ---------------- Update Profile & Store History ----------------
 const updateProfile = async () => {
  if (!first_name || !last_name || !email) return alert('Fill all required fields');
  if (password && password !== confirmPassword) return alert('Passwords do not match');

  setLoading(true);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not found');

    // Fetch current profile
    const { data: currentProfile, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError) throw fetchError;

    // Normalize arrays / strings for comparison
    const normalizeArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
        return val.split(',').map((v) => v.trim());
      }
      return [val];
    };

    const formattedDob = dobDate
      ? `${dobDate.getFullYear()}-${String(dobDate.getMonth() + 1).padStart(2, '0')}-${String(dobDate.getDate()).padStart(2, '0')}`
      : null;

    const newProfileData = {
      profile_photo,
      first_name,
      last_name,
      middle_initial,
      dob: formattedDob,
      gender,
      race,
      address,
      city,
      state,
      zip,
      email,
      phone,
      primary_care,
      current_medication,
      allergies,
      pharmacy,
      fax,
      billto,
      relationship,
      responsible_address,
      responsible_phone,
      citystatezip,
      consentgiven,
    };

    const changes = {};

    Object.keys(newProfileData).forEach((key) => {
      let oldVal = currentProfile[key];
      let newVal = newProfileData[key];

      // Compare arrays properly
      if (Array.isArray(newVal) || typeof oldVal === 'string') {
        oldVal = normalizeArray(oldVal);
        newVal = normalizeArray(newVal);
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          changes[key] = { old: oldVal.join(', '), new: newVal.join(', ') };
        }
      } else if (oldVal !== newVal) {
        changes[key] = { old: oldVal, new: newVal };
      }
    });

    // Insert change history only if actual changes exist
    if (Object.keys(changes).length > 0) {
      await supabase
        .from('profile_changes_history')
        .insert([{ user_id: user.id, changes, changed_at: new Date() }]);
    }

    // Update password if provided
    if (password) {
      const { error: passError } = await supabase.auth.updateUser({ password });
      if (passError) throw passError;
    }

    // Update profile
    const { error } = await supabase.from('users').update(newProfileData).eq('id', user.id);
    if (error) throw error;

    Alert.alert('Success', 'Profile updated successfully!');
  } catch (err) {
    console.log(err);
    alert(err.message || 'Update failed');
  } finally {
    setLoading(false);
  }
};


  // ---------------- Render Steps ----------------
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={{ width: '100%' }}>
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
                {profile_photo ? <Image source={{ uri: profile_photo }} style={styles.photo} /> : <MaterialIcons name="add-a-photo" size={50} color={BRAND_RED} />}
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>First Name</Text>
            <TextInput placeholder="First Name" value={first_name} onChangeText={setFirstName} style={styles.input} editable={false}/>

            <Text style={styles.label}>Last Name</Text>
            <TextInput placeholder="Last Name" value={last_name} onChangeText={setLastName} style={styles.input} editable={false} />

            <Text style={styles.label}>Middle Initial</Text>
            <TextInput placeholder="Middle Initial" value={middle_initial} onChangeText={setMiddleInitial} style={styles.input} />

            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input} disabled={true}>
              <Text style={{ color: dob ? '#000' : '#888' }}>{dob || 'Date of Birth'}</Text>
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={dobDate} mode="date" display="default" onChange={onDobChange} maximumDate={new Date()} />}

            <Text style={styles.label}>Gender</Text>
            <View style={[styles.input, styles.pickerContainer]}>
              <Picker selectedValue={gender} onValueChange={setGender} style={{ height: 50, width: '100%' }} enabled={false}>
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            <Text style={styles.label}>Race</Text>
            <TextInput placeholder="Race" value={race} onChangeText={setRace} style={styles.input} />

            <Text style={styles.label}>Address</Text>
            <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={styles.input} />

            <Text style={styles.label}>City</Text>
            <TextInput placeholder="City" value={city} onChangeText={setCity} style={styles.input} />

            <Text style={styles.label}>State</Text>
            <TextInput placeholder="State" value={state} onChangeText={setStateField} style={styles.input} />

            <Text style={styles.label}>Zip</Text>
            <TextInput placeholder="Zip" value={zip} onChangeText={setZip} style={styles.input} />

            <Text style={styles.label}>Email</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" editable={false} />

            <Text style={styles.label}>Cell Phone</Text>
            <TextInput placeholder="Cell Phone" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad"  />
          </View>
        );
      case 2:
      case 3:
      case 4:
        return renderOtherSteps();
      default:
        return null;
    }
  };

  const renderOtherSteps = () => {
    switch (step) {
      case 2:
        return (
          <>
            <Text style={styles.sectionTitle}>Medical Information</Text>

            <Text style={styles.label}>Primary Care Provider</Text>
            <TextInput placeholder="Enter provider name" value={primary_care} onChangeText={setPrimaryCare} style={styles.input} />

            <Text style={styles.label}>Current Medications</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              <TextInput
                placeholder="Add Medication"
                value={current_medication_input}
                onChangeText={setCurrentMedicationInput}
                style={[styles.input, { flex: 1 }]}
              />
              <TouchableOpacity onPress={addMedication} style={styles.addBtn}>
                <MaterialIcons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {current_medication.map((item, index) => (
              <View key={index} style={styles.medItem}>
                <Text>{item}</Text>
                <TouchableOpacity onPress={() => deleteMedication(index)}>
                  <MaterialIcons name="close" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}

            <Text style={styles.label}>Medication Allergies</Text>
            <TextInput placeholder="Enter allergies" value={allergies} onChangeText={setAllergies} style={styles.input} />

            <Text style={styles.label}>Preferred Pharmacy & Address</Text>
            <TextInput placeholder="Enter details" value={pharmacy} onChangeText={setPharmacy} style={styles.input} />

            <Text style={styles.label}>Fax Number</Text>
            <TextInput placeholder="Enter fax number" value={fax} onChangeText={setFax} style={styles.input} />
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.sectionTitle}>Party Responsible for Charges</Text>
            <Text style={styles.label}>Bill To</Text>
            <TextInput placeholder="Bill To" value={billto} onChangeText={setBillto} style={styles.input} />

            <Text style={styles.label}>Relationship</Text>
            <TextInput placeholder="Relationship" value={relationship} onChangeText={setRelationship} style={styles.input} />

            <Text style={styles.label}>Address</Text>
            <TextInput placeholder="Address" value={responsible_address} onChangeText={setResponsibleAddress} style={styles.input} />

            <Text style={styles.label}>Phone</Text>
            <TextInput placeholder="Phone" value={responsible_phone} onChangeText={setResponsiblePhone} style={styles.input} />

            <Text style={styles.label}>City/State/Zip</Text>
            <TextInput placeholder="City/State/Zip" value={citystatezip} onChangeText={setCityStateZip} style={styles.input} />
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.sectionTitle}>Consent & Agreement</Text>
            <Text style={styles.consentText}>
              By signing below, I attest that the information provided is true and accurate, and I provide my consent
              for evaluation, diagnosing and treatment. I authorize the release of my medical information, including
              personalized visit report, for submission to the appropriate federal, state, and local health agencies.
            </Text>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={() => setConsentGiven(!consentgiven)} style={[styles.checkbox, consentgiven && { backgroundColor: BRAND_RED }]}>
                {consentgiven && <MaterialIcons name="check" size={20} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>I agree to the above consent</Text>
            </View>
          </>
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={["bottom","left","right"]}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Edit Profile</Text>
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
              },
            ]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 150 }}>
        {loading ? <ActivityIndicator size="large" color={BRAND_RED} /> : renderStep()}
      </ScrollView>

   {/* Bottom Navigation */}
<View style={styles.bottomNav}>
  {step === 1 ? (
    // Full-width Next button for Step 1
    <TouchableOpacity
      onPress={handleNext}
      style={[styles.fullWidthNavBtn, { backgroundColor: BRAND_RED }]}
    >
      <Text style={[styles.navBtnText, { color: '#fff' }]}>Next</Text>
    </TouchableOpacity>
  ) : (
    // For steps 2,3,4: Previous & Next / Update Profile buttons
    <>
      {step > 1 && (
        <TouchableOpacity
          onPress={handlePrev}
          style={[styles.navBtn, { backgroundColor: '#ccc' }]}
        >
          <Text style={styles.navBtnText}>Previous</Text>
        </TouchableOpacity>
      )}
      {step < totalSteps ? (
        <TouchableOpacity
          onPress={handleNext}
          style={[styles.navBtn, { backgroundColor: BRAND_RED }]}
        >
          <Text style={[styles.navBtnText, { color: '#fff' }]}>Next</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={updateProfile}
          style={[styles.navBtn, { backgroundColor: BRAND_RED }]}
        >
          <Text style={[styles.navBtnText, { color: '#fff' }]}>Update Profile</Text>
        </TouchableOpacity>
      )}
    </>
  )}
</View>
</KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: '#fff' },
  headerText: { fontSize: 20, fontWeight: 'bold', color: BRAND_RED, textAlign: 'center' },
  progressContainer: { height: 5, backgroundColor: '#eee', borderRadius: 3, marginTop: 10 },
  progressBar: { height: 6, backgroundColor: BRAND_RED, borderRadius: 3 },
  label: { marginBottom: 5, fontWeight: 'bold' },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
  photoContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  photo: { width: 120, height: 120, borderRadius: 60 },
  pickerContainer: { justifyContent: 'center', height: 50 },
  addBtn: { backgroundColor: BRAND_RED, padding: 10, borderRadius: 5, marginLeft: 5,marginBottom:10 },
  medItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginVertical: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  consentText: { fontSize: 14, marginVertical: 15 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  checkbox: { width: 24, height: 24, borderWidth: 1, borderColor: '#ccc', marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checkboxLabel: { fontSize: 16 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderTopWidth: 1, borderTopColor: '#ccc', backgroundColor: '#fff', position: 'absolute', bottom: 0, width: '100%' },
  navBtn: { padding: 15, borderRadius: 8, minWidth: 120, alignItems: 'center' },
  navBtnText: { fontWeight: 'bold', fontSize: 16 },
 fullWidthNavBtn: {
  width: '100%',
  padding: 15,
  borderRadius: 8,
  alignItems: 'center',
},
bottomNav: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 10,
  borderTopWidth: 1,
  borderTopColor: '#ccc',
  backgroundColor: '#fff',
  position: 'absolute',
  bottom: 0,
  width: '100%',
},
});
