import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../supabase'; 
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const STAGES = {
  EXPOSURE: 'EXPOSURE',
  PARTNER: 'PARTNER',
  SYMPTOMS: 'SYMPTOMS',
  TREATMENT_LOADING: 'TREATMENT_LOADING',
  PHARMACY: 'PHARMACY',
  SUMMARY: 'SUMMARY',
  HISTORY: 'HISTORY',
};

const BRAND_BLUE = '#3182ce';
const BRAND_RED = '#8B0000';

export default function STDExposureScreen() {
  const [stage, setStage] = useState(STAGES.EXPOSURE);
  const [selectedSTD, setSelectedSTD] = useState('');
  const [allergy, setAllergy] = useState(false);

  // Profile Data
  const [userData, setUserData] = useState({ firstName: '', lastName: '', dob: '', email: '' });
  const [pharmacy, setPharmacy] = useState('');
  const [tempPharmacy, setTempPharmacy] = useState('');
  
  // History States
  const [history, setHistory] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  // UI States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [options, setOptions] = useState({ email: true, archive: true, pcp: false });
  
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    fetchProfile();
    fetchHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('first_name, last_name, dob, pharmacy, email, allergies')
          .eq('id', user.id)
          .single();

        if (data) {
          setUserData({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            dob: data.dob || '',
            email: data.email || ''
          });
          setPharmacy(data.pharmacy || 'No pharmacy address on file');

         // LOGIC: Check if 'Doxycycline' exists in the allergies string
        const allergyStr = data.allergies || '';
        const hasDoxyAllergy = allergyStr.toLowerCase().includes('doxy');
        setAllergy(hasDoxyAllergy);
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('visit_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (data) setHistory(data);
      }
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };

  const handleSymptomSelection = () => {
    setStage(STAGES.TREATMENT_LOADING);
    setTimeout(() => {
      setStage(STAGES.PHARMACY);
    }, 3000);
  };

  const handleUpdatePharmacy = async () => {
    if (!tempPharmacy.trim()) return;
    setIsUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('users').update({ pharmacy: tempPharmacy }).eq('id', user.id);
        setPharmacy(tempPharmacy);
        setIsModalVisible(false);
      }
    } catch (err) {
      Alert.alert("Update Failed", err.message);
    } finally { setIsUpdating(false); }
  };

 const sendEmailSummary = async () => {
    setIsSending(true);
    try {
      // This helper now uses the DB-backed allergy state
      const med = getMedication(); 
      const { data: { user } } = await supabase.auth.getUser();

      const visitRecord = {
        user_id: user.id,
        exposure_type: selectedSTD,
        medication_name: med.name,
        medication_rx: med.rx,
        medication_qty: med.qty,
        instruction: med.instruction,
        pharmacy_sent: pharmacy,
        diagnosis: `Exposure to ${selectedSTD}`,
        first_name: userData.firstName,
        last_name: userData.lastName,
        user_email: userData.email,
        dob: userData.dob
      };

      if (options.archive) {
        const { error: insertError } = await supabase
          .from('visit_history')
          .insert([visitRecord]);
        if (insertError) throw insertError;
      }

      if (options.email) {
        await supabase.functions.invoke('send-visit-receipt', {
          body: visitRecord
        });
      }

      Alert.alert("Success!", "Visit finalized and summary sent.");
      await fetchHistory();
      setSelectedSTD('');
      // Note: We don't reset 'allergy' here because it's a persistent profile trait
      setStage(STAGES.HISTORY);

    } catch (err) {
      console.error("Finalize Error:", err);
      Alert.alert("Error", "Could not finalize visit.");
    } finally {
      setIsSending(false);
    }
  };

  const getMedication = () => {
    if (allergy) {
      // Plan for patients with Doxycycline allergy
      return { 
        name: 'Azythromycin 1g', 
        rx: 'by mouth x 1 dose', 
        qty: '1 dose',
        instruction: 'Complete the full course of treatment. This medication was selected due to reported allergies to standard treatments.'
      };
    }
    // Standard Plan
    return { 
      name: 'Doxycycline 100mg', 
      rx: 'twice daily x 7 days', 
      qty: 'Quantity 14 tablets, no refills',
      instruction: 'Limit sun exposure, use shade to reduce direct sun exposure while taking Doxycycline to prevent sun allergy/sensitivity.'
    };
  };

  const BackButton = ({ to }) => (
    <TouchableOpacity style={styles.backBtn} onPress={() => setStage(to)}>
      <Ionicons name="arrow-back" size={20} color={BRAND_BLUE} />
      <Text style={styles.backBtnText}>Go Back</Text>
    </TouchableOpacity>
  );

  const ActionCard = ({ title, onPress, color = '#f8f9fa' }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <Text style={styles.cardText}>{title}</Text>
        <MaterialIcons name="chevron-right" size={24} color="#cbd5e0" />
      </View>
    </TouchableOpacity>
  );

  const CheckItem = ({ label, value, onPress }) => (
    <TouchableOpacity style={styles.checkRow} onPress={onPress}>
      <Ionicons name={value ? "checkbox" : "square-outline"} size={22} color={BRAND_BLUE} />
      <Text style={styles.checkLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Navigation - SWAPPED: New Visit Left, History Right */}
        <View style={styles.topNav}>
           <TouchableOpacity onPress={() => setStage(STAGES.EXPOSURE)}>
              <Text style={[styles.topNavText, stage !== STAGES.HISTORY && {color: BRAND_BLUE}]}>New Visit</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={() => setStage(STAGES.HISTORY)}>
              <Text style={[styles.topNavText, stage === STAGES.HISTORY && {color: BRAND_BLUE}]}>History</Text>
           </TouchableOpacity>
        </View>

        {stage !== STAGES.SUMMARY && stage !== STAGES.HISTORY && stage !== STAGES.TREATMENT_LOADING && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${((Object.keys(STAGES).indexOf(stage) + 1) / 5) * 100}%` }]} />
            </View>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          
          {/* HISTORY VIEW - RESTORED FULL LAYOUT */}
{/* HISTORY VIEW - UPDATED WITH ARCHIVE TEXT */}
{stage === STAGES.HISTORY && (
  <View>
    <Text style={styles.title}>History</Text>
    <Text style={styles.subtitle}>Previous visit records</Text>
    {history.map((item) => {
      const dateObj = new Date(item.created_at);
      const timeStr = dateObj.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      return (
        <TouchableOpacity 
          key={item.id} 
          style={styles.historyCard} 
          onPress={() => { setSelectedVisit(item); setIsDetailVisible(true); }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.historyDate}>
              {dateObj.toLocaleDateString(undefined, { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </Text>
            <Text style={styles.historyTitle}>{item.exposure_type}</Text>
            <Text style={styles.smallLabel} numberOfLines={1}>{item.pharmacy_sent}</Text>
          </View>

          {/* RIGHT SIDE: Time, Icon, and Archive Text */}
          <View style={styles.historyRightSide}>
            <Text style={styles.historyTime}>{timeStr}</Text>
            <View style={styles.statusBadge}>
              <MaterialIcons name="receipt" size={20} color={BRAND_BLUE} />
            </View>
            {/* NEW: Archive text on bottom right */}
            <Text style={styles.archiveLabel}>Archived</Text> 
          </View>
        </TouchableOpacity>
      );
    })}
  </View>
)}

          {stage === STAGES.EXPOSURE && (
  <View>
    <Text style={styles.title}>Std exposure</Text>
    <Text style={styles.subtitle}>Access confidential treatment and advice for potential std exposures safely and discreetly.</Text>
    <Text style={styles.subtitle}>Select the specific exposure type to begin.</Text>
    {['Chlamydia', 'Trichomonas', 'Chlamydia and trichomonas', 'Gonorrhea']
      .sort() // This sorts them: Chlamydia, Chlamydia and..., Gonorrhea, Trichomonas
      .map(item => (
        <ActionCard 
          key={item} 
          title={item} 
          onPress={() => { 
            setSelectedSTD(item); 
            setStage(STAGES.PARTNER); 
          }} 
        />
      ))}
  </View>
)}

          {stage === STAGES.PARTNER && (
            <View>
              <Text style={styles.title}>Partner Context</Text>
              <ActionCard title={`My partner has ${selectedSTD}`} onPress={() => setStage(STAGES.SYMPTOMS)} />
              <BackButton to={STAGES.EXPOSURE} />
            </View>
          )}

          {stage === STAGES.SYMPTOMS && (
            <View>
              <Text style={styles.title}>Symptom Check</Text>
              <ActionCard title="I have no symptoms" onPress={handleSymptomSelection} />
              <ActionCard title="I have symptoms" color="#fff5f5" onPress={handleSymptomSelection} />
              <BackButton to={STAGES.PARTNER} />
            </View>
          )}

          {stage === STAGES.TREATMENT_LOADING && (
            <View style={styles.centerBox}>
              <View style={styles.processingOval}><Text style={styles.ovalText}>Preparing treatment</Text></View>
              <ActivityIndicator size="large" color={BRAND_BLUE} style={{marginTop: 20}} />
              <Text style={[styles.question, {marginTop: 20}]}>Designing your clinical plan...</Text>
            </View>
          )}

          {stage === STAGES.PHARMACY && (
            <View>
              <Text style={styles.title}>Pharmacy Selection</Text>
              <View style={styles.pharmacyDisplayCard}>
                <Text style={styles.smallLabel}>Current Pharmacy:</Text>
                <Text style={styles.pharmacyAddress}>{pharmacy}</Text>
              </View>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setStage(STAGES.SUMMARY)}>
                <Text style={styles.primaryBtnText}>Yes, send to my pharmacy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => { setTempPharmacy(pharmacy); setIsModalVisible(true); }}>
                <Text style={styles.secondaryBtnText}>Change pharmacy</Text>
              </TouchableOpacity>
              <BackButton to={STAGES.SYMPTOMS} />
            </View>
          )}

          {stage === STAGES.SUMMARY && (
             <View style={styles.receiptContainer}>
               <View style={styles.profileHeader}>
                 <Text style={styles.headerText}>Patient's name: <Text style={styles.boldText}>{userData.firstName} {userData.lastName}</Text></Text>
                 <Text style={styles.headerText}>D O S: {currentDate}</Text>
                 <Text style={styles.headerText}>D O B: {userData.dob}</Text>
                 <Text style={styles.headerText}>Visit type - Std exposure</Text>
                 <Text style={styles.headerText}>Provider - Kiataker</Text>
               </View>

               <View style={styles.blueLabelBox}><Text style={styles.labelWhiteText}>Visit summary</Text></View>
               
               <View style={styles.receiptSection}>
                 <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Reason for visit</Text></View>
                 <Text style={styles.receiptValue}>- Std exposure—{selectedSTD}</Text>
               </View>

               <View style={styles.receiptSection}>
                 <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Diagnosis</Text></View>
                 <Text style={styles.receiptValue}>- Exposure to {selectedSTD.toLowerCase()}</Text>
               </View>

               <View style={styles.receiptSection}>
                 <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Treatment provided</Text></View>
                 <Text style={styles.receiptValue}>- {getMedication().name} {getMedication().rx}</Text>
                 <Text style={styles.receiptValue}>- {getMedication().qty}</Text>
                 <Text style={styles.receiptValue}>- Sent to: {pharmacy}</Text>
               </View>

               <View style={styles.receiptSection}>
                 <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Instructions</Text></View>
                 <Text style={styles.bullet}>• Complete the full course of treatment</Text>
                 <Text style={styles.bullet}>• {getMedication().instruction}</Text>
                 <Text style={styles.bullet}>• Abstain from sexual activity until treatment is completed.</Text>
               </View>

               <View style={styles.receiptSection}>
                 <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Follow up</Text></View>
                 <Text style={styles.receiptValue}>- Follow up w your PCP within 3 days for std screening.</Text>
               </View>

              <View style={styles.finalFooter}>
  <View style={styles.completeOval}><Text style={styles.completeText}>visit complete</Text></View>
  <Text style={styles.thanks}>Thank you for your visit 🙂</Text>
  <View style={styles.hopeOval}><Text style={styles.hopeText}>I hope you feel better soon</Text></View>
  
  {/* FIXED: Changed div to View here */}
  <View style={styles.optionsBox}>
    <CheckItem label="Send to my email" value={options.email} onPress={() => setOptions({...options, email: !options.email})} />
    <CheckItem label="Archive visit" value={options.archive} onPress={() => setOptions({...options, archive: !options.archive})} />
    <CheckItem label="Notify PCP" value={options.pcp} onPress={() => setOptions({...options, pcp: !options.pcp})} />
  </View>

  <TouchableOpacity 
    style={[styles.primaryBtn, {width: '100%', marginTop: 20}]} 
    onPress={sendEmailSummary}
    disabled={isSending}
  >
    {isSending ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Finalize & Send Summary</Text>}
  </TouchableOpacity>
</View>
             </View>
          )}
        </ScrollView>

        <Modal visible={isModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Update Pharmacy</Text>
              <TextInput style={styles.modalInput} value={tempPharmacy} onChangeText={setTempPharmacy} multiline />
              <View style={styles.row}>
                <TouchableOpacity style={[styles.choiceBtn, {borderColor: '#ccc'}]} onPress={() => setIsModalVisible(false)}><Text>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.choiceBtn, {backgroundColor: BRAND_BLUE, borderColor: BRAND_BLUE}]} onPress={handleUpdatePharmacy}>
                  {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={{color: '#fff', fontWeight: 'bold'}}>Save</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* HISTORY DETAIL MODAL - RESTORED FULL LAYOUT */}
        <Modal visible={isDetailVisible} animationType="slide">
          <SafeAreaView style={{flex: 1}}>
            <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setIsDetailVisible(false)}><Ionicons name="close" size={28} /></TouchableOpacity>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>Visit Record</Text>
                <View style={{width: 28}} />
            </View>
            <ScrollView style={{padding: 20}}>
              {selectedVisit && (
                <View style={styles.receiptContainer}>
                   <View style={styles.profileHeader}>
                      <Text style={styles.headerText}>Patient's name: <Text style={styles.boldText}>{userData.firstName} {userData.lastName}</Text></Text>
                      <Text style={styles.headerText}>D O S: {new Date(selectedVisit.created_at).toLocaleDateString()}</Text>
                      <Text style={styles.headerText}>D O B: {userData.dob}</Text>
                      <Text style={styles.headerText}>Visit type - Std exposure</Text>
                      <Text style={styles.headerText}>Provider - Kiataker</Text>
                   </View>

                   <View style={styles.blueLabelBox}><Text style={styles.labelWhiteText}>Visit summary</Text></View>
                   
                   <View style={styles.receiptSection}>
                      <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Reason for visit</Text></View>
                      <Text style={styles.receiptValue}>- Std exposure—{selectedVisit.exposure_type}</Text>
                   </View>

                   <View style={styles.receiptSection}>
                      <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Diagnosis</Text></View>
                      <Text style={styles.receiptValue}>- {selectedVisit.diagnosis}</Text>
                   </View>

                   <View style={styles.receiptSection}>
                      <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Treatment provided</Text></View>
                      <Text style={styles.receiptValue}>- {selectedVisit.medication_name} {selectedVisit.medication_rx}</Text>
                      <Text style={styles.receiptValue}>- {selectedVisit.medication_qty}</Text>
                      <Text style={styles.receiptValue}>- Sent to: {selectedVisit.pharmacy_sent}</Text>
                   </View>

                   <View style={styles.receiptSection}>
                      <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Instructions</Text></View>
                      <Text style={styles.bullet}>• Complete the full course of treatment</Text>
                      <Text style={styles.bullet}>• {selectedVisit.instruction || 'Follow provider advice.'}</Text>
                   </View>

                   <View style={styles.receiptSection}>
                     <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Follow up</Text></View>
                     <Text style={styles.receiptValue}>- Follow up w your PCP within 3 days for std screening.</Text>
                   </View>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  topNav: { flexDirection: 'row', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', marginBottom: 15,justifyContent:"space-between" },
  topNavText: { fontWeight: 'bold', color: '#cbd5e0' },
  title: { fontSize: 26, fontWeight: '800', color: BRAND_RED, marginBottom: 5 },
  subtitle: { fontSize: 15, color: '#718096', marginBottom: 20 },
  progressContainer: { marginBottom: 20 },
  progressBar: { height: 4, backgroundColor: '#edf2f7', borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: BRAND_BLUE, borderRadius: 2 },
  card: { padding: 18, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#edf2f7' },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardText: { fontSize: 16, fontWeight: '600' },
  pharmacyDisplayCard: { padding: 15, backgroundColor: '#f7fafc', borderRadius: 10, marginBottom: 15 },
  pharmacyAddress: { fontSize: 15, marginTop: 5 },
  primaryBtn: { backgroundColor: BRAND_BLUE, padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  secondaryBtn: { padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: BRAND_BLUE, marginBottom: 10 },
  secondaryBtnText: { color: BRAND_BLUE, fontWeight: 'bold' },
  centerBox: { alignItems: 'center', marginTop: 30 },
  processingOval: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 2, borderColor: BRAND_BLUE, marginBottom: 15 },
  ovalText: { color: BRAND_BLUE, fontWeight: 'bold' },
  question: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
  row: { flexDirection: 'row', gap: 10 },
  choiceBtn: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingVertical: 5 },
  backBtnText: { color: BRAND_BLUE, fontWeight: '600', marginLeft: 5 },
  historyCard: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  historyDate: { fontSize: 12, fontWeight: 'bold', color: BRAND_BLUE },
  historyTitle: { fontSize: 16, fontWeight: '700' },
  receiptContainer: { backgroundColor: '#fff', padding: 5 },
  profileHeader: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 15 },
  headerText: { fontSize: 14, color: '#4a5568', marginBottom: 4 },
  boldText: { fontWeight: '700', color: '#1a202c' },
  blueLabelBox: { backgroundColor: BRAND_BLUE, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', borderRadius: 4, marginBottom: 15 },
  inlineLabel: { backgroundColor: BRAND_BLUE, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start', borderRadius: 3, marginBottom: 6 },
  labelWhiteText: { color: '#fff', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
  receiptSection: { marginBottom: 20 },
  receiptValue: { fontSize: 15, marginLeft: 5, color: '#2d3748', lineHeight: 22 },
  bullet: { fontSize: 14, color: '#4a5568', marginLeft: 10, marginBottom: 6, lineHeight: 20 },
  finalFooter: { marginTop: 10, alignItems: 'center', padding: 15, backgroundColor: '#f8fafc', borderRadius: 20 },
  completeOval: { paddingHorizontal: 22, paddingVertical: 8, borderRadius: 25, borderWidth: 1.5, borderColor: '#2d3748', marginBottom: 12 },
  completeText: { fontSize: 14, fontWeight: '700', textTransform: 'lowercase' },
  thanks: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  hopeOval: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 5, borderColor: '#cbd5e0', marginBottom: 20 },
  hopeText: { fontSize: 13, color: '#718096', fontStyle: 'italic' },
  optionsBox: { width: '100%', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 20 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkLabel: { marginLeft: 12, fontSize: 15, color: '#4a5568' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 15, padding: 20 },
  modalInput: { borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, height: 80, marginBottom: 15 },
  modalTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  smallLabel: { fontSize: 12, fontWeight: 'bold', color: BRAND_BLUE },
historyRightSide: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'relative',
    paddingBottom: 10, // Creates a small buffer for the absolute text
  },
  historyTime: {
    fontSize: 11,
    color: '#94a3b8', // Softer blue-gray
    marginBottom: 4,
    fontWeight: '600',
    // Using a monospaced font for time looks very "medical record" professional
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
  },
  statusBadge: {
    padding: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  archiveLabel: {
    position: 'absolute',
    bottom: -5,
    right: 0,
    fontSize: 8,
    color: '#94a3b8',
    fontWeight: 'bold',
    letterSpacing: 0.6, // Increases professional look
    textTransform: 'uppercase', // Uppercase with spacing is a classic professional UI pattern
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Medium' : 'sans-serif-medium',
  },
});






// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   SafeAreaView,
//   Modal,
//   TextInput,
//   ActivityIndicator,
// } from 'react-native';
// import { supabase } from '../supabase'; 
// import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// const STAGES = {
//   EXPOSURE: 'EXPOSURE',
//   PARTNER: 'PARTNER',
//   SYMPTOMS: 'SYMPTOMS',
//   ALLERGY: 'ALLERGY',
//   PHARMACY: 'PHARMACY',
//   SUMMARY: 'SUMMARY',
// };

// const BRAND_BLUE = '#3182ce';
// const BRAND_RED = '#8B0000';

// export default function STDExposureScreen() {
//   const [stage, setStage] = useState(STAGES.EXPOSURE);
//   const [selectedSTD, setSelectedSTD] = useState('');
//   const [allergy, setAllergy] = useState(false);

//   // Profile Data
//   const [userData, setUserData] = useState({ firstName: '', lastName: '', dob: '', email: '' });
//   const [pharmacy, setPharmacy] = useState('');
//   const [tempPharmacy, setTempPharmacy] = useState('');
  
//   // UI States
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [isSending, setIsSending] = useState(false);
//   const [options, setOptions] = useState({ email: true, archive: true, pcp: false });
  
//   const currentDate = new Date().toLocaleDateString();

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) {
//         const { data } = await supabase
//           .from('users')
//           .select('first_name, last_name, dob, pharmacy, email')
//           .eq('id', user.id)
//           .single();

//         if (data) {
//           setUserData({
//             firstName: data.first_name || '',
//             lastName: data.last_name || '',
//             dob: data.dob || '',
//             email: data.email || ''
//           });
//           setPharmacy(data.pharmacy || 'No pharmacy address on file');
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching profile:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdatePharmacy = async () => {
//     if (!tempPharmacy.trim()) return;
//     setIsUpdating(true);
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) {
//         await supabase.from('users').update({ pharmacy: tempPharmacy }).eq('id', user.id);
//         setPharmacy(tempPharmacy);
//         setIsModalVisible(false);
//       }
//     } catch (err) {
//       Alert.alert("Update Failed", err.message);
//     } finally { setIsUpdating(false); }
//   };

//   // REAL EMAIL FUNCTIONALITY
//   const sendEmailSummary = async () => {
//     if (!options.email) {
//       Alert.alert("Process Complete", "Visit has been recorded in your history.");
//       return;
//     }

//     setIsSending(true);
//     try {
//       const med = getMedication();
//       const { data, error } = await supabase.functions.invoke('send-visit-receipt', {
//         body: {
//           email: userData.email,
//           firstName: userData.firstName,
//           lastName: userData.lastName,
//           dob: userData.dob,
//           dos: currentDate,
//           diagnosis: `Exposure to ${selectedSTD}`,
//           medication: `${med.name} (${med.rx})`,
//           pharmacy: pharmacy
//         }
//       });

//       if (error) throw error;

//       Alert.alert("Success!", `A professional summary has been sent to ${userData.email}`);
//     } catch (err) {
//       console.error("Email error:", err);
//       Alert.alert("Email Error", "Could not send email summary. Please check your internet connection.");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const getMedication = () => {
//     if (allergy) {
//       return { 
//         name: 'Azythromycin 1g', 
//         rx: 'by mouth x 1 dose', 
//         qty: '1 dose',
//         instruction: 'Complete the full course of treatment.'
//       };
//     }
//     return { 
//       name: 'Doxycycline 100mg', 
//       rx: 'twice daily x 7 days', 
//       qty: 'Quantity 14 tablets, no refills',
//       instruction: 'Limit sun exposure, use shade to reduce direct sun exposure while taking Doxycycline to prevent sun allergy/sensitivity.'
//     };
//   };

//   const BackButton = ({ to }) => (
//     <TouchableOpacity style={styles.backBtn} onPress={() => setStage(to)}>
//       <Ionicons name="arrow-back" size={20} color={BRAND_BLUE} />
//       <Text style={styles.backBtnText}>Go Back</Text>
//     </TouchableOpacity>
//   );

//   const ActionCard = ({ title, onPress, color = '#f8f9fa' }) => (
//     <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.7}>
//       <View style={styles.cardContent}>
//         <Text style={styles.cardText}>{title}</Text>
//         <MaterialIcons name="chevron-right" size={24} color="#cbd5e0" />
//       </View>
//     </TouchableOpacity>
//   );

//   const CheckItem = ({ label, value, onPress }) => (
//     <TouchableOpacity style={styles.checkRow} onPress={onPress}>
//       <Ionicons name={value ? "checkbox" : "square-outline"} size={22} color={BRAND_BLUE} />
//       <Text style={styles.checkLabel}>{label}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
        
//         {stage !== STAGES.SUMMARY && (
//           <View style={styles.progressContainer}>
//             <View style={styles.progressBar}>
//               <View style={[styles.progressFill, { width: `${((Object.keys(STAGES).indexOf(stage) + 1) / 5) * 100}%` }]} />
//             </View>
//           </View>
//         )}

//         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
//           {stage === STAGES.EXPOSURE && (
//             <View>
//               <Text style={styles.title}>Std exposure</Text>
//               <Text style={styles.subtitle}>Select the specific exposure type to begin.</Text>
//               {['Chlamydia', 'Trichomonas', 'Chlamydia and trichomonas'].map(item => (
//                 <ActionCard key={item} title={item} onPress={() => { setSelectedSTD(item); setStage(STAGES.PARTNER); }} />
//               ))}
//             </View>
//           )}

//           {stage === STAGES.PARTNER && (
//             <View>
//               <Text style={styles.title}>Partner Context</Text>
//               <ActionCard title={`My partner has ${selectedSTD}`} onPress={() => setStage(STAGES.SYMPTOMS)} />
//               <BackButton to={STAGES.EXPOSURE} />
//             </View>
//           )}

//           {stage === STAGES.SYMPTOMS && (
//             <View>
//               <Text style={styles.title}>Symptom Check</Text>
//               <ActionCard title="I have no symptoms" onPress={() => setStage(STAGES.ALLERGY)} />
//               <ActionCard title="I have symptoms" color="#fff5f5" onPress={() => Alert.alert("Clinic Visit Required", "Please visit a clinic for an exam.")} />
//               <BackButton to={STAGES.PARTNER} />
//             </View>
//           )}

//           {stage === STAGES.ALLERGY && (
//             <View style={styles.centerBox}>
//               <View style={styles.processingOval}><Text style={styles.ovalText}>Preparing treatment</Text></View>
//               <Text style={styles.question}>Do you have a Doxycycline allergy?</Text>
              
//               <View style={styles.row}>
//                 <TouchableOpacity style={[styles.choiceBtn, {borderColor: BRAND_RED}]} onPress={() => { setAllergy(true); setStage(STAGES.PHARMACY); }}>
//                   <Text style={{color: BRAND_RED, fontWeight: 'bold'}}>Yes (Allergic)</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.choiceBtn, {backgroundColor: BRAND_BLUE, borderColor: BRAND_BLUE}]} onPress={() => { setAllergy(false); setStage(STAGES.PHARMACY); }}>
//                   <Text style={{color: '#fff', fontWeight: 'bold'}}>No Allergy</Text>
//                 </TouchableOpacity>
//               </View>
//               <View style={{marginTop: 30, width: '100%'}}>
//                 <BackButton to={STAGES.SYMPTOMS} />
//               </View>
//             </View>
//           )}

//           {stage === STAGES.PHARMACY && (
//             <View>
//               <Text style={styles.title}>Pharmacy Selection</Text>
//               <View style={styles.pharmacyDisplayCard}>
//                 <Text style={styles.smallLabel}>Current Pharmacy:</Text>
//                 <Text style={styles.pharmacyAddress}>{pharmacy}</Text>
//               </View>
//               <TouchableOpacity style={styles.primaryBtn} onPress={() => setStage(STAGES.SUMMARY)}>
//                 <Text style={styles.primaryBtnText}>Yes, send to my pharmacy</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.secondaryBtn} onPress={() => { setTempPharmacy(pharmacy); setIsModalVisible(true); }}>
//                 <Text style={styles.secondaryBtnText}>Change pharmacy</Text>
//               </TouchableOpacity>
//               <BackButton to={STAGES.ALLERGY} />
//             </View>
//           )}

//           {stage === STAGES.SUMMARY && (
//             <View style={styles.receiptContainer}>
//               <View style={styles.profileHeader}>
//                 <Text style={styles.headerText}>Patient's name: <Text style={styles.boldText}>{userData.firstName} {userData.lastName}</Text></Text>
//                 <Text style={styles.headerText}>D O S: {currentDate}</Text>
//                 <Text style={styles.headerText}>D O B: {userData.dob}</Text>
//                 <Text style={styles.headerText}>Visit type - Std exposure</Text>
//                 <Text style={styles.headerText}>Provider - Kiataker</Text>
//               </View>

//               <View style={styles.blueLabelBox}><Text style={styles.labelWhiteText}>Visit summary</Text></View>
              
//               <View style={styles.receiptSection}>
//                 <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Reason for visit</Text></View>
//                 <Text style={styles.receiptValue}>- Std exposure—{selectedSTD}</Text>
//               </View>

//               <View style={styles.receiptSection}>
//                 <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Diagnosis</Text></View>
//                 <Text style={styles.receiptValue}>- Exposure to {selectedSTD.toLowerCase()}</Text>
//               </View>

//               <View style={styles.receiptSection}>
//                 <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Treatment provided</Text></View>
//                 <Text style={styles.receiptValue}>- {getMedication().name} {getMedication().rx}</Text>
//                 <Text style={styles.receiptValue}>- {getMedication().qty}</Text>
//                 <Text style={styles.receiptValue}>- Sent to: {pharmacy}</Text>
//               </View>

//               <View style={styles.receiptSection}>
//                 <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Instructions</Text></View>
//                 <Text style={styles.bullet}>• Complete the full course of treatment</Text>
//                 <Text style={styles.bullet}>• {getMedication().instruction}</Text>
//                 <Text style={styles.bullet}>• Abstain from sexual activity until treatment is completed.</Text>
//               </View>

//               <View style={styles.receiptSection}>
//                 <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Follow up</Text></View>
//                 <Text style={styles.receiptValue}>- Follow up w your PCP within 3 days for std screening.</Text>
//               </View>

//               <View style={styles.finalFooter}>
//                 <View style={styles.completeOval}><Text style={styles.completeText}>visit complete</Text></View>
//                 <Text style={styles.thanks}>Thank you for your visit 🙂</Text>
//                 <View style={styles.hopeOval}><Text style={styles.hopeText}>I hope you feel better soon</Text></View>
                
//                 <View style={styles.optionsBox}>
//                   <CheckItem label="Send to my email" value={options.email} onPress={() => setOptions({...options, email: !options.email})} />
//                   <CheckItem label="Archive visit" value={options.archive} onPress={() => setOptions({...options, archive: !options.archive})} />
//                   <CheckItem label="Notify PCP" value={options.pcp} onPress={() => setOptions({...options, pcp: !options.pcp})} />
//                 </View>

//                 <TouchableOpacity 
//                   style={[styles.primaryBtn, {width: '100%', marginTop: 20}]} 
//                   onPress={sendEmailSummary}
//                   disabled={isSending}
//                 >
//                   {isSending ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Finalize & Send Summary</Text>}
//                 </TouchableOpacity>

//                 <TouchableOpacity style={{marginTop: 15}} onPress={() => setStage(STAGES.PHARMACY)}>
//                   <Text style={{color: BRAND_BLUE, fontSize: 14}}>Edit Details</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         </ScrollView>

//         <Modal visible={isModalVisible} transparent animationType="fade">
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Update Pharmacy</Text>
//               <TextInput style={styles.modalInput} value={tempPharmacy} onChangeText={setTempPharmacy} multiline />
//               <View style={styles.row}>
//                 <TouchableOpacity style={[styles.choiceBtn, {borderColor: '#ccc'}]} onPress={() => setIsModalVisible(false)}>
//                   <Text>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.choiceBtn, {backgroundColor: BRAND_BLUE, borderColor: BRAND_BLUE}]} onPress={handleUpdatePharmacy}>
//                   {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={{color: '#fff', fontWeight: 'bold'}}>Save & Update</Text>}
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>

//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#fff' },
//   container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
//   title: { fontSize: 26, fontWeight: '800', color: '#1a202c', marginBottom: 5 },
//   subtitle: { fontSize: 15, color: '#718096', marginBottom: 20 },
//   progressContainer: { marginBottom: 20 },
//   progressBar: { height: 4, backgroundColor: '#edf2f7', borderRadius: 2 },
//   progressFill: { height: 4, backgroundColor: BRAND_BLUE, borderRadius: 2 },
//   card: { padding: 18, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#edf2f7' },
//   cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   cardText: { fontSize: 16, fontWeight: '600' },
//   pharmacyDisplayCard: { padding: 15, backgroundColor: '#f7fafc', borderRadius: 10, marginBottom: 15 },
//   pharmacyAddress: { fontSize: 15, marginTop: 5 },
//   primaryBtn: { backgroundColor: BRAND_BLUE, padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
//   primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   secondaryBtn: { padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: BRAND_BLUE, marginBottom: 10 },
//   secondaryBtnText: { color: BRAND_BLUE, fontWeight: 'bold' },
//   centerBox: { alignItems: 'center', marginTop: 30 },
//   processingOval: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 2, borderColor: BRAND_BLUE, marginBottom: 15 },
//   ovalText: { color: BRAND_BLUE, fontWeight: 'bold' },
//   question: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
//   row: { flexDirection: 'row', gap: 10 },
//   choiceBtn: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
//   backBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingVertical: 5 },
//   backBtnText: { color: BRAND_BLUE, fontWeight: '600', marginLeft: 5 },
//   receiptContainer: { backgroundColor: '#fff', padding: 5 },
//   profileHeader: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 15 },
//   headerText: { fontSize: 14, color: '#4a5568', marginBottom: 4 },
//   boldText: { fontWeight: '700', color: '#1a202c' },
//   blueLabelBox: { backgroundColor: BRAND_BLUE, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', borderRadius: 4, marginBottom: 15 },
//   inlineLabel: { backgroundColor: BRAND_BLUE, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start', borderRadius: 3, marginBottom: 6 },
//   labelWhiteText: { color: '#fff', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
//   receiptSection: { marginBottom: 20 },
//   receiptValue: { fontSize: 15, marginLeft: 5, color: '#2d3748', lineHeight: 22 },
//   bullet: { fontSize: 14, color: '#4a5568', marginLeft: 10, marginBottom: 6, lineHeight: 20 },
//   finalFooter: { marginTop: 10, alignItems: 'center', padding: 15, backgroundColor: '#f8fafc', borderRadius: 20 },
//   completeOval: { paddingHorizontal: 22, paddingVertical: 8, borderRadius: 25, borderWidth: 1.5, borderColor: '#2d3748', marginBottom: 12 },
//   completeText: { fontSize: 14, fontWeight: '700', textTransform: 'lowercase' },
//   thanks: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
//   hopeOval: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 5, borderColor: '#cbd5e0', marginBottom: 20 },
//   hopeText: { fontSize: 13, color: '#718096', fontStyle: 'italic' },
//   optionsBox: { width: '100%', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 20 },
//   checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   checkLabel: { marginLeft: 12, fontSize: 15, color: '#4a5568' },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
//   modalContent: { backgroundColor: '#fff', borderRadius: 15, padding: 20 },
//   modalInput: { borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, height: 80, marginBottom: 15 },
//   modalTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
//   smallLabel: { fontSize: 12, fontWeight: 'bold', color: BRAND_BLUE }
// });



// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   SafeAreaView,
//   Modal,
//   TextInput,
//   ActivityIndicator,
// } from 'react-native';
// import { supabase } from '../supabase'; 
// import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// const STAGES = {
//   EXPOSURE: 'EXPOSURE',
//   PARTNER: 'PARTNER',
//   SYMPTOMS: 'SYMPTOMS',
//   ALLERGY: 'ALLERGY',
//   PHARMACY: 'PHARMACY',
//   SUMMARY: 'SUMMARY',
// };

// const BRAND_BLUE = '#3182ce';
// const BRAND_RED = '#8B0000';

// export default function STDExposureScreen() {
//   const [stage, setStage] = useState(STAGES.EXPOSURE);
//   const [selectedSTD, setSelectedSTD] = useState('');
//   const [allergy, setAllergy] = useState(false);

//   // Profile Data
//   const [userData, setUserData] = useState({ firstName: '', lastName: '', dob: '', email: '' });
//   const [pharmacy, setPharmacy] = useState('');
//   const [tempPharmacy, setTempPharmacy] = useState('');
  
//   // UI States
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [isSending, setIsSending] = useState(false);
//   const [options, setOptions] = useState({ email: true, archive: true, pcp: false });
  
//   const currentDate = new Date().toLocaleDateString();

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) {
//         const { data, error } = await supabase
//           .from('users')
//           .select('first_name, last_name, dob, pharmacy, email')
//           .eq('id', user.id)
//           .single();

//         if (data) {
//           setUserData({
//             firstName: data.first_name || '',
//             lastName: data.last_name || '',
//             dob: data.dob || '',
//             email: data.email || ''
//           });
//           setPharmacy(data.pharmacy || 'No pharmacy address on file');
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching profile:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdatePharmacy = async () => {
//     if (!tempPharmacy.trim()) return;
//     setIsUpdating(true);
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) {
//         await supabase.from('users').update({ pharmacy: tempPharmacy }).eq('id', user.id);
//         setPharmacy(tempPharmacy);
//         setIsModalVisible(false);
//       }
//     } catch (err) {
//       Alert.alert("Update Failed", err.message);
//     } finally { setIsUpdating(false); }
//   };

//   const sendEmailSummary = async () => {
//     if (!options.email) {
//       Alert.alert("Process Complete", "Visit has been recorded in your history.");
//       return;
//     }
//     setIsSending(true);
//     setTimeout(() => {
//       setIsSending(false);
//       Alert.alert("Sent!", `A professional summary has been sent to ${userData.email}`);
//     }, 1500);
//   };

//   const getMedication = () => {
//     if (allergy) {
//       return { 
//         name: 'Azythromycin 1g', 
//         rx: 'by mouth x 1 dose', 
//         qty: '1 dose',
//         instruction: 'Complete the full course of treatment.'
//       };
//     }
//     return { 
//       name: 'Doxycycline 100mg', 
//       rx: 'twice daily x 7 days', 
//       qty: 'Quantity 14 tablets, no refills',
//       instruction: 'Limit sun exposure, use shade to reduce direct sun exposure while taking Doxycycline to prevent sun allergy/sensitivity.'
//     };
//   };

//   const ActionCard = ({ title, onPress, color = '#f8f9fa' }) => (
//     <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.7}>
//       <View style={styles.cardContent}>
//         <Text style={styles.cardText}>{title}</Text>
//         <MaterialIcons name="chevron-right" size={24} color="#cbd5e0" />
//       </View>
//     </TouchableOpacity>
//   );

//   const CheckItem = ({ label, value, onPress }) => (
//     <TouchableOpacity style={styles.checkRow} onPress={onPress}>
//       <Ionicons name={value ? "checkbox" : "square-outline"} size={22} color={BRAND_BLUE} />
//       <Text style={styles.checkLabel}>{label}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
        
//         {stage !== STAGES.SUMMARY && (
//           <View style={styles.progressContainer}>
//             <View style={styles.progressBar}>
//               <View style={[styles.progressFill, { width: `${((Object.keys(STAGES).indexOf(stage) + 1) / 5) * 100}%` }]} />
//             </View>
//           </View>
//         )}

//         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
//           {stage === STAGES.EXPOSURE && (
//             <View>
//               <Text style={styles.title}>Std exposure</Text>
//               <Text style={styles.subtitle}>Select the specific exposure type to begin.</Text>
//               {['Chlamydia', 'Trichomonas', 'Chlamydia and trichomonas'].map(item => (
//                 <ActionCard key={item} title={item} onPress={() => { setSelectedSTD(item); setStage(STAGES.PARTNER); }} />
//               ))}
//             </View>
//           )}

//           {stage === STAGES.PARTNER && (
//             <View>
//               <Text style={styles.title}>Partner Context</Text>
//               <ActionCard title={`My partner has ${selectedSTD}`} onPress={() => setStage(STAGES.SYMPTOMS)} />
//             </View>
//           )}

//           {stage === STAGES.SYMPTOMS && (
//             <View>
//               <Text style={styles.title}>Symptom Check</Text>
//               <ActionCard title="I have no symptoms" onPress={() => setStage(STAGES.ALLERGY)} />
//               <ActionCard title="I have symptoms" color="#fff5f5" onPress={() => Alert.alert("Clinic Visit Required", "Please visit a clinic for an exam.")} />
//             </View>
//           )}

//           {stage === STAGES.ALLERGY && (
//             <View style={styles.centerBox}>
//               <View style={styles.processingOval}><Text style={styles.ovalText}>Preparing treatment</Text></View>
//               <Text style={styles.question}>Do you have a Doxycycline allergy?</Text>
              
//               <View style={styles.row}>
//                 <TouchableOpacity style={[styles.choiceBtn, {borderColor: BRAND_RED}]} onPress={() => { setAllergy(true); setStage(STAGES.PHARMACY); }}>
//                   <Text style={{color: BRAND_RED, fontWeight: 'bold'}}>Yes (Allergic)</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.choiceBtn, {backgroundColor: BRAND_BLUE, borderColor: BRAND_BLUE}]} onPress={() => { setAllergy(false); setStage(STAGES.PHARMACY); }}>
//                   <Text style={{color: '#fff', fontWeight: 'bold'}}>No Allergy</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}

//           {stage === STAGES.PHARMACY && (
//             <View>
//               <Text style={styles.title}>Pharmacy Selection</Text>
//               <View style={styles.pharmacyDisplayCard}>
//                 <Text style={styles.smallLabel}>Current Pharmacy:</Text>
//                 <Text style={styles.pharmacyAddress}>{pharmacy}</Text>
//               </View>
//               <TouchableOpacity style={styles.primaryBtn} onPress={() => setStage(STAGES.SUMMARY)}>
//                 <Text style={styles.primaryBtnText}>Yes, send to my pharmacy</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.secondaryBtn} onPress={() => { setTempPharmacy(pharmacy); setIsModalVisible(true); }}>
//                 <Text style={styles.secondaryBtnText}>Change pharmacy</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {stage === STAGES.SUMMARY && (
//             <View style={styles.receiptContainer}>
//               <View style={styles.profileHeader}>
//                 <Text style={styles.headerText}>Patient's name: <Text style={styles.boldText}>{userData.firstName} {userData.lastName}</Text></Text>
//                 <Text style={styles.headerText}>D O S: {currentDate}</Text>
//                 <Text style={styles.headerText}>D O B: {userData.dob}</Text>
//                 <Text style={styles.headerText}>Visit type - Std exposure</Text>
//                 <Text style={styles.headerText}>Provider - Kiataker</Text>
//               </View>

//               <View style={styles.blueLabelBox}><Text style={styles.labelWhiteText}>Visit summary</Text></View>
              
//               <View style={styles.receiptSection}>
//                 <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Reason for visit</Text></View>
//                 <Text style={styles.receiptValue}>- Std exposure—{selectedSTD}</Text>
//               </View>

//               <View style={styles.receiptSection}>
//                 <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Diagnosis</Text></View>
//                 <Text style={styles.receiptValue}>- Exposure to {selectedSTD.toLowerCase()}</Text>
//               </View>

//               <View style={styles.receiptSection}>
//                 <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Treatment provided</Text></View>
//                 <Text style={styles.receiptValue}>- {getMedication().name} {getMedication().rx}</Text>
//                 <Text style={styles.receiptValue}>- {getMedication().qty}</Text>
//                 <Text style={styles.receiptValue}>- Sent to: {pharmacy}</Text>
//               </View>

//               <View style={styles.receiptSection}>
//                 <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Instructions</Text></View>
//                 <Text style={styles.bullet}>• Complete the full course of treatment</Text>
//                 <Text style={styles.bullet}>• {getMedication().instruction}</Text>
//                 <Text style={styles.bullet}>• Abstain from sexual activity until treatment is completed.</Text>
//               </View>

//               <View style={styles.receiptSection}>
//                 <View style={styles.inlineLabel}><Text style={styles.labelWhiteText}>Follow up</Text></View>
//                 <Text style={styles.receiptValue}>- Follow up w your PCP within 3 days for std screening.</Text>
//               </View>

//               <View style={styles.finalFooter}>
//                 <View style={styles.completeOval}><Text style={styles.completeText}>visit complete</Text></View>
//                 <Text style={styles.thanks}>Thank you for your visit 🙂</Text>
//                 <View style={styles.hopeOval}><Text style={styles.hopeText}>I hope you feel better soon</Text></View>
                
//                 <View style={styles.optionsBox}>
//                   <CheckItem label="Send to my email" value={options.email} onPress={() => setOptions({...options, email: !options.email})} />
//                   <CheckItem label="Archive visit" value={options.archive} onPress={() => setOptions({...options, archive: !options.archive})} />
//                   <CheckItem label="Notify PCP" value={options.pcp} onPress={() => setOptions({...options, pcp: !options.pcp})} />
//                 </View>

//                 <TouchableOpacity 
//                   style={[styles.primaryBtn, {width: '100%', marginTop: 20}]} 
//                   onPress={sendEmailSummary}
//                   disabled={isSending}
//                 >
//                   {isSending ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Finalize & Send Summary</Text>}
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         </ScrollView>

//         <Modal visible={isModalVisible} transparent animationType="fade">
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Update Pharmacy</Text>
//               <TextInput style={styles.modalInput} value={tempPharmacy} onChangeText={setTempPharmacy} multiline />
//               <View style={styles.row}>
//                 <TouchableOpacity style={[styles.choiceBtn, {borderColor: '#ccc'}]} onPress={() => setIsModalVisible(false)}>
//                   <Text>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.choiceBtn, {backgroundColor: BRAND_BLUE, borderColor: BRAND_BLUE}]} onPress={handleUpdatePharmacy}>
//                   {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={{color: '#fff', fontWeight: 'bold'}}>Save & Update</Text>}
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>

//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#fff' },
//   container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
//   title: { fontSize: 26, fontWeight: '800', color: '#1a202c', marginBottom: 5 },
//   subtitle: { fontSize: 15, color: '#718096', marginBottom: 20 },
//   progressContainer: { marginBottom: 20 },
//   progressBar: { height: 4, backgroundColor: '#edf2f7', borderRadius: 2 },
//   progressFill: { height: 4, backgroundColor: BRAND_BLUE, borderRadius: 2 },
//   card: { padding: 18, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#edf2f7' },
//   cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   cardText: { fontSize: 16, fontWeight: '600' },
//   pharmacyDisplayCard: { padding: 15, backgroundColor: '#f7fafc', borderRadius: 10, marginBottom: 15 },
//   pharmacyAddress: { fontSize: 15, marginTop: 5 },
//   primaryBtn: { backgroundColor: BRAND_BLUE, padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
//   primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   secondaryBtn: { padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: BRAND_BLUE },
//   secondaryBtnText: { color: BRAND_BLUE, fontWeight: 'bold' },
//   centerBox: { alignItems: 'center', marginTop: 30 },
//   processingOval: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 2, borderColor: BRAND_BLUE, marginBottom: 15 },
//   ovalText: { color: BRAND_BLUE, fontWeight: 'bold' },
//   question: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
//   row: { flexDirection: 'row', gap: 10 },
//   choiceBtn: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, alignItems: 'center' },

//   receiptContainer: { backgroundColor: '#fff', padding: 5 },
//   profileHeader: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 15 },
//   headerText: { fontSize: 14, color: '#4a5568', marginBottom: 4 },
//   boldText: { fontWeight: '700', color: '#1a202c' },
//   blueLabelBox: { backgroundColor: BRAND_BLUE, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', borderRadius: 4, marginBottom: 15 },
//   inlineLabel: { backgroundColor: BRAND_BLUE, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start', borderRadius: 3, marginBottom: 6 },
//   labelWhiteText: { color: '#fff', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
//   receiptSection: { marginBottom: 20 },
//   receiptValue: { fontSize: 15, marginLeft: 5, color: '#2d3748', lineHeight: 22 },
//   bullet: { fontSize: 14, color: '#4a5568', marginLeft: 10, marginBottom: 6, lineHeight: 20 },
  
//   finalFooter: { marginTop: 10, alignItems: 'center', padding: 15, backgroundColor: '#f8fafc', borderRadius: 20 },
//   completeOval: { paddingHorizontal: 22, paddingVertical: 8, borderRadius: 25, borderWidth: 1.5, borderColor: '#2d3748', marginBottom: 12 },
//   completeText: { fontSize: 14, fontWeight: '700', textTransform: 'lowercase' },
//   thanks: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
//   hopeOval: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 5, borderColor: '#cbd5e0', marginBottom: 20 },
//   hopeText: { fontSize: 13, color: '#718096', fontStyle: 'italic' },
  
//   optionsBox: { width: '100%', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 20 },
//   checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   checkLabel: { marginLeft: 12, fontSize: 15, color: '#4a5568' },

//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
//   modalContent: { backgroundColor: '#fff', borderRadius: 15, padding: 20 },
//   modalInput: { borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, height: 80, marginBottom: 15 },
//   modalTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
//   smallLabel: { fontSize: 12, fontWeight: 'bold', color: BRAND_BLUE }
// });





// Updated 18-12-2025
// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

// const stdItems = [
//   'Chlamydia',
//   'Trichomonas',
//   'Chlamydia and Trichomonas',
//   'Gonorrhea',
// ];

// // Sort items alphabetically
// const sortedStdItems = stdItems.sort((a, b) => a.localeCompare(b));

// export default function STDExposureScreen() {
//   const handleItemPress = (item) => {
//     Alert.alert('Selected STD', item); 
//     // Replace with navigation or action for AI-guided recommendations
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
//       <Text style={styles.header}>STD Exposure</Text>
//       <Text style={styles.subText}>
//         Access confidential care and advice for potential STD exposures safely and discreetly.
//       </Text>

//       {sortedStdItems.map((item, index) => (
//         <TouchableOpacity
//           key={index}
//           style={styles.itemContainer}
//           onPress={() => handleItemPress(item)}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.itemText}>{item}</Text>
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#8B0000',
//     marginBottom: 8,
//   },
//   subText: {
//     fontSize: 15,
//     color: '#555',
//     lineHeight: 22,
//     marginBottom: 20,
//   },
//   itemContainer: {
//     backgroundColor: '#f9f9f9',
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 1,
//   },
//   itemText: {
//     fontSize: 16,
//     color: '#555',
//   },
// });



// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

// const stdItems = [
//   'Chlamydia',
//   'Trichomonas',
//   'Chlamydia and Trichomonas',
//   'Gonorrhea',
// ];

// export default function STDExposureScreen() {
//   const handleItemPress = (item) => {
//     Alert.alert('Selected STD', item); 
//     // Replace with navigation or action for AI-guided recommendations
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
//       <Text style={styles.header}>STD Exposure</Text>
//       <Text style={styles.subText}>
//         Access confidential care and advice for potential STD exposures safely and discreetly.
//       </Text>

//       {stdItems.map((item, index) => (
//         <TouchableOpacity
//           key={index}
//           style={styles.itemContainer}
//           onPress={() => handleItemPress(item)}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.itemText}>{item}</Text>
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#8B0000',
//     marginBottom: 8,
//   },
//   subText: {
//     fontSize: 15,
//     color: '#555',
//     lineHeight: 22,
//     marginBottom: 20,
//   },
//   itemContainer: {
//     backgroundColor: '#f9f9f9',
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 1,
//   },
//   itemText: {
//     fontSize: 16,
//     color: '#555',
//   },
// });
