import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const CameraCheckIn = ({ navigation }: any) => {
  const takePicture = () => {
    // Using the Native Alert module fixes the TS error
    Alert.alert(
      "Verification Success",
      "Photo captured and synced with GPS coordinates.",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraPlaceholder}>
        <Text style={{ color: '#fff' }}>Camera Preview</Text>
      </View>
      <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
        <View style={styles.innerCircle} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  cameraPlaceholder: { width: '100%', height: '70%', backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  captureBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  innerCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#000' }
});

export default CameraCheckIn;