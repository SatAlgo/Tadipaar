import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import apiClient from '../../api/client';

const MapBoundary = () => {
  const [criminals, setCriminals] = useState([]);

  useEffect(() => {
    const fetchLiveStatus = async () => {
      try {
        const response = await apiClient.get('/auth/criminals');
        setCriminals(response.data);
      } catch (error) {
        console.error("Monitoring Error:", error);
      }
    };
    fetchLiveStatus();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 18.5204, // Pune Center
          longitude: 73.8567,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {criminals.map((item: any) => (
          <React.Fragment key={item.aadhaar_number}>
            {/* The Boundary for each criminal */}
            <Circle
              center={{ latitude: 18.5204, longitude: 73.8567 }} // Default Pune center for demo
              radius={5000} // 5km boundary
              strokeColor="rgba(255, 0, 0, 0.5)"
              fillColor={item.is_compliant ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.2)"}
            />
            {/* The Criminal's Current Location */}
            <Marker
              coordinate={{ latitude: 18.5300, longitude: 73.8600 }} // Replace with real live data
              title={item.name}
              description={item.is_compliant ? "Within District" : "BOUNDARY BREACH!"}
              pinColor={item.is_compliant ? "green" : "red"}
            />
          </React.Fragment>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
});

export default MapBoundary;