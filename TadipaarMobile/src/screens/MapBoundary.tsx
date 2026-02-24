import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Polygon, PROVIDER_GOOGLE } from 'react-native-maps';

const MapBoundary = ({ navigation }: any) => {
  // Define 4 Zone Coordinates (Example: Pune Sub-districts)
  const zones = [
    { name: 'Zone 1 (Haveli)', color: 'rgba(255, 0, 0, 0.3)', coords: [{latitude: 18.52, longitude: 73.85}, {latitude: 18.55, longitude: 73.90}, {latitude: 18.50, longitude: 73.92}] },
    { name: 'Zone 2 (Pune City)', color: 'rgba(0, 122, 255, 0.3)', coords: [{latitude: 18.51, longitude: 73.83}, {latitude: 18.53, longitude: 73.86}, {latitude: 18.49, longitude: 73.85}] },
    { name: 'Zone 3 (Pimpri)', color: 'rgba(52, 199, 89, 0.3)', coords: [{latitude: 18.62, longitude: 73.80}, {latitude: 18.65, longitude: 73.82}, {latitude: 18.60, longitude: 73.85}] },
    { name: 'Zone 4 (Dighi Area)', color: 'rgba(255, 149, 0, 0.3)', coords: [{latitude: 18.60, longitude: 73.88}, {latitude: 18.63, longitude: 73.91}, {latitude: 18.58, longitude: 73.93}] },
  ];

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 18.5204,
          longitude: 73.8567,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {zones.map((zone, index) => (
          <Polygon 
            key={index}
            coordinates={zone.coords}
            fillColor={zone.color}
            strokeColor="black"
            strokeWidth={1}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>← Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  backBtn: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#000', padding: 15, borderRadius: 30, paddingHorizontal: 25 },
  backBtnText: { color: '#fff', fontWeight: 'bold' }
});

export default MapBoundary;