import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const CreateCriminalAccount = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} placeholder="Enter Name" />

      <Text style={styles.label}>Case Number</Text>
      <TextInput style={styles.input} placeholder="FIR/Legal ID" />

      <Text style={styles.label}>Restricted Zone (Radius in KM)</Text>
      <TextInput style={styles.input} placeholder="e.g. 10" keyboardType="numeric" />

      <Text style={styles.label}>Primary Mobile Number</Text>
      <TextInput style={styles.input} placeholder="Linked Device No." keyboardType="phone-pad" />

      <TouchableOpacity style={styles.submitBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.submitBtnText}>Create Record & Generate ID</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#E5E5EA', padding: 12, borderRadius: 8, marginBottom: 20 },
  submitBtn: { backgroundColor: '#34C759', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default CreateCriminalAccount;