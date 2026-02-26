import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const AdminDashboard = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>DCP Crime Office Portal</Text>
      
      <View style={styles.analyticsBox}>
        <Text style={styles.analyticsText}>Total Externed: 45</Text>
        <Text style={[styles.analyticsText, {color: 'red'}]}>Active Breaches: 2</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('CreateCriminalAccount')}>
        <Text style={styles.btnText}>Register New Individual</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('MapBoundary')}>
        <Text style={styles.btnText}>Live District Monitoring</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, {backgroundColor: '#8E8E93'}]} onPress={() => navigation.replace('Login')}>
        <Text style={styles.btnText}>← Logout / Switch Role</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  analyticsBox: { backgroundColor: '#F2F2F7', padding: 20, borderRadius: 15, marginBottom: 30 },
  analyticsText: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  btn: { backgroundColor: '#007AFF', padding: 18, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});

export default AdminDashboard;