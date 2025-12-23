import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "../supabase";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { findNodeHandle } from "react-native";

const BRAND_RED = "#8B0000";
const totalSteps = 4;

export default function CreateProfileScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const scrollRef = useRef(null);
  // Step 1 - Patient Info
  const [profile_photo, setProfilePhoto] = useState(null);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [middle_initial, setMiddleInitial] = useState("");
  const [dob, setDob] = useState(""); // string to display in TextInput
  const [dobDate, setDobDate] = useState(new Date()); // actual Date object
  const [showDatePicker, setShowDatePicker] = useState(false);
  // const [dob, setDob] = useState('');
  // For Gender picker popup on iOS
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [gender, setGender] = useState("Male");
  const [race, setRace] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setStateField] = useState("");
  const [zip, setZip] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2 - Medical Info
  const [primary_care, setPrimaryCare] = useState("");
  const [current_medication_input, setCurrentMedicationInput] = useState("");
  const [current_medication, setCurrentMedication] = useState([]);
  const [allergies, setAllergies] = useState("");
  const [pharmacy, setPharmacy] = useState("");
  const [fax, setFax] = useState("");

  // Step 3 - Party Responsible
  const [billto, setBillto] = useState(""); // ✅ matches DB column
  const [relationship, setRelationship] = useState("");
  const [responsible_address, setResponsibleAddress] = useState("");
  const [responsible_phone, setResponsiblePhone] = useState("");
  const [citystatezip, setCityStateZip] = useState("");

  // Step 4 - Consent
  const [consentgiven, setConsentGiven] = useState(false);

  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Step 1 - Patient Info
const firstNameRef = useRef();
const lastNameRef = useRef();
const middleInitialRef = useRef();
const dobRef = useRef();
const genderRef = useRef();
const raceRef = useRef();
const addressRef = useRef();
const cityRef = useRef();
const stateRef = useRef();
const zipRef = useRef();
const emailRef = useRef();
const phoneRef = useRef();
const passwordRef = useRef();
const confirmPasswordRef = useRef();

// Step 2 - Medical Info
const primaryCareRef = useRef();
const medicationInputRef = useRef();
const allergiesRef = useRef();
const pharmacyRef = useRef();
const faxRef = useRef();

// Step 3 - Party Responsible
const billToRef = useRef();
const relationshipRef = useRef();
const responsibleAddressRef = useRef();
const responsiblePhoneRef = useRef();
const cityStateZipRef = useRef();


  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

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
        quality: 0.7,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      const fileExt = asset.uri.split(".").pop();
      const fileName = `profile_${Date.now()}.${fileExt}`;

      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        name: fileName,
        type: `image/${fileExt}`,
      });

      const { data, error } = await supabase.storage
        .from("profile-photos")
        .upload(fileName, formData, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (error) {
        console.log("Upload error:", error);
        Alert.alert("Error", "Image upload failed");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(fileName);

      setProfilePhoto(publicUrlData.publicUrl);
    } catch (err) {
      console.log("Image Picker Error:", err);
      Alert.alert("Error", "Something went wrong while picking image");
    }
  };

  // const pickImage = async () => {
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [1, 1],
  //       quality: 0.6,
  //       base64: true,
  //     });

  //     if (result.canceled) return;

  //     const asset = result.assets[0];
  //     if (!asset.base64) {
  //       alert('Image data missing. Please try again.');
  //       return;
  //     }

  //     const byteCharacters = atob(asset.base64);
  //     const byteNumbers = new Array(byteCharacters.length);
  //     for (let i = 0; i < byteCharacters.length; i++) {
  //       byteNumbers[i] = byteCharacters.charCodeAt(i);
  //     }
  //     const fileData = Uint8Array.from(byteNumbers);
  //     const fileName = `profile_${Date.now()}.jpg`;

  //     const { error: uploadError } = await supabase.storage
  //       .from('profile-photos')
  //       .upload(fileName, fileData, { contentType: 'image/jpeg', upsert: true });

  //     if (uploadError) {
  //       console.log('Upload Error:', uploadError);
  //       alert('Image upload failed');
  //       return;
  //     }

  //     const { data: publicData } = supabase.storage
  //       .from('profile-photos')
  //       .getPublicUrl(fileName);

  //     setProfilePhoto(publicData.publicUrl);
  //   } catch (error) {
  //     console.log('Pick Image Error:', error);
  //     alert('Something went wrong while uploading the photo');
  //   }
  // };

  // Handle date selection
  // const onDobChange = (event, selectedDate) => {
  //   setShowDatePicker(false);
  //   if (selectedDate) {
  //     setDobDate(selectedDate);

  //     // Format as YYYY-MM-DD for Supabase
  //     const year = selectedDate.getFullYear();
  //     const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  //     const day = String(selectedDate.getDate()).padStart(2, '0');
  //     setDob(`${month}-${day}-${year}`); // optional: display in MM-DD-YYYY
  //   }
  // };
  // Handle date selection
  const onDobChange = (event, selectedDate) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) {
      setDobDate(selectedDate);
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const year = selectedDate.getFullYear();
      setDob(`${month}-${day}-${year}`);
    }
  };

  // ---------------- Step Navigation ----------------
  const handleNext = () => {
    if (step === 1) {
      if (
        !first_name ||
        !last_name ||
        !dob ||
        !gender ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword
      ) {
        alert("Please fill all required fields in Patient Information.");
        return;
      }
      if (!profile_photo) {
        alert("Please upload a profile photo.");
        return;
      }
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
    } else if (step === 2 && !primary_care) {
      alert("Please provide Primary Care Provider information.");
      return;
    } else if (step === 3 && (!billto || !relationship)) {
      alert("Please provide the required information for Party Responsible.");
      return;
    }

    setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  // ---------------- Register ----------------
  const register = async () => {
    if (
      !first_name ||
      !last_name ||
      !email ||
      !middle_initial ||
      !dob ||
      !gender ||
      !race ||
      !address ||
      !city ||
      !state ||
      !zip ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!profile_photo) {
      alert("Please upload a profile photo.");
      return;
    }
    if (!consentgiven) {
      alert("Please provide consent to submit the form.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("Signup failed");

      const formattedDob = dobDate
        ? `${dobDate.getFullYear()}-${String(dobDate.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(dobDate.getDate()).padStart(2, "0")}`
        : null;
      // 2️⃣ Insert user info into 'users' table (matching DB column names exactly)
      const { error: dbError } = await supabase.from("users").insert([
        {
          id: userId,
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
        },
      ]);

      if (dbError) throw dbError;

      Alert.alert(
        "Success",
        "Registration Successful! Please login to continue.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );

      // { text: 'OK', onPress: () => navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Login' }] }) },
    } catch (err) {
      console.log("REGISTER ERROR:", err);
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  //------------- Medication Handling --------------

  const addMedication = () => {
    if (!current_medication_input.trim()) return;

    setCurrentMedication([
      ...current_medication,
      current_medication_input.trim(),
    ]);
    setCurrentMedicationInput("");
  };

  const deleteMedication = (index) => {
    const updatedList = [...current_medication];
    updatedList.splice(index, 1);
    setCurrentMedication(updatedList);
  };

  // ---------------- Render Steps ----------------
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
              {profile_photo ? (
                <Image source={{ uri: profile_photo }} style={styles.photo} />
              ) : (
                <MaterialIcons name="add-a-photo" size={50} color={BRAND_RED} />
              )}
            </TouchableOpacity>

            <Text style={styles.label}>First Name</Text>
            {/* <TextInput placeholder="First Name" value={first_name} onChangeText={setFirstName} style={styles.input} /> */}
            <TextInput
              ref={firstNameRef}
              placeholder="First Name"
              value={first_name}
              onChangeText={setFirstName}
              style={styles.input}
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current.focus()} // move to next
            />
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              ref={lastNameRef}
              placeholder="Last Name"
              value={last_name}
              onChangeText={setLastName}
              style={styles.input}
              returnKeyType="next"
              onSubmitEditing={() => middleInitialRef.current.focus()}
            />
            {/* <TextInput placeholder="Last Name" value={last_name} onChangeText={setLastName} style={styles.input} /> */}
            <Text style={styles.label}>Middle Initial</Text>
            <TextInput
              ref={middleInitialRef}
              placeholder="Middle Initial"
              value={middle_initial}
              onChangeText={setMiddleInitial}
              style={styles.input}
              returnKeyType="next"
              // onSubmitEditing={() => dobRef.current.focus()}
            />
            {/* <TextInput placeholder="Middle Initial" value={middle_initial} onChangeText={setMiddleInitial} style={styles.input} /> */}
            <Text style={styles.label}>Date of Birth</Text>
            {/* <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
  <Text style={{ color: dob ? '#000' : '#888' }}>{dob || 'Date of Birth'}</Text>
</TouchableOpacity>

{showDatePicker && (
  <DateTimePicker
    value={dobDate}
    mode="date"
    display="default"
    onChange={onDobChange}
    maximumDate={new Date()} // prevent future dates
  />
)} */}

            {/* // Date of Birth */}
  <TouchableOpacity
    onPress={() => setShowDatePicker(true)}
    style={styles.input}
  >
    <Text style={{ color: dob ? "#000" : "#888" }}>
      {dob || "Date of Birth"}
    </Text>
  </TouchableOpacity>



            {showDatePicker && (
              <DateTimePicker
                value={dobDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === "android") setShowDatePicker(false);
                  if (selectedDate) {
                    setDobDate(selectedDate);
                    const month = String(selectedDate.getMonth() + 1).padStart(
                      2,
                      "0"
                    );
                    const day = String(selectedDate.getDate()).padStart(2, "0");
                    const year = selectedDate.getFullYear();
                    setDob(`${month}-${day}-${year}`);
                    // Focus next input automatically (Gender)
                    genderRef.current.focus?.();
                  }
                }}
              />
            )}

            {/* Optional Done button for iOS */}
            {Platform.OS === "ios" && showDatePicker && (
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={{ padding: 10, alignItems: "center" }}
              >
                <Text style={{ color: BRAND_RED, fontWeight: "600" }}>
                  Done
                </Text>
              </TouchableOpacity>
            )}

            {/* Gender */}
            <Text style={styles.label}>Gender</Text>

            {Platform.OS === "ios" ? (
              <>
                <TouchableOpacity
                  ref={genderRef}
                  onPress={() => setShowGenderPicker(!showGenderPicker)}
                  style={styles.input}
                >
                  <Text>{gender || "Select Gender"}</Text>
                </TouchableOpacity>

                {showGenderPicker && (
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      width: "100%",
                      backgroundColor: "#fff",
                      marginTop: 4,
                      overflow: "hidden",
                    }}
                  >
                    <Picker
                      selectedValue={gender}
                      onValueChange={(itemValue) => {
                        setGender(itemValue);
                        setShowGenderPicker(false);
                        // Scroll to next input automatically
                        raceRef.current?.focus();
                      }}
                      style={{ width: "100%" }}
                    >
                      <Picker.Item label="Male" value="Male" />
                      <Picker.Item label="Female" value="Female" />
                      <Picker.Item label="Other" value="Other" />
                    </Picker>
                  </View>
                )}
              </>
            ) : (
              <View style={[styles.input, styles.pickerContainer]}>
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) => setGender(itemValue)}
                  style={{ height: 50, width: "100%" }}
                >
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            )}

            {/* <Text style={styles.label}>Gender</Text>
            <View style={[styles.input, styles.pickerContainer]}>
              <Picker selectedValue={gender} onValueChange={setGender} style={{ height: 50, width: '100%' }}>
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View> */}

            <Text style={styles.label}>Race</Text>
            <TextInput
              ref={raceRef}
              placeholder="Race"
              value={race}
              onChangeText={setRace}
              style={styles.input}
              returnKeyType="next"
              onSubmitEditing={() => addressRef.current?.focus()}
            />
            <Text style={styles.label}>Address</Text>
            <TextInput
            ref={addressRef}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
               returnKeyType="next"
        onSubmitEditing={() => cityRef.current?.focus()}
            />
            <Text style={styles.label}>City</Text>
            <TextInput
            ref={cityRef}
              placeholder="City"
              value={city}
              onChangeText={setCity}
              style={styles.input}
               returnKeyType="next"
        onSubmitEditing={() => stateRef.current?.focus()}
            />
            <Text style={styles.label}>State</Text>
            <TextInput
            ref={stateRef}
              placeholder="State"
              value={state}
              onChangeText={setStateField}
              style={styles.input}
               returnKeyType="next"
        onSubmitEditing={() => zipRef.current?.focus()}
            />
            <Text style={styles.label}>Zip</Text>
            <TextInput
            ref={zipRef}
              placeholder="Zip"
              value={zip}
              onChangeText={setZip}
              style={styles.input}
              returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
            ref={emailRef}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
        onSubmitEditing={() => phoneRef.current?.focus()}
            />
            <Text style={styles.label}>Cell Phone</Text>
            <TextInput
            ref={phoneRef}
              placeholder="Cell Phone"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              keyboardType="phone-pad"
              returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <Text style={styles.label}>Password</Text>
            <View style={{ position: "relative", width: "100%" }}>
              <TextInput
              ref={passwordRef}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry={!showPassword}
                returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
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

            <Text style={styles.label}>Confirm Password</Text>
            <View style={{ position: "relative", width: "100%" }}>
              <TextInput
               ref={confirmPasswordRef}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <MaterialIcons
                  name={showConfirmPassword ? "visibility" : "visibility-off"}
                  size={22}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          </>
        );

      case 2:
        return (
          <>
            <Text style={styles.sectionTitle}>Medical Information</Text>

            {/* Primary Care Provider */}
            <Text style={styles.label}>Primary Care Provider</Text>
            <TextInput
            ref={primaryCareRef}
              value={primary_care}
              onChangeText={setPrimaryCare}
              style={styles.input}
              placeholder="Enter provider name"
              returnKeyType="next"
        onSubmitEditing={() => medicationInputRef.current?.focus()}
            />

            {/* Add Medication */}
            <Text style={styles.label}>Current Medications</Text>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextInput
              ref={medicationInputRef}
                placeholder="Add Medication"
                value={current_medication_input}
                onChangeText={setCurrentMedicationInput}
                style={[styles.input, { flex: 1 }]}
                returnKeyType="done"
          onSubmitEditing={addMedication}
              />

              <TouchableOpacity
                onPress={addMedication}
                style={{
                  backgroundColor: BRAND_RED,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  marginLeft: 8,
                  marginBottom: 12,
                  borderRadius: 8,
                }}
              >
                <MaterialIcons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Medication List */}
            {current_medication.length > 0 && (
              <View style={{ width: "100%", marginTop: 10 }}>
                {current_medication.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      padding: 12,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 8,
                      marginBottom: 6,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{item}</Text>

                    {/* ❌ Delete icon */}
                    <TouchableOpacity onPress={() => deleteMedication(index)}>
                      <MaterialIcons name="close" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Allergies */}
            <Text style={styles.label}>Medication Allergies</Text>
            <TextInput
            ref={allergiesRef}
              placeholder="Enter allergies"
              value={allergies}
              onChangeText={setAllergies}
              style={styles.input}
               returnKeyType="next"
        onSubmitEditing={() => pharmacyRef.current?.focus()}
            />

            {/* Pharmacy */}
            <Text style={styles.label}>Preferred Pharmacy & Address</Text>
            <TextInput
            ref={pharmacyRef}
              placeholder="Enter details"
              value={pharmacy}
              onChangeText={setPharmacy}
              style={styles.input}
              returnKeyType="next"
        onSubmitEditing={() => faxRef.current?.focus()}
            />

            {/* FAX */}
            <Text style={styles.label}>Fax Number</Text>
            <TextInput
            ref={faxRef}
              placeholder="Enter fax number"
              value={fax}
              onChangeText={setFax}
              style={styles.input}
              keyboardType="phone-pad"
        returnKeyType="done"
            />
          </>
        );

      case 3:
        return (
          <>
            <Text style={styles.sectionTitle}>
              Party Responsible for Charges
            </Text>

            <Text style={styles.label}>Bill To</Text>
            <TextInput
            ref={billToRef}
              placeholder="Bill To"
              value={billto}
              onChangeText={setBillto}
              style={styles.input}
              returnKeyType="next"
        onSubmitEditing={() => relationshipRef.current?.focus()}
            />
            <Text style={styles.label}>Relationship</Text>
            <TextInput
            ref={relationshipRef}
              placeholder="Relationship"
              value={relationship}
              onChangeText={setRelationship}
              style={styles.input}
              returnKeyType="next"
        onSubmitEditing={() => responsibleAddressRef.current?.focus()}
            />
            <Text style={styles.label}>Address</Text>
            <TextInput
            ref={responsibleAddressRef}
              placeholder="Address"
              value={responsible_address}
              onChangeText={setResponsibleAddress}
              style={styles.input}
               returnKeyType="next"
        onSubmitEditing={() => responsiblePhoneRef.current?.focus()}
            />
            <Text style={styles.label}>Phone</Text>
            <TextInput
            ref={responsiblePhoneRef}
              placeholder="Phone"
              value={responsible_phone}
              onChangeText={setResponsiblePhone}
              style={styles.input}
               returnKeyType="next"
        onSubmitEditing={() => cityStateZipRef.current?.focus()}
            />
            <Text style={styles.label}>City/State/Zip</Text>
            <TextInput
            ref={cityStateZipRef}
              placeholder="City/State/Zip"
              value={citystatezip}
              onChangeText={setCityStateZip}
              style={styles.input}
              returnKeyType="done"
            />
          </>
        );

      case 4:
        return (
          <View style={{ width: "100%" }}>
            <Text style={styles.sectionTitle}>Consent & Agreement</Text>
            <Text style={styles.consentText}>
              By signing below, I attest that the information provided is true
              and accurate, and I provide my consent for evaluation, diagnosing
              and treatment. I authorize the release of my medical information,
              including personalized visit report, for submission to the
              appropriate federal, state, and local health agencies. I also
              authorize the release of treatment and associated information to
              my healthcare provider.
            </Text>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() => setConsentGiven(!consentgiven)}
                style={[
                  styles.checkbox,
                  consentgiven && { backgroundColor: BRAND_RED },
                ]}
              >
                {consentgiven && (
                  <MaterialIcons name="check" size={20} color="#fff" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                I agree to the above consent
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <LinearGradient colors={["#ffffff", "#ffffff"]} style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {/* <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}> */}
            <KeyboardAwareScrollView
              ref={scrollRef}
              contentContainerStyle={styles.container}
              enableOnAndroid={true}
              extraScrollHeight={30}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.mainTitle}>Create Account</Text>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <Animated.View
                  style={[styles.progressBar, { width: progressWidth }]}
                />
                <Text style={styles.progressText}>
                  Step {step}/{totalSteps}
                </Text>
              </View>

              <Animated.View
                style={{
                  opacity: fadeAnim,
                  width: "100%",
                  alignItems: "center",
                }}
              >
                {renderStep()}
              </Animated.View>
              {/* </ScrollView> */}
            </KeyboardAwareScrollView>

            {/* Fixed Bottom Buttons */}
            <View style={styles.navButtons}>
              {step > 1 && (
                <TouchableOpacity
                  onPress={handlePrev}
                  style={[
                    styles.button,
                    { backgroundColor: "#6c757d", flex: 1, marginRight: 10 },
                  ]}
                >
                  <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
              )}
              {step < totalSteps ? (
                <TouchableOpacity
                  onPress={handleNext}
                  style={[
                    styles.button,
                    { flex: 1, marginLeft: step > 1 ? 10 : 0 },
                  ]}
                >
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={register}
                  style={[
                    styles.button,
                    { backgroundColor: BRAND_RED, flex: 1 },
                  ]}
                  disabled={loading || !consentgiven}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Submit</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: BRAND_RED,
  },
  progressContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginBottom: 20,
    position: "relative",
  },
  progressBar: {
    height: 10,
    backgroundColor: BRAND_RED,
    borderRadius: 10,
    position: "absolute",
    left: 0,
    top: 0,
  },
  progressText: {
    position: "absolute",
    top: 12,
    right: 0,
    fontSize: 12,
    color: "#555",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    width: "100%",
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
  label: {
    width: "100%",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 12,
    color: "gray",
  },
  pickerContainer: { justifyContent: "center", height: 50 },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: Platform.OS === "ios" ? 18 : 15,
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: BRAND_RED,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  photo: { width: "100%", height: "100%" },
  consentText: {
    fontSize: 14,
    color: "#555",
    textAlign: "justify",
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BRAND_RED,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLabel: { fontSize: 14, flexShrink: 1 },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
    position: "absolute",
    bottom: 0,
  },
  button: {
    backgroundColor: BRAND_RED,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: BRAND_RED,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});





// // Old Layout 10-12-2025 Updated

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
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { supabase } from '../supabase';
// import { MaterialIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';

// export default function CreateProfileScreen({ navigation }) {
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
//       alert('Please fill all fields');
//       return;
//     }
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       alert('Please enter a valid email');
//       return;
//     }
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
//     if (!passwordRegex.test(password)) {
//       alert(
//         'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
//       );
//       return;
//     }
//     if (password !== confirmPassword) {
//       alert('Passwords do not match');
//       return;
//     }
//     const ageInt = parseInt(age);
//     if (isNaN(ageInt)) {
//       alert('Age must be a number');
//       return;
//     }
//     setLoading(true);
//     try {
//       const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
//       if (existingUser) {
//         alert('User with this email already exists');
//         setLoading(false);
//         return;
//       }
//       const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
//       if (authError) throw authError;
//       const userId = authData.user?.id;
//       if (!userId) throw new Error('Signup failed');
//       const { error: dbError } = await supabase.from('users').insert([
//         { id: userId, name, email, phone, age: ageInt, gender, address },
//       ]);
//       if (dbError) throw dbError;
//       alert('Registration Successful! Please verify your email.');
//       navigation.navigate('Login');
//     } catch (err) {
//       console.log('REGISTER ERROR:', err);
//       alert(err.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LinearGradient colors={['#6DD5FA', '#ffffff']} style={styles.gradient}>
//       <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
//         <Text style={styles.title}>Create Account</Text>
//         <Text style={styles.subtitle}>Register to manage your health professionally</Text>

//         <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={styles.input} />
//         <TextInput
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           style={styles.input}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//         <TextInput
//           placeholder="Phone Number"
//           value={phone}
//           onChangeText={setPhone}
//           style={styles.input}
//           keyboardType="phone-pad"
//         />
//         <TextInput
//           placeholder="Age"
//           value={age}
//           onChangeText={setAge}
//           style={styles.input}
//           keyboardType="numeric"
//         />

//         <View style={[styles.input, styles.pickerContainer]}>
//           <Picker
//             selectedValue={gender}
//             onValueChange={setGender}
//             style={{ height: 50, width: '100%' }}
//             itemStyle={{ fontSize: 14 }}
//           >
//             <Picker.Item label="Male" value="Male" />
//             <Picker.Item label="Female" value="Female" />
//             <Picker.Item label="Other" value="Other" />
//           </Picker>
//         </View>

//         <TextInput
//           placeholder="Address"
//           value={address}
//           onChangeText={setAddress}
//           style={[styles.input, { height: 80 }]}
//           multiline
//         />

//         <View style={{ position: 'relative', width: '100%' }}>
//           <TextInput
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             style={styles.input}
//             secureTextEntry={!showPassword}
//           />
//           <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
//             <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={22} color="#555" />
//           </TouchableOpacity>
//         </View>

//         <TextInput
//           placeholder="Confirm Password"
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//           style={styles.input}
//           secureTextEntry
//         />

//         <TouchableOpacity onPress={register} style={styles.button} disabled={loading}>
//           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//           <Text style={styles.loginText}>Already have an account? Login</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   gradient: { flex: 1 },
//   container: {
//     flexGrow: 1,
//     padding: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5, textAlign: 'center', color: '#007bff' },
//   subtitle: { fontSize: 14, color: '#555', marginBottom: 20, textAlign: 'center' },
//   input: {
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 12,
//     padding: Platform.OS === 'ios' ? 15 : 12,
//     marginBottom: 12,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   pickerContainer: { justifyContent: 'center' ,height: 50},
//   eyeIcon: { position: 'absolute', right: 12, top: Platform.OS === 'ios' ? 18 : 15 },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 15,
//     width: '100%',
//     shadowColor: '#007bff',
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 3,
//   },
//   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   loginText: { marginTop: 20, textAlign: 'center', color: '#007bff', fontWeight: '500' },
// });
