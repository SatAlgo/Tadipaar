import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

interface LoginProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginProps> = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!mobile || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { mobile, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      // ROLE-BASED NAVIGATION
      switch (user.role) {
        case 'ADMIN':
          navigation.replace('AdminDashboard');
          break;
        case 'DCP':
          navigation.replace('DCPDashboard');
          break;
        case 'ACP':
          navigation.replace('ACPDashboard');
          break;
        case 'OFFICER':
          navigation.replace('OfficerDashboard');
          break;
        case 'CRIMINAL':
          navigation.replace('CriminalDashboard');
          break;
        default:
          Alert.alert("Error", "Unknown User Role");
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.response?.data?.message || "Check connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>🛡️ TADIPAAR MONITOR</Text>
        <Text style={styles.subtitle}>Pune Police Department</Text>

        <TextInput
          placeholder="Registered Mobile Number"
          style={styles.input}
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  innerContainer: { flex: 1, justifyContent: 'center', padding: 25 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#007AFF', marginBottom: 5 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#8E8E93', marginBottom: 40, letterSpacing: 1 },
  input: { backgroundColor: '#F2F2F7', padding: 18, borderRadius: 12, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  buttonDisabled: { backgroundColor: '#A2CFFE' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});

export default LoginScreen;