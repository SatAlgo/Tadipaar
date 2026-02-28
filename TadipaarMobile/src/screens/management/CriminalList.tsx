import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Alert, SafeAreaView } from 'react-native';
import { Card, Badge } from 'react-native-paper'; 
// Assuming this is in src/screens/management/CriminalList.tsx
// Two dots (..) gets you to src/, then into api/client
import apiClient from '../../api/client'; 

// TypeScript Interface for the Criminal data
interface Criminal {
    aadhaar_number: string;
    name: string;
    case_number: string;
    is_compliant: boolean;
    mobile: string;
}

const CriminalList = () => {
    const [criminals, setCriminals] = useState<Criminal[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCriminals = async () => {
        try {
            const response = await apiClient.get('/auth/criminals');
            // Ensure we are setting an array even if the DB is empty
            setCriminals(response.data || []);
        } catch (error: any) {
            console.error("Fetch Error:", error);
            const errorMsg = error.response?.data?.message || "Check server connection & IP address.";
            Alert.alert("Data Error", errorMsg);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // UseCallback for the pull-to-refresh functionality
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchCriminals();
    }, []);

    useEffect(() => {
        fetchCriminals();
    }, []);

    const renderCriminalItem = ({ item }: { item: Criminal }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.row}>
                    <View style={styles.infoSection}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.subText}>ID: {item.aadhaar_number}</Text>
                        <Text style={styles.subText}>Case: {item.case_number}</Text>
                    </View>
                    
                    <View style={styles.statusSection}>
                        <Badge 
                            size={24} 
                            style={[
                                styles.badge, 
                                { backgroundColor: item.is_compliant ? '#2E7D32' : '#D32F2F' }
                            ]}
                        >
                            {item.is_compliant ? "SECURE" : "BREACH"}
                        </Badge>
                        <Text style={styles.mobileText}>{item.mobile}</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.header}>📋 Criminal Records</Text>
                    <Text style={styles.subHeader}>Pune Police Surveillance</Text>
                </View>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{criminals.length}</Text>
                </View>
            </View>

            {loading && !refreshing ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Fetching database...</Text>
                </View>
            ) : (
                <FlatList
                    data={criminals}
                    keyExtractor={(item) => item.aadhaar_number}
                    renderItem={renderCriminalItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
                    }
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>No criminals found in records.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    headerRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 20, 
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA'
    },
    header: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E' },
    subHeader: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
    countBadge: { backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
    countText: { color: '#FFF', fontWeight: 'bold' },
    listContent: { padding: 15 },
    card: { marginBottom: 15, borderRadius: 12, elevation: 2, backgroundColor: '#FFF' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    infoSection: { flex: 0.7 },
    statusSection: { flex: 0.3, alignItems: 'flex-end' },
    name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    subText: { color: '#666', fontSize: 13, marginTop: 3 },
    badge: { width: 80, fontWeight: 'bold', color: '#FFF' },
    mobileText: { fontSize: 12, color: '#8E8E93', marginTop: 8 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    loadingText: { marginTop: 10, color: '#666' },
    emptyText: { color: '#8E8E93', fontSize: 16 }
});

export default CriminalList;