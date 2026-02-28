import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import apiClient from '../../api/client';

const CriminalList = () => {
  const [criminals, setCriminals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/auth/criminals')
      .then(res => setCriminals(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{flex:1}} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={criminals}
        keyExtractor={(item: any) => item.aadhaar_number}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name} ({item.alias_name})</Text>
            <Text style={styles.sub}>Aadhaar: {item.aadhaar_number}</Text>
            <Text style={item.is_compliant ? styles.safe : styles.danger}>
              {item.is_compliant ? "✅ Within Boundaries" : "🚨 OUTSIDE PUNE"}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  item: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  name: { fontSize: 18, fontWeight: 'bold' },
  sub: { color: '#666', marginVertical: 4 },
  safe: { color: 'green', fontWeight: 'bold' },
  danger: { color: 'red', fontWeight: 'bold' }
});

export default CriminalList;