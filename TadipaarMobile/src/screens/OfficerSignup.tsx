import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import apiClient from '../api/client';

const OfficerSignup = ({ navigation }: any) => {
  const [form, setForm] = useState({
    name: '',
    buckle_number: '',
    rank: '',
    police_station: '',
    mobile: '',
    password: '',
  });

  const handleSignup = async () => {
    try {
      const response = await apiClient.post('/auth/register-officer', form);
      Alert.alert("Success", `Officer ${response.data.officer.name} Registered`);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🚨 Register New Officer</Text>
      
      <TextInput placeholder="Full Name" style={styles.input} onChangeText={(t) => setForm({...form, name: t})} />
      <TextInput placeholder="Buckle Number (ID)" style={styles.input} onChangeText={(t) => setForm({...form, buckle_number: t})} />
      <TextInput placeholder="Rank (e.g. PI, ACP)" style={styles.input} onChangeText={(t) => setForm({...form, rank: t})} />
      <TextInput placeholder="Police Station" style={styles.input} onChangeText={(t) => setForm({...form, police_station: t})} />
      <TextInput placeholder="Mobile Number" style={styles.input} keyboardType="phone-pad" onChangeText={(t) => setForm({...form, mobile: t})} />
      <TextInput placeholder="Temporary Password" style={styles.input} secureTextEntry onChangeText={(t) => setForm({...form, password: t})} />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Officer Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#d32f2f', textAlign: 'center' },
  input: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#d32f2f', padding: 18, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

export default OfficerSignup;