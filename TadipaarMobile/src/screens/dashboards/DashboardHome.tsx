import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import apiClient from '../../api/client';

const ACPDashboard = () => {
  const [stats, setStats] = useState({ total: 0, missing: 0, violations: 0 });

  useEffect(() => {
    apiClient.get('/monitoring/stats').then(res => {
        setStats(res.data);
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Division Oversight</Text>
      
      <View style={styles.row}>
        <View style={[styles.card, { borderLeftColor: '#1a237e' }]}>
          <Text style={styles.cardTitle}>Total Externed</Text>
          <Text style={styles.count}>{stats.total}</Text>
        </View>

        <View style={[styles.card, { borderLeftColor: '#d32f2f' }]}>
          <Text style={styles.cardTitle}>Photo Missing</Text>
          <Text style={[styles.count, { color: '#d32f2f' }]}>{stats.missing}</Text>
        </View>
      </View>

      <View style={styles.alertBox}>
        <Text style={styles.alertText}>🚨 {stats.violations} Active Geofence Breaches</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 15 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  card: { backgroundColor: '#fff', width: '48%', padding: 15, borderRadius: 10, borderLeftWidth: 5 },
  cardTitle: { fontSize: 12, color: '#666' },
  count: { fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  alertBox: { backgroundColor: '#ffebee', padding: 20, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  alertText: { color: '#c62828', fontWeight: 'bold' }
});