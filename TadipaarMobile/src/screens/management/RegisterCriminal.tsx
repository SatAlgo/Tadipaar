import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import DatePicker from 'react-native-date-picker'; // ✅ Import Calendar
import { HIERARCHY, SECTIONS } from '../../constants/hierarchy';
import apiClient from '../../api/client';

const RegisterCriminal = ({ navigation }: any) => {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  
  const [form, setForm] = useState({
    aadhaar_number: '', 
    name: '', 
    alias_name: '', 
    mobile: '', 
    password: '',
    zone_name: 'ZONE 1', 
    acp_division: 'ACP PIMPRI', 
    ps_name: 'Pimpri PS',
    home_address: '', 
    residence_during_externment: '',
    section_type: '56', 
    start_date: new Date().toISOString().split('T')[0], // Default today
    end_date: new Date().toISOString().split('T')[0]
  });

  const handleRegister = async () => {
    if(!form.aadhaar_number || !form.name || !form.mobile) {
      Alert.alert("Error", "Please fill mandatory fields");
      return;
    }
    try {
      await apiClient.post('/auth/register-criminal', form);
      Alert.alert("Success", "Individual Registered Successfully");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Registration Failed");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.mainTitle}>New Externment Record</Text>

      {/* ... (Keep 1. Section, 2. Personal Info, and 3. Hierarchy the same as before) ... */}
      
      {/* 2. PERSONAL INFO */}
      <Text style={styles.label}>2. Personal Information</Text>
      <TextInput placeholder="Full Name" style={styles.input} onChangeText={(v)=>setForm({...form, name:v})} />
      <TextInput placeholder="Mobile Number" style={styles.input} keyboardType="phone-pad" maxLength={10} onChangeText={(v)=>setForm({...form, mobile:v})} />
      <TextInput placeholder="Aadhaar Number" style={styles.input} keyboardType="numeric" maxLength={12} onChangeText={(v)=>setForm({...form, aadhaar_number:v})} />
      <TextInput placeholder="Set App Password" style={styles.input} secureTextEntry onChangeText={(v)=>setForm({...form, password:v})} />

      {/* 4. ADDRESSES */}
      <Text style={styles.label}>4. Address Details</Text>
      <TextInput placeholder="Permanent Address" style={styles.input} multiline onChangeText={(v)=>setForm({...form, home_address:v})} />
      <TextInput placeholder="Residence During Externment" style={styles.input} multiline onChangeText={(v)=>setForm({...form, residence_during_externment:v})} />

      {/* 5. PERIOD WITH CALENDAR */}
      <Text style={styles.label}>5. Externment Period</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        
        {/* Start Date Selector */}
        <TouchableOpacity style={styles.dateBox} onPress={() => setOpenStart(true)}>
          <Text style={styles.dateLabel}>From:</Text>
          <Text style={styles.dateValue}>{form.start_date}</Text>
        </TouchableOpacity>

        {/* End Date Selector */}
        <TouchableOpacity style={styles.dateBox} onPress={() => setOpenEnd(true)}>
          <Text style={styles.dateLabel}>Till:</Text>
          <Text style={styles.dateValue}>{form.end_date}</Text>
        </TouchableOpacity>
      </View>

      {/* Start Date Picker Modal */}
      <DatePicker
        modal
        mode="date"
        open={openStart}
        date={new Date(form.start_date)}
        onConfirm={(date) => {
          setOpenStart(false);
          setForm({...form, start_date: date.toISOString().split('T')[0]});
        }}
        onCancel={() => setOpenStart(false)}
      />

      {/* End Date Picker Modal */}
      <DatePicker
        modal
        mode="date"
        open={openEnd}
        date={new Date(form.end_date)}
        onConfirm={(date) => {
          setOpenEnd(false);
          setForm({...form, end_date: date.toISOString().split('T')[0]});
        }}
        onCancel={() => setOpenEnd(false)}
      />

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>REGISTER INDIVIDUAL</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  mainTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a237e', marginBottom: 15, textAlign: 'center' },
  label: { fontWeight: 'bold', marginTop: 15, color: '#1a237e', fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 5 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginTop: 10 },
  dateBox: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    width: '48%', 
    padding: 10,
    alignItems: 'center'
  },
  dateLabel: { fontSize: 10, color: '#666' },
  dateValue: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 2 },
  btn: { backgroundColor: '#1a237e', padding: 15, borderRadius: 10, marginTop: 30, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  pickerContainer: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginTop: 10, overflow: 'hidden' },
  subLabel: { fontSize: 12, color: '#666', marginTop: 10, marginLeft: 5 },
});

export default RegisterCriminal;