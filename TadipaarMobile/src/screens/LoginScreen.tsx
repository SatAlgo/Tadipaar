import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

const LoginScreen = ({ navigation }: any) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!mobile || !password) return Alert.alert("Error", "Enter all fields");
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { mobile, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Role-based Navigation
      if (user.role === 'ADMIN') navigation.replace('AdminDashboard');
      else if (user.role === 'DCP') navigation.replace('DCPDashboard');
      else if (user.role === 'CRIMINAL') navigation.replace('CriminalDashboard');
      else Alert.alert("Access Denied", "Dashboard not found for this role");

    } catch (err: any) {
      Alert.alert("Login Failed", err.response?.data?.message || "Check connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🛡️ Tadipaar</Text>
      <TextInput placeholder="Mobile Number" style={styles.input} keyboardType="phone-pad" onChangeText={setMobile} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={setPassword} />
      
      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>LOGIN</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RegisterCriminal')}>
        <Text style={styles.link}>New Registration? Click Here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#fff' },
  logo: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#d32f2f' },
  input: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 15 },
  btn: { backgroundColor: '#d32f2f', padding: 18, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#007AFF', textAlign: 'center', marginTop: 20 }
});

export default LoginScreen;