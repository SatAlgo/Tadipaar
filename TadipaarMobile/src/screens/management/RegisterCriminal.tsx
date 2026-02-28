import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import apiClient from '../../api/client';

const RegisterCriminal = ({ navigation }: any) => {
  const [form, setForm] = useState({
    aadhaar_number: '', name: '', alias_name: '', case_number: '', mobile: '', password: '', order_expiry_date: '2027-12-31'
  });

  const onRegister = async () => {
    try {
      await apiClient.post('/auth/register-criminal', form);
      Alert.alert("Success", "Individual Registered!");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Failed", err.response?.data?.error || "Registration error");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Individual</Text>
      <TextInput placeholder="Aadhaar" style={styles.input} onChangeText={(t) => setForm({...form, aadhaar_number: t})} />
      <TextInput placeholder="Full Name" style={styles.input} onChangeText={(t) => setForm({...form, name: t})} />
      <TextInput placeholder="Mobile" style={styles.input} keyboardType="phone-pad" onChangeText={(t) => setForm({...form, mobile: t})} />
      <TextInput placeholder="Case ID" style={styles.input} onChangeText={(t) => setForm({...form, case_number: t})} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={(t) => setForm({...form, password: t})} />
      
      <TouchableOpacity style={styles.btn} onPress={onRegister}>
        <Text style={styles.btnText}>SUBMIT RECORD</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 25, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  btn: { backgroundColor: '#007AFF', padding: 18, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});

export default RegisterCriminal;