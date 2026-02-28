import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client';

const CriminalDashboard = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState('Individual');
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('front');

  useEffect(() => {
    const getUser = async () => {
      const data = await AsyncStorage.getItem('user');
      if (data) setUserName(JSON.parse(data).name);
    };
    getUser();
  }, []);

  const handleCapture = async () => {
    if (!camera.current) return;
    setIsSubmitting(true);
    try {
      const photo = await camera.current.takePhoto();
      Geolocation.getCurrentPosition(
        async (pos) => {
          const userData = await AsyncStorage.getItem('user');
          const user = JSON.parse(userData || '{}');
          
          const formData = new FormData();
          formData.append('aadhaar_number', user.id);
          formData.append('latitude', pos.coords.latitude.toString());
          formData.append('longitude', pos.coords.longitude.toString());
          formData.append('photo', {
            uri: `file://${photo.path}`,
            name: 'checkin.jpg',
            type: 'image/jpeg',
          } as any);

          await apiClient.post('/auth/check-in', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          Alert.alert("Success", "Verification uploaded successfully.");
          setShowCamera(false);
          setIsSubmitting(false);
        },
        (err) => Alert.alert("GPS Error", err.message),
        { enableHighAccuracy: true }
      );
    } catch (e) {
      Alert.alert("Error", "Capture failed");
      setIsSubmitting(false);
    }
  };

  // CAMERA VIEW
  if (showCamera) {
    return (
      <View style={styles.fullScreen}>
        {!device ? <Text>Camera not available</Text> : (
          <Camera ref={camera} style={StyleSheet.absoluteFill} device={device} isActive={true} photo={true} />
        )}
        <View style={styles.cameraOverlay}>
          <TouchableOpacity style={styles.captureBtn} onPress={handleCapture}>
            {isSubmitting ? <ActivityIndicator color="#fff" /> : <View style={styles.innerCircle} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtn} onPress={() => setShowCamera(false)}>
            <Text style={styles.backBtnText}>✕ Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // DASHBOARD VIEW
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.welcome}>Jai Hind, {userName}</Text>
        <Text style={styles.status}>Status: Under Monitoring</Text>
      </View>
      
      <TouchableOpacity style={styles.mainBtn} onPress={() => setShowCamera(true)}>
        <Text style={styles.mainBtnText}>📸 START DAILY VERIFICATION</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4', justifyContent: 'center' },
  fullScreen: { flex: 1, backgroundColor: '#000' },
  card: { backgroundColor: '#fff', padding: 30, borderRadius: 15, elevation: 5, marginBottom: 30 },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  status: { color: 'green', marginTop: 10, fontWeight: '600' },
  mainBtn: { backgroundColor: '#d32f2f', padding: 20, borderRadius: 12, alignItems: 'center' },
  mainBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cameraOverlay: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  captureBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff' },
  backBtn: { marginTop: 20, padding: 10 },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default CriminalDashboard;