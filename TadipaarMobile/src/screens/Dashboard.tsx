import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = ({ navigation }: any) => {
  
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear(); // 🗑️ Deletes Token & User Data
          navigation.replace('Login'); // 🔙 Sends back to Login
        } 
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛡️ Tadipaar Monitor</Text>
      
      <View style={styles.card}>
        <Text style={styles.welcome}>Active Monitoring is ON</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: { padding: 20, backgroundColor: '#F2F2F7', borderRadius: 15, marginBottom: 50 },
  welcome: { textAlign: 'center', color: '#34C759', fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 10, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});

export default Dashboard;