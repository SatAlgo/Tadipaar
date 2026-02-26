import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Card, Badge } from 'react-native-paper'; 
// If api is in src/api/client.ts and this is in src/screens/dashboards/CriminalList.tsx:
import apiClient from '../api/client'; 

const CriminalList = () => {
    const [criminals, setCriminals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCriminals = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/auth/criminals');
            setCriminals(response.data);
        } catch (error: any) {
            console.error("Fetch Error:", error);
            Alert.alert("Error", "Could not load surveillance data. Check backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCriminals();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>🚨 Monitoring Panel</Text>
                <Text style={styles.count}>{criminals.length} Active</Text>
            </View>

            {loading && criminals.length === 0 ? (
                <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 50}} />
            ) : (
                <FlatList
                    data={criminals}
                    keyExtractor={(item: any) => item.aadhaar_number}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={fetchCriminals} colors={['#007AFF']} />
                    }
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                            <Card.Content>
                                <View style={styles.row}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.name}>{item.name}</Text>
                                        <Text style={styles.subText}>Aadhaar: {item.aadhaar_number}</Text>
                                        <Text style={styles.subText}>Case: {item.case_number}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Badge 
                                            size={25}
                                            style={[
                                                styles.badge, 
                                                { backgroundColor: item.is_compliant ? '#4CAF50' : '#F44336' }
                                            ]}
                                        >
                                            {item.is_compliant ? "SECURE" : "BREACH"}
                                        </Badge>
                                        <Text style={styles.mobileText}>{item.mobile}</Text>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: '#f0f2f5' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    header: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' },
    count: { color: '#666', fontWeight: '600' },
    card: { marginBottom: 12, borderRadius: 12, elevation: 3, backgroundColor: '#fff' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    subText: { color: '#777', fontSize: 13, marginTop: 2 },
    badge: { color: '#fff', fontWeight: 'bold', width: 80 },
    mobileText: { fontSize: 11, color: '#999', marginTop: 5 }
});

export default CriminalList;