import { View, Image, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    checkPairedDevice();
  }, []);

  const checkPairedDevice = async () => {
    try {
      const pairedPhone = await AsyncStorage.getItem('pairedPhone');
      setTimeout(() => {
        router.replace(pairedPhone ? '/(tabs)' : '/landing');
      }, 2000);
    } catch (error) {
      console.error('Error checking paired device:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.jpeg')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
  },
});