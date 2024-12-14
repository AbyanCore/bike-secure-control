import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InfoPage() {
  const router = useRouter();
  const [deviceInfo, setDeviceInfo] = useState({
    phoneNumber: '',
    balance: '0',
    pairedPhone: '',
  });

  useEffect(() => {
    loadDeviceInfo();
  }, []);

  const loadDeviceInfo = async () => {
    try {
      const pairedPhone = await AsyncStorage.getItem('pairedPhone');
      setDeviceInfo({
        phoneNumber: '+1234567890', // Replace with actual phone number
        balance: '$10.00', // Replace with actual balance
        pairedPhone: pairedPhone || '',
      });
    } catch (error) {
      console.error('Error loading device info:', error);
    }
  };

  const handleUnpair = async () => {
    try {
      await AsyncStorage.removeItem('pairedPhone');
      router.replace('../landing');
    } catch (error) {
      console.error('Error unpairing device:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Phone Number:</Text>
        <Text style={styles.value}>{deviceInfo.phoneNumber}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Available Balance:</Text>
        <Text style={styles.value}>{deviceInfo.balance}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Paired BSS Device:</Text>
        <Text style={styles.value}>{deviceInfo.pairedPhone}</Text>
      </View>

      <TouchableOpacity style={styles.unpairButton} onPress={handleUnpair}>
        <Text style={styles.unpairButtonText}>Unpair Device</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  unpairButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  unpairButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});