import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const AdminDashboard = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Pune Police Admin</Text>
      
      <View style={styles.grid}>
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('RegisterCriminal')}>
          <Text style={styles.icon}>👤</Text>
          <Text style={styles.boxText}>Register New Individual</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('CriminalList')}>
          <Text style={styles.icon}>📋</Text>
          <Text style={styles.boxText}>Active Records</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('MapBoundary')}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.boxText}>Live Geofence Map</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, color: '#1a237e' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  box: { backgroundColor: '#fff', width: '48%', padding: 20, borderRadius: 12, marginBottom: 15, alignItems: 'center', elevation: 3 },
  icon: { fontSize: 30, marginBottom: 10 },
  boxText: { textAlign: 'center', fontWeight: '600', color: '#333' }
});

export default AdminDashboard;