import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { Camera, useCameraDevice, CameraPermissionStatus } from 'react-native-vision-camera';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client';

const CriminalDashboard = () => {
  const camera = useRef<Camera>(null);
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>('not-determined');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);

  // 1. Select the Front Camera Device
  const device = useCameraDevice('front');

  // 2. Request Permissions on Mount
  useEffect(() => {
    const checkPermissions = async () => {
      const status = await Camera.requestCameraPermission();
      setCameraPermission(status);
      
      // Also request Location permission
      Geolocation.requestAuthorization('whenInUse');
    };
    checkPermissions();
  }, []);

  const handleVerification = async () => {
    if (!camera.current) return;
    setIsSubmitting(true);

    try {
      // Step A: Capture Photo
      const photo = await camera.current.takePhoto({
        flash: 'off',
        enableShutterSound: true,
      });

      // Step B: Get Current GPS Coordinates
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Step C: Get User ID from Storage
          const userData = await AsyncStorage.getItem('user');
          const user = userData ? JSON.parse(userData) : null;

          // Step D: Prepare Form Data for Backend
          const formData = new FormData();
          formData.append('aadhaar_number', user?.id || '');
          formData.append('latitude', latitude.toString());
          formData.append('longitude', longitude.toString());
          formData.append('photo', {
            uri: `file://${photo.path}`,
            name: 'verification.jpg',
            type: 'image/jpeg',
          } as any);

          // Step E: Upload to Server
          const response = await apiClient.post('/auth/check-in', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          setLastCheckIn(new Date().toLocaleTimeString());
          Alert.alert("✅ Verified", "Your location and photo have been logged.");
          setIsSubmitting(false);
        },
        (error) => {
          Alert.alert("GPS Error", "Please enable location services.");
          setIsSubmitting(false);
        },
        { enableHighAccuracy: true, timeout: 15000 }
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to capture verification data.");
      setIsSubmitting(false);
    }
  };

  // --- UI Conditional Rendering ---
  if (cameraPermission === 'not-determined') return <ActivityIndicator style={styles.center} />;
  if (cameraPermission !== 'granted') return <View style={styles.center}><Text>Camera Access Denied</Text></View>;
  if (!device) return <View style={styles.center}><Text>No Camera Detected</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Identity Verification</Text>
        <Text style={styles.subtitle}>Position your face in the camera frame</Text>
      </View>

      <View style={styles.cameraContainer}>
        <Camera
          ref={camera}
          style={styles.preview}
          device={device}
          isActive={true}
          photo={true}
        />
        {/* Overlay for framing face */}
        <View style={styles.overlay} />
      </View>

      <View style={styles.bottomSection}>
        {lastCheckIn && (
          <Text style={styles.statusText}>Last Check-in: {lastCheckIn}</Text>
        )}
        
        <TouchableOpacity 
          style={[styles.btn, isSubmitting && styles.btnDisabled]} 
          onPress={handleVerification}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>UPLOAD GEOTAGGED PHOTO</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 40, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#d32f2f' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  cameraContainer: { flex: 1, overflow: 'hidden' },
  preview: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 50,
    borderColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    margin: 20,
  },
  bottomSection: { padding: 30, backgroundColor: '#fff', alignItems: 'center' },
  statusText: { marginBottom: 15, color: '#27ae60', fontWeight: 'bold' },
  btn: { 
    backgroundColor: '#d32f2f', 
    paddingVertical: 18, 
    paddingHorizontal: 40, 
    borderRadius: 30,
    width: '100%',
    alignItems: 'center'
  },
  btnDisabled: { backgroundColor: '#999' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CriminalDashboard;