import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LandingPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handlePair = async () => {
    if (phoneNumber.length >= 10) {
      try {
        await AsyncStorage.setItem('pairedPhone', phoneNumber);
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Error saving phone number:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.jpeg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter BSS Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TouchableOpacity style={styles.button} onPress={handlePair}>
        <Text style={styles.buttonText}>Pair Device</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
