import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import apiClient from '../../api/client';

const DCPDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [criminals, setCriminals] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await apiClient.get('/auth/criminals');
        setCriminals(response.data);
      } catch (error) {
        console.error("Map Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} color="#007AFF" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🚨 Pune Live Monitoring</Text>
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 18.5204, // Center of Pune
          longitude: 73.8567,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {criminals.map((person: any) => (
          <React.Fragment key={person.aadhaar_number}>
            {/* Red Circle shows the 'Forbidden Zone' */}
            <Circle
              center={{ latitude: 18.5204, longitude: 73.8567 }} // Replace with individual's restriction center
              radius={2000} // 2km radius
              strokeColor="rgba(255, 0, 0, 0.5)"
              fillColor="rgba(255, 0, 0, 0.1)"
            />
            
            {/* Marker shows current phone location */}
            <Marker
              coordinate={{ latitude: 18.5250, longitude: 73.8580 }} // Replace with real-time GPS from DB
              title={person.name}
              pinColor={person.is_compliant ? "green" : "red"}
              description={`Case: ${person.case_number}`}
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
  header: { position: 'absolute', top: 50, left: 20, right: 20, backgroundColor: 'white', padding: 15, borderRadius: 10, zIndex: 5, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5 },
  headerText: { fontWeight: 'bold', fontSize: 18, color: '#d32f2f', textAlign: 'center' },
  loader: { flex: 1, justifyContent: 'center' }
});

export default DCPDashboard;