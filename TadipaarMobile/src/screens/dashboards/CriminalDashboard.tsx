import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client';

const CriminalDashboard = ({ navigation }: any) => { // Added navigation prop
  const [showCamera, setShowCamera] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('front');

  useEffect(() => {
    const getUserData = async () => {
      const data = await AsyncStorage.getItem('user');
      if (data) setUser(JSON.parse(data));
    };
    getUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  const handleCapture = async () => {
    if (!camera.current) return;
    setIsSubmitting(true);

    try {
      const photo = await camera.current.takePhoto({
        flash: 'off',
      });

      Geolocation.getCurrentPosition(
        async (pos) => {
          const formData = new FormData();
          // ✅ FIXED: Changed user.id to user.aadhaar_number to match DB
          formData.append('aadhaar_number', user?.aadhaar_number || '');
          formData.append('latitude', pos.coords.latitude.toString());
          formData.append('longitude', pos.coords.longitude.toString());
          formData.append('photo', {
            uri: `file://${photo.path}`,
            name: 'verification.jpg',
            type: 'image/jpeg',
          } as any);

          try {
            const response = await apiClient.post('/auth/check-in', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
              Alert.alert("✅ Verified", "Jai Hind! Your check-in is recorded.");
              setShowCamera(false);
            }
          } catch (apiErr: any) {
            Alert.alert("Upload Failed", apiErr.response?.data?.error || "Server error");
          } finally {
            setIsSubmitting(false);
          }
        },
        (err) => {
          Alert.alert("GPS Error", "Please enable location services.");
          setIsSubmitting(false);
        },
        { enableHighAccuracy: true, timeout: 15000 }
      );
    } catch (e) {
      Alert.alert("Error", "Camera capture failed");
      setIsSubmitting(false);
    }
  };

  if (showCamera) {
    return (
      <View style={styles.fullScreen}>
        {!device ? (
          <View style={styles.center}><Text style={{color:'#fff'}}>Camera Not Found</Text></View>
        ) : (
          <Camera ref={camera} style={StyleSheet.absoluteFill} device={device} isActive={true} photo={true} />
        )}
        <View style={styles.cameraOverlay}>
          <TouchableOpacity style={styles.captureBtn} onPress={handleCapture} disabled={isSubmitting}>
            {isSubmitting ? <ActivityIndicator color="#fff" size="large" /> : <View style={styles.innerCircle} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowCamera(false)}>
            <Text style={styles.closeBtnText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.welcome}>Jai Hind,</Text>
        <Text style={styles.userName}>{user?.name || 'Individual'}</Text>
        <View style={styles.divider} />
        <Text style={styles.infoText}>Section: {user?.section_type || '56'}</Text>
        <Text style={styles.infoText}>PS: {user?.ps_name || 'Not Assigned'}</Text>
      </View>
      
      <TouchableOpacity style={styles.mainBtn} onPress={() => setShowCamera(true)}>
        <Text style={styles.mainBtnText}>📸 START VERIFICATION</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutLink} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout from Device</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#f0f2f5', justifyContent: 'center' },
  fullScreen: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', padding: 25, borderRadius: 20, elevation: 8, marginBottom: 40, borderTopWidth: 5, borderTopColor: '#d32f2f' },
  welcome: { fontSize: 16, color: '#666' },
  userName: { fontSize: 26, fontWeight: 'bold', color: '#1a237e', marginTop: 5 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  infoText: { fontSize: 14, color: '#444', marginBottom: 5 },
  mainBtn: { backgroundColor: '#d32f2f', padding: 20, borderRadius: 15, alignItems: 'center', shadowColor: '#d32f2f', shadowOpacity: 0.3, shadowRadius: 10 },
  mainBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  cameraOverlay: { position: 'absolute', bottom: 50, width: '100%', alignItems: 'center' },
  captureBtn: { width: 85, height: 85, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff' },
  innerCircle: { width: 65, height: 65, borderRadius: 35, backgroundColor: '#fff' },
  closeBtn: { marginTop: 30, padding: 10 },
  closeBtnText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 },
  logoutLink: { marginTop: 30, alignSelf: 'center' },
  logoutText: { color: '#666', textDecorationLine: 'underline' }
});

export default CriminalDashboard;